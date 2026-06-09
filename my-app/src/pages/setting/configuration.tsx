import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { Sliders, Droplets, Thermometer, ArrowLeft } from "lucide-react";
import BackToDashboard from "../../components/BackToDashboard";
import InputField from "../../components/InputField";
import Header from "../../components/Header";
import { defaultConfig, validateConfig } from "../../lib/configUtils";
import { useThemeMode } from "@/hooks/useThemeMode";

const ConfigurationPage = () => {
  // State
  const { theme, toggleTheme } = useThemeMode();
  const isOnline = true;
  const [config, setConfig] = useState(defaultConfig);
  const [notif, setNotif] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Ambil konfigurasi dari API saat halaman dibuka
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch("/api/config");
        if (res.ok) {
          const data = await res.json();
          setConfig(data ?? defaultConfig);
        } else {
          setConfig(defaultConfig);
        }
      } catch {
        setNotif({ type: 'error', message: 'Gagal mengambil konfigurasi dari server.' });
        setConfig(defaultConfig);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const showNotif = (
    type: "success" | "error",
    message: string
  ) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    setNotif({ type, message });

    setTimeout(() => {
      setNotif(null);
    }, 3000);
  };
  
  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateConfig(config, setNotif)) return;
    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        showNotif(
          "success",
          "✓ Perubahan berhasil disimpan"
        );
      } else {
        showNotif(
          "error",
          "Gagal menyimpan konfigurasi ke server."
        );
      }
    } catch {
      showNotif(
        "error",
        "Gagal menyimpan konfigurasi ke server."
      );
    }
  };

  // Handle reset
  const handleReset = async () => {
    setConfig(defaultConfig);
    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(defaultConfig),
      });
      if (res.ok) {
        showNotif(
          "success",
          "✓ Konfigurasi dikembalikan ke default"
        );
      } else {
        showNotif(
          "error",
          "Gagal reset konfigurasi ke server."
        );
      }
    } catch {
      setNotif({ type: 'error', message: 'Gagal reset konfigurasi ke server.' });
    }
  };

  const summaryTextColor = theme === "dark" ? "text-white" : "text-gray-900";
  const inputTextColor = theme === "dark" ? "text-white" : "text-gray-900";

  const inputBgColor =
  theme === "dark"
    ? "bg-gray-800 border-gray-600"
    : "bg-gray-50 border-gray-300";

  return (
    <>
      <Head>
        <title>Konfigurasi Threshold - Smart Irrigation</title>
        <meta name="description" content="Pengaturan threshold irigasi cerdas" />
      </Head>
      <div className={theme} suppressHydrationWarning>
        <div className="min-h-screen transition-all duration-300" style={{ background: "var(--bg-900)" }}>
          <Header theme={theme} onToggleTheme={toggleTheme} isOnline={isOnline} />
          <main className="flex flex-col items-center justify-center min-h-[80vh] px-2 pt-6 md:pt-10">
            <div
              className={`w-full max-w-6xl rounded-3xl shadow-2xl p-6 md:p-10 border transition-colors duration-300
                ${theme === "dark"
                  ? "bg-[var(--card-bg)] border-[var(--border)]"
                  : "bg-white border-gray-300"
                }
              `}
            >
              {loading && (
                <div className="text-center text-sm text-[var(--text-muted)] mb-4">Memuat konfigurasi dari server...</div>
              )}
              {/* Tombol Kembali */}
              <div className="mb-6">
                <BackToDashboard className="bg-[var(--bg-600)] border-[var(--border)] text-sm text-[var(--primary)] shadow hover:scale-105 transition-all">
                  <ArrowLeft className="w-5 h-5" /> Dashboard
                </BackToDashboard>
              </div>
              {/* Judul dan Icon */}
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <Sliders className="w-8 h-8 text-[var(--primary)]" />
                  <div>
                    <h2 className="text-3xl font-extrabold text-[var(--primary)] tracking-wide">
                      Konfigurasi Sistem
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                      <span className="text-sm text-green-400">
                        Konfigurasi tersimpan di Firebase
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Notifikasi */}
              {notif && (
                <div className={`mb-4 px-4 py-2 rounded-lg text-sm font-semibold ${
                  notif.type === 'success'
                    ? 'bg-green-900/60 text-green-300 border border-green-400'
                    : 'bg-red-900/60 text-red-300 border border-red-400'
                }`}>
                  {notif.message}
                </div>
              )}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

                <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">                
                  <p className={inputTextColor}>Kelembapan Tanah</p>
                  <p className={`text-2xl font-bold mt-1 ${summaryTextColor}`}>
                    {config.soilMoistureMin}% - {config.soilMoistureMax}%
                  </p>
                </div>

                <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4">
                  <p className={inputTextColor}>Suhu</p>
                  <p className={`text-2xl font-bold mt-1 ${summaryTextColor}`}>
                    {config.temperatureMin}° - {config.temperatureMax}°
                  </p>
                </div>

                <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                  <p className={inputTextColor}>Kelembapan Udara</p>
                  <p className={`text-2xl font-bold mt-1 ${summaryTextColor}`}>
                    {config.humidityMin}% - {config.humidityMax}%
                  </p>
                </div>

                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <p className={inputTextColor}>Air Tangki</p>
                  <p className={`text-2xl font-bold mt-1 ${summaryTextColor}`}>
                    Min {config.waterLevelMin}%
                  </p>
                </div>

              </div>
              {/* Form konfigurasi */}
              <form onSubmit={handleSubmit} className="space-y-5 mt-2">
                <h3 className="text-lg font-bold text-cyan-400">
                  Kelembapan Tanah
                </h3>
                <div className="flex flex-col md:flex-row gap-4 md:gap-5">
                  <InputField
                    label="Kelembapan Tanah Minimum (%)"
                    name="soilMoistureMin"
                    value={config.soilMoistureMin}
                    onChange={handleChange}
                    icon={<Droplets className={`w-6 h-6 ${theme === "dark" ? "text-cyan-300" : "text-cyan-700"}`} />}
                    className={theme === "dark" ? "bg-[var(--card-bg)] border-[var(--border)]" : "bg-white border-gray-300"}
                    info="Nilai minimum kelembapan tanah agar irigasi aktif."
                    description="Irigasi akan aktif jika kelembapan di bawah nilai ini."
                    min={0}
                    max={100}
                    textColor={inputTextColor}
                    inputClass={inputBgColor}
                  />
                  <InputField
                    label="Kelembapan Tanah Maksimum (%)"
                    name="soilMoistureMax"
                    value={config.soilMoistureMax}
                    onChange={handleChange}
                    icon={<Droplets className={`w-6 h-6 ${theme === "dark" ? "text-cyan-300" : "text-cyan-700"}`} />}
                    className={theme === "dark" ? "bg-[var(--card-bg)] border-[var(--border)]" : "bg-white border-gray-300"}
                    info="Nilai maksimum kelembapan tanah agar irigasi berhenti."
                    description="Irigasi akan berhenti jika kelembapan di atas nilai ini."
                    min={0}
                    max={100}
                    textColor={inputTextColor}
                    inputClass={inputBgColor}
                  />
                </div>
                <h3 className="text-lg font-bold text-orange-400 mt-6">
                  Suhu Lingkungan
                </h3>
                <div className="flex flex-col md:flex-row gap-4 md:gap-5">
                  <InputField
                    label="Suhu Minimum (°C)"
                    name="temperatureMin"
                    value={config.temperatureMin}
                    onChange={handleChange}
                    icon={<Thermometer className={`w-6 h-6 ${theme === "dark" ? "text-orange-300" : "text-orange-700"}`} />}
                    className={theme === "dark" ? "bg-[var(--card-bg)] border-[var(--border)]" : "bg-white border-gray-300"}
                    info="Nilai suhu minimum yang diizinkan."
                    description="Sistem akan memberi peringatan jika suhu di bawah nilai ini."
                    min={-20}
                    max={100}
                    textColor={inputTextColor}
                    inputClass={inputBgColor}
                  />
                  <InputField
                    label="Suhu Maksimum (°C)"
                    name="temperatureMax"
                    value={config.temperatureMax}
                    onChange={handleChange}
                    icon={<Thermometer className={`w-6 h-6 ${theme === "dark" ? "text-orange-300" : "text-orange-700"}`} />}
                    className={theme === "dark" ? "bg-[var(--card-bg)] border-[var(--border)]" : "bg-white border-gray-300"}
                    info="Nilai suhu maksimum yang diizinkan."
                    description="Sistem akan memberi peringatan jika suhu di atas nilai ini."
                    min={-20}
                    max={100}
                    textColor={inputTextColor}
                    inputClass={inputBgColor}
                  />
                </div>
                <h3 className="text-lg font-bold text-blue-400 mt-6">
                  Kelembapan Udara
                </h3>
                <div className="flex flex-col md:flex-row gap-4 md:gap-5">
                  <InputField
                    label="Kelembapan Udara Minimum (%)"
                    name="humidityMin"
                    value={config.humidityMin}
                    onChange={handleChange}
                    icon={
                      <Droplets
                        className={`w-6 h-6 ${
                          theme === "dark" ? "text-blue-300" : "text-blue-700"
                        }`}
                      />
                    }
                    className={
                      theme === "dark"
                        ? "bg-[var(--card-bg)] border-[var(--border)]"
                        : "bg-white border-gray-300"
                    }
                    info="Batas minimum kelembapan udara."
                    description="Peringatan jika udara terlalu kering."
                    min={0}
                    max={100}
                    textColor={inputTextColor}
                    inputClass={inputBgColor}
                  />

                  <InputField
                    label="Kelembapan Udara Maksimum (%)"
                    name="humidityMax"
                    value={config.humidityMax}
                    onChange={handleChange}
                    icon={
                      <Droplets
                        className={`w-6 h-6 ${
                          theme === "dark" ? "text-blue-300" : "text-blue-700"
                        }`}
                      />
                    }
                    className={
                      theme === "dark"
                        ? "bg-[var(--card-bg)] border-[var(--border)]"
                        : "bg-white border-gray-300"
                    }
                    info="Batas maksimum kelembapan udara."
                    description="Peringatan jika udara terlalu lembap."
                    min={0}
                    max={100}
                    textColor={inputTextColor}
                    inputClass={inputBgColor}
                  />
                </div>
                <h3 className="text-lg font-bold text-emerald-400 mt-6">
                  Air Tangki
                </h3>
                <InputField
                  label="Ketinggian Air Tangki Minimum (%)"
                  name="waterLevelMin"
                  value={config.waterLevelMin}
                  onChange={handleChange}
                  icon={<Droplets className={`w-6 h-6 ${theme === "dark" ? "text-blue-300" : "text-blue-700"}`} />}
                  className={theme === "dark" ? "bg-[var(--card-bg)] border-[var(--border)]" : "bg-white border-gray-300"}
                  info="Pompa akan berhenti jika level air di bawah nilai ini."
                  description="Batas minimum level air tangki."
                  min={0}
                  max={100}
                  textColor={inputTextColor}
                  inputClass={inputBgColor}
                />
                <div className="flex flex-col md:flex-row gap-3 md:gap-4 mt-4">
                  <button type="submit" className="w-full md:w-1/2 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-green-400 text-white font-bold text-base md:text-lg shadow hover:scale-[1.03] transition-all">Simpan Konfigurasi</button>
                  <button type="button" onClick={handleReset} className="w-full md:w-1/2 py-2 rounded-lg bg-gradient-to-r from-gray-600 to-gray-800 text-white font-bold text-base md:text-lg shadow hover:scale-[1.03] transition-all">Reset ke Default</button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default ConfigurationPage;
