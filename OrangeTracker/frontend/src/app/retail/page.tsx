"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Store, AlertTriangle, CheckCircle2, Loader2, QrCode, Camera, UploadCloud } from 'lucide-react';

export default function RetailView() {
    const [formData, setFormData] = useState({ crateId: '', location: '', defectType: 'Spoilage' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [photoUploaded, setPhotoUploaded] = useState(false);
    const [isDefectMode, setIsDefectMode] = useState(false);

    const handleReceive = async () => {
        setIsSubmitting(true);
        // Simulate Web3 contract call: updateLocation(crateId, Retail, location)
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 2000);
    };

    const handleDefectReport = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!photoUploaded) {
            alert("Please upload photographic evidence first.");
            return;
        }
        setIsSubmitting(true);
        // Simulate IPFS upload + Web3 contract call: reportDefect(crateId, ipfsHash, location)
        await new Promise(resolve => setTimeout(resolve, 3000));
        setIsSubmitting(false);
        setIsSuccess(true);
        setTimeout(() => {
            setIsSuccess(false);
            setIsDefectMode(false);
            setPhotoUploaded(false);
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
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
                        Retail View
                    </h1>
                    <p className="text-sm text-slate-400">Receive & QA Escalation</p>
                </div>
            </header>

            <div className="glass-panel p-6 mb-6">
                <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                    <div className="bg-purple-500/20 p-2 rounded-lg">
                        <Store className="w-5 h-5 text-purple-400" />
                    </div>
                    <h2 className="text-lg font-semibold">Crate Inspection</h2>
                </div>

                <div className="flex space-x-2 mb-6">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Scan Crate QR"
                            className="input-field pl-11 !bg-slate-800/80"
                            value={formData.crateId}
                            onChange={e => setFormData({ ...formData, crateId: e.target.value })}
                        />
                        <QrCode className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Store Location
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. Pune City Freshmart"
                        className="input-field"
                        value={formData.location}
                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                    />
                </div>

                {!isDefectMode ? (
                    <div className="space-y-4">
                        <button
                            onClick={handleReceive}
                            disabled={isSubmitting || !formData.crateId}
                            className="w-full btn-primary bg-purple-600 hover:bg-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.4)]"
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : isSuccess ? <CheckCircle2 className="w-5 h-5" /> : 'Accept Delivery (Good Condition)'}
                        </button>
                        <button
                            onClick={() => setIsDefectMode(true)}
                            className="w-full btn-danger"
                        >
                            <AlertTriangle className="w-5 h-5" /> Report Defect
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleDefectReport} className="mt-8 pt-6 border-t border-red-500/30 animate-fade-in-up">
                        <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" /> File QA Exception
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Defect Type</label>
                                <select
                                    className="input-field border-red-500/30 focus:ring-red-500"
                                    value={formData.defectType}
                                    onChange={e => setFormData({ ...formData, defectType: e.target.value })}
                                >
                                    <option>Spoilage / Mold</option>
                                    <option>Physical Damage</option>
                                    <option>Temperature Abuse</option>
                                    <option>Missing Items</option>
                                </select>
                            </div>

                            <div
                                className={`border-2 border-dashed ${photoUploaded ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-600 hover:border-slate-500 bg-slate-900/50'} rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors`}
                                onClick={() => setPhotoUploaded(true)}
                            >
                                {photoUploaded ? (
                                    <>
                                        <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
                                        <span className="text-emerald-400 font-medium tracking-wide">evidence_082.jpg</span>
                                        <span className="text-xs text-emerald-500/70 mt-1">Ready for IPFS Upload</span>
                                    </>
                                ) : (
                                    <>
                                        <Camera className="w-8 h-8 text-slate-400 mb-2" />
                                        <span className="text-slate-300 font-medium">Capture Evidence Photo</span>
                                        <span className="text-xs text-slate-500 mt-1">Required for Disputed status</span>
                                    </>
                                )}
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsDefectMode(false)}
                                    className="flex-1 btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || isSuccess || !photoUploaded}
                                    className="flex-1 btn-danger"
                                >
                                    {isSubmitting ? (
                                        <><UploadCloud className="w-5 h-5 animate-spin" /> Uploading...</>
                                    ) : isSuccess ? (
                                        <><CheckCircle2 className="w-5 h-5" /> Escalated</>
                                    ) : (
                                        'Submit to Blockchain'
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
