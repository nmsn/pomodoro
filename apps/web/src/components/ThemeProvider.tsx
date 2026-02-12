"use client";

import { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { themeModeAtom, setThemeModeAtom } from "@/atoms/theme";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const themeMode = useAtomValue(themeModeAtom);
  const setThemeMode = useSetAtom(setThemeModeAtom);

  useEffect(() => {
    // 初始化主题
    const root = document.documentElement;
    
    if (themeMode === "dark") {
      root.classList.add("dark");
    } else if (themeMode === "light") {
      root.classList.remove("dark");
    } else {
      // system 模式
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (systemDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [themeMode]);

  useEffect(() => {
    // 监听系统主题变化（仅在 system 模式下）
    if (themeMode !== "system") return;
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const root = document.documentElement;
      if (e.matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [themeMode]);

  return <>{children}</>;
}
