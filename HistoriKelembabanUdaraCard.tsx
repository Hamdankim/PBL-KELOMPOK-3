"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useRouter } from "next/router";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="px-3 py-2 rounded-lg text-xs"
        style={{
          background: "rgba(13, 20, 36, 0.95)",
          border: "1px solid rgba(0, 229, 160, 0.3)",
          fontFamily: "'Share Tech Mono', monospace",
          color: "#e2e8f0",
        }}
      >
        <p style={{ color: "var(--text-muted)" }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: {p.value}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function HistoriKelembabanUdaraCard({ chartData }: any) {
  const router = useRouter();

  return (
    <div
      className="card p-4 cursor-pointer hover:opacity-80 transition-opacity"
      onClick={() => router.push("/histori-kelembaban-udara")}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3
            className="text-xs font-semibold"
            style={{ color: "var(--text-primary)", fontFamily: "'Share Tech Mono', monospace" }}
          >
            Histori Kelembaban Udara
          </h3>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>(6 jam)</p>
        </div>
        <div className="w-2 h-2 rounded-full" style={{ background: "#3b82f6", boxShadow: "0 0 8px #3b82f6" }} />
      </div>

      <ResponsiveContainer width="100%" height={140}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="airGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" />
          <XAxis
            dataKey="time"
            tick={{ fill: "#64748b", fontSize: 9, fontFamily: "'Share Tech Mono'" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#64748b", fontSize: 9, fontFamily: "'Share Tech Mono'" }}
            axisLine={false}
            tickLine={false}
            domain={[20, 100]}
          />
          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="kelembabanUdara"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#airGrad)"
            dot={false}
            activeDot={{ r: 4, fill: "#3b82f6", stroke: "none" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

