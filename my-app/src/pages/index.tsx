import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Header from "@/components/Header";
import { useThemeMode } from "@/hooks/useThemeMode";
import { db as realtimeDb } from "@/utils/db/firebase";
import { ref, onValue } from "firebase/database";
import { 
  Activity, 
  Thermometer, 
  Droplets, 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink,
  Laptop,
  Layers,
  Sparkles
} from "lucide-react";

const OFFLINE_TIMEOUT_MS = 5 * 60 * 1000;

export default function LandingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { theme, toggleTheme } = useThemeMode();
  const [isOnline, setIsOnline] = useState(false);
  const [copied, setCopied] = useState(false);

  // Live sensor data for the hero preview
  const [sensorData, setSensorData] = useState({
    soilMoisture: 70,
    temperature: 28,
    humidity: 59.2,
    waterLevel: 80,
    pumpStatus: "NON-AKTIF"
  });

  const prevSensorRef = useRef<string>("");
  const offlineTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetOfflineTimer = () => {
    if (offlineTimerRef.current) {
      clearTimeout(offlineTimerRef.current);
    }
    setIsOnline(true);
    offlineTimerRef.current = setTimeout(() => {
      setIsOnline(false);
    }, OFFLINE_TIMEOUT_MS);
  };

  useEffect(() => {
    return () => {
      if (offlineTimerRef.current) clearTimeout(offlineTimerRef.current);
    };
  }, []);

  // Listen to Firebase Realtime DB for live preview data and online status
  useEffect(() => {
    const smartPlantRef = ref(realtimeDb, 'SmartPlant');
    const unsub = onValue(smartPlantRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const fingerprint = `${data.soilMoisture}-${data.temperature}-${data.humidity}`;
        if (fingerprint !== prevSensorRef.current) {
          prevSensorRef.current = fingerprint;
          resetOfflineTimer();
        }
        setSensorData({
          soilMoisture: data.soilMoisture ?? 70,
          temperature: data.temperature ?? 28,
          humidity: data.humidity ?? 59.2,
          waterLevel: data.waterLevel ?? 80,
          pumpStatus: data.pumpStatus ? "AKTIF" : "NON-AKTIF"
        });
      }
    });

    return () => {
      unsub();
    };
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://pbl-kelompok-3.vercel.app/");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const featureList = [
    {
      title: "Pantau Suhu & Kelembaban",
      desc: "Monitor kondisi tanah dan kelembapan udara secara real-time langsung melalui dashboard.",
      icon: <Thermometer className="w-6 h-6 text-[#00c8ff]" />,
      badge: "Suhu & Kelembapan"
    },
    {
      title: "Peringatan Otomatis",
      desc: "Menerima peringatan popup instan ketika kondisi tanah berada di luar rentang aman.",
      icon: <Activity className="w-6 h-6 text-red-400" />,
      badge: "Peringatan Instan"
    },
    {
      title: "Penyiraman Otomatis",
      desc: "Pompa cerdas menyiram tanaman secara otomatis berdasarkan data pembacaan sensor.",
      icon: <Droplets className="w-6 h-6 text-[#00e5a0]" />,
      badge: "Hemat Air & Waktu"
    },
    {
      title: "Kontrol Sistem Remote",
      desc: "Kendalikan pompa air secara manual atau ubah mode otomatis dari mana saja.",
      icon: <Cpu className="w-6 h-6 text-purple-400" />,
      badge: "Akses Fleksibel"
    }
  ];

  return (
    <>
      <Head>
        <title>Smart Irrigation System - Hemat Air & Pantau Real-time</title>
        <meta name="description" content="Sistem irigasi otomatis berbasis IoT untuk memantau kondisi tanah secara real-time dan mengontrol penyiraman tanaman." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={theme} suppressHydrationWarning>
        <div 
          className="min-h-screen text-[var(--text-primary)] transition-all duration-300 relative overflow-hidden"
          style={{ background: "var(--bg-900)" }}
        >
          {/* Background Ambient Glows */}
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[rgba(0,229,160,0.03)] blur-[100px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[rgba(0,200,255,0.03)] blur-[120px] pointer-events-none" />

          <Header theme={theme} onToggleTheme={toggleTheme} isOnline={isOnline} />

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 relative z-10">
            {/* Hero Section */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-8 lg:py-16">
              {/* Left Column: Copy */}
              <div className="lg:col-span-7 flex flex-col space-y-6">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[rgba(0,229,160,0.1)] border border-[rgba(0,229,160,0.25)] text-[var(--primary)] mb-4">
                    <Sparkles className="w-3 h-3 animate-pulse" />
                    Project PBL Kelompok 3
                  </span>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none mb-3">
                    <span className="block text-[var(--text-primary)]">SMART</span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00e5a0] to-[#00c8ff] glow-text">
                      IRRIGATION SYSTEM
                    </span>
                  </h1>
                </div>

                <p className="text-lg font-bold text-[#00c8ff] uppercase tracking-wide">
                  HEMAT AIR, PANTAU KAPANPUN, KENDALIKAN DARI MANA SAJA!
                </p>

                <p className="text-[var(--text-muted)] text-base sm:text-lg max-w-2xl leading-relaxed">
                  Smart Irrigation System adalah sistem irigasi otomatis berbasis IoT yang dapat memantau kondisi tanah secara real-time dan mengontrol penyiraman melalui dashboard berbasis web.
                </p>

                {/* Checklist Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2">
                  <div className="flex items-center gap-2 text-sm sm:text-base">
                    <CheckCircle2 className="w-5 h-5 text-[#00e5a0] shrink-0" />
                    <span>Pantau suhu & kelembaban langsung</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm sm:text-base">
                    <CheckCircle2 className="w-5 h-5 text-[#00e5a0] shrink-0" />
                    <span>Peringatan otomatis kondisi tanah</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm sm:text-base">
                    <CheckCircle2 className="w-5 h-5 text-[#00e5a0] shrink-0" />
                    <span>Penyiraman otomatis berbasis sensor</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm sm:text-base">
                    <CheckCircle2 className="w-5 h-5 text-[#00e5a0] shrink-0" />
                    <span>Kontrol pompa dari mana saja</span>
                  </div>
                </div>

                {/* Call to Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  {session ? (
                    <Link href="/dashboard" className="px-8 py-3.5 rounded-xl font-bold bg-gradient-to-r from-[#00e5a0] to-[#00c8ff] text-slate-950 flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-[#00e5a0]/15 hover:scale-[1.02] transition-all">
                      Masuk ke Dashboard <ArrowRight className="w-5 h-5" />
                    </Link>
                  ) : (
                    <Link href="/auth/login" className="px-8 py-3.5 rounded-xl font-bold bg-gradient-to-r from-[#00e5a0] to-[#00c8ff] text-slate-950 flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-[#00e5a0]/15 hover:scale-[1.02] transition-all">
                      Masuk ke Dashboard <ArrowRight className="w-5 h-5" />
                    </Link>
                  )}
                  <a href="#features" className="px-8 py-3.5 rounded-xl font-semibold border border-solid border-[var(--border)] bg-[rgba(13,20,36,0.5)] flex items-center justify-center gap-2 hover:bg-[rgba(13,20,36,0.8)] transition-all">
                    Pelajari Fitur
                  </a>
                </div>
              </div>

              {/* Right Column: Dashboard Preview Panel */}
              <div className="lg:col-span-5 relative w-full flex justify-center">
                {/* Floating Glow elements behind device */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#00e5a0]/10 to-[#00c8ff]/10 rounded-2xl filter blur-2xl opacity-70 -z-10" />

                {/* Laptop Mockup Wrapper */}
                <div className="w-full max-w-[480px] p-6 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-2xl relative">
                  {/* Window Controls */}
                  <div className="flex items-center gap-1.5 mb-4 pb-2 border-b border-gray-800/40">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    <span className="text-[10px] font-mono text-[var(--text-muted)] ml-2">SmartPlant Dashboard (Live)</span>
                    <span className={`ml-auto w-2 h-2 rounded-full ${isOnline ? 'bg-[#00e5a0]' : 'bg-red-400'} animate-pulse`} />
                  </div>

                  {/* Panel Grid Info */}
                  <div className="space-y-4 font-mono text-xs">
                    {/* Mode & Pump status */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 rounded-lg border border-[var(--border)] bg-[rgba(10,15,26,0.4)]">
                        <p className="text-[var(--text-muted)] text-[10px] uppercase">Mode Irigasi</p>
                        <p className="font-bold text-sm text-[var(--primary)] mt-1">OTOMATIS</p>
                      </div>
                      <div className="p-3 rounded-lg border border-[var(--border)] bg-[rgba(10,15,26,0.4)]">
                        <p className="text-[var(--text-muted)] text-[10px] uppercase">Status Pompa</p>
                        <p className={`font-bold text-sm mt-1 ${sensorData.pumpStatus === "AKTIF" ? "text-[#00e5a0]" : "text-gray-400"}`}>
                          {sensorData.pumpStatus}
                        </p>
                      </div>
                    </div>

                    {/* Sensor list */}
                    <div className="space-y-2.5">
                      <div className="p-2.5 rounded-lg border border-[var(--border)] bg-[rgba(10,15,26,0.3)] flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <Droplets className="w-4 h-4 text-[#3b82f6]" /> Kelembapan Tanah
                        </span>
                        <span className="font-bold text-[#3b82f6] text-sm">{sensorData.soilMoisture}%</span>
                      </div>

                      <div className="p-2.5 rounded-lg border border-[var(--border)] bg-[rgba(10,15,26,0.3)] flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <Thermometer className="w-4 h-4 text-orange-400" /> Suhu Lingkungan
                        </span>
                        <span className="font-bold text-orange-400 text-sm">{sensorData.temperature}°C</span>
                      </div>

                      <div className="p-2.5 rounded-lg border border-[var(--border)] bg-[rgba(10,15,26,0.3)] flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-[#00e5a0]" /> Kelembapan Udara
                        </span>
                        <span className="font-bold text-[#00e5a0] text-sm">{sensorData.humidity}%</span>
                      </div>
                    </div>

                    {/* Water Level Availability */}
                    <div className="p-3 rounded-lg border border-[var(--border)] bg-[rgba(10,15,26,0.4)] space-y-1.5">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-[var(--text-muted)]">KETERSEDIAAN AIR TANGKI</span>
                        <span className="font-bold text-[var(--secondary)]">{sensorData.waterLevel}%</span>
                      </div>
                      <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#00c8ff] to-[#00e5a0] rounded-full transition-all duration-1000"
                          style={{ width: `${sensorData.waterLevel}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 border-t border-gray-800/30 scroll-mt-20">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-4">
                  Bagaimana Sistem Ini Membantu Anda?
                </h2>
                <p className="text-base text-[var(--text-muted)]">
                  Smart Irrigation System dirancang dengan standar teknologi IoT modern untuk menyajikan otomatisasi dan efisiensi optimal pada pemeliharaan tanaman.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featureList.map((feat, idx) => (
                  <div 
                    key={idx}
                    className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] hover:border-[rgba(0,229,160,0.4)] transition-all hover:-translate-y-1"
                  >
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-slate-900 border border-gray-800/80 mb-4">
                      {feat.icon}
                    </div>
                    <span className="text-[10px] font-mono text-[var(--primary)] uppercase tracking-wider block mb-1">
                      {feat.badge}
                    </span>
                    <h3 className="text-lg font-bold mb-2 text-[var(--text-primary)]">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Product Demo & QR Code Code */}
            <section className="py-12 border-t border-gray-800/30">
              <div className="p-8 rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--bg-800)] to-[var(--bg-900)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xl">
                {/* QR Visual */}
                <div className="lg:col-span-4 flex flex-col items-center justify-center text-center">
                  <div className="p-4 rounded-xl border-2 border-dashed border-[#00e5a0] bg-white w-48 h-48 flex items-center justify-center shadow-lg shadow-[#00e5a0]/5 hover:scale-[1.03] transition-all relative group">
                    {/* Simulated QR Code using high-quality clean SVG paths */}
                    <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950" fill="currentColor">
                      {/* Corners */}
                      <path d="M5 5h20v5H10v15H5zm20 0h5v5h-5zm65 0h5v5h-5zm5 0h5v20h-5v-15H75v-5zM5 70h5v15h15v5H5zm85 0h5v20h-20v-5h15z" />
                      {/* Top Left Finder Pattern */}
                      <path d="M10 10h15v15H10zm3 3v9h9V13zm3 3h3v3h-3z" />
                      {/* Top Right Finder Pattern */}
                      <path d="M75 10h15v15H75zm3 3v9h9V13zm3 3h3v3h-3z" />
                      {/* Bottom Left Finder Pattern */}
                      <path d="M10 75h15v15H10zm3 3v9h9V78zm3 3h3v3h-3z" />
                      {/* Alignment and Random Dots */}
                      <path d="M35 15h5v5h-5zm10 0h10v5H45zm15 0h5v5h-5zm0 10h5v5h-5zm-25 5h15v5H35zm20 0h5v10h-5zm10 5h10v5H65zm-30 10h5v15h-5zm10 5h10v5H45zm25 0h5v10h-5zm15 5h5v5h-5zm-45 10h10v5H45zm15 0h10v5H60zm10 10h5v5h-5zm10 0h5v5h-5z" />
                      <path d="M35 50h5v5h-5zm15 5h10v5H50zm15-5h5v5h-5zm10 15h5v5h-5zm-25 5h15v5H50z" />
                      <rect x="44" y="44" width="12" height="12" rx="2" fill="#00e5a0" />
                      <circle cx="50" cy="50" r="2.5" fill="black" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--primary)] mt-3 tracking-widest">SCAN HERE</span>
                </div>

                {/* Promo Text and Link Actions */}
                <div className="lg:col-span-8 space-y-5">
                  <h3 className="text-2xl font-extrabold text-[var(--text-primary)]">
                    Scan Disini Untuk Demo Produk
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] max-w-xl">
                    Aplikasi ini terhubung langsung ke unit mikrokontroler fisik. Gunakan link di bawah ini untuk mengakses demo publik dan melihat simulasi kontrol secara instan.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 items-stretch max-w-lg">
                    <div className="flex-1 px-4 py-3 rounded-lg border border-[var(--border)] bg-slate-900/60 font-mono text-xs flex items-center justify-between overflow-x-auto whitespace-nowrap">
                      <span className="text-gray-300">https://pbl-kelompok-3.vercel.app/</span>
                    </div>

                    <button 
                      onClick={handleCopyLink}
                      className="px-5 py-3 rounded-lg font-bold bg-[#00c8ff] text-slate-950 flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all text-xs"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" /> Tersalin!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" /> Salin Link
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="pt-2">
                    <a 
                      href="https://pbl-kelompok-3.vercel.app/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-[var(--primary)] hover:underline font-mono"
                    >
                      Buka Demo di Tab Baru <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </main>

          {/* Footer */}
          <footer className="border-t border-gray-800/30 py-8 relative z-10" style={{ background: "rgba(10, 15, 26, 0.4)" }}>
            <div className="max-w-7xl mx-auto px-4 text-center space-y-3">
              <p className="text-xs text-[var(--text-muted)] font-mono">
                &copy; {new Date().getFullYear()} PBL Kelompok 3. All rights reserved.
              </p>
              <div className="flex justify-center gap-4 text-[10px] text-[var(--text-muted)] font-mono">
                <span>Next.js 14</span>
                <span>•</span>
                <span>Firebase RTDB</span>
                <span>•</span>
                <span>Tailwind CSS</span>
                <span>•</span>
                <span>IoT Integration</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}