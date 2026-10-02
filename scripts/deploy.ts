import { network } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
    const { ethers } = await network.connect();
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const Tracker = await ethers.getContractFactory("OrangeProvenanceTracker");
    const tracker = await Tracker.deploy();
    await tracker.waitForDeployment();

    const targetAddress = await tracker.getAddress();
    console.log("OrangeProvenanceTracker deployed to:", targetAddress);

    // Automatically update the frontend contract.ts file
    const contractFilePath = path.join(process.cwd(), "frontend", "lib", "contract.ts");
    if (fs.existsSync(contractFilePath)) {
        let content = fs.readFileSync(contractFilePath, "utf8");
        content = content.replace(
            /export const CONTRACT_ADDRESS = ".*";/,
            `export const CONTRACT_ADDRESS = "${targetAddress}";`
        );
        fs.writeFileSync(contractFilePath, content);
        console.log(`Successfully updated CONTRACT_ADDRESS in ${contractFilePath}`);
    } else {
        console.error(`Could not find frontend contract file at: ${contractFilePath}`);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});