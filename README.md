# 🍊 Nagpur Orange Provenance Tracker (DTIS)

> **Decentralized Tracking and Information System (DTIS)** for agricultural supply chains, cold-chain verification, and farm-to-consumer provenance of Geographical Indication (GI) tagged Nagpur Oranges.

[![Solidity](https://img.shields.io/badge/Solidity-^0.8.20-363636?logo=solidity)](https://soliditylang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Hardhat](https://img.shields.io/badge/Hardhat-3.0-yellow?logo=ethereum)](https://hardhat.org/)
[![Ethers.js](https://img.shields.io/badge/Ethers.js-v6-2535a0)](https://docs.ethers.org/v6/)

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Why Blockchain for Nagpur Oranges?](#-why-blockchain-for-nagpur-oranges)
- [System Architecture](#-system-architecture)
- [Core Features & Application Pages](#-core-features--application-pages)
- [Smart Contract Architecture](#-smart-contract-architecture)
- [Tech Stack](#-tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Prerequisites](#-prerequisites)
- [Quick Start Guide](#-quick-start-guide)
- [Testing & Mock Data](#-testing--mock-data)
- [Troubleshooting](#-troubleshooting)
- [License & Authors](#-license--authors)

---

## 📖 Overview

Nagpur Mandarin Oranges (*Citrus reticulata*) hold a prestigious **Geographical Indication (GI)** status. However, the agricultural supply chain suffers from challenges like counterfeit origin claims, lack of temperature compliance in cold transit, quality disputes, and zero transparency for final consumers.

The **DTIS Orange Provenance Tracker** solves this by establishing a decentralized, immutable ledger on the Ethereum blockchain. Every crate is identified by a unique QR code and tracked through every stage of its journey—from harvest at the orchard to cold storage, distribution centers, and retail shelves.

---

## 🍊 Why Blockchain for Nagpur Oranges?

1. **Anti-Counterfeiting:** Ensures oranges claiming to be "Nagpur Oranges" genuinely originated from authenticated farms in the Vidarbha region.
2. **Cold Chain Integrity:** Monitors transit checkpoints and logs temperature deviations before produce reaches consumers.
3. **Immutable Defect Reporting:** Quality inspectors can permanently flag damaged or spoiled crates with cryptographic proof (IPFS photo evidence) that cannot be altered or suppressed.
4. **Frictionless Consumer Verification:** Consumers scan a crate's QR code and instantly view its entire chronological history without needing a crypto wallet, browser extension, or cryptocurrency.
5. **Gasless Relayer Architecture:** Supply chain workers in the field do not need crypto wallets or ETH tokens; transactions are signed and sponsored via a server-side relayer.

---

## 🏗️ System Architecture

```text
  [ Farm Origin ]           [ Logistics Hubs ]           [ Quality QA ]            [ Consumer ]
         │                         │                           │                         │
  Scan QR to Pair          Logistics Checkpoint        Defect Escalation         Public Scan/Track
 (Harvest Genesis)       (Processed/Transit/Store)      (IPFS Proof Pin)         (Read-Only RPC)
         │                         │                           │                         │
         └─────────────────────────┼───────────────────────────┴─────────────────────────┘
                                   │
                                   ▼
                      [ Next.js API Relayer ]
                  (Signs transactions server-side)
                                   │
                                   ▼
                [ OrangeProvenanceTracker Smart Contract ]
                    (EVM Ledger / Local Hardhat Node)
                                   │
           ┌───────────────────────┴───────────────────────┐
           ▼                                               ▼
  [ On-Chain State ]                              [ Decentralized IPFS ]
• Crate Structs & Mappings                      • Photographic Evidence
• Timestamped TrackingEvents                    • Quality Reports (CID)
• Lifecycle Enum States
```

---

## 🚀 Core Features & Application Pages

The frontend application provides tailored views for different supply chain stakeholders:

| Route | Page Name | Primary User | Description |
|---|---|---|---|
| `/` | **Operations Overview** | Supply Chain Managers | High-level KPI cards (Active Shipments, QA Score, Cold-Chain Violations), temperature trend charts, and active shipment table. |
| `/register` | **Register Harvest** | Farmers / Sorting Centers | Genesis registration binding a physical Crate QR ID to farm details and geolocation. |
| `/logistics` | **Logistics Checkpoint** | Transit Handlers & Drivers | Record custody handoffs and status changes (`Processed`, `In Transit`, `Warehoused`, `Retail`). |
| `/qa-reports` | **Defect Reporting** | Quality Inspectors | Log damage or spoilage with IPFS photo hashes, permanently setting the crate status to `Disputed`. |
| `/track` | **Public Search** | Consumers & Retailers | Clean, responsive search portal where anyone can input or scan a Crate ID. |
| `/crate/[id]` | **Consumer Provenance** | Consumers & Auditors | Full interactive chronological journey timeline from farm to shelf, displaying handlers, timestamps, locations, and cryptographic badges. |

---

## 📜 Smart Contract Architecture

The core contract is [`contracts/OrangeProvenanceTracker.sol`](contracts/OrangeProvenanceTracker.sol).

### Crate Lifecycle States

```solidity
enum CrateStatus {
    Harvested,   // 0: Initial farm genesis registration
    Processed,   // 1: Sorted, cleaned, and packed
    InTransit,   // 2: In transit via cold-chain transport
    Warehoused,  // 3: Stored in regional distribution warehouse
    Retail,      // 4: Delivered to retail supermarket / market
    Disputed     // 5: Flagged with quality defects or cold-chain violation
}
```

### Key Functions

* **`registerCrate(string _crateId, string _farmDetails, string _location)`**: Binds a unique QR ID to farm origin data and emits `CrateRegistered`.
* **`updateLocation(string _crateId, CrateStatus _newStatus, string _location)`**: Appends a new `TrackingEvent` and updates current status.
* **`reportDefect(string _crateId, string _ipfsHash, string _location)`**: Attaches IPFS evidence CID and marks crate status as `Disputed`.
* **`getCrateDetails(string _crateId)`**: Returns the complete crate struct including the full array of historical tracking events.
* **`batchUpdateCrate(string _crateId, CrateStatus[] _newStatuses, string[] _locations)`**: Batch appends tracking events for batch efficiency.

---

## 💻 Tech Stack

- **Smart Contract & Blockchain**: Solidity `^0.8.20`, Hardhat 3 Beta, Ethers.js v6
- **Frontend Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling & UI**: Tailwind CSS v4, Lucide Icons, Recharts
- **Storage**: IPFS (CID integration)
- **Local Dev Server**: Node.js JSON-RPC provider on `http://127.0.0.1:8545`

---

## 📁 Project Directory Structure

```text
DTIS project/
├── contracts/
│   └── OrangeProvenanceTracker.sol  # Core provenance smart contract
├── scripts/
│   ├── deploy.ts                    # Deploys contract & auto-updates frontend config
│   ├── seed.ts                      # Seeds mock orange crates onto local chain
│   └── send-op-tx.ts                # Test transaction script
├── hardhat.config.ts                # Hardhat network configuration
├── package.json                     # Root dependencies (Hardhat, Ethers, Mocha)
├── Project_Documentation.md         # Detailed system documentation
├── STARTUP_GUIDE.md                 # Daily shutdown/startup workflow guide
└── frontend/                        # Next.js Web Application
    ├── app/
    │   ├── page.tsx                 # Operations Overview dashboard
    │   ├── register/page.tsx        # Crate registration portal
    │   ├── logistics/page.tsx       # Transit tracking portal
    │   ├── qa-reports/page.tsx      # Defect reporting portal
    │   ├── track/page.tsx           # Consumer crate search page
    │   ├── crate/[id]/page.tsx      # Dynamic crate timeline view
    │   └── api/                     # Backend Gasless Relayer API routes
    │       ├── register/route.ts
    │       ├── update/route.ts
    │       └── defect/route.ts
    ├── components/                  # Reusable UI widgets & dashboards
    ├── hooks/                       # Web3 wallet hook (`useWallet`)
    ├── lib/
    │   └── contract.ts              # Contract ABI & deployed address
    └── package.json                 # Frontend dependencies (Next.js, React, Tailwind)
```

---

## ⚙️ Prerequisites

Make sure you have installed:
- **[Node.js](https://nodejs.org/)** (v18.17 or higher, v20+ recommended)
- **npm** (comes with Node.js)
- **[Git](https://git-scm.com/)**

---

## 🚀 Quick Start Guide

Follow these steps in order to run the entire application locally:

### 1. Clone the Repository

```bash
git clone https://github.com/AniketGarud400/orange-supply-chain.git
cd orange-supply-chain
```

### 2. Install Dependencies

Install root dependencies (Hardhat environment):
```bash
npm install
```

Install frontend dependencies:
```bash
cd frontend
npm install
cd ..
```

### 3. Configure Frontend Environment

Create a `.env.local` file inside the `frontend` directory:
```bash
# In frontend/.env.local:
PRIVATE_KEY="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
NEXT_PUBLIC_RPC_URL="http://127.0.0.1:8545"
```
*(The private key above is Hardhat's default Account #0 for local testing).*

---

### 4. Start the Local Blockchain Node

Open **Terminal 1** at the project root:
```bash
npx hardhat node
```
> Keep this terminal open! Hardhat provides 20 local test accounts with 10,000 ETH each at `http://127.0.0.1:8545`.

---

### 5. Deploy the Smart Contract

Open **Terminal 2** at the project root:
```bash
npx hardhat run scripts/deploy.ts --network localhost
```
*The deploy script automatically updates the deployed contract address inside `frontend/lib/contract.ts`.*

---

### 6. (Optional) Seed Sample Test Data

In **Terminal 2**, populate the blockchain with sample crates (`CRATE-001`, `CRATE-002`, `CRATE-003`):
```bash
npx hardhat run scripts/seed.ts --network localhost
```

---

### 7. Run the Next.js Frontend

In **Terminal 2**, start the web server:
```bash
cd frontend
npm run dev
```

Open your browser and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🧪 Testing the Workflow

1. **Dashboard:** Visit `http://localhost:3000` to review overall metrics and temperature trends.
2. **Register a Crate:** Navigate to `/register` and register a crate with ID `NGPR-2026-A1`.
3. **Logistics Checkpoints:** Navigate to `/logistics`, enter `NGPR-2026-A1`, select `In Transit`, and set location to `Nagpur Cold Hub`.
4. **Report Defect (Optional):** Go to `/qa-reports`, enter `NGPR-2026-A1`, attach sample photo evidence, and submit.
5. **Verify as a Consumer:** Navigate to `/track`, enter `NGPR-2026-A1` (or click directly on `/crate/NGPR-2026-A1`), and view the complete verified provenance journey timeline!

---

## 🔧 Troubleshooting

- **Contract Address Desync:** If you stop and restart `npx hardhat node`, the local blockchain state resets. Always run `npx hardhat run scripts/deploy.ts --network localhost` after restarting the node.
- **MetaMask Nonce Desync:** If using MetaMask on the local chain after restarting the node, reset account history:
  *Open MetaMask -> Settings -> Advanced -> Clear activity tab data*.
- **Port Conflicts:** Ensure port `8545` (Hardhat) and port `3000` (Next.js) are free before starting.

---

## 📄 License & Authors

Developed by **Aniket Garud** ([@AniketGarud400](https://github.com/AniketGarud400)).

Licensed under the [MIT License](LICENSE).
