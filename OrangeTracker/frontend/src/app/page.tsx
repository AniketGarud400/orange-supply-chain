import Link from 'next/link';
import { Citrus, Truck, Store, Activity } from 'lucide-react';

export default function Home() {
    return (
        <div className="flex-1 flex flex-col justify-center animate-fade-in-up">
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center p-4 bg-orange-500/20 rounded-full mb-6 ring-1 ring-orange-500/50">
                    <Citrus className="w-12 h-12 text-orange-500" />
                </div>
                <h1 className="text-4xl font-bold mb-3 tracking-tight bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
                    Nagpur Oranges
                </h1>
                <p className="text-slate-400 text-lg">Provenance & Quality Tracker</p>
            </div>

            <div className="space-y-4">
                <Link href="/farmer" className="glass-panel p-5 flex items-center gap-4 hover:bg-white/15 transition-colors group cursor-pointer block">
                    <div className="bg-emerald-500/20 p-3 rounded-lg group-hover:scale-110 transition-transform">
                        <Citrus className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-white">Farmer Portal</h2>
                        <p className="text-sm text-slate-400">Register harvest & crates</p>
                    </div>
                </Link>

                <Link href="/handler" className="glass-panel p-5 flex items-center gap-4 hover:bg-white/15 transition-colors group cursor-pointer block">
                    <div className="bg-blue-500/20 p-3 rounded-lg group-hover:scale-110 transition-transform">
                        <Truck className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-white">Logistics Handler</h2>
                        <p className="text-sm text-slate-400">Scan & update locations</p>
                    </div>
                </Link>

                <Link href="/retail" className="glass-panel p-5 flex items-center gap-4 hover:bg-white/15 transition-colors group cursor-pointer block">
                    <div className="bg-purple-500/20 p-3 rounded-lg group-hover:scale-110 transition-transform">
                        <Store className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-white">Retail View</h2>
                        <p className="text-sm text-slate-400">Receive goods & file reports</p>
                    </div>
                </Link>

                <div className="my-8 flex items-center justify-center">
                    <div className="w-full h-px bg-slate-800"></div>
                    <span className="px-4 text-xs text-slate-500 uppercase tracking-widest font-semibold">HQ</span>
                    <div className="w-full h-px bg-slate-800"></div>
                </div>

                <Link href="/dashboard" className="glass-panel p-5 flex items-center gap-4 hover:bg-white/15 transition-colors group cursor-pointer border-orange-500/30 block">
                    <div className="bg-orange-500/20 p-3 rounded-lg group-hover:scale-110 transition-transform">
                        <Activity className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-white">QA Dashboard</h2>
                        <p className="text-sm text-slate-400">Analytics & exception handling</p>
                    </div>
                </Link>
            </div>

            <div className="mt-12 text-center text-xs text-slate-600">
                <p>Secured by Web3</p>
            </div>
        </div>
    );
}
