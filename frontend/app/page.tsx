import { StatCard } from "@/components/stat-card";
import { TemperatureChart } from "@/components/temperature-chart";
import { ShipmentTable } from "@/components/shipment-table";
import { PackageSearch, AlertCircle, ThermometerSnowflake, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col gap-8 pb-8 animate-in fade-in duration-500">

      {/* Dashboard Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Operations Overview</h1>
        <p className="text-muted-foreground">
          Monitor your Nagpur Orange supply chain, cold storage, and QA metrics in real-time.
        </p>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Shipments"
          value="1,248"
          trend="12"
          trendUp={true}
          icon={PackageSearch}
          description="vs last month"
        />
        <StatCard
          title="Quality Assurance Avg"
          value="96.4%"
          trend="2.1"
          trendUp={true}
          icon={ShieldCheck}
          description="Avg QA score across batches"
        />
        <StatCard
          title="Cold Chain Violations"
          value="3"
          trend="18"
          trendUp={false}
          icon={ThermometerSnowflake}
          description="Alerts triggered this week"
        />
        <StatCard
          title="Critical Alerts"
          value="1"
          trend="50"
          trendUp={false}
          icon={AlertCircle}
          description="Requires immediate action"
        />
      </div>

      {/* Charts & Tables Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Chart spans 2 columns on large screens */}
        <div className="col-span-1 lg:col-span-2">
          <TemperatureChart />
        </div>

        {/* Right side activity feed or smaller widget */}
        <div className="col-span-1 border border-border bg-card rounded-xl p-6 shadow-sm flex flex-col">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">Quick Actions</h3>

          <div className="flex flex-col gap-3 flex-1">
            <button className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all w-full text-left group">
              <div className="flex items-center justify-center p-2 rounded-md bg-primary/10 text-primary">
                <PackageSearch className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium group-hover:text-primary transition-colors">Register Batch</span>
                <span className="text-xs text-muted-foreground">Enter a new harvest origin</span>
              </div>
            </button>

            <button className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all w-full text-left group">
              <div className="flex items-center justify-center p-2 rounded-md bg-primary/10 text-primary">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium group-hover:text-primary transition-colors">Log QA Report</span>
                <span className="text-xs text-muted-foreground">Submit grading assessment</span>
              </div>
            </button>
          </div>

          <div className="mt-auto pt-6 border-t border-border">
            <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start gap-3 border border-red-200">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <span className="font-medium text-sm">Action Required: SHP-0C73</span>
                <span className="text-xs opacity-90">Temperature deviation reported in transit to Pune Logistics. Review data anomalies immediately.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Width Table row */}
      <div className="w-full">
        <ShipmentTable />
      </div>

    </div>
  );
}
