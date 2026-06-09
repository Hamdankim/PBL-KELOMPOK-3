"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Thermometer,
  Snowflake,
  BarChart3,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
} from "firebase/firestore";
import app from "../../utils/db/firebase";

const db = getFirestore(app);

type SensorDataType = {
  id: string;
  day: string;
  moisture: number;
  temperature: number;
  rawDate: Date;
};

const calculateStats = (data: SensorDataType[], timeRange: number) => {
  if (data.length === 0)
    return { max: "0.0", min: "0.0", avg: "0.0", change: "0.0" };

  const values = data.map((d) => d.moisture);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;

  const now = new Date();
  let currentValues: number[] = [];
  let previousValues: number[] = [];

  if (timeRange === 1) {
    // 1 Hari: Bandingkan data jam terakhir vs 6 jam yang lalu
    const oneHourAgo = new Date(now.getTime() - 1 * 60 * 60 * 1000);
    const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);
    const sevenHoursAgo = new Date(now.getTime() - 7 * 60 * 60 * 1000);

    currentValues = data
      .filter((d) => d.rawDate >= oneHourAgo)
      .map((d) => d.moisture);
    previousValues = data
      .filter((d) => d.rawDate >= sevenHoursAgo && d.rawDate < sixHoursAgo)
      .map((d) => d.moisture);
  } else {
    // 7 Hari: Bandingkan data hari ini vs 6 hari yang lalu
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const sixDaysAgo = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    currentValues = data
      .filter((d) => d.rawDate >= oneDayAgo)
      .map((d) => d.moisture);
    previousValues = data
      .filter((d) => d.rawDate >= sevenDaysAgo && d.rawDate < sixDaysAgo)
      .map((d) => d.moisture);
  }

  const avgRecent = currentValues.length
    ? currentValues.reduce((a, b) => a + b, 0) / currentValues.length
    : values[values.length - 1];

  let avgPrevious = previousValues.length
    ? previousValues.reduce((a, b) => a + b, 0) / previousValues.length
    : 0;

  if (previousValues.length === 0 && data.length > 0) {
    avgPrevious = values[0];
  }

  const changePercent =
    avgPrevious === 0 ? 0 : ((avgRecent - avgPrevious) / avgPrevious) * 100;

  return {
    max: max.toFixed(1),
    min: min.toFixed(1),
    avg: avg.toFixed(1),
    change: changePercent.toFixed(1),
  };
};

interface ChartKelembapanProps {
  timeRange: number;
}

