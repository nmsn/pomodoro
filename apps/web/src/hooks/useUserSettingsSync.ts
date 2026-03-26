"use client"

import { useEffect } from "react"
import { useSession } from "@/atoms/auth"
import { loadUserSettings } from "@/atoms/settings"
import { useSetAtom } from "jotai"
import { setThemeModeAtom } from "@/atoms/theme"
import { backgroundThemeAtom } from "@/atoms/background"
import {
  timerTypeAtom,
  workDurationAtom,
  breakDurationAtom,
} from "@/atoms/timer"

/**
 * 当用户登录时，从后端加载用户设置并应用到 atoms
 * 用于客户端 session 变化时的同步（如登录）
 */
export function useUserSettingsSync() {
  const { data: session, isPending } = useSession()
  const setThemeMode = useSetAtom(setThemeModeAtom)
  const setBackground = useSetAtom(backgroundThemeAtom)
  const setTimerType = useSetAtom(timerTypeAtom)
  const setWorkDuration = useSetAtom(workDurationAtom)
  const setBreakDuration = useSetAtom(breakDurationAtom)

  useEffect(() => {
    // 等待 session 加载完成
    if (isPending) return

    // 用户已登录时加载设置
    if (session?.user) {
      loadUserSettings().then((settings) => {
        if (settings) {
          setThemeMode(settings.theme)
          setBackground(settings.background)
          setTimerType(settings.timerType)
          setWorkDuration(settings.workDuration)
          setBreakDuration(settings.breakDuration)
        }
      })
    }
  }, [isPending, session?.user, setThemeMode, setBackground, setTimerType, setWorkDuration, setBreakDuration])
}