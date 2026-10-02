"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, QrCode } from "lucide-react";

export default function ConsumerLandingPage() {
    const [crateId, setCrateId] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!crateId.trim()) {
            setError("Please enter a valid Crate ID.");
            return;
        }

        setIsSearching(true);
        // Redirect to the dynamic timeline route we built earlier
        router.push(`/crate/${encodeURIComponent(crateId.trim())}`);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 animate-in zoom-in-95 duration-500">

            <div className="bg-card border border-border rounded-3xl p-8 sm:p-12 w-full max-w-xl shadow-xl shadow-primary/5 text-center relative overflow-hidden">

                {/* Aesthetic Background Elements */}
                <div className="absolute -top-24 -right-24 h-48 w-48 bg-primary/10 blur-3xl rounded-full"></div>
                <div className="absolute -bottom-24 -left-24 h-48 w-48 bg-primary/5 blur-3xl rounded-full"></div>

                <div className="relative z-10 flex flex-col items-center gap-6">
                    <div className="h-20 w-20 bg-primary/10 text-primary rounded-full flex items-center justify-center border border-primary/20 mb-2">
                        <MapPin className="h-10 w-10" />
                    </div>

                    <div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
                            Track Your Oranges
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Discover the immutable origin and journey of your Nagpur Oranges directly from the blockchain.
                        </p>
                    </div>

                    <form onSubmit={handleSearch} className="w-full flex flex-col gap-4 mt-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <QrCode className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                type="text"
                                value={crateId}
                                onChange={(e) => setCrateId(e.target.value)}
                                placeholder="Enter Crate ID (e.g. NGPR-ORG-001)"
                                className="block w-full pl-12 pr-4 py-4 bg-muted/50 border-2 border-transparent focus:border-primary/50 focus:bg-background rounded-2xl text-lg transition-all focus:outline-none focus:ring-4 focus:ring-primary/10 placeholder:text-muted-foreground/70"
                            />
                        </div>

                        {error && <p className="text-destructive text-sm font-medium text-left px-2">{error}</p>}

                        <button
                            type="submit"
                            disabled={isSearching}
                            className="w-full mt-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2"
                        >
                            {isSearching ? "Searching Ledger..." : "Analyze Provenance"}
                            {!isSearching && <Search className="h-5 w-5" />}
                        </button>
                    </form>

                    <p className="text-sm font-medium text-muted-foreground mt-6 flex items-center justify-center gap-2">
                        Powered by Ethereum Smart Contracts
                    </p>
                </div>
            </div>
        </div>
    );
}