export default function ChartKelembapan({ timeRange }: ChartKelembapanProps) {
  const [data, setData] = useState<SensorDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<any | null>(null);

  useEffect(() => {
    const docId = timeRange === 1 ? "latest_1_day" : "latest_7_days";
    const docRef = doc(db, "sensor_analytics", docId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setAnalyticsData(docSnap.data());
      } else {
        setAnalyticsData(null);
      }
    }, (err) => {
      console.error("Error fetching sensor_analytics:", err);
    });
    return () => unsubscribe();
  }, [timeRange]);

  useEffect(() => {
    setIsLoading(true);
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - timeRange);

    const q = query(
      collection(db, "sensor_history"),
      where("timestamp", ">=", pastDate),
      orderBy("timestamp", "asc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Objek untuk menampung pengelompokan (grouping)
      const groups: Record<
        string,
        {
          totalMoisture: number;
          totalTemp: number;
          count: number;
          rawDate: Date;
        }
      > = {};

      snapshot.docs.forEach((doc) => {
        const docData = doc.data();
        if (
          docData.timestamp &&
          typeof docData.timestamp.toDate === "function"
        ) {
          const dateObj = docData.timestamp.toDate();
          let groupKey = "";

          if (timeRange === 1) {
            // Group berdasarkan jam yang sama (Tahun-Bulan-Tanggal Jam)
            groupKey = `${dateObj.getFullYear()}-${dateObj.getMonth()}-${dateObj.getDate()} ${dateObj.getHours()}`;
          } else {
            // Group berdasarkan hari yang sama (Tahun-Bulan-Tanggal)
            groupKey = `${dateObj.getFullYear()}-${dateObj.getMonth()}-${dateObj.getDate()}`;
          }

          if (!groups[groupKey]) {
            groups[groupKey] = {
              totalMoisture: 0,
              totalTemp: 0,
              count: 0,
              rawDate: dateObj,
            };
          }

          groups[groupKey].totalMoisture += docData.soilMoisture || 0;
          groups[groupKey].totalTemp += docData.temperature || 0;
          groups[groupKey].count += 1;
        }
      });

      // Konversi hasil grouping menjadi array rata-rata
      const aggregatedData: SensorDataType[] = Object.keys(groups).map(
        (key) => {
          const group = groups[key];
          const dateObj = group.rawDate;

          let dateStr = "";
          if (timeRange === 1) {
            dateStr = dateObj.toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            });
          } else {
            dateStr = dateObj.toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
            });
          }

          return {
            id: key,
            day: dateStr,
            moisture: group.totalMoisture / group.count,
            temperature: group.totalTemp / group.count,
            rawDate: dateObj,
          };
        },
      );

      setData(aggregatedData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [timeRange]);

  const stats = calculateStats(data, timeRange);
  
  // Ambil data dari sensor_analytics dengan fallback ke stats lokal jika belum termuat
  const hasAnalytics = analyticsData && analyticsData.soilMoisture;
  const displayStats = {
    max: hasAnalytics ? analyticsData.soilMoisture.highest.toFixed(1) : stats.max,
    min: hasAnalytics ? analyticsData.soilMoisture.lowest.toFixed(1) : stats.min,
    avg: hasAnalytics ? analyticsData.soilMoisture.average.toFixed(1) : stats.avg,
    change: hasAnalytics ? analyticsData.soilMoisture.trend.changePercent.toFixed(1) : stats.change,
    trend: hasAnalytics ? analyticsData.soilMoisture.trend.trend : (Number(stats.change) < 0 ? "turun" : "naik"),
  };
  const isDown = displayStats.trend.toLowerCase() === "turun";

  return (
    <div
      className="rounded-xl p-4 shadow-md"
      style={{ background: "var(--bg-800)", color: "var(--text-primary)" }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
          Kelembapan Tanah ({timeRange === 1 ? "24 Jam" : "7 Hari"})
        </h2>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[300px]" style={{ color: "var(--text-muted)" }}>
          Memuat data...
        </div>
      ) : data.length === 0 ? (
        <div className="flex items-center justify-center h-[300px]" style={{ color: "var(--text-muted)" }}>
          Belum ada data sensor.
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip
                contentStyle={{ backgroundColor: "var(--bg-800)", borderColor: "var(--border)" }}
                itemStyle={{ color: "#22c55e" }}
              />
              <Line
                type="monotone"
                dataKey="moisture"
                stroke="#22c55e"
                strokeWidth={2}
                dot={true}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm text-left" style={{ color: "var(--text-primary)" }}>
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                  <th className="py-2">Parameter</th>
                  <th>Nilai</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-1 flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-orange-400" />{" "}
                    Kelembapan Tertinggi
                  </td>
                  <td>{displayStats.max} %</td>
                </tr>
                <tr>
                  <td className="py-1 flex items-center gap-2">
                    <Snowflake className="w-4 h-4 text-blue-400" /> Kelembapan
                    Terendah
                  </td>
                  <td>{displayStats.min} %</td>
                </tr>
                <tr>
                  <td className="py-1 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-green-400" /> Rata-rata
                  </td>
                  <td>{displayStats.avg} %</td>
                </tr>
                <tr>
                  <td className="py-1 flex items-center gap-2">
                    {isDown ? (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    ) : (
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    )}{" "}
                    Tren
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      {isDown ? (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      ) : (
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      )}
                      {displayStats.change}%
                    </div>
                    <div className="text-xs text-muted">
                      {timeRange === 1
                        ? "dibanding 6 jam yang lalu"
                        : "dibanding 6 hari yang lalu"}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
