# Orange Provenance App - Quick Start Guide

This guide explains how to safely shut down your local development servers and start them up again.

## How to Shut Down

To stop the application, you need to terminate the two running terminal processes.

1. **Stop the Next.js Frontend:**
   - Go to the terminal window that is running `npm run dev` (inside the `frontend` folder).
   - Press **`Ctrl + C`** on your keyboard. 
   - If prompted with "Terminate batch job (Y/N)?", type `Y` and press Enter.

2. **Stop the Hardhat Blockchain:**
   - Go to the terminal window that is running `npx hardhat node`.
   - Press **`Ctrl + C`**. This stops the local blockchain. 
   - *Note: Every time you stop the node, the local blockchain resets. This means any crates you registered or ETH you transferred will be wiped clean for the next session.*

---

## How to Start it up Again

When you want to run the application again, you must do it in this exact order:

### 1. Start the Local Blockchain First
Open a new terminal at the root of your project (`c:\My Files\Coding\DTIS project`) and run:
   ```bash
   npx hardhat node
   ```
*(Leave this terminal running in the background).*

### 2. Deploy the Smart Contract
Since the blockchain resets every time you shut down, you must redeploy your contract to the fresh chain. Open a **second** terminal at your project root and run:
   ```bash
   npx hardhat run scripts/deploy.ts --network localhost
   ```
Look at the output! It will say: `OrangeProvenanceTracker deployed to: 0x...`
**Important**: If the deployed address *changes*, you must update the `CONTRACT_ADDRESS` constant in your frontend code at:
`frontend/lib/contract.ts`

### 3. Start the Next.js Frontend
In that same second terminal window, navigate into the frontend folder and start the server:
   ```bash
   cd frontend
   npm run dev
   ```
Now you can open `http://localhost:3000` in your browser.

---

### *A Note on MetaMask Nonce Errors*
If you restart your Hardhat node and try to use the same MetaMask account, MetaMask might get confused and block your transactions. If this happens:
1. Open MetaMask.
2. Go to Settings > Advanced.
3. Click **"Clear activity tab data"** (or "Reset account"). 
This fixes the desynchronization between MetaMask and your fresh local blockchain.
