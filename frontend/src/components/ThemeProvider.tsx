"use client";

import { ReactNode, useEffect, useState } from "react";
import { useThemeStore } from "@/lib/theme";

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme, setTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme-storage');
    if (savedTheme) {
      const parsedTheme = JSON.parse(savedTheme);
      setTheme(parsedTheme.state.theme);
    }
  }, [setTheme]);

  if (!mounted) {
    return null;
  }

  return <>{children}</>;
} 