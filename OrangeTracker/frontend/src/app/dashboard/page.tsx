"use client";

import { useState } from 'react';
import Link from 'next/link';
import {
    ArrowLeft, Activity, AlertTriangle, Clock,
    Package, TrendingDown, Image as ImageIcon,
    Zap, ChevronRight, X
} from 'lucide-react';

// Mock Data
const MOCK_METRICS = {
    totalCrates: "14,208",
    avgTransitTime: "5.2 Days",
    defectRate: "1.4%",
};

interface TrackingEvent {
    status: string;
    timestamp: string; // ISO format for calculation
}

interface DisputedCrate {
    id: string;
    farmDetails: string;
    ipfsHash: string;
    defectType: string;
    events: TrackingEvent[];
}

const DISPUTED_CRATES: DisputedCrate[] = [
    {
        id: "CRT-9144-NAG",
        farmDetails: "Kalmeshwar Premium Orchards",
        ipfsHash: "QmYwAPJzv5CZsnA625s3Xf2nex5xb...xVa",
        defectType: "Spoilage / Mold",
        events: [
            { status: "Harvested", timestamp: "2023-10-10T08:00:00Z" },
            { status: "Processed", timestamp: "2023-10-11T10:00:00Z" },
            // 50 hours delay
            { status: "In Transit", timestamp: "2023-10-13T12:00:00Z" },
            { status: "Retail", timestamp: "2023-10-14T09:00:00Z" },
        ]
    },
    {
        id: "CRT-3329-PUN",
        farmDetails: "Western Ghats Citrus",
        ipfsHash: "QmPbXfjz5CZsnA625s3Xf...2nxa",
        defectType: "Physical Damage",
        events: [
            { status: "Harvested", timestamp: "2023-10-12T07:00:00Z" },
            { status: "Processed", timestamp: "2023-10-12T14:00:00Z" },
            // Transit took 5 days
            { status: "In Transit", timestamp: "2023-10-12T18:00:00Z" },
            { status: "Retail", timestamp: "2023-10-17T18:00:00Z" },
        ]
    }
];

