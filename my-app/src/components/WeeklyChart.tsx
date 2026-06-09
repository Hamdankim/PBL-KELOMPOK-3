import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getSensorHistory } from '@/utils/db/servicefirebase';

interface DailyStatus {
  date: string;
  avgValue: number;
  variation: number;
  status: 'Stabil' | 'Tidak Stabil';
  minValue: number;
  maxValue: number;
}

interface WeeklyChartProps {
  title: string;
  dataKey: 'suhu' | 'kelembaban' | 'humidity';
  unit: string;
  color: string;
}


export default function WeeklyChart({ title, dataKey, unit, color }: WeeklyChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [dailyStatus, setDailyStatus] = useState<DailyStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const history = await getSensorHistory(7);

        if (!history || history.length === 0) {
          setChartData([]);
          setDailyStatus([]);
          setLoading(false);
          return;
        }

        // Map sensor field berdasarkan dataKey
        const sensorField =
          dataKey === 'suhu' ? 'temperature' :
          dataKey === 'kelembaban' ? 'soilMoisture' :
          'humidity';

        // Group data by day dan buat chart points
        const data: any[] = [];
        const dayGroups: Record<string, number[]> = {};

        for (const item of history) {
          const ts: Date = item.timestamp instanceof Date ? item.timestamp : new Date(item.timestamp);
          const dayLabel = ts.toLocaleDateString('id-ID', { weekday: 'short', month: 'short', day: 'numeric' });
          const timeLabel = ts.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

          const value = (item as any)[sensorField] ?? 0;

          data.push({
            time: `${dayLabel} ${timeLabel}`,
            [dataKey]: parseFloat(Number(value).toFixed(1)),
            day: dayLabel,
          });

          if (!dayGroups[dayLabel]) dayGroups[dayLabel] = [];
          dayGroups[dayLabel].push(value);
        }

        // Hitung statistik harian
        const status: DailyStatus[] = Object.entries(dayGroups).map(([date, values]) => {
          const avgValue = values.reduce((a, b) => a + b, 0) / values.length;
          const minValue = Math.min(...values);
          const maxValue = Math.max(...values);
          const variation = maxValue - minValue;
          const isStable = variation < 5;

          return {
            date,
            avgValue: parseFloat(avgValue.toFixed(1)),
            variation: parseFloat(variation.toFixed(1)),
            status: isStable ? 'Stabil' : 'Tidak Stabil',
            minValue: parseFloat(minValue.toFixed(1)),
            maxValue: parseFloat(maxValue.toFixed(1)),
          };
        });

        setChartData(data);
        setDailyStatus(status);
      } catch (error) {
        console.error("Error fetching sensor history:", error);
        setChartData([]);
        setDailyStatus([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [dataKey]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-6 border border-slate-700" style={{ background: 'var(--bg-800)' }}>
          <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{title}</h3>
          <div className="flex items-center justify-center" style={{ height: 350 }}>
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${color} transparent ${color} ${color}` }} />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Memuat data histori...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-6 border border-slate-700" style={{ background: 'var(--bg-800)' }}>
          <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{title}</h3>
          <div className="flex items-center justify-center" style={{ height: 350 }}>
            <div className="flex flex-col items-center gap-3">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="M7 16l4-8 4 4 4-6" />
              </svg>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Belum ada data histori</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
                Data akan mulai tersimpan otomatis setiap 5 menit dari dashboard
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Chart Section */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-6 border border-slate-700 hover:shadow-xl transition-shadow" style={{ background: 'var(--bg-800)' }}>
        <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{title}</h3>
        <div className="bg-slate-900 rounded-lg p-4" style={{ background: 'var(--bg-900)' }}>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color, #374151)" opacity={0.3} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12, fill: 'var(--text-secondary, #9ca3af)' }}
                interval={Math.floor(chartData.length / 14)}
                stroke="var(--border-color, #374151)"
              />
              <YAxis
                label={{ value: unit, angle: -90, position: 'insideLeft', fill: 'var(--text-secondary, #9ca3af)' }}
                domain={dataKey === 'suhu' ? [15, 35] : [20, 90]}
                tick={{ fill: 'var(--text-secondary, #9ca3af)' }}
                stroke="var(--border-color, #374151)"
              />
              <Tooltip
                formatter={(value) => `${value} ${unit}`}
                labelFormatter={(label) => `${label}`}
                contentStyle={{ backgroundColor: 'var(--bg-800, #1f2937)', border: `2px solid ${color}`, borderRadius: '8px', color: 'var(--text-primary, #fff)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '16px' }} />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                dot={false}
                strokeWidth={3}
                isAnimationActive={false}
                name={dataKey === 'suhu' ? 'Suhu (°C)' : dataKey === 'humidity' ? 'Kelembaban Udara (%)' : 'Kelembaban (%)'}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Status Table */}
      {dailyStatus.length > 0 && (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-6 border border-slate-700" style={{ background: 'var(--bg-800)' }}>
          <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Ringkasan Harian</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ color: 'var(--text-secondary)' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color, #374151)' }}>
                  <th className="text-left py-2 px-3">Tanggal</th>
                  <th className="text-center py-2 px-3">Rata-rata</th>
                  <th className="text-center py-2 px-3">Min</th>
                  <th className="text-center py-2 px-3">Max</th>
                  <th className="text-center py-2 px-3">Variasi</th>
                  <th className="text-center py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {dailyStatus.map((day) => (
                  <tr key={day.date} style={{ borderBottom: '1px solid var(--border-color, #374151)' }}>
                    <td className="py-2 px-3">{day.date}</td>
                    <td className="text-center py-2 px-3">{day.avgValue} {unit}</td>
                    <td className="text-center py-2 px-3">{day.minValue} {unit}</td>
                    <td className="text-center py-2 px-3">{day.maxValue} {unit}</td>
                    <td className="text-center py-2 px-3">{day.variation}</td>
                    <td className="text-center py-2 px-3">
                      <span
                        className="px-2 py-1 rounded-full text-xs font-semibold"
                        style={{
                          background: day.status === 'Stabil' ? 'rgba(0,229,160,0.15)' : 'rgba(239,68,68,0.15)',
                          color: day.status === 'Stabil' ? '#00e5a0' : '#ef4444',
                        }}
                      >
                        {day.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}