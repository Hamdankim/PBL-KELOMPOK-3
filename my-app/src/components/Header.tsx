"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";


interface HeaderProps {
  theme: "dark" | "light";
  onToggleTheme: () => void;
  isOnline: boolean;
}

export default function Header({
  theme,
  onToggleTheme,
  isOnline,
}: HeaderProps) {
  const { data: session }: any = useSession();
  const router = useRouter();
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Smart Irrigation System";

  const now = new Date();
  const dateStr = now.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const headerButtonStyle = {
    height: "38px",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    fontFamily: "'Share Tech Mono', monospace",
  };

  return (
    <header
      className="sticky top-0 z-50 px-4 py-3 flex items-center justify-between"
      style={{
        background:
          theme === "dark"
            ? "rgba(10, 15, 26, 0.95)"
            : "rgba(255, 255, 255, 0.95)",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Logo + Title */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => router.push("/")}
      >
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #00e5a0, #00c8ff)" }}
        >
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 2.69s-5 5.81-5 9.81a5 5 0 0 0 10 0c0-4-5-9.81-5-9.81z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <h1
            className="font-bold text-sm leading-tight"
            style={{
              color: "var(--primary)",
              fontFamily: "'Exo 2', sans-serif",
              letterSpacing: "0.05em",
            }}
          >
            {appName}
          </h1>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">

        {/* Date/Time */}
        <div className="hidden sm:flex flex-col items-end">
          <span
            className="text-xs font-medium"
            style={{
              color: theme === "dark" ? "#f3f4f6" : "#111827",
            }}
          >
            {timeStr}
          </span>

          <span
            className="text-xs"
            style={{
              color: theme === "dark" ? "#9ca3af" : "#6b7280",
            }}
          >
            {dateStr}
          </span>
        </div>
        {/* Online Status */}
        <div
          className="flex items-center gap-1.5 px-3"
          style={{
            ...headerButtonStyle,
            background: isOnline
              ? "rgba(0, 229, 160, 0.1)"
              : "rgba(239, 68, 68, 0.1)",
            border: `1px solid ${
              isOnline
                ? "rgba(0, 229, 160, 0.3)"
                : "rgba(239, 68, 68, 0.3)"
            }`,
            borderRadius: "9999px", // biar tetap bentuk kapsul
          }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{
              background: isOnline ? "#00e5a0" : "#ef4444",
              boxShadow: isOnline ? "0 0 6px #00e5a0" : "0 0 6px #ef4444",
              animation: "pulse 2s infinite",
            }}
          />
          <span
            className="text-xs font-medium"
            style={{
              color: isOnline ? "#00e5a0" : "#ef4444",
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.65rem",
            }}
          >
            {isOnline ? "ONLINE" : "OFFLINE"}
          </span>
        </div>
        
        {/* Analytics */}
        <Link
          href="/analytics"
          className="hidden md:inline-flex items-center justify-center px-3 text-xs transition-all hover:scale-105"
          style={{
            ...headerButtonStyle,
            color: "var(--primary)",
            background: "rgba(0, 200, 255, 0.08)",
          }}
        >
          Analitik
        </Link>

        {/* Dropdown */}
        <div className="relative hidden md:block group">
            <button
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg transition-all hover:scale-105"
              style={{
                ...headerButtonStyle,
                color: "var(--primary)",
                background: "rgba(0, 229, 160, 0.08)",
              }}
            >
              Manajemen
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

          {/* FIX: hapus nested div yang tidak perlu */}
          <div
            className="absolute right-0 mt-2 w-44 rounded-lg p-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
            }}
          >
            <Link
              href="/management/users"
              className="block w-full px-3 py-2 rounded text-xs"
              style={{
                color: "var(--text-primary)",
                fontFamily: "'Share Tech Mono', monospace",
              }}
            >
              Manajemen Pengguna
            </Link>
          </div>
        </div>

        {/* Konfigurasi */}
        <Link
          href="/setting/configuration"
          className="hidden md:inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg transition-all hover:scale-105"
          style={{
            ...headerButtonStyle,
            color: "var(--primary)",
            background: "rgba(0, 200, 255, 0.08)",
          }}
        >
          Konfigurasi
        </Link>

        {/* Session */}
          {session ? (
          <>
            <button
              onClick={() => router.push("/profile")}
              className="flex items-center gap-2 text-xs px-2.5 py-1 rounded-lg"
              style={{
                ...headerButtonStyle,
                background: "transparent",
              }}
            >
              <Image
                src={session.user.image || "/avatar-head.svg"}
                alt="avatar"
                className="w-6 h-6 rounded-full object-cover"
                width={24}
                height={24}
                unoptimized
              />
              <span
                className="hidden md:block"
                style={{
                  color: theme === "dark" ? "#f3f4f6" : "#111827",
                }}
              >
                {session.user.fullname}
              </span>
            </button>

            {/* Theme */}
            <button
              onClick={onToggleTheme}
              className="flex items-center justify-center"
              style={{
                ...headerButtonStyle,
                width: "38px",
                background:
                  theme === "dark"
                    ? "transparent"
                    : "rgba(255,255,255,0.8)",
              }}
            >
              {theme === "dark" ? (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-xs px-2.5 py-1 rounded-lg border ml-2"
              style={{
                ...headerButtonStyle,
                border: "1px solid #ef4444",
                color: "#ef4444",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => router.push("/auth/login")}
              className="text-xs px-2.5 py-1 rounded-lg border"
              style={{ borderColor: "#00c8ff", color: "var(--primary)" }}
            >
              Login
            </button>
            <button
              onClick={() => router.push("/auth/register")}
              className="text-xs px-2.5 py-1 rounded-lg border ml-2"
              style={{ borderColor: "#00e5a0", color: "#00e5a0" }}
            >
              Register
            </button>
          </>
        )}
      </div>
    </header>
  );
}