export default function HQDashboard() {
    const [selectedCrate, setSelectedCrate] = useState<DisputedCrate | null>(null);

    // Automated Root Cause Analysis Engine
    const generateDiagnostic = (events: TrackingEvent[]) => {
        let diagnostic = "Analysis Complete: Normal transit timeline.";
        let isFlagged = false;
        let bottleneckStage = "";

        const processEvent = events.find(e => e.status === "Processed");
        const transitEvent = events.find(e => e.status === "In Transit");
        const retailEvent = events.find(e => e.status === "Retail");

        if (processEvent && transitEvent) {
            const pTime = new Date(processEvent.timestamp).getTime();
            const tTime = new Date(transitEvent.timestamp).getTime();
            const diffHours = (tTime - pTime) / (1000 * 60 * 60);

            if (diffHours > 48) {
                diagnostic = `Critical Delay: Crate sat at Processing Center for ${diffHours.toFixed(1)} hours before dispatch. Exceeds 48h freshness threshold.`;
                isFlagged = true;
                bottleneckStage = "Processing -> Transit";
            }
        }

        if (!isFlagged && transitEvent && retailEvent) {
            const tTime = new Date(transitEvent.timestamp).getTime();
            const rTime = new Date(retailEvent.timestamp).getTime();
            const diffDays = (rTime - tTime) / (1000 * 60 * 60 * 24);

            if (diffDays > 3) {
                diagnostic = `Transit Anomaly: Journey took ${diffDays.toFixed(1)} days. High probability of temperature abuse during prolonged transit.`;
                bottleneckStage = "In Transit";
            }
        }

        return { diagnostic, bottleneckStage };
    };

    return (
        <div className="flex-1 flex flex-col pt-4 animate-fade-in-up w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Desktop Header */}
            <header className="flex justify-between items-center mb-8">
                <div>
                    <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-2">
                        <ArrowLeft className="w-4 h-4" /> Exit Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent flex items-center gap-3">
                        <Activity className="w-8 h-8 text-orange-500" /> HQ Operations Tracker
                    </h1>
                    <p className="text-slate-400">Real-time Supply Chain Network Overview</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-medium text-slate-300">Live Network Status</p>
                    <p className="text-emerald-400 text-sm flex items-center gap-2 justify-end">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> All Nodes Operational
                    </p>
                </div>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass-panel p-6 border-blue-500/20">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-slate-400 font-medium">Total Crates Tracked</p>
                            <h3 className="text-3xl font-bold text-white mt-1">{MOCK_METRICS.totalCrates}</h3>
                        </div>
                        <div className="bg-blue-500/20 p-3 rounded-xl border border-blue-500/30">
                            <Package className="w-6 h-6 text-blue-400" />
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-6 border-purple-500/20">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-slate-400 font-medium">Average Transit Time</p>
                            <h3 className="text-3xl font-bold text-white mt-1">{MOCK_METRICS.avgTransitTime}</h3>
                        </div>
                        <div className="bg-purple-500/20 p-3 rounded-xl border border-purple-500/30">
                            <Clock className="w-6 h-6 text-purple-400" />
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-6 border-red-500/20">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-slate-400 font-medium">Defect Rate (Last 30D)</p>
                            <h3 className="text-3xl font-bold text-white mt-1">{MOCK_METRICS.defectRate}</h3>
                        </div>
                        <div className="bg-red-500/20 p-3 rounded-xl border border-red-500/30">
                            <TrendingDown className="w-6 h-6 text-red-400" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
                {/* Defect Alerts Panel */}
                <div className="lg:col-span-1 glass-panel flex flex-col overflow-hidden">
                    <div className="p-5 border-b border-white/10 bg-black/20">
                        <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                            <AlertTriangle className="w-5 h-5 text-amber-500" /> Disputed Crates Feed
                        </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-3">
                        {DISPUTED_CRATES.map(crate => (
                            <div
                                key={crate.id}
                                onClick={() => setSelectedCrate(crate)}
                                className={`p-4 rounded-xl cursor-pointer border transition-all ${selectedCrate?.id === crate.id ? 'bg-amber-500/10 border-amber-500/50' : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-500/50 hover:bg-slate-800/80'}`}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-mono text-sm text-slate-300">{crate.id}</span>
                                    <span className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400 border border-red-500/30">{crate.defectType}</span>
                                </div>
                                <p className="text-xs text-slate-400 truncate">{crate.farmDetails}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RCA Details Area */}
                <div className="lg:col-span-2 glass-panel p-6 flex flex-col relative overflow-hidden">
                    {!selectedCrate ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                            <Activity className="w-16 h-16 text-slate-600 mb-4 opacity-50" />
                            <p>Select a disputed crate to run Root Cause Analysis</p>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col animate-fade-in-up z-10">
                            <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">RCA: {selectedCrate.id}</h2>
                                    <p className="text-sm text-slate-400 flex items-center gap-2">
                                        IPFS Evidence: <span className="font-mono text-blue-400 cursor-pointer hover:underline">{selectedCrate.ipfsHash}</span>
                                    </p>
                                </div>
                                <button onClick={() => setSelectedCrate(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors hidden sm:block">
                                    <X className="w-6 h-6 text-slate-400" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
                                {/* Simulated IPFS Evidence */}
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <ImageIcon className="w-4 h-4" /> Photographic Evidence
                                    </h3>
                                    <div className="aspect-video bg-slate-900 rounded-xl border border-slate-700 relative overflow-hidden flex items-center justify-center shadow-inner group">
                                        <img
                                            src={`https://images.unsplash.com/photo-1550828520-4cb496926fc9?w=600&h=400&fit=crop`}
                                            alt="Defect Evidence"
                                            className="object-cover w-full h-full opacity-80 group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                                            <span className="text-red-400 font-medium shadow-black drop-shadow-md">{selectedCrate.defectType}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* AI Diagnostic engine */}
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-amber-500" /> Automated Diagnostic
                                    </h3>

                                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 mb-6">
                                        {(() => {
                                            const analysis = generateDiagnostic(selectedCrate.events);
                                            return (
                                                <>
                                                    <div className="flex gap-3 text-amber-300 font-medium items-start">
                                                        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                                                        <p className="leading-relaxed">{analysis.diagnostic}</p>
                                                    </div>
                                                    {analysis.bottleneckStage && (
                                                        <div className="mt-4 inline-flex items-center gap-2 bg-black/30 border border-amber-500/20 px-3 py-1.5 rounded-lg text-xs font-mono text-amber-400">
                                                            Bottleneck Identified: {analysis.bottleneckStage}
                                                        </div>
                                                    )}
                                                </>
                                            );
                                        })()}
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Immutable Event Logs</h4>
                                        {selectedCrate.events.map((e, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg border border-white/5">
                                                <span className="text-sm font-medium text-slate-200">{e.status}</span>
                                                <span className="text-xs font-mono text-slate-400">
                                                    {new Date(e.timestamp).toLocaleString(undefined, {
                                                        dateStyle: 'medium', timeStyle: 'short'
                                                    })}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
