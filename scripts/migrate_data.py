import os
import pandas as pd
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

def clean_val(val):
    """Helper to convert pandas NaN/NaT values to Python None for SQL NULLs"""
    if pd.isna(val):
        return None
    return val

def migrate_data():
    # Load database connection URI from .env file
    load_dotenv()
    db_uri = os.getenv('DATABASE_URL')
    
    if not db_uri:
        print("❌ Error: DATABASE_URL not found in .env file. Please check your configuration.")
        return

    try:
        # Create SQLAlchemy engine
        engine = create_engine(db_uri)
        print("✅ Successfully connected to the PostgreSQL database.")
        
        # Define Excel file path
        excel_file = "UK SKUs Sahyadri Exports Volumes.xlsx"
        
        if not os.path.exists(excel_file):
            print(f"❌ Error: Could not find the file '{excel_file}' in the current directory.")
            return

        print(f"\nReading data from {excel_file}...")
        
        # Read the specified sheets into pandas DataFrames
        df_sheet1 = pd.read_excel(excel_file, sheet_name='SKU Ingredient Data')
        df_sheet3 = pd.read_excel(excel_file, sheet_name='Sources & Calculations')
        
        # Merge dataframes on the exact SKU string
        df_master = pd.merge(
            df_sheet1, 
            df_sheet3, 
            left_on='Target Product Line / Exact SKU', 
            right_on='SKU (Exact)', 
            how='inner'
        )
        print(f"Merged master dataframe has {len(df_master)} rows.")

        # Establish database connection and start a transaction
        with engine.connect() as conn:
            with conn.begin(): 
                
                # ==========================================
                # 1. Process Organizations
                # ==========================================
                print("\nProcessing Organizations...")
                orgs = df_master[['Organisation Name', 'Sector / Primary Business']].drop_duplicates().dropna(subset=['Organisation Name'])
                
                org_id_map = {}
                for _, row in orgs.iterrows():
                    org_name = clean_val(row['Organisation Name'])
                    sector = clean_val(row['Sector / Primary Business'])
                    
                    # Check if organization already exists
                    query_select = text('SELECT "Org_ID" FROM "Organizations" WHERE "Org_Name" = :name')
                    res = conn.execute(query_select, {"name": org_name}).fetchone()
                    
                    if res:
                        org_id = res[0]
                    else:
                        # Insert and return generated ID
                        query_insert = text('INSERT INTO "Organizations" ("Org_Name", "Sector") VALUES (:name, :sector) RETURNING "Org_ID"')
                        org_id = conn.execute(query_insert, {"name": org_name, "sector": sector}).fetchone()[0]
                        
                    org_id_map[org_name] = org_id
                print(f"Successfully processed {len(org_id_map)} unique organizations.")

                # ==========================================
                # 2. Process Ingredients
                # ==========================================
                print("Processing Ingredients...")
                ingredients = df_master[['Required Ingredient', 'Matched Category']].drop_duplicates().dropna(subset=['Required Ingredient'])
                
                ingredient_id_map = {}
                for _, row in ingredients.iterrows():
                    ing_name = clean_val(row['Required Ingredient'])
                    category = clean_val(row['Matched Category'])
                    
                    query_select = text('SELECT "Ingredient_ID" FROM "Ingredients" WHERE "Ingredient_Name" = :name')
                    res = conn.execute(query_select, {"name": ing_name}).fetchone()
                    
                    if res:
                        ing_id = res[0]
                    else:
                        query_insert = text('INSERT INTO "Ingredients" ("Ingredient_Name", "Matched_Category") VALUES (:name, :category) RETURNING "Ingredient_ID"')
                        ing_id = conn.execute(query_insert, {"name": ing_name, "category": category}).fetchone()[0]
                    
                    ingredient_id_map[ing_name] = ing_id
                print(f"Successfully processed {len(ingredient_id_map)} unique ingredients.")

                # ==========================================
                # 3. Process SKUs
                # ==========================================
                print("Processing SKUs...")
                # Filter down to unique SKUs
                skus = df_master[['Target Product Line / Exact SKU', 'Organisation Name', 'Production Vol. (t)', 'Vol. Source / Reference']].drop_duplicates(subset=['Target Product Line / Exact SKU']).dropna(subset=['Target Product Line / Exact SKU'])
                
                sku_id_map = {}
                for _, row in skus.iterrows():
                    sku_name = clean_val(row['Target Product Line / Exact SKU'])
                    org_name = clean_val(row['Organisation Name'])
                    prod_vol = clean_val(row['Production Vol. (t)'])
                    vol_source = clean_val(row['Vol. Source / Reference'])
                    
                    org_id = org_id_map.get(org_name)
                    
                    query_select = text('SELECT "SKU_ID" FROM "SKUs" WHERE "SKU_Name" = :name')
                    res = conn.execute(query_select, {"name": sku_name}).fetchone()
                    
                    if res:
                        sku_id = res[0]
                    else:
                        query_insert = text("""
                            INSERT INTO "SKUs" ("SKU_Name", "Org_ID", "Annual_Production_Tonnes", "Volume_Source") 
                            VALUES (:name, :org_id, :prod_vol, :vol_source) 
                            RETURNING "SKU_ID"
                        """)
                        sku_id = conn.execute(query_insert, {
                            "name": sku_name,
                            "org_id": org_id,
                            "prod_vol": prod_vol,
                            "vol_source": vol_source
                        }).fetchone()[0]
                    
                    sku_id_map[sku_name] = sku_id
                print(f"Successfully processed {len(sku_id_map)} unique SKUs.")

                # ==========================================
                # 4. Process SKU_Ingredients (Mapping Table)
                # ==========================================
                print("Processing SKU to Ingredient mappings...")
                # Filter out rows missing essential matching keys
                mappings = df_master.dropna(subset=['Target Product Line / Exact SKU', 'Required Ingredient'])
                
                inserted_mappings = 0
                for _, row in mappings.iterrows():
                    sku_name = row['Target Product Line / Exact SKU']
                    ing_name = row['Required Ingredient']
                    
                    sku_id = sku_id_map.get(sku_name)
                    ing_id = ingredient_id_map.get(ing_name)
                    
                    if not sku_id or not ing_id:
                        continue
                        
                    incl_rate = clean_val(row['Inclusion Rate (%)'])
                    incl_source = clean_val(row['Inclusion Rate Source / Reference'])
                    est_qty = clean_val(row['Ingredient Qty (kg/yr)'])
                    confidence = clean_val(row['Confidence Level'])
                    
                    # Check if mapping already exists to prevent duplicate entries
                    query_select = text('SELECT "Mapping_ID" FROM "SKU_Ingredients" WHERE "SKU_ID" = :sku_id AND "Ingredient_ID" = :ing_id')
                    res = conn.execute(query_select, {"sku_id": sku_id, "ing_id": ing_id}).fetchone()
                    
                    if not res:
                        query_insert = text("""
                            INSERT INTO "SKU_Ingredients" (
                                "SKU_ID", "Ingredient_ID", "Inclusion_Rate_Percent", 
                                "Inclusion_Rate_Source", "Est_Ingredient_Qty_KG", "Confidence_Level"
                            ) VALUES (
                                :sku_id, :ing_id, :incl_rate, :incl_source, :est_qty, :confidence
                            )
                        """)
                        conn.execute(query_insert, {
                            "sku_id": sku_id,
                            "ing_id": ing_id,
                            "incl_rate": incl_rate,
                            "incl_source": incl_source,
                            "est_qty": est_qty,
                            "confidence": confidence
                        })
                        inserted_mappings += 1
                
                print(f"Successfully inserted {inserted_mappings} new SKU-Ingredient mappings.")
                
        print("\n✅ Data migration completed successfully!")

    except Exception as e:
        print(f"\n❌ An error occurred during migration: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    migrate_data()
