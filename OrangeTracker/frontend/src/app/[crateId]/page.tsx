"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, ShieldCheck, MapPin, Calendar, Clock, Citrus } from 'lucide-react';

interface TrackingEvent {
    status: string;
    location: string;
    timestamp: string;
    handler: string;
}

export default function ConsumerView() {
    const params = useParams();
    const crateId = params.crateId as string;
    const [loading, setLoading] = useState(true);

    // Mock data fetched from Web3 Smart Contract
    const farmDetails = {
        name: "Kalmeshwar Premium Orchards",
        region: "Nagpur, Maharashtra, India",
        variety: "Nagpur Mandarin (Geographical Indication)",
        harvestDate: "Oct 12, 2023"
    };

    const timelineEvents: TrackingEvent[] = [
        {
            status: "Harvested",
            location: "Kalmeshwar Farms, Plot 4",
            timestamp: "Oct 12, 2023 • 08:30 AM",
            handler: "0x4F...8a92"
        },
        {
            status: "Processed",
            location: "Nagpur Sorting Facility A",
            timestamp: "Oct 13, 2023 • 02:15 PM",
            handler: "0x91...2b11"
        },
        {
            status: "In Transit",
            location: "Nagpur -> Pune Dispatch",
            timestamp: "Oct 14, 2023 • 09:00 AM",
            handler: "0xCc...4d77"
        },
        {
            status: "Retail",
            location: "Pune City Freshmart",
            timestamp: "Oct 15, 2023 • 11:45 AM",
            handler: "0x1A...9f00"
        }
    ];

    useEffect(() => {
        // Simulate fetching crate data from blockchain
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, [crateId]);

    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center animate-pulse">
                <Citrus className="w-16 h-16 text-orange-500 mb-4 animate-spin-slow" />
                <h2 className="text-xl font-bold text-slate-300">Querying Blockchain...</h2>
                <p className="text-slate-500 mt-2 text-sm">Validating Provenance for Crate {crateId}</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col pt-2 pb-8 animate-fade-in-up">
            <header className="mb-6">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-4">
                    <ArrowLeft className="w-4 h-4" /> Back
                </Link>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
                            Crate Journey
                        </h1>
                        <p className="text-sm font-mono text-slate-400 mt-1 uppercase tracking-wider">ID: {crateId}</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Verified Origin
                        </span>
                    </div>
                </div>
            </header>

            {/* Farm Profile Card */}
            <div className="glass-panel p-5 mb-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700" />

                <div className="relative z-10">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Citrus className="w-5 h-5 text-orange-500" /> Farm Profile
                    </h2>

                    <div className="space-y-3 font-medium">
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-white text-sm">{farmDetails.name}</p>
                                <p className="text-xs text-slate-400">{farmDetails.region}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-white text-sm">Authentic Variety</p>
                                <p className="text-xs text-slate-400">{farmDetails.variety}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-white text-sm">Harvest Date</p>
                                <p className="text-xs text-slate-400">{farmDetails.harvestDate}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Vertical Provenance Timeline */}
            <h2 className="text-lg font-bold text-white mb-6 px-1 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" /> Blockchain Timeline
            </h2>

            <div className="relative border-l-2 border-slate-700 ml-4 pl-6 space-y-8">
                {timelineEvents.map((event, idx) => {
                    const isLast = idx === timelineEvents.length - 1;
                    return (
                        <div key={idx} className="relative">
                            {/* Node Dot */}
                            <div className={`absolute -left-[31px] w-4 h-4 rounded-full border-2 border-slate-900 ${isLast ? 'bg-orange-500 ring-4 ring-orange-500/20' : 'bg-slate-500'}`} />

                            <div className="bg-slate-800/40 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-sm font-bold ${isLast ? 'text-orange-400' : 'text-slate-300'}`}>
                                        {event.status}
                                    </span>
                                    <span className="text-xs text-slate-500 font-mono bg-black/30 px-2 py-0.5 rounded">
                                        {event.handler}
                                    </span>
                                </div>

                                <h3 className="text-md text-white mb-1">{event.location}</h3>
                                <p className="text-xs text-slate-400">{event.timestamp}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-10 flex justify-center">
                <div className="inline-flex flex-col items-center">
                    <ShieldCheck className="w-8 h-8 text-emerald-500 opacity-80 mb-2" />
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold text-center">
                        Blockchain Verified<br />Smart Contract 0x8a9B...12E4
                    </p>
                </div>
            </div>
        </div>
    );
}
