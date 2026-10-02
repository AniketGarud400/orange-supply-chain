"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract";
import { ShieldCheck, MapPin, Clock, PackageCheck, AlertOctagon, Loader2, ArrowDown } from "lucide-react";

// Types matching the Solidity struct tuple
type TrackingEvent = {
    timestamp: bigint;
    location: string;
    handlerAddress: string;
    status: bigint;
};

type CrateDetails = {
    crateId: string;
    farmDetails: string;
    currentStatus: number;
    ipfsDefectHash: string;
    trackingEvents: TrackingEvent[];
};

const STATUS_MAP = ["Harvested", "Processed", "In Transit", "Warehoused", "Retail", "Disputed"];
const STATUS_COLORS = [
    "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20", // 0
    "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",       // 1
    "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20",   // 2
    "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",   // 3
    "bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/20",       // 4
    "bg-destructive/10 text-destructive border-destructive/20"                  // 5
];

export default function ConsumerCrateTracker() {
    const params = useParams<{ id: string }>();
    const crateId = params?.id ? decodeURIComponent(params.id) : null;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [crateData, setCrateData] = useState<CrateDetails | null>(null);

    useEffect(() => {
        if (!crateId) return;

        const fetchCrateProvenance = async () => {
            try {
                setLoading(true);
                setError(null);

                // Setup Read-Only Provider for Hardhat Localhost (or fallback if deployed to testnet)
                // This ensures Consumers DO NOT need MetaMask installed.
                let provider;
                if (typeof window !== "undefined" && (window as any).ethereum) {
                    // Prefer injected provider if available to avoid unhandled localhost errors when browser has metamask
                    provider = new ethers.BrowserProvider((window as any).ethereum);
                } else {
                    provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
                }

                const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

                // Check registry first
                const isRegistered = await contract.isCrateRegistered(crateId);
                if (!isRegistered) {
                    setError(`No records found on the blockchain for Crate ID: ${crateId}`);
                    setLoading(false);
                    return;
                }

                const data = await contract.getCrateDetails(crateId);

                setCrateData({
                    crateId: data.r_crateId,
                    farmDetails: data.r_farmDetails,
                    currentStatus: Number(data.r_currentStatus),
                    ipfsDefectHash: data.r_ipfsDefectHash,
                    trackingEvents: data.r_trackingEvents
                });

            } catch (err: any) {
                console.error("Error fetching provenance data:", err);
                setError("Failed to fetch blockchain records. Ensure the local network node is running.");
            } finally {
                setLoading(false);
            }
        };

        fetchCrateProvenance();
    }, [crateId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground font-medium animate-pulse">Reading Ledger State...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto mt-12 text-center p-8 bg-destructive/5 border border-destructive/20 rounded-2xl">
                <AlertOctagon className="h-12 w-12 text-destructive mx-auto mb-4 opacity-80" />
                <h2 className="text-xl font-bold text-foreground mb-2">Verification Failed</h2>
                <p className="text-muted-foreground">{error}</p>
            </div>
        );
    }

    if (!crateData) return null;

    const isDisputed = crateData.currentStatus === 5;

    return (
        <div className="flex flex-col gap-8 max-w-2xl mx-auto pb-12 animate-in slide-in-from-bottom-4 duration-700">

            {/* Verified Trust Badge Header */}
            <div className="flex flex-col items-center text-center gap-4 bg-gradient-to-br from-success/5 to-transparent border border-success/20 p-8 rounded-3xl shadow-sm relative overflow-hidden">
                <div className="absolute -top-12 -right-12 h-32 w-32 bg-success/10 blur-3xl rounded-full"></div>
                <div className="absolute -bottom-8 -left-8 h-24 w-24 bg-primary/10 blur-2xl rounded-full"></div>

                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-success/10 text-success text-sm font-semibold border border-success/20 mb-2 shadow-inner">
                    <ShieldCheck className="h-4 w-4" />
                    Verified on Blockchain
                </div>

                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight break-words">
                    {crateData.crateId}
                </h1>

                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 mt-2">
                    <div className="flex items-center gap-2 text-muted-foreground font-medium">
                        <PackageCheck className="h-4 w-4" />
                        <span className="text-foreground">Farm Origin:</span> {crateData.farmDetails}
                    </div>
                </div>

                <div className={`mt-4 px-6 py-2 rounded-xl border text-sm font-semibold tracking-wide ${STATUS_COLORS[crateData.currentStatus]}`}>
                    Status: {STATUS_MAP[crateData.currentStatus]}
                </div>
            </div>

            {isDisputed && crateData.ipfsDefectHash && (
                <div className="bg-destructive/10 border-l-4 border-l-destructive p-5 rounded-r-xl flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-destructive font-bold">
                        <AlertOctagon className="h-5 w-5" />
                        Quality Defect Reported
                    </div>
                    <p className="text-sm text-foreground/80 dark:text-foreground/90 leading-relaxed">
                        This shipment has been flagged for quality issues.
                        <br />
                        <span className="font-mono text-xs opacity-70 mt-1 block">Evidence CID: {crateData.ipfsDefectHash}</span>
                    </p>
                </div>
            )}

            {/* Provenance Timeline */}
            <div className="mt-4 px-4">
                <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Journey Timeline
                </h2>

                <div className="relative border-l-2 border-primary/20 ml-3 sm:ml-4 space-y-10 pl-6 sm:pl-8">
                    {crateData.trackingEvents.map((event, index) => {
                        // In Solidity block.timestamp is seconds since epoch. JS expects milliseconds.
                        const date = new Date(Number(event.timestamp) * 1000);
                        // Use the actual status recorded on the blockchain
                        const actualStatus = Number(event.status);
                        // If last and disputed, flag it
                        const isLastAndDisputed = isDisputed && index === crateData.trackingEvents.length - 1;

                        return (
                            <div key={index} className="relative">
                                {/* Timeline Node Connector */}
                                <div className={`absolute -left-[35px] sm:-left-[43px] top-1 h-5 w-5 sm:h-6 sm:w-6 rounded-full border-4 border-background flex items-center justify-center
                    ${isLastAndDisputed ? 'bg-destructive ring-destructive/30' : 'bg-primary ring-primary/30'} ring-4
                 `}></div>

                                <div className="flex flex-col gap-1.5 bg-card/50 p-5 border border-border rounded-xl shadow-sm hover:border-primary/50 transition-colors">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                        <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border 
                                       ${isLastAndDisputed ? STATUS_COLORS[5] : STATUS_COLORS[actualStatus]}`}>
                                            {isLastAndDisputed ? "Defect Found" : STATUS_MAP[actualStatus]}
                                        </span>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium bg-muted px-2 py-1 rounded-md">
                                            <Clock className="h-3 w-3" />
                                            {date.toLocaleString(undefined, {
                                                month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                                            })}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mt-1">
                                        <MapPin className="h-4 w-4 text-primary" />
                                        {event.location}
                                    </h3>

                                    <p className="text-xs font-mono text-muted-foreground truncate opacity-60 flex items-center gap-2 mt-2 pt-2 border-t border-border">
                                        <span className="px-1.5 py-0.5 bg-background rounded border text-[10px] tracking-wider uppercase font-sans font-bold">Handler</span>
                                        {event.handlerAddress}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
    );
}
