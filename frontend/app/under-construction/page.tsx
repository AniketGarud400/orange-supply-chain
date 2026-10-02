import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function UnderConstruction() {
    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-50 border border-gray-200 shadow-sm">
                <span className="text-4xl text-gray-900">🚧</span>
            </div>
            <h1 className="mb-3 text-2xl font-semibold tracking-tight text-gray-900">
                Page Under Construction
            </h1>
            <p className="mb-8 max-w-md text-gray-500 text-sm leading-relaxed">
                This module is currently being built for the next phase of the DTIS project. Check back soon!
            </p>
            <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
            </Link>
        </div>
    );
}
