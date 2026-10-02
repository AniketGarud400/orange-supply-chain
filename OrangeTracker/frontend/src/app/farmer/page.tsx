"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Leaf, QrCode, CheckCircle2, Loader2 } from 'lucide-react';

export default function FarmerView() {
    const [formData, setFormData] = useState({ crateId: '', farmDetails: '', location: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate Web3 contract call: registerCrate(crateId, farmDetails, location)
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsSubmitting(false);
        setIsSuccess(true);
        setTimeout(() => {
            setIsSuccess(false);
            setFormData({ crateId: '', farmDetails: '', location: '' });
        }, 3000);
    };

    return (
        <div className="flex-1 flex flex-col pt-4 animate-fade-in-up">
            <header className="flex items-center gap-4 mb-8">
                <Link href="/" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                    <ArrowLeft className="w-6 h-6 text-slate-300" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">
                        Farmer Portal
                    </h1>
                    <p className="text-sm text-slate-400">Register new harvest crate</p>
                </div>
            </header>

            <div className="glass-panel p-6 mb-6">
                <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                    <div className="bg-emerald-500/20 p-2 rounded-lg">
                        <Leaf className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h2 className="text-lg font-semibold">Origin Details</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Scan Crate QR / Enter ID
                        </label>
                        <div className="relative">
                            <input
                                required
                                type="text"
                                placeholder="e.g. CRT-8492-NAG"
                                className="input-field pl-11"
                                value={formData.crateId}
                                onChange={e => setFormData({ ...formData, crateId: e.target.value })}
                            />
                            <QrCode className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Farm Details
                        </label>
                        <input
                            required
                            type="text"
                            placeholder="e.g. Kalmeshwar Farms, Plot 4"
                            className="input-field"
                            value={formData.farmDetails}
                            onChange={e => setFormData({ ...formData, farmDetails: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Initial Location
                        </label>
                        <input
                            required
                            type="text"
                            placeholder="e.g. Nagpur Processing Center A"
                            className="input-field"
                            value={formData.location}
                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || isSuccess}
                        className={`w-full ${isSuccess ? 'bg-emerald-600' : 'btn-primary bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]'} mt-4`}
                    >
                        {isSubmitting ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> Registering on Blockchain...</>
                        ) : isSuccess ? (
                            <><CheckCircle2 className="w-5 h-5" /> Crate Registered!</>
                        ) : (
                            'Register Crate'
                        )}
                    </button>
                </form>
            </div>

            <p className="text-center text-xs text-slate-500 mt-auto">
                Smart Contract: OrangeProvenanceTracker.sol
            </p>
        </div>
    );
}
