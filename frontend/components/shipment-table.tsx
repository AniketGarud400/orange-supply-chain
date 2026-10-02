import { BadgeCheck, Clock, AlertTriangle } from "lucide-react";

export function ShipmentTable() {
    const shipments = [
        {
            id: "SHP-0A91",
            origin: "Kalamna Market, Nagpur",
            destination: "Mumbai Distribution Center",
            status: "In Transit",
            qaScore: 98,
            temperature: "4.2°C"
        },
        {
            id: "SHP-0B42",
            origin: "Katol Orchards",
            destination: "Delhi Hub",
            status: "Delivered",
            qaScore: 95,
            temperature: "4.5°C"
        },
        {
            id: "SHP-0C73",
            origin: "Saoner Farms",
            destination: "Pune Logistics",
            status: "Alert",
            qaScore: 82,
            temperature: "6.8°C"
        },
        {
            id: "SHP-0D19",
            origin: "Kalmeshwar Processing",
            destination: "Hyderabad Distribution",
            status: "In Transit",
            qaScore: 99,
            temperature: "4.1°C"
        }
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Delivered": return <BadgeCheck className="h-4 w-4 text-success" />;
            case "In Transit": return <Clock className="h-4 w-4 text-primary" />;
            case "Alert": return <AlertTriangle className="h-4 w-4 text-destructive" />;
            default: return null;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Delivered": return "bg-success/10 text-success border-success/20";
            case "In Transit": return "bg-primary/10 text-primary border-primary/20";
            case "Alert": return "bg-destructive/10 text-destructive border-destructive/20";
            default: return "bg-muted text-muted-foreground";
        }
    };

    return (
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-border flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-card-foreground">Active Shipments</h3>
                    <p className="text-sm text-muted-foreground">Recent transit logs and QA assignments</p>
                </div>
                <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                    View All
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                        <tr>
                            <th scope="col" className="px-6 py-4 font-medium">Tracking ID</th>
                            <th scope="col" className="px-6 py-4 font-medium">Route</th>
                            <th scope="col" className="px-6 py-4 font-medium">Status</th>
                            <th scope="col" className="px-6 py-4 font-medium">QA Score</th>
                            <th scope="col" className="px-6 py-4 font-medium">Current Temp</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {shipments.map((shipment) => (
                            <tr key={shipment.id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-6 py-4 font-medium text-foreground">
                                    {shipment.id}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-foreground">{shipment.destination}</span>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            From: {shipment.origin}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(shipment.status)}`}>
                                        {getStatusIcon(shipment.status)}
                                        {shipment.status}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-full bg-muted rounded-full h-2 min-w-[60px] max-w-[100px]">
                                            <div
                                                className={`h-2 rounded-full ${shipment.qaScore < 90 ? 'bg-destructive' : 'bg-success'}`}
                                                style={{ width: `${shipment.qaScore}%` }}
                                            ></div>
                                        </div>
                                        <span className="font-medium">{shipment.qaScore}/100</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-medium">
                                    {shipment.temperature}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
