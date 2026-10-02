import { network } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
    const { ethers } = await network.connect();
    const Tracker = await ethers.getContractFactory("OrangeProvenanceTracker");

    // We need the deployed address. Let's read it from the frontend contract.ts file.
    let contractAddress = "";

    const contractFilePath = path.join(process.cwd(), "frontend", "lib", "contract.ts");
    if (fs.existsSync(contractFilePath)) {
        let content = fs.readFileSync(contractFilePath, "utf8");
        const match = content.match(/export const CONTRACT_ADDRESS = "(.*)";/);
        if (match && match[1]) {
            contractAddress = match[1];
        }
    }

    if (!contractAddress) {
        console.error("Could not find contract address in frontend/lib/contract.ts");
        process.exit(1);
    }

    const tracker = Tracker.attach(contractAddress);

    console.log("Seeding test crates...");

    // Create the crates promised in the testing guide
    const cratesToSeed = [
        { id: "CRATE-001", farm: "Nagpur Central Farm, Plot 42", loc: "Farm Storage" },
        { id: "CRATE-002", farm: "East Valley Orchards", loc: "Local Sorting Facility" },
        { id: "CRATE-003", farm: "Westside Citrus Co-op", loc: "Farm Storage" }
    ];

    for (const crate of cratesToSeed) {
        // Check if not already registered
        const isRegistered = await (tracker as any).isCrateRegistered(crate.id);
        if (!isRegistered) {
            const tx = await (tracker as any).registerCrate(crate.id, crate.farm, crate.loc);
            await tx.wait();
            console.log(`Crate ${crate.id} successfully registered on the blockchain.`);
        } else {
            console.log(`Crate ${crate.id} is already registered.`);
        }
    }

    console.log("Seeding complete!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
