"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Truck, MapPin, CheckCircle2, Loader2, QrCode } from 'lucide-react';

export default function HandlerView() {
    const [formData, setFormData] = useState({ crateId: '', location: '', status: '1' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate Web3 contract call: updateLocation(crateId, status, location)
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setIsSuccess(true);
        setTimeout(() => {
            setIsSuccess(false);
            setFormData(prev => ({ ...prev, crateId: '' }));
        }, 2000);
    };

    return (
        <div className="flex-1 flex flex-col pt-4 animate-fade-in-up">
            <header className="flex items-center gap-4 mb-8">
                <Link href="/" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                    <ArrowLeft className="w-6 h-6 text-slate-300" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                        Logistics Handler
                    </h1>
                    <p className="text-sm text-slate-400">1-Click Transit Update</p>
                </div>
            </header>

            <div className="glass-panel p-6 mb-6">
                <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                    <div className="bg-blue-500/20 p-2 rounded-lg">
                        <Truck className="w-5 h-5 text-blue-400" />
                    </div>
                    <h2 className="text-lg font-semibold">Scan & Update</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="flex space-x-2">
                        <div className="flex-1 relative">
                            <input
                                required
                                type="text"
                                placeholder="Scan Crate QR"
                                className="input-field pl-11"
                                value={formData.crateId}
                                onChange={e => setFormData({ ...formData, crateId: e.target.value })}
                            />
                            <QrCode className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                        </div>
                        <button type="button" className="bg-slate-800 p-3 rounded-xl border border-slate-700 hover:bg-slate-700 transition-colors">
                            <QrCode className="w-6 h-6 text-blue-400" />
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Current Location
                        </label>
                        <div className="relative">
                            <input
                                required
                                type="text"
                                placeholder="e.g. Mumbai Distribution Hub"
                                className="input-field pl-11"
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                            />
                            <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Lifecycle Stage
                        </label>
                        <select
                            className="input-field appearance-none"
                            value={formData.status}
                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="1">Processed</option>
                            <option value="2">In Transit</option>
                            <option value="3">Warehoused</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || isSuccess || !formData.crateId}
                        className={`w-full ${isSuccess ? 'bg-blue-600' : 'btn-primary bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]'} mt-4`}
                    >
                        {isSubmitting ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> Updating Contract...</>
                        ) : isSuccess ? (
                            <><CheckCircle2 className="w-5 h-5" /> Location Logged!</>
                        ) : (
                            'Log Arrival/Departure'
                        )}
                    </button>
                </form>
            </div>

            <div className="glass-panel p-4 bg-blue-500/5 border-blue-500/20">
                <p className="text-xs text-blue-200/70 text-center">
                    Transactions are signed by your handler wallet and permanently recorded.
                </p>
            </div>
        </div>
    );
}
