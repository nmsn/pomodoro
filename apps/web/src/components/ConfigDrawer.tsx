"use client"

import { useState } from "react"
import { useAtom, useAtomValue } from "jotai"
import { Settings, Clock, Palette, Bell, User, Check, X, Sun, Moon, Monitor } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  timerTypeAtom,
  workDurationAtom,
  breakDurationAtom,
  switchTimerTypeAtom,
  updateDurationAtom,
  timerTypeConfig,
  TimerType,
} from "@/atoms/timer"
import {
  backgroundThemeAtom,
  backgroundThemes,
  switchBackgroundThemeAtom,
  BackgroundTheme,
} from "@/atoms/background"
import {
  themeModeAtom,
  setThemeModeAtom,
  ThemeMode,
} from "@/atoms/theme"

type NavItem = {
  id: string
  label: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    id: "timer",
    label: "计时器",
    icon: <Clock className="h-4 w-4" />,
  },
  {
    id: "appearance",
    label: "外观",
    icon: <Palette className="h-4 w-4" />,
  },
  {
    id: "notifications",
    label: "通知",
    icon: <Bell className="h-4 w-4" />,
  },
  {
    id: "account",
    label: "账户",
    icon: <User className="h-4 w-4" />,
  },
]

function TimerSettings() {
  const timerType = useAtomValue(timerTypeAtom)
  const workDuration = useAtomValue(workDurationAtom)
  const breakDuration = useAtomValue(breakDurationAtom)
  const [, switchTimerType] = useAtom(switchTimerTypeAtom)
  const [, updateDuration] = useAtom(updateDurationAtom)
  const config = timerTypeConfig[timerType]

  const handleTypeChange = (value: string) => {
    switchTimerType(value as TimerType)
  }

  const adjustDuration = (type: "work" | "break", delta: number) => {
    const current = type === "work" ? workDuration : breakDuration
    const newValue = Math.max(1, current + delta)
    updateDuration({ type, duration: newValue })
  }

  return (
    <div className="space-y-8">
      {/* 计时类型选择 */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">计时模式</h3>
          <p className="text-sm text-muted-foreground mt-1">选择适合您的计时方式</p>
        </div>
        <Select value={timerType} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-full h-12 rounded-xl border-muted-foreground/20">
            <SelectValue placeholder="选择计时模式">
              {timerTypeConfig[timerType]?.name}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="pomodoro" className="rounded-lg">
              <div className="flex flex-col items-start py-1">
                <span className="font-medium">番茄钟</span>
                <span className="text-xs text-muted-foreground">经典番茄工作法：专注与休息交替</span>
              </div>
            </SelectItem>
            <SelectItem value="countdown" className="rounded-lg">
              <div className="flex flex-col items-start py-1">
                <span className="font-medium">倒计时</span>
                <span className="text-xs text-muted-foreground">自定义倒计时</span>
              </div>
            </SelectItem>
            <SelectItem value="stopwatch" className="rounded-lg">
              <div className="flex flex-col items-start py-1">
                <span className="font-medium">码表</span>
                <span className="text-xs text-muted-foreground">从 0 开始正计时</span>
              </div>
            </SelectItem>
            <SelectItem value="animedoro" className="rounded-lg">
              <div className="flex flex-col items-start py-1">
                <span className="font-medium">Animedoro</span>
                <span className="text-xs text-muted-foreground">看番剧/视频作为奖励的番茄变体</span>
              </div>
            </SelectItem>
            <SelectItem value="52-17" className="rounded-lg">
              <div className="flex flex-col items-start py-1">
                <span className="font-medium">52/17</span>
                <span className="text-xs text-muted-foreground">工作 52 分钟，休息 17 分钟</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator className="bg-muted-foreground/10" />

      {/* 专注时长 - 只在需要显示时展示 */}
      {config.showDurations && (
        <>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold tracking-tight">
                {timerType === "countdown" ? "倒计时时长" : "专注时长"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {timerType === "countdown" ? "设置倒计时时间" : "设置每次专注的默认时长"}
              </p>
            </div>
            <div className="flex items-center gap-3 bg-muted/50 rounded-2xl p-4 w-fit">
              <Button
                variant="outline"
                size="icon"
                onClick={() => adjustDuration("work", -1)}
                className="h-10 w-10 rounded-xl border-muted-foreground/20"
              >
                -
              </Button>
              <span className="text-3xl font-bold w-16 text-center tabular-nums">{workDuration}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => adjustDuration("work", 1)}
                className="h-10 w-10 rounded-xl border-muted-foreground/20"
              >
                +
              </Button>
              <span className="text-sm text-muted-foreground ml-2">分钟</span>
            </div>
          </div>

          <Separator className="bg-muted-foreground/10" />

          {/* 休息时长 - 只在有休息时间的模式下显示 */}
          {config.breakDuration > 0 && (
            <>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">休息时长</h3>
                  <p className="text-sm text-muted-foreground mt-1">设置每次休息的默认时长</p>
                </div>
                <div className="flex items-center gap-3 bg-muted/50 rounded-2xl p-4 w-fit">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => adjustDuration("break", -1)}
                    className="h-10 w-10 rounded-xl border-muted-foreground/20"
                  >
                    -
                  </Button>
                  <span className="text-3xl font-bold w-16 text-center tabular-nums">{breakDuration}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => adjustDuration("break", 1)}
                    className="h-10 w-10 rounded-xl border-muted-foreground/20"
                  >
                    +
                  </Button>
                  <span className="text-sm text-muted-foreground ml-2">分钟</span>
                </div>
              </div>
              <Separator className="bg-muted-foreground/10" />
            </>
          )}
        </>
      )}

      {/* 模式说明 */}
      <div className="bg-gradient-to-br from-muted/80 to-muted/40 rounded-2xl p-5 border border-muted-foreground/5">
        <h4 className="font-semibold mb-1">{config.name}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{config.description}</p>
      </div>
    </div>
  )
}

