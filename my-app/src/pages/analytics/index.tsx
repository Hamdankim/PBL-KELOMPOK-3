import Head from "next/head";
import Header from "@/components/Header";
import ChartKelembapan from "@/components/analytics/chartKelembapan";
import ChartSuhu from "@/components/analytics/chartSuhu";
import ChartHumidity from "@/components/analytics/chartHumidity";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Import fungsi Firestore
import { getFirestore } from "firebase/firestore";
import app, { db as realtimeDb } from "@/utils/db/firebase"; 
import { ref, onValue } from "firebase/database";
import { useState, useEffect, useRef } from "react";
import { useThemeMode } from "@/hooks/useThemeMode";

// Inisialisasi db
const db = getFirestore(app);
const OFFLINE_TIMEOUT_MS = 5 * 60 * 1000; // 5 menit tanpa data baru = mati

export default function Analitik() {
  const { theme, toggleTheme } = useThemeMode();
  const [isOnline, setIsOnline] = useState(false);
  const [timeRange, setTimeRange] = useState<number>(1);
  
  const prevSensorRef = useRef<string>("");
  const offlineTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Helper untuk reset offline timer
  const resetOfflineTimer = () => {
    if (offlineTimerRef.current) {
      clearTimeout(offlineTimerRef.current);
    }
    setIsOnline(true);
    offlineTimerRef.current = setTimeout(() => {
      setIsOnline(false);
      console.log("Komponen IoT terdeteksi MATI (tidak ada data baru selama 5 menit)");
    }, OFFLINE_TIMEOUT_MS);
  };

  // Cleanup timer saat unmount
  useEffect(() => {
    return () => {
      if (offlineTimerRef.current) clearTimeout(offlineTimerRef.current);
    };
  }, []);

  // Listen status online/offline dari Realtime DB
  useEffect(() => {
    const smartPlantRef = ref(realtimeDb, 'SmartPlant');
    const unsubSensor = onValue(smartPlantRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Deteksi perubahan data sensor untuk menentukan apakah alat aktif mengirim data
        const fingerprint = `${data.soilMoisture}-${data.temperature}-${data.humidity}`;
        if (fingerprint !== prevSensorRef.current) {
          prevSensorRef.current = fingerprint;
          resetOfflineTimer();
        }
      }
    });

    return () => {
      unsubSensor();
    };
  }, []);




  return (
    <>
      <Head>
        <title>Analitik - Smart Irrigation</title>
        <meta
          name="description"
          content="Analisis kelembapan tanah dan suhu real-time"
        />
      </Head>

      <div className={theme} suppressHydrationWarning>
        <div
          className="min-h-screen transition-all duration-300"
          style={{ background: "var(--bg-900)" }}
        >
          <Header
            theme={theme}
            onToggleTheme={toggleTheme}
            isOnline={isOnline}
          />

          <main className="px-4 pb-8 pt-4 max-w-7xl mx-auto text-white">

            
            {/* Header Analitik */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              
              {/* Sisi Kiri: Navigasi, Judul & Filter Global */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3">
                  <Link href="/dashboard">
                    <button
                      className="p-2 rounded-lg transition-all hover:scale-110"
                      style={{
                        background: "var(--bg-800)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <ArrowLeft
                        className="w-4 h-4"
                        style={{ color: "var(--primary)" }}
                      />
                    </button>
                  </Link>
                  <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Analitik Sensor</h1>
                </div>

                {/* Filter Global Rentang Waktu */}
                <div className="flex bg-gray-800/60 backdrop-blur-sm border border-gray-700/40 rounded-lg p-0.5 shadow-sm">
                  <button
                    onClick={() => setTimeRange(1)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all duration-200 ${
                      timeRange === 1
                        ? "bg-green-500 text-white shadow"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    1 Hari
                  </button>
                  <button
                    onClick={() => setTimeRange(7)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all duration-200 ${
                      timeRange === 7
                        ? "bg-green-500 text-white shadow"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    7 Hari
                  </button>
                </div>
              </div>
            </div>


            {/* Grid Grafik */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartKelembapan timeRange={timeRange} />
              <ChartSuhu timeRange={timeRange} />
              <ChartHumidity timeRange={timeRange} />
            </div>


          </main>
        </div>
      </div>
    </>
  );
}