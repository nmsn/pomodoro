"use client"

import { useEffect } from "react"
import { useSetAtom } from "jotai"
import { setThemeModeAtom, type ThemeMode } from "@/atoms/theme"
import { backgroundThemeAtom, type BackgroundTheme } from "@/atoms/background"
import {
  timerTypeAtom,
  workDurationAtom,
  breakDurationAtom,
  type TimerType,
} from "@/atoms/timer"
import { type ServerUserSettings } from "@/lib/server-settings"
import { serverSettingsLoadedAtom } from "@/hooks/useUserSettingsSync"

interface Props {
  settings: ServerUserSettings | null
}

export function SettingsInitializer({ settings }: Props) {
  const setThemeMode = useSetAtom(setThemeModeAtom)
  const setBackground = useSetAtom(backgroundThemeAtom)
  const setTimerType = useSetAtom(timerTypeAtom)
  const setWorkDuration = useSetAtom(workDurationAtom)
  const setBreakDuration = useSetAtom(breakDurationAtom)
  const setServerSettingsLoaded = useSetAtom(serverSettingsLoadedAtom)

  useEffect(() => {
    if (settings) {
      setThemeMode(settings.theme as ThemeMode)
      setBackground(settings.background as BackgroundTheme)
      setTimerType(settings.timerType as TimerType)
      setWorkDuration(settings.workDuration)
      setBreakDuration(settings.breakDuration)
      setServerSettingsLoaded(true)
    }
  }, [settings, setThemeMode, setBackground, setTimerType, setWorkDuration, setBreakDuration, setServerSettingsLoaded])

  return null
}