function AppearanceSettings() {
  const currentTheme = useAtomValue(backgroundThemeAtom)
  const [, switchTheme] = useAtom(switchBackgroundThemeAtom)
  const themeMode = useAtomValue(themeModeAtom)
  const [, setThemeMode] = useAtom(setThemeModeAtom)

  const handleThemeChange = (theme: BackgroundTheme) => {
    switchTheme(theme)
  }

  const handleModeChange = (mode: ThemeMode) => {
    setThemeMode(mode)
  }

  // 获取背景预览样式
  const getPreviewStyle = (themeKey: BackgroundTheme): React.CSSProperties => {
    const config = backgroundThemes[themeKey]

    if (config.type === "solid") {
      return {
        background: themeKey === "solid-dark" ? "#0f172a" : "#f8fafc",
      }
    }

    // Shader 背景使用渐变色预览
    if (config.colors && config.colors.length > 0) {
      const gradient = `linear-gradient(135deg, ${config.colors.join(", ")})`
      return { background: gradient }
    }

    return {}
  }

  const getThemeIcon = (mode: ThemeMode) => {
    switch (mode) {
      case "light":
        return <Sun className="h-5 w-5" />
      case "dark":
        return <Moon className="h-5 w-5" />
      case "system":
        return <Monitor className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-8">
      {/* 主题选择 */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">主题</h3>
          <p className="text-sm text-muted-foreground mt-1">选择您喜欢的主题风格</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {(["light", "dark", "system"] as ThemeMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => handleModeChange(mode)}
              className={cn(
                "relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200",
                themeMode === mode
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/10 bg-muted/30 hover:border-muted-foreground/20 hover:bg-muted/50"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                themeMode === mode ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground"
              )}>
                {getThemeIcon(mode)}
              </div>
              <span className={cn(
                "text-sm font-medium",
                themeMode === mode ? "text-foreground" : "text-muted-foreground"
              )}>
                {mode === "light" ? "浅色" : mode === "dark" ? "深色" : "跟随系统"}
              </span>
              {themeMode === mode && (
                <div className="absolute top-2 right-2">
                  <div className="bg-primary text-primary-foreground rounded-full p-0.5">
                    <Check className="h-3 w-3" />
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <Separator className="bg-muted-foreground/10" />

      {/* 背景选择 */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">背景效果</h3>
          <p className="text-sm text-muted-foreground mt-1">选择动态背景效果</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(backgroundThemes) as BackgroundTheme[]).map((themeKey) => {
            const config = backgroundThemes[themeKey]
            const isSelected = currentTheme === themeKey

            return (
              <button
                key={themeKey}
                onClick={() => handleThemeChange(themeKey)}
                className={cn(
                  "relative h-28 rounded-2xl border-2 overflow-hidden transition-all duration-200",
                  isSelected
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-transparent hover:border-muted-foreground/20"
                )}
              >
                {/* 背景预览 */}
                <div
                  className="absolute inset-0"
                  style={getPreviewStyle(themeKey)}
                />

                {/* 遮罩层 */}
                <div className={cn(
                  "absolute inset-0 transition-opacity",
                  isSelected ? "bg-black/20" : "bg-black/40 hover:bg-black/30"
                )} />

                {/* 选中标记 */}
                {isSelected && (
                  <div className="absolute top-2 right-2 z-10">
                    <div className="bg-white text-black rounded-full p-1 shadow-lg">
                      <Check className="h-3 w-3" />
                    </div>
                  </div>
                )}

                {/* 内容 */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-3">
                  <span className="font-semibold text-sm text-white drop-shadow-lg">{config.name}</span>
                  <span className="text-xs text-white/80 drop-shadow-md line-clamp-1 mt-0.5">
                    {config.description}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function NotificationSettings() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">通知设置</h3>
          <p className="text-sm text-muted-foreground mt-1">配置计时结束时的通知方式</p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/50 border border-muted-foreground/5">
            <div>
              <p className="font-medium">声音提醒</p>
              <p className="text-sm text-muted-foreground">计时结束时播放提示音</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-full px-4">开启</Button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/50 border border-muted-foreground/5">
            <div>
              <p className="font-medium">桌面通知</p>
              <p className="text-sm text-muted-foreground">显示系统桌面通知</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-full px-4">开启</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function AccountSettings() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">账户信息</h3>
          <p className="text-sm text-muted-foreground mt-1">管理您的账户设置</p>
        </div>
        <div className="p-5 rounded-2xl bg-muted/50 border border-muted-foreground/5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg">
              U
            </div>
            <div>
              <p className="font-semibold">用户名</p>
              <p className="text-sm text-muted-foreground">user@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const contentMap: Record<string, React.ReactNode> = {
  timer: <TimerSettings />,
  appearance: <AppearanceSettings />,
  notifications: <NotificationSettings />,
  account: <AccountSettings />,
}

export function DrawerScrollableContent() {
  const [selectedNav, setSelectedNav] = useState<string>("timer")

  const renderNavItem = (item: NavItem) => {
    const isSelected = selectedNav === item.id

    return (
      <button
        key={item.id}
        onClick={() => setSelectedNav(item.id)}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
          isSelected
            ? "bg-primary text-primary-foreground shadow-md"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <span className={cn(
          "transition-transform duration-200",
          isSelected && "scale-110"
        )}>
          {item.icon}
        </span>
        <span className="flex-1 text-left font-medium">{item.label}</span>
      </button>
    )
  }

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full shadow-lg bg-background/80 backdrop-blur-sm border-muted-foreground/20 hover:bg-background/90"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-0 border-l border-muted-foreground/10">
        <div className="flex h-[100vh]">
          {/* 左侧导航栏 */}
          <div className="w-60 border-r bg-muted/20 flex-shrink-0 flex flex-col">
            {/* 关闭按钮 */}
            <div className="p-4 border-b border-muted-foreground/10">
              <DrawerClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-xl hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
            <ScrollArea className="flex-1 py-3 px-2">
              <div className="space-y-1">
                {navItems.map((item) => renderNavItem(item))}
              </div>
            </ScrollArea>
          </div>

          {/* 右侧内容区域 */}
          <div className="flex-1 bg-background">
            <ScrollArea className="h-full">
              <div className="p-8 max-w-xl">
                {contentMap[selectedNav] || (
                  <div className="text-center text-muted-foreground py-12">
                    请选择左侧菜单查看设置
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
