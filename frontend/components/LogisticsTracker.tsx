"use client";

import { useState } from "react";
import { PackageSearch, MapPin, Truck, BadgeAlert, CheckCircle2, Loader2, Plus, Trash2, History } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract";

// Enum Mapping based on Solidity contract:
// Harvested = 0, Processed = 1, InTransit = 2, Warehoused = 3, Retail = 4, Disputed = 5
const STATUS_OPTIONS = [
    { value: "1", label: "Processed" },
    { value: "2", label: "In Transit" },
    { value: "3", label: "Warehoused" },
    { value: "4", label: "Retail" }
];

interface QueuedUpdate {
    status: number;
    location: string;
}

export function LogisticsTracker() {
    const { account, signer } = useWallet();

    // Form State
    const [crateId, setCrateId] = useState("");
    const [location, setLocation] = useState("");
    const [newStatus, setNewStatus] = useState("2"); // Default to In Transit
    
    // Batching State
    const [updates, setUpdates] = useState<QueuedUpdate[]>([]);

    // Transaction State
    const [txStatus, setTxStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
    const [txMessage, setTxMessage] = useState("");
    const [txHash, setTxHash] = useState("");

    const addUpdateToQueue = () => {
        if (!location) return;
        setUpdates([...updates, { status: parseInt(newStatus), location }]);
        setLocation("");
    };

    const removeUpdateFromQueue = (index: number) => {
        setUpdates(updates.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!account || !signer) {
            setTxStatus("error");
            setTxMessage("Please connect your wallet first.");
            return;
        }

        if (!crateId) {
            setTxStatus("error");
            setTxMessage("Crate ID is required.");
            return;
        }

        // If there are no queued updates, use the current input fields
        const finalUpdates = updates.length > 0 
            ? updates 
            : (location ? [{ status: parseInt(newStatus), location }] : []);

        if (finalUpdates.length === 0) {
            setTxStatus("error");
            setTxMessage("Please add at least one update or fill in the location.");
            return;
        }

        try {
            setTxStatus("pending");
            setTxMessage("Please confirm the transaction in MetaMask...");
            setTxHash("");

            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            let tx;

            if (finalUpdates.length === 1) {
                // Single update
                tx = await contract.updateLocation(crateId, finalUpdates[0].status, finalUpdates[0].location);
            } else {
                // Batch update same crate
                const statuses = finalUpdates.map(u => u.status);
                const locations = finalUpdates.map(u => u.location);
                tx = await contract.batchUpdateCrate(crateId, statuses, locations);
            }

            setTxMessage("Transaction submitted. Waiting for confirmation...");
            setTxHash(tx.hash);
            
            const receipt = await tx.wait();

            if (receipt.status === 0) {
                throw new Error("Transaction failed on-chain.");
            }

            setTxStatus("success");
            setTxMessage(`Successfully registered ${finalUpdates.length} update(s) for ${crateId} in a single transaction.`);

            // Reset form
            setCrateId("");
            setLocation("");
            setUpdates([]);
        } catch (error: any) {
            console.error("Submission Error:", error);
            setTxStatus("error");
            setTxMessage(error.message || "An unknown error occurred.");
        }
    };

    return (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden mt-6">
            <div className="bg-muted/50 p-6 border-b border-border">
                <h2 className="font-semibold text-xl flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    Update Logistics Checkpoint
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Log transit events for a Nagpur Orange crate. You can add multiple steps to register them in a <b>single MetaMask transaction</b>.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">

                <div className="flex flex-col gap-2">
                    <label htmlFor="crateIdInput" className="text-sm font-medium flex items-center gap-2">
                        <PackageSearch className="h-4 w-4 text-muted-foreground" />
                        Target Crate ID
                    </label>
                    <input
                        id="crateIdInput"
                        type="text"
                        value={crateId}
                        onChange={(e) => setCrateId(e.target.value)}
                        placeholder="e.g., NGPR-ORG-2026-A1"
                        className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
                        required
                    />
                </div>

                <div className="bg-muted/30 p-4 rounded-xl border border-dashed border-border flex flex-col gap-4">
                    <h3 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                        <Plus className="h-4 w-4" />
                        Add Update Step
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-medium text-muted-foreground">Status</label>
                            <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                            >
                                {STATUS_OPTIONS.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-medium text-muted-foreground">Location</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="e.g., Mumbai Hub"
                                    className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={addUpdateToQueue}
                                    disabled={!location}
                                    className="px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 disabled:opacity-50 transition-colors"
                                    title="Add step to transaction"
                                >
                                    <Plus className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {updates.length > 0 && (
                        <div className="mt-2 border-t border-border pt-4">
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                                <History className="h-3 w-3" />
                                Queued for this transaction:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {updates.map((upd, idx) => (
                                    <div key={idx} className="flex items-center gap-2 bg-background border border-border px-3 py-1.5 rounded-full text-xs shadow-sm group">
                                        <span className="font-semibold text-primary">{STATUS_OPTIONS.find(o => parseInt(o.value) === upd.status)?.label}</span>
                                        <span className="text-muted-foreground">at</span>
                                        <span>{upd.location}</span>
                                        <button 
                                            type="button" 
                                            onClick={() => removeUpdateFromQueue(idx)}
                                            className="text-muted-foreground hover:text-destructive ml-1"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Alert Boxes for Tx Status */}
                {txStatus !== "idle" && (
                    <div className={`p-4 rounded-xl border flex flex-col gap-2
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
                <div className="pt-4 mt-2 border-t border-border">
                    <button
                        type="submit"
                        disabled={txStatus === 'pending'}
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none active:scale-95"
                    >
                        {txStatus === 'pending' ? (
                            <>
                                <Loader2 className="h-6 w-6 animate-spin" />
                                Processing in MetaMask...
                            </>
                        ) : (
                            updates.length > 1 
                                ? `Register all ${updates.length} updates at once`
                                : "Log Transit Checkpoint"
                        )}
                    </button>
                    {updates.length > 1 && (
                        <p className="text-center text-[10px] text-muted-foreground mt-3 uppercase tracking-widest">
                            Multiple updates detected — saving gas with a single transaction
                        </p>
                    )}
                </div>

            </form>
        </div>
    );
}
