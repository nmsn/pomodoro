"use client";

import { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { themeModeAtom, setThemeModeAtom, type ThemeMode } from "@/atoms/theme";
import { backgroundThemeAtom, type BackgroundTheme } from "@/atoms/background";
import {
  timerTypeAtom,
  workDurationAtom,
  breakDurationAtom,
  type TimerType,
} from "@/atoms/timer";
import { type ServerUserSettings } from "@/lib/server-settings";

interface ThemeProviderProps {
  children: React.ReactNode;
  serverSettings?: ServerUserSettings | null;
}

export function ThemeProvider({ children, serverSettings }: ThemeProviderProps) {
  const themeMode = useAtomValue(themeModeAtom);
  const setThemeMode = useSetAtom(setThemeModeAtom);
  const setBackground = useSetAtom(backgroundThemeAtom);
  const setTimerType = useSetAtom(timerTypeAtom);
  const setWorkDuration = useSetAtom(workDurationAtom);
  const setBreakDuration = useSetAtom(breakDurationAtom);

  // 应用服务端加载的设置（同步执行，避免闪烁）
  useEffect(() => {
    if (serverSettings) {
      setThemeMode(serverSettings.theme as ThemeMode);
      setBackground(serverSettings.background as BackgroundTheme);
      setTimerType(serverSettings.timerType as TimerType);
      setWorkDuration(serverSettings.workDuration);
      setBreakDuration(serverSettings.breakDuration);
    }
  }, [serverSettings, setThemeMode, setBackground, setTimerType, setWorkDuration, setBreakDuration]);

  // 应用主题到 DOM
  useEffect(() => {
    const root = document.documentElement;

    if (themeMode === "dark") {
      root.classList.add("dark");
    } else if (themeMode === "light") {
      root.classList.remove("dark");
    } else {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (systemDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [themeMode]);

  // 监听系统主题变化（仅在 system 模式下）
  useEffect(() => {
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