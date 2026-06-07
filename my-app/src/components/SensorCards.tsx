"use client";

import { Droplets, Thermometer, Activity } from "lucide-react";
import { useState } from "react";

interface SensorData {
  soilMoisture: number;
  temperature: number;
  humidity: number;
  pumpStatus: string;
}

interface SensorCardsProps {
  data: SensorData;
  onPumpToggle?: (state: boolean) => void;
  irrigationMode?: "AUTO" | "MANUAL";
  onModeChange?: (mode: "AUTO" | "MANUAL") => void;
}

export default function SensorCards(props: SensorCardsProps) {
  const { data, onPumpToggle, irrigationMode = "AUTO", onModeChange } = props;
  const isPumpActive = data.pumpStatus === "AKTIF";
  const mode = irrigationMode;

  return (
    <div className="space-y-3 mt-4">
      {/* Top row: Status + Mode */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Status Card */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium" style={{ color: "var(--text-muted)", fontFamily: "'Share Tech Mono', monospace" }}>
              Status
            </p>
            <Activity className="w-3.5 h-3.5" style={{ color: isPumpActive ? "var(--primary)" : "#ef4444" }} />
          </div>

          <p
            className="text-2xl font-bold"
            style={{
              color: isPumpActive ? "var(--primary)" : "#ef4444",
              fontFamily: "'Share Tech Mono', monospace",
              textShadow: isPumpActive ? "0 0 20px rgba(0,229,160,0.5)" : "0 0 20px rgba(239,68,68,0.5)",
            }}
          >
            {data.pumpStatus}
          </p>

          <div className="mt-2 flex items-center gap-1.5">
            <span className="sensor-dot" style={{ background: isPumpActive ? "var(--primary)" : "#ef4444" }} />
            <span className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "'Share Tech Mono', monospace" }}>
              {isPumpActive ? "Beroperasi" : "Standby"}
            </span>
          </div>
        </div>

        {/* Mode Card */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium" style={{ color: "var(--text-muted)", fontFamily: "'Share Tech Mono', monospace" }}>
              Mode Penyiraman
            </p>
            <Activity className="w-3.5 h-3.5" style={{ color: mode === "MANUAL" ? "var(--primary)" : "#f59e0b" }} />
          </div>

          <p
            className="text-2xl font-bold"
            style={{
              color: mode === "MANUAL" ? "var(--primary)" : "#f59e0b",
              fontFamily: "'Share Tech Mono', monospace",
              textShadow: mode === "MANUAL" ? "0 0 20px rgba(0,229,160,0.5)" : "0 0 12px rgba(245,158,11,0.35)",
            }}
          >
            {mode === "MANUAL" ? "Manual" : "Otomatis"}
          </p>

          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={() => onModeChange && onModeChange("AUTO")}
              className="text-xs px-3 py-1.5 rounded"
              style={{
                background: mode === "AUTO" ? "rgba(245,159,11,0.15)" : "transparent",
                border: mode === "AUTO" ? "1px solid rgba(245,159,11,0.25)" : "1px solid rgba(255,255,255,0.03)",
                color: mode === "AUTO" ? "#f59e0b" : "var(--text-muted)",
                fontFamily: "'Share Tech Mono', monospace",
              }}
            >
              Otomatis
            </button>

            <button
              onClick={() => onModeChange && onModeChange("MANUAL")}
              className="text-xs px-3 py-1.5 rounded"
              style={{
                background: mode === "MANUAL" ? "rgba(0,229,160,0.12)" : "transparent",
                border: mode === "MANUAL" ? "1px solid rgba(0,229,160,0.25)" : "1px solid rgba(255,255,255,0.03)",
                color: mode === "MANUAL" ? "var(--primary)" : "var(--text-muted)",
                fontFamily: "'Share Tech Mono', monospace",
              }}
            >
              Manual
            </button>
          </div>
        </div>
      </div>

      {/* Bottom row: three sensor cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Kelembaban Tanah */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium" style={{ color: "var(--text-muted)", fontFamily: "'Share Tech Mono', monospace" }}>
              Kelembaban Tanah
            </p>
            <Droplets className="w-3.5 h-3.5" style={{ color: "var(--primary)" }} />
          </div>

          <p className="text-3xl font-bold glow-text" style={{ color: "var(--primary)", fontFamily: "'Exo 2', sans-serif" }}>
            {data.soilMoisture}%
          </p>

          <div className="mt-3 h-1.5 rounded-full" style={{ background: "var(--bg-600)" }}>
            <div className="progress-bar h-full" style={{ width: `${data.soilMoisture}%` }} />
          </div>
        </div>

        {/* Suhu Lingkungan */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium" style={{ color: "var(--text-muted)", fontFamily: "'Share Tech Mono', monospace" }}>
              Suhu Lingkungan
            </p>
            <Thermometer className="w-3.5 h-3.5" style={{ color: "#00c8ff" }} />
          </div>

          <p className="text-3xl font-bold" style={{ color: "#00c8ff", fontFamily: "'Exo 2', sans-serif", textShadow: "0 0 20px rgba(0,200,255,0.5)" }}>
            {data.temperature}°
          </p>

          <div className="mt-3 h-1.5 rounded-full" style={{ background: "var(--bg-600)" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${((data.temperature - 15) / 25) * 100}%`,
                background: "linear-gradient(90deg, #00c8ff, #0080ff)",
                boxShadow: "0 0 10px rgba(0,200,255,0.4)",
                transition: "width 0.8s ease",
              }}
            />
          </div>
        </div>

        {/* Kelembaban Udara */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium" style={{ color: "var(--text-muted)", fontFamily: "'Share Tech Mono', monospace" }}>
              Kelembaban Udara
            </p>
            <Droplets className="w-3.5 h-3.5" style={{ color: "#3b82f6" }} />
          </div>

          <p className="text-3xl font-bold" style={{ color: "#3b82f6", fontFamily: "'Exo 2', sans-serif", textShadow: "0 0 20px rgba(59,130,246,0.35)" }}>
            {data.humidity}%
          </p>

          <div className="mt-3 h-1.5 rounded-full" style={{ background: "var(--bg-600)" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.max(0, Math.min(100, data.humidity))}%`,
                background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
                boxShadow: "0 0 10px rgba(59,130,246,0.35)",
                transition: "width 0.8s ease",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
