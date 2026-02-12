"use client"

import { useState } from "react"
import { useAtom, useAtomValue } from "jotai"
import { Settings, Clock, Palette, Bell, User, ChevronRight, Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
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
    <div className="space-y-6">
      {/* 计时类型选择 */}
      <div>
        <h3 className="text-lg font-medium">计时模式</h3>
        <p className="text-sm text-muted-foreground">选择适合您的计时方式</p>
        <div className="mt-4">
          <Select value={timerType} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="选择计时模式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pomodoro">
                <div className="flex flex-col items-start">
                  <span className="font-medium">番茄钟</span>
                  <span className="text-xs text-muted-foreground">经典番茄工作法：专注与休息交替</span>
                </div>
              </SelectItem>
              <SelectItem value="countdown">
                <div className="flex flex-col items-start">
                  <span className="font-medium">倒计时</span>
                  <span className="text-xs text-muted-foreground">自定义倒计时</span>
                </div>
              </SelectItem>
              <SelectItem value="stopwatch">
                <div className="flex flex-col items-start">
                  <span className="font-medium">码表</span>
                  <span className="text-xs text-muted-foreground">从 0 开始正计时</span>
                </div>
              </SelectItem>
              <SelectItem value="animedoro">
                <div className="flex flex-col items-start">
                  <span className="font-medium">Animedoro</span>
                  <span className="text-xs text-muted-foreground">看番剧/视频作为奖励的番茄变体</span>
                </div>
              </SelectItem>
              <SelectItem value="52-17">
                <div className="flex flex-col items-start">
                  <span className="font-medium">52/17</span>
                  <span className="text-xs text-muted-foreground">工作 52 分钟，休息 17 分钟</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      {/* 专注时长 - 只在需要显示时展示 */}
      {config.showDurations && (
        <>
          <div>
            <h3 className="text-lg font-medium">
              {timerType === "countdown" ? "倒计时时长" : "专注时长"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {timerType === "countdown" ? "设置倒计时时间" : "设置每次专注的默认时长"}
            </p>
            <div className="mt-4 flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustDuration("work", -1)}
              >
                -
              </Button>
              <span className="text-2xl font-bold w-16 text-center">{workDuration}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustDuration("work", 1)}
              >
                +
              </Button>
              <span className="text-sm text-muted-foreground">分钟</span>
            </div>
          </div>

          <Separator />

          {/* 休息时长 - 只在有休息时间的模式下显示 */}
          {config.breakDuration > 0 && (
            <>
              <div>
                <h3 className="text-lg font-medium">休息时长</h3>
                <p className="text-sm text-muted-foreground">设置每次休息的默认时长</p>
                <div className="mt-4 flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => adjustDuration("break", -1)}
                  >
                    -
                  </Button>
                  <span className="text-2xl font-bold w-16 text-center">{breakDuration}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => adjustDuration("break", 1)}
                  >
                    +
                  </Button>
                  <span className="text-sm text-muted-foreground">分钟</span>
                </div>
              </div>
              <Separator />
            </>
          )}
        </>
      )}

      {/* 模式说明 */}
      <div className="bg-muted p-4 rounded-lg">
        <h4 className="font-medium mb-1">{config.name}</h4>
        <p className="text-sm text-muted-foreground">{config.description}</p>
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

  return (
    <div className="space-y-6">
      {/* 主题选择 */}
      <div>
        <h3 className="text-lg font-medium">主题</h3>
        <p className="text-sm text-muted-foreground">选择您喜欢的主题风格</p>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <Button
            variant={themeMode === "light" ? "default" : "outline"}
            className="h-20 flex flex-col gap-2"
            onClick={() => handleModeChange("light")}
          >
            <div className="w-8 h-8 rounded-full bg-white border border-gray-300" />
            <span className="text-xs">浅色</span>
          </Button>
          <Button
            variant={themeMode === "dark" ? "default" : "outline"}
            className="h-20 flex flex-col gap-2"
            onClick={() => handleModeChange("dark")}
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 border" />
            <span className="text-xs">深色</span>
          </Button>
          <Button
            variant={themeMode === "system" ? "default" : "outline"}
            className="h-20 flex flex-col gap-2"
            onClick={() => handleModeChange("system")}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white to-slate-900 border" />
            <span className="text-xs">跟随系统</span>
          </Button>
        </div>
      </div>

      <Separator />

      {/* 背景选择 */}
      <div>
        <h3 className="text-lg font-medium">背景效果</h3>
        <p className="text-sm text-muted-foreground">选择动态背景效果</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {(Object.keys(backgroundThemes) as BackgroundTheme[]).map((themeKey) => {
            const config = backgroundThemes[themeKey]
            const isSelected = currentTheme === themeKey

            return (
              <Button
                key={themeKey}
                variant="outline"
                className={cn(
                  "h-24 flex flex-col gap-2 relative overflow-hidden",
                  isSelected && "ring-2 ring-primary ring-offset-2"
                )}
                onClick={() => handleThemeChange(themeKey)}
              >
                {/* 背景预览 */}
                <div
                  className="absolute inset-0 opacity-60"
                  style={getPreviewStyle(themeKey)}
                />

                {/* 选中标记 */}
                {isSelected && (
                  <div className="absolute top-2 right-2 z-10">
                    <div className="bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="h-3 w-3" />
                    </div>
                  </div>
                )}

                {/* 内容 */}
                <div className="relative z-10 flex flex-col items-center">
                  <span className="font-medium text-sm">{config.name}</span>
                  <span className="text-xs text-muted-foreground line-clamp-1">
                    {config.description}
                  </span>
                </div>
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function NotificationSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">通知设置</h3>
        <p className="text-sm text-muted-foreground">配置计时结束时的通知方式</p>
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">声音提醒</p>
              <p className="text-sm text-muted-foreground">计时结束时播放提示音</p>
            </div>
            <Button variant="outline" size="sm">开启</Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">桌面通知</p>
              <p className="text-sm text-muted-foreground">显示系统桌面通知</p>
            </div>
            <Button variant="outline" size="sm">开启</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function AccountSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">账户信息</h3>
        <p className="text-sm text-muted-foreground">管理您的账户设置</p>
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
              U
            </div>
            <div>
              <p className="font-medium">用户名</p>
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
      <div key={item.id}>
        <Button
          variant={isSelected ? "secondary" : "ghost"}
          className="w-full justify-start gap-2"
          onClick={() => setSelectedNav(item.id)}
        >
          {item.icon}
          <span className="flex-1 text-left">{item.label}</span>
        </Button>
      </div>
    )
  }

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon" className="h-12 w-12 rounded-full shadow-lg">
          <Settings className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="border-b">
          <DrawerTitle>设置</DrawerTitle>
          <DrawerDescription>配置您的番茄钟偏好</DrawerDescription>
        </DrawerHeader>

        <div className="flex h-[calc(100vh-12rem)]">
          {/* 左侧导航栏 - 删除二级菜单 */}
          <div className="w-56 border-r bg-muted/30 flex-shrink-0">
            <ScrollArea className="h-full py-4">
              <div className="px-2 space-y-1">
                {navItems.map((item) => renderNavItem(item))}
              </div>
            </ScrollArea>
          </div>

          {/* 右侧内容区域 */}
          <div className="flex-1 p-6">
            <ScrollArea className="h-full">
              {contentMap[selectedNav] || (
                <div className="text-center text-muted-foreground py-12">
                  请选择左侧菜单查看设置
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DrawerFooter className="border-t">
          <div className="flex justify-end gap-2">
            <Button>保存</Button>
            <DrawerClose asChild>
              <Button variant="outline">取消</Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
