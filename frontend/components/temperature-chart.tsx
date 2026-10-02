"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

const mockData = [
    { time: '08:00', temp: 4.2 },
    { time: '10:00', temp: 4.5 },
    { time: '12:00', temp: 4.8 },
    { time: '14:00', temp: 5.1 },
    { time: '16:00', temp: 4.6 },
    { time: '18:00', temp: 4.3 },
    { time: '20:00', temp: 4.1 },
];

export function TemperatureChart() {
    return (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-card-foreground">Cold Chain Monitoring</h3>
                <p className="text-sm text-muted-foreground">Average temperature across active shipments (°C)</p>
            </div>

            <div className="h-[300px] w-full mt-6">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                        <XAxis
                            dataKey="time"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                            domain={[2, 6]}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--card)',
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                                color: 'var(--card-foreground)',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                            itemStyle={{ color: 'var(--primary)' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="temp"
                            stroke="var(--primary)"
                            strokeWidth={3}
                            dot={{ r: 4, fill: 'var(--card)', stroke: 'var(--primary)', strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: 'var(--primary)', stroke: 'var(--background)' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
