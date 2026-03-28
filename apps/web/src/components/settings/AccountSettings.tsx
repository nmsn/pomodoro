"use client"

import { useSession, signIn, signOut } from "@/atoms/auth"
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import { useEffect, useRef } from "react"
import { useSetAtom } from "jotai"
import { loadUserSettings } from "@/atoms/settings"
import { setThemeModeAtom } from "@/atoms/theme"
import { backgroundThemeAtom } from "@/atoms/background"
import {
  workDurationAtom,
  breakDurationAtom,
  timerTypeAtom,
  timerModeAtom,
  timeLeftAtom,
  isActiveAtom,
  elapsedTimeAtom,
} from "@/atoms/timer"
import type { UserSettings } from "@/atoms/settings"

export function AccountSettings() {
  const { data: session, isPending } = useSession()
  const setThemeMode = useSetAtom(setThemeModeAtom)
  const setBackground = useSetAtom(backgroundThemeAtom)
  const setWorkDuration = useSetAtom(workDurationAtom)
  const setBreakDuration = useSetAtom(breakDurationAtom)
  const setTimerType = useSetAtom(timerTypeAtom)
  const setTimerMode = useSetAtom(timerModeAtom)
  const setTimeLeft = useSetAtom(timeLeftAtom)
  const setIsActive = useSetAtom(isActiveAtom)
  const setElapsedTime = useSetAtom(elapsedTimeAtom)

  // 防止重复加载
  const loadedRef = useRef(false)

  // 登录后加载用户设置
  useEffect(() => {
    if (!session?.user) return
    if (loadedRef.current) return
    loadedRef.current = true

    loadUserSettings().then((settings: UserSettings | null) => {
      if (!settings) return
      if (settings.theme) setThemeMode(settings.theme)
      if (settings.background) setBackground(settings.background)

      // 直接设置计时器相关 atoms，不走 switchTimerType（避免覆盖用户保存的值）
      if (settings.timerType) setTimerType(settings.timerType)
      if (settings.workDuration) setWorkDuration(settings.workDuration)
      if (settings.breakDuration) setBreakDuration(settings.breakDuration)

      // 重置计时器状态
      setTimerMode("work")
      setIsActive(false)
      setElapsedTime(0)
      if (settings.workDuration) {
        setTimeLeft(settings.workDuration * 60)
      }
    })
  }, [session, setThemeMode, setBackground, setTimerType, setWorkDuration, setBreakDuration, setTimerMode, setIsActive, setElapsedTime, setTimeLeft])

  const handleGitHubSignIn = async () => {
    await signIn.social({
      provider: "github",
      callbackURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    })
  }

  const handleSignOut = async () => {
    await signOut()
  }

  if (isPending) {
    return (
      <div className="space-y-8">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">账户信息</h3>
            <p className="text-sm text-muted-foreground mt-1">管理您的账户设置</p>
          </div>
          <div className="p-5 rounded-2xl bg-muted/50 border border-muted-foreground/5 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-3 w-32 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="space-y-8">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">账户信息</h3>
            <p className="text-sm text-muted-foreground mt-1">登录以同步您的数据</p>
          </div>
          <div className="p-5 rounded-2xl bg-muted/50 border border-muted-foreground/5">
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                <span className="text-3xl">👤</span>
              </div>
              <div className="text-center">
                <p className="font-medium">未登录</p>
                <p className="text-sm text-muted-foreground mt-1">登录后可以同步您的计时数据</p>
              </div>
              <Button
                onClick={handleGitHubSignIn}
                className="w-full mt-2 rounded-xl cursor-pointer"
              >
                <Github className="w-4 h-4 mr-2" />
                使用 GitHub 登录
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const { user } = session

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">账户信息</h3>
          <p className="text-sm text-muted-foreground mt-1">已登录账户</p>
        </div>
        <div className="p-5 rounded-2xl bg-muted/50 border border-muted-foreground/5">
          <div className="flex items-center gap-4">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "用户头像"}
                className="w-14 h-14 rounded-2xl shadow-lg"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg">
                {user.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
            <div className="flex-1">
              <p className="font-semibold">{user.name || "用户"}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="w-full mt-4 rounded-xl cursor-pointer"
          >
            退出登录
          </Button>
        </div>
      </div>
    </div>
  )
}
