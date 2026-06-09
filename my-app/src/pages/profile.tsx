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
      <ProfileView />
    </>
  );
}
