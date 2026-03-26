"use client"

import { useEffect } from "react"
import { atom, useAtom, useSetAtom } from "jotai"
import { useSession } from "@/atoms/auth"
import { loadUserSettings } from "@/atoms/settings"
import { setThemeModeAtom } from "@/atoms/theme"
import { backgroundThemeAtom } from "@/atoms/background"
import {
  timerTypeAtom,
  workDurationAtom,
  breakDurationAtom,
} from "@/atoms/timer"

// 跟踪服务端设置是否已加载
export const serverSettingsLoadedAtom = atom(false)

/**
 * 当用户登录时，从后端加载用户设置并应用到 atoms
 * 用于客户端 session 变化时的同步（如登录/登出）
 */
export function useUserSettingsSync() {
  const { data: session, isPending } = useSession()
  const [serverSettingsLoaded, setServerSettingsLoaded] = useAtom(serverSettingsLoadedAtom)
  const setThemeMode = useSetAtom(setThemeModeAtom)
  const setBackground = useSetAtom(backgroundThemeAtom)
  const setTimerType = useSetAtom(timerTypeAtom)
  const setWorkDuration = useSetAtom(workDurationAtom)
  const setBreakDuration = useSetAtom(breakDurationAtom)

  useEffect(() => {
    // 等待 session 加载完成
    if (isPending) return

    // 只有当用户已登录且服务端设置尚未加载过才加载
    // 已登录用户首次加载由服务端/SettingsInitializer 处理
    if (session?.user && !serverSettingsLoaded) {
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

    // 用户登出时重置标记
    if (!session?.user) {
      setServerSettingsLoaded(false)
    }
  }, [isPending, session?.user, serverSettingsLoaded, setThemeMode, setBackground, setTimerType, setWorkDuration, setBreakDuration, setServerSettingsLoaded])
}

// 标记服务端设置已加载（由 SettingsInitializer 调用）
export function markServerSettingsLoaded() {
  // This is a workaround - we need to set the atom
  // But atoms can't be set outside of React components
  // So SettingsInitializer will use useSetAtom instead
}