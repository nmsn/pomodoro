"use client"

import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { useCallback, useRef } from "react"
import { useOptimistic } from "react"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
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
  timerTypeConfig,
  TimerType,
} from "@/atoms/timer"
import { saveUserSettings } from "@/atoms/settings"

export function TimerSettings() {
  const timerType = useAtomValue(timerTypeAtom)
  const workDuration = useAtomValue(workDurationAtom)
  const breakDuration = useAtomValue(breakDurationAtom)
  const [, switchTimerType] = useAtom(switchTimerTypeAtom)
  const setWorkDuration = useSetAtom(workDurationAtom)
  const setBreakDuration = useSetAtom(breakDurationAtom)
  const config = timerTypeConfig[timerType]

  // useOptimistic：乐观更新（立即响应）
  const [optimisticWork, addOptimisticWork] = useOptimistic(workDuration, (_state, newValue: number) => newValue)
  const [optimisticBreak, addOptimisticBreak] = useOptimistic(breakDuration, (_state, newValue: number) => newValue)

  // 防抖保存 refs
  const workTimerRef = useRef<NodeJS.Timeout | null>(null)
  const breakTimerRef = useRef<NodeJS.Timeout | null>(null)

  const handleTypeChange = (value: string) => {
    switchTimerType(value as TimerType)
  }

  // 滑动更新：立即更新 UI，防抖同步到后端
  const handleDurationChange = useCallback((type: "work" | "break", value: number[]) => {
    const newValue = value[0]

    // 乐观更新：立即响应
    if (type === "work") {
      addOptimisticWork(newValue)
      setWorkDuration(newValue)
    } else {
      addOptimisticBreak(newValue)
      setBreakDuration(newValue)
    }

    // 清除之前的定时器，防抖保存
    if (type === "work") {
      if (workTimerRef.current) clearTimeout(workTimerRef.current)
      workTimerRef.current = setTimeout(() => {
        saveUserSettings({ workDuration: newValue })
      }, 300)
    } else {
      if (breakTimerRef.current) clearTimeout(breakTimerRef.current)
      breakTimerRef.current = setTimeout(() => {
        saveUserSettings({ breakDuration: newValue })
      }, 300)
    }
  }, [addOptimisticWork, addOptimisticBreak, setWorkDuration, setBreakDuration])

  return (
    <div className="space-y-8">
      {/* 计时类型选择 */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">计时模式</h3>
          <p className="text-sm text-muted-foreground mt-1">选择适合您的计时方式</p>
        </div>
        <Select value={timerType} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-full h-12 rounded-2xl border-muted-foreground/20 cursor-pointer">
            <SelectValue placeholder="选择计时模式">
              {timerTypeConfig[timerType]?.name}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="rounded-2xl">
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
            <div className="flex items-center gap-6 bg-gradient-to-br from-muted/80 to-muted/40 rounded-2xl p-5 border border-muted-foreground/10">
              <span className="text-3xl font-bold w-16 text-center tabular-nums font-mono">
                {optimisticWork}
              </span>
              <div
                className="flex-1 touch-none"
                onPointerDown={(e) => e.stopPropagation()}
              >
                <Slider
                  min={1}
                  max={60}
                  step={1}
                  value={[optimisticWork]}
                  onValueChange={(value) => handleDurationChange("work", value)}
                  showTicks
                  ticksInterval={5}
                />
              </div>
              <span className="text-sm text-muted-foreground w-10">分钟</span>
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
                <div className="flex items-center gap-6 bg-gradient-to-br from-muted/80 to-muted/40 rounded-2xl p-5 border border-muted-foreground/10">
                  <span className="text-3xl font-bold w-16 text-center tabular-nums font-mono">
                    {optimisticBreak}
                  </span>
                  <div
                    className="flex-1 touch-none"
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    <Slider
                      min={1}
                      max={30}
                      step={1}
                      value={[optimisticBreak]}
                      onValueChange={(value) => handleDurationChange("break", value)}
                      showTicks
                      ticksInterval={5}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-10">分钟</span>
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
