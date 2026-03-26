import { atom } from "jotai"
import { apiFetch } from "@/lib/api"
import { type ThemeMode } from "@/atoms/theme"
import { type BackgroundTheme, backgroundThemes } from "@/atoms/background"
import { type TimerType, timerTypeConfig } from "@/atoms/timer"

export interface UserSettings {
  theme: ThemeMode
  background: BackgroundTheme
  workDuration: number
  breakDuration: number
  timerType: TimerType
  soundEnabled: boolean
  notificationsEnabled: boolean
}

// 加载用户设置
export async function loadUserSettings(): Promise<UserSettings | null> {
  const res = await apiFetch<UserSettings>("/api/settings/")
  if (res.success && res.data) {
    const s = res.data
    return {
      theme: s.theme as ThemeMode,
      background: s.background as BackgroundTheme,
      workDuration: s.workDuration,
      breakDuration: s.breakDuration,
      timerType: s.timerType as TimerType,
      soundEnabled: s.soundEnabled,
      notificationsEnabled: s.notificationsEnabled,
    }
  }
  return null
}

// 保存用户设置到后端
export async function saveUserSettings(partial: Partial<UserSettings>) {
  await apiFetch("/api/settings", {
    method: "PATCH",
    body: JSON.stringify(partial),
  })
}
