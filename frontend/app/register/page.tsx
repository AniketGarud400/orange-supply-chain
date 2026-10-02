"use client";

import { useState } from "react";
import { QrCode, MapPin, Pickaxe, BadgeAlert, CheckCircle2, Loader2 } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract";

export default function RegisterHarvest() {
    const { account, signer, connectWallet } = useWallet();

    // Form State
    const [crateId, setCrateId] = useState("");
    const [farmDetails, setFarmDetails] = useState("");
    const [location, setLocation] = useState("");

    // Transaction State
    const [txStatus, setTxStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
    const [txMessage, setTxMessage] = useState("");
    const [txHash, setTxHash] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!account || !signer) {
            setTxStatus("error");
            setTxMessage("Please connect your wallet first.");
            return;
        }

        if (!crateId || !farmDetails || !location) {
            setTxStatus("error");
            setTxMessage("All fields are required.");
            return;
        }

        try {
            setTxStatus("pending");
            setTxMessage("Please confirm the transaction in MetaMask...");
            setTxHash("");

            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            
            // Execute the transaction
            const tx = await contract.registerCrate(crateId, farmDetails, location);
            
            setTxMessage("Transaction submitted. Waiting for confirmation...");
            setTxHash(tx.hash);
            
            const receipt = await tx.wait();

            if (receipt.status === 0) {
                throw new Error("Transaction failed on-chain.");
            }

            setTxStatus("success");
            setTxMessage("Harvest registered successfully on the blockchain.");

            // Clear form on success
            setCrateId("");
            setFarmDetails("");
            setLocation("");

        } catch (error: any) {
            console.error("Transaction Error:", error);
            setTxStatus("error");
            setTxMessage(error.message || "An unknown error occurred during the transaction.");
        }
    };

    return (
        <div className="flex flex-col gap-8 pb-8 animate-in fade-in duration-500 max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Register Harvest</h1>
                <p className="text-muted-foreground">
                    Initialize a new batch of Nagpur Oranges onto the provenance blockchain. This creates an immutable origin record directly via your <b>MetaMask</b> wallet.
                </p>
            </div>

            {/* Registration Form */}
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="bg-muted/50 p-6 border-b border-border">
                    <h2 className="font-semibold text-xl">New Batch Registration</h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">

                    <div className="flex flex-col gap-2">
                        <label htmlFor="crateId" className="text-sm font-medium flex items-center gap-2">
                            <QrCode className="h-4 w-4 text-muted-foreground" />
                            Crate QR Code ID
                        </label>
                        <input
                            id="crateId"
                            type="text"
                            value={crateId}
                            onChange={(e) => setCrateId(e.target.value)}
                            placeholder="e.g., NGPR-ORG-2026-A1"
                            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="farmDetails" className="text-sm font-medium flex items-center gap-2">
                            <Pickaxe className="h-4 w-4 text-muted-foreground" />
                            Farm Origin Details
                        </label>
                        <input
                            id="farmDetails"
                            type="text"
                            value={farmDetails}
                            onChange={(e) => setFarmDetails(e.target.value)}
                            placeholder="e.g., Kalmeshwar Estate, Plot B"
                            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            Initial Location
                        </label>
                        <input
                            id="location"
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="e.g., Sorting Center 1, Nagpur"
                            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
                            required
                        />
                    </div>

                    {/* Alert Boxes for Tx Status */}
                    {txStatus !== "idle" && (
                        <div className={`p-4 rounded-xl border flex flex-col gap-2 mt-2
              ${txStatus === 'pending' ? 'bg-orange-500/10 border-orange-500/20 text-orange-700 dark:text-orange-400' : ''}
              ${txStatus === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400' : ''}
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
                    <div className="pt-4 mt-2 border-t border-border">
                        <button
                            type="submit"
                            disabled={txStatus === 'pending'}
                            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-orange-600 text-white font-bold text-lg hover:bg-orange-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none active:scale-95"
                        >
                            {txStatus === 'pending' ? (
                                <>
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                    Relaying to Blockchain...
                                </>
                            ) : (
                                "Register on Public Ledger"
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
