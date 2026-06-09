import Head from "next/head";
import { useState } from "react";
import Header from "@/components/Header";
import ProfileView from "@/views/profile";

export default function ProfilePage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <>
      <Head>
        <title>Profil Saya</title>
      </Head>

      <div className={theme} suppressHydrationWarning>
        <div
          className="min-h-screen transition-all duration-300"
          style={{ background: "var(--bg-900)" }}
          suppressHydrationWarning
        >
          <Header theme={theme} onToggleTheme={toggleTheme} isOnline={true} />

          <main className="px-4 pb-8 pt-2 max-w-7xl mx-auto">
            <ProfileView />
          </main>
        </div>
      </div>
    </>
  );
}
