"use client"

import { useAtom, useAtomValue } from "jotai"
import { useCallback } from "react"
import { debounce } from "es-toolkit"
import { Button } from "@/components/ui/button"
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

export function TimerSettings() {
  const timerType = useAtomValue(timerTypeAtom)
  const workDuration = useAtomValue(workDurationAtom)
  const breakDuration = useAtomValue(breakDurationAtom)
  const [, switchTimerType] = useAtom(switchTimerTypeAtom)
  const [, updateDuration] = useAtom(updateDurationAtom)
  const config = timerTypeConfig[timerType]

  const handleTypeChange = (value: string) => {
    switchTimerType(value as TimerType)
  }

  // 创建防抖的更新函数，300ms 延迟
  const debouncedUpdateDuration = useCallback(
    debounce((type: "work" | "break", duration: number) => {
      updateDuration({ type, duration })
    }, 300),
    [updateDuration]
  )

  const adjustDuration = (type: "work" | "break", delta: number) => {
    const current = type === "work" ? workDuration : breakDuration
    const newValue = Math.max(1, current + delta)
    debouncedUpdateDuration(type, newValue)
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
            <DurationControl
              value={workDuration}
              onIncrease={() => adjustDuration("work", 1)}
              onDecrease={() => adjustDuration("work", -1)}
              label="分钟"
            />
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
                <DurationControl
                  value={breakDuration}
                  onIncrease={() => adjustDuration("break", 1)}
                  onDecrease={() => adjustDuration("break", -1)}
                  label="分钟"
                />
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

interface DurationControlProps {
  value: number
  onIncrease: () => void
  onDecrease: () => void
  label: string
}

function DurationControl({ value, onIncrease, onDecrease, label }: DurationControlProps) {
  return (
    <div className="flex items-center gap-4 bg-gradient-to-br from-muted/80 to-muted/40 rounded-2xl p-5 w-fit border border-muted-foreground/10">
      <Button
        variant="outline"
        size="icon"
        onClick={onDecrease}
        aria-label="减少时长"
        className="group h-12 w-12 rounded-xl border-2 border-muted-foreground/20 cursor-pointer hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
      >
        <span className="text-2xl text-muted-foreground group-hover:text-foreground transition-colors font-light">−</span>
      </Button>
      <span className="text-4xl font-bold w-20 text-center tabular-nums font-mono bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
        {value}
      </span>
      <Button
        variant="outline"
        size="icon"
        onClick={onIncrease}
        aria-label="增加时长"
        className="group h-12 w-12 rounded-xl border-2 border-muted-foreground/20 cursor-pointer hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
      >
        <span className="text-2xl text-muted-foreground group-hover:text-foreground transition-colors font-light">+</span>
      </Button>
      <span className="text-sm text-muted-foreground font-medium ml-2">{label}</span>
    </div>
  )
}
