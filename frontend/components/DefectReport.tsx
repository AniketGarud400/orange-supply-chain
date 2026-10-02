"use client";

import { useState } from "react";
import { AlertOctagon, MapPin, PackageSearch, ImagePlus, BadgeAlert, CheckCircle2, Loader2 } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract";

export function DefectReport() {
    const { account, signer } = useWallet();

    // Form State
    const [crateId, setCrateId] = useState("");
    const [location, setLocation] = useState("");
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
    const [ipfsHash, setIpfsHash] = useState("");

    // Transaction State
    const [txStatus, setTxStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
    const [txMessage, setTxMessage] = useState("");
    const [txHash, setTxHash] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setSelectedFileName(file.name);

            // Simulate IPFS upload by generating a dummy hash string
            const dummyIpfsCID = "Qm" + Array.from({ length: 44 }, () => Math.random().toString(36).charAt(2)).join('');
            setIpfsHash(dummyIpfsCID);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!account || !signer) {
            setTxStatus("error");
            setTxMessage("Please connect your wallet first.");
            return;
        }

        if (!crateId || !location || !ipfsHash) {
            setTxStatus("error");
            setTxMessage("Crate ID, Location, and Photographic Evidence are required.");
            return;
        }

        try {
            setTxStatus("pending");
            setTxMessage("Please confirm the defect report in MetaMask...");
            setTxHash("");

            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            
            // Execute the transaction
            const tx = await contract.reportDefect(crateId, ipfsHash, location);
            
            setTxMessage("Transaction submitted. Waiting for confirmation...");
            setTxHash(tx.hash);
            
            const receipt = await tx.wait();

            if (receipt.status === 0) {
                throw new Error("Transaction failed on-chain.");
            }

            setTxStatus("success");
            setTxMessage(`Defect successfully reported. Crate ${crateId} is now flagged as Disputed.`);

            // Reset form
            setCrateId("");
            setLocation("");
            setSelectedFileName(null);
            setIpfsHash("");
            setTimeout(() => {
                if (document.getElementById("file-upload")) {
                    (document.getElementById("file-upload") as HTMLInputElement).value = "";
                }
            }, 0);

        } catch (error: any) {
            console.error("Submission Error:", error);
            setTxStatus("error");
            setTxMessage(error.message || "An unknown error occurred.");
        }
    };

    return (
        <div className="bg-destructive/5 border border-destructive/20 rounded-xl shadow-sm overflow-hidden mt-6">
            <div className="bg-destructive/10 p-6 border-b border-destructive/20">
                <h2 className="font-semibold text-xl flex items-center gap-2 text-destructive">
                    <AlertOctagon className="h-6 w-6" />
                    Report Quality Defect
                </h2>
                <p className="text-sm text-destructive/80 mt-1 dark:text-destructive/90">
                    File an operational anomaly or spoilage report. This action cannot be reversed and permanently marks the crate as Disputed on the blockchain ledger via <b>MetaMask</b>.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="crateIdInput" className="text-sm font-medium flex items-center gap-2">
                            <PackageSearch className="h-4 w-4 text-muted-foreground" />
                            Crate QR Code ID
                        </label>
                        <input
                            id="crateIdInput"
                            type="text"
                            value={crateId}
                            onChange={(e) => setCrateId(e.target.value)}
                            placeholder="e.g., NGPR-ORG-2026-B9"
                            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="locationInput" className="text-sm font-medium flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            Store / Facility Location
                        </label>
                        <input
                            id="locationInput"
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="e.g., Reliance Smart Retail, Pune"
                            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
                            required
                        />
                    </div>
                </div>

                {/* File Upload Section */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <ImagePlus className="h-4 w-4 text-muted-foreground" />
                        Upload Defect Evidence (Photo)
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <label htmlFor="file-upload" className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-input bg-background hover:bg-muted text-sm font-medium transition-colors">
                            <ImagePlus className="h-4 w-4" />
                            Select Evidence Image
                        </label>
                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                            required={!ipfsHash}
                        />
                        <div className="flex-1 text-sm text-muted-foreground truncate">
                            {selectedFileName ? (
                                <div className="flex flex-col">
                                    <span className="font-medium text-foreground truncate">{selectedFileName}</span>
                                    <span className="text-xs truncate font-mono mt-1 opacity-70">IPFS: {ipfsHash}</span>
                                </div>
                            ) : (
                                "No evidence attached. Image is required to open a dispute."
                            )}
                        </div>
                    </div>
                </div>

                {/* Alert Boxes for Tx Status */}
                {txStatus !== "idle" && (
                    <div className={`p-4 rounded-xl border flex flex-col gap-2 mt-2
            ${txStatus === 'pending' ? 'bg-orange-500/10 border-orange-500/20 text-orange-700 dark:text-orange-400' : ''}
            ${txStatus === 'success' ? 'bg-success/10 border-success/20 text-success' : ''}
            ${txStatus === 'error' ? 'bg-destructive/10 border-destructive/20 text-destructive' : ''}
          `}>
                        <div className="flex items-center gap-3">
                            {txStatus === 'pending' && <Loader2 className="h-5 w-5 animate-spin" />}
                            {txStatus === 'success' && <CheckCircle2 className="h-5 w-5" />}
                            {txStatus === 'error' && <BadgeAlert className="h-5 w-5" />}
                            <span className="font-medium">{txMessage}</span>
                        </div>
                        {txHash && (
                            <div className="text-xs opacity-80 pl-8 font-mono break-all pt-1 border-t border-current/10 mt-1">
                                Tx Hash: {txHash}
                            </div>
                        )}
                    </div>
                )}

                {/* Submit Button */}
                <div className="pt-4 mt-2 border-t border-destructive/20 text-destructive">
                    <button
                        type="submit"
                        disabled={txStatus === 'pending'}
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-destructive text-destructive-foreground font-bold text-lg hover:bg-destructive/90 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none active:scale-95"
                    >
                        {txStatus === 'pending' ? (
                            <>
                                <Loader2 className="h-6 w-6 animate-spin" />
                                Processing in MetaMask...
                            </>
                        ) : (
                            "Escalate & Report Defect"
                        )}
                    </button>
                </div>

            </form>
        </div>
    );
}
