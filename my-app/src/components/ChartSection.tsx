"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceDot,
  ResponsiveContainer,
} from "recharts";
import { generateChartData } from "@/lib/mockData";
import HistoriKelembabanUdaraCard from "@/components/HistoriKelembabanUdaraCard";

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
            {p.name}: {p.value}{p.name === "kelembaban" ? "%" : "°C"}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

interface ChartSectionProps {
  data: {
    soilMoisture: number;
    temperature: number;
    humidity?: number;
  };
  irrigationEvents?: any[];
}

type ChartRow = {
  time: string;
  kelembaban: number;
  suhu: number;
  kelembabanUdara: number;
};



export default function ChartSection({ data, irrigationEvents }: ChartSectionProps) {
  // keep latest irrigation events in window for the interval to pick up
  useEffect(() => {
    try {
      (window as any).__LATEST_IRR_EVENTS__ = (irrigationEvents || []).map(ev => ({ timestamp: ev.timestamp }));
    } catch (e) {}
  }, [irrigationEvents]);
  type LocalChartRow = {
    time: string;
    kelembaban: number;
    suhu: number;
    kelembabanUdara: number;
    watering?: number;
  };

  const [chartData, setChartData] = useState<LocalChartRow[]>(generateChartData() as any);

  // Keep latest irrigation events in a ref for interval checks
  const irrigationRef = useRef<any[]>([]);
  useEffect(() => {
    // parent will pass irrigation events via data.irrigationEvents in future
    // but current prop is separate; we'll read from window (fallback) if not provided
  }, []);


  const router = useRouter();
  const latestDataRef = useRef(data);

  useEffect(() => {
    latestDataRef.current = data;
  }, [data]);

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData((prev) => {
        const newData = [...prev];
        const now = new Date();
        const label = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
        // Determine if a recent irrigation event happened within last 7 seconds
        const recentIrr = (window as any).__LATEST_IRR_EVENTS__ || [];
        const isWatering = recentIrr.some((ev: any) => Math.abs(now.getTime() - new Date(ev.timestamp).getTime()) < 7000);

        newData.push({
          time: label,
          kelembaban: latestDataRef.current.soilMoisture,
          suhu: latestDataRef.current.temperature,
          kelembabanUdara: latestDataRef.current.humidity ?? 0,
          // include watering flag for rendering marker
          watering: isWatering ? 1 : 0,
        } as any);
        if (newData.length > 15) newData.shift();
        return newData;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleKelembapanClick = () => {
    router.push('/histori-kelembapan');
  };

  const handleSuhuClick = () => {
    router.push('/histori-suhu');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      {/* Kelembaban Chart */}
      <div className="card p-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={handleKelembapanClick}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs font-semibold" style={{ color: "var(--text-primary)", fontFamily: "'Share Tech Mono', monospace" }}>
              Histori Kelembaban Tanah
            </h3>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>(6 jam)</p>
          </div>
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: "var(--primary)", boxShadow: "0 0 8px var(--primary)" }}
          />
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="kelGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00e5a0" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00e5a0" stopOpacity={0} />
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
              domain={[20, 80]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="kelembaban"
              stroke="#00e5a0"
              strokeWidth={2}
              fill="url(#kelGrad)"
              dot={false}
              activeDot={{ r: 4, fill: "#00e5a0", stroke: "none" }}
            />
            {chartData.length > 0 && (chartData[chartData.length - 1] as any).watering === 1 && (
              <ReferenceDot
                x={(chartData[chartData.length - 1] as any).time}
                y={(chartData[chartData.length - 1] as any).kelembaban}
                r={5}
                fill="#00e5a0"
                stroke="rgba(0,229,160,0.6)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Suhu Chart */}
      <div className="card p-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={handleSuhuClick}>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs font-semibold" style={{ color: "var(--text-primary)", fontFamily: "'Share Tech Mono', monospace" }}>
              Histori Suhu
            </h3>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>(6 jam)</p>
          </div>
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: "#00c8ff", boxShadow: "0 0 8px #00c8ff" }}
          />
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="suhuGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00c8ff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00c8ff" stopOpacity={0} />
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
              domain={[19, 29]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="suhu"
              stroke="#00c8ff"
              strokeWidth={2}
              fill="url(#suhuGrad)"
              dot={false}
              activeDot={{ r: 4, fill: "#00c8ff", stroke: "none" }}
            />
            {chartData.length > 0 && (chartData[chartData.length - 1] as any).watering === 1 && (
              <ReferenceDot
                x={(chartData[chartData.length - 1] as any).time}
                y={(chartData[chartData.length - 1] as any).suhu}
                r={5}
                fill="#00c8ff"
                stroke="rgba(0,200,255,0.6)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Kelembaban Udara Chart */}
      <div className="card p-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => router.push("/histori-kelembaban-udara")}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs font-semibold" style={{ color: "var(--text-primary)", fontFamily: "'Share Tech Mono', monospace" }}>
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
              domain={[40, 100]}
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
            {chartData.length > 0 && (chartData[chartData.length - 1] as any).watering === 1 && (
              <ReferenceDot
                x={(chartData[chartData.length - 1] as any).time}
                y={(chartData[chartData.length - 1] as any).kelembabanUdara}
                r={5}
                fill="#3b82f6"
                stroke="rgba(59,130,246,0.6)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      </div>
  );
}

