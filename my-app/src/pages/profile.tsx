import Head from "next/head";
import Header from "@/components/Header";
import ProfileView from "@/views/profile";
import { useThemeMode } from "@/hooks/useThemeMode";

export default function ProfilePage() {
  const { theme, toggleTheme } = useThemeMode();

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
