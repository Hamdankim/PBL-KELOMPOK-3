import { useEffect, useState } from "react";

export type ThemeMode = "dark" | "light";

const THEME_STORAGE_KEY = "smart-irrigation-theme";

function readStoredTheme(defaultTheme: ThemeMode): ThemeMode {
  if (typeof window === "undefined") {
    return defaultTheme;
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return storedTheme === "light" ? "light" : defaultTheme;
}

export function useThemeMode(defaultTheme: ThemeMode = "dark") {
  const [theme, setTheme] = useState<ThemeMode>(() =>
    readStoredTheme(defaultTheme)
  );

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  return { theme, setTheme, toggleTheme };
}