import { DefectReport } from "@/components/DefectReport";
import { ShieldCheck } from "lucide-react";

export default function QAReportsPage() {
    return (
        <div className="flex flex-col gap-8 pb-8 animate-in fade-in duration-500 max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                    Operations & QA Validation
                </h1>
                <p className="text-muted-foreground">
                    Manage product quality assurances. If an anomaly is detected, flag the shipment accurately to ensure transparency across the supply chain.
                </p>
            </div>

            <DefectReport />
        </div>
    );
}
