# DTIS Project - Orange Provenance Tracker
## Project Flow & Documentation

This document explains the overall flow of the Nagpur Orange Provenance Tracker project and details the function of every page within the application.

---

### 1. Overall Project Flow

The **DTIS (Decentralized Tracking and Information System)** project is a Web3-powered supply chain application designed to track the lifecycle, cold chain transit, and quality assurance of Nagpur Oranges. The system uses an Ethereum Smart Contract (`OrangeProvenanceTracker.sol`) to ensure all data is immutable, transparent, and verifiable.

The flow of an orange crate through the system is as follows:

1. **Origin & Harvest (Registration)**
   - The journey begins at the farm. A farm manager or worker uses the system to pair a physical QR code (Crate ID) with the farm's details and the initial location.
   - This records the genesis transaction on the blockchain, setting the crate's initial status to **Harvested**.

2. **Supply Chain Logistics (Transit & Custody)**
   - As the crate moves between various logistics nodes (e.g., Processing Centers, Warehouses, Distribution Centers, and Retail), handlers scan the crate.
   - They update the crate's status and current location on the blockchain, creating a chronological, tamper-proof trail of custody.

3. **Quality Assurance (QA & Defect Reporting)**
   - Throughout the journey, if an anomaly is detected (e.g., temperature deviation, physical damage, spoilage), QA personnel can intervene.
   - They log a defect report containing proof (such as images or sensor data) uploaded to IPFS. The blockchain records this IPFS hash and immediately flags the crate's status as **Disputed**.

4. **Consumer Verification (End-User Tracking)**
   - Once the crate reaches the retail level or the end consumer, anyone can scan the QR code or enter the Crate ID on the consumer portal.
   - The system reads the blockchain ledger (requiring no Web3 wallet from the consumer) and displays the complete, verified timeline of the orange crate from farm to table.

---

### 2. Page Functions & Architecture

The application is built using **Next.js** for the frontend and **TailwindCSS** for styling, adhering to a responsive and modern aesthetic. Below is a breakdown of every page in the `frontend/app` directory and its specific function:

#### **Operations Overview (`/`)**
- **File:** `app/page.tsx`
- **Function:** This is the main dashboard for internal supply chain personnel. It provides a macroscopic view of logistics and quality metrics.
- **Key Features:** Features High-level KPI statistics (Active Shipments, QA Average, Violations), a Temperature Chart for cold chain monitoring, quick action buttons to register batches or log QA reports, and a tabular view of all active shipments.

#### **Register Harvest (`/register`)**
- **File:** `app/register/page.tsx`
- **Function:** The starting point of the provenance tracking. Used exclusively to register new, unregistered crates onto the blockchain.
- **Key Features:** Contains a form to input the `Crate ID` (QR Code), `Farm Origin Details`, and `Initial Location`. It connects to the user's MetaMask wallet to sign and mine the initial `registerCrate` transaction.

#### **Logistics Checkpoint (`/logistics`)**
- **File:** `app/logistics/page.tsx`
- **Function:** Dedicated portal for logistics handlers and transport personnel to update the location and status of crates in transit.
- **Key Features:** Uses the `LogisticsTracker` component, allowing users to scan a crate, select its new lifecycle stage (e.g., Processed, In Transit, Warehoused, Retail), and record the new location on the blockchain.

#### **Operations & QA Validation (`/qa-reports`)**
- **File:** `app/qa-reports/page.tsx`
- **Function:** A specialized QA interface used by quality inspectors to flag shipments that have violated quality or cold-chain parameters.
- **Key Features:** Utilizes the `DefectReport` component. Users can input the Crate ID, specify the location of the inspection, and attach an IPFS hash containing evidence of the defect. This action permanently marks the crate as `Disputed`.

#### **Track Your Oranges (`/track`)**
- **File:** `app/track/page.tsx`
- **Function:** The consumer-facing landing page where end-users, retailers, or auditors enter the system.
- **Key Features:** Features an aesthetic, minimalist search interface where users enter or scan a `Crate ID`. Upon submission, it redirects them to the detailed dynamic timeline page. 

#### **Consumer Crate Tracker (`/crate/[id]`)**
- **File:** `app/crate/[id]/page.tsx`
- **Function:** The core verifiable provenance page. It displays the complete chronological history of a single crate.
- **Key Features:** 
  - **Read-Only Accessibility:** Connects to the blockchain via a standard RPC provider, completely removing the need for the user to have MetaMask installed.
  - **Verified Badge:** Displays the current status, farm origin, and a cryptographic verification badge.
  - **Journey Timeline:** Maps out every tracking event conceptually (Timestamp, Location, Handler Address, Status).
  - **Defect Visibility:** Prominently highlights if the crate was flagged as `Disputed`, displaying the attached IPFS evidence hash.
