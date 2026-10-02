import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string;
    trend?: string;
    trendUp?: boolean;
    icon: LucideIcon;
    description?: string;
}

export function StatCard({
    title,
    value,
    trend,
    trendUp,
    icon: Icon,
    description
}: StatCardProps) {
    return (
        <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

            <div className="relative z-10 flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center transition-transform group-hover:scale-110">
                    <Icon className="h-5 w-5 text-primary" />
                </div>
            </div>

            <div className="relative z-10 mt-4">
                <div className="text-3xl font-bold tracking-tight text-card-foreground">
                    {value}
                </div>

                <div className="mt-2 flex items-center text-sm">
                    {trend && (
                        <span className={`font-medium ${trendUp ? "text-success" : "text-destructive"}`}>
                            {trendUp ? "+" : "-"}{Math.abs(parseFloat(trend))}%
                        </span>
                    )}
                    {description && (
                        <span className="ml-2 text-muted-foreground truncate">
                            {description}
                        </span>
                    )}
                </div>
            </div>

            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/20" />
        </div>
    );
}
