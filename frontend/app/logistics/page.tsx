import { LogisticsTracker } from "@/components/LogisticsTracker";
import { Truck } from "lucide-react";

export default function LogisticsPage() {
    return (
        <div className="flex flex-col gap-8 pb-8 animate-in fade-in duration-500 max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                    <Truck className="h-8 w-8 text-primary" />
                    Logistics Checkpoint
                </h1>
                <p className="text-muted-foreground">
                    Update the real-time custody and location of Nagpur Orange crates as they transit through the supply chain.
                </p>
            </div>

            <LogisticsTracker />
        </div>
    );
}
