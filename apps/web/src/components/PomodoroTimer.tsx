"use client";

import { useAtomValue } from "jotai";
import { Coffee, Brain, Timer, Hourglass, Watch, Tv, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePomodoroTimer, TimerMode, TimerState } from "@/hooks/usePomodoroTimer";
import { TimerRenderer } from "./TimerRenderer";
import { timerTypeConfig, TimerType } from "@/atoms/timer";
import { isDarkBackgroundAtom } from "@/atoms/background";

interface PomodoroTimerProps {
  workDuration?: number;
  breakDuration?: number;
  className?: string;
  onTimerUpdate?: (state: TimerState) => void;
}

// 获取计时模式对应的图标
const getTimerIcon = (timerType: TimerType, isDark: boolean) => {
  const iconClass = cn("h-5 w-5", isDark && "text-white");
  switch (timerType) {
    case "pomodoro":
      return <Timer className={iconClass} />;
    case "countdown":
      return <Hourglass className={iconClass} />;
    case "stopwatch":
      return <Watch className={iconClass} />;
    case "animedoro":
      return <Tv className={iconClass} />;
    case "52-17":
      return <Calendar className={iconClass} />;
    default:
      return <Timer className={iconClass} />;
  }
};

// 获取计时模式名称
const getTimerTitle = (timerType: TimerType) => {
  return timerTypeConfig[timerType].name;
};

export function PomodoroTimer({
  workDuration = 25,
  breakDuration = 5,
  className,
  onTimerUpdate,
}: PomodoroTimerProps) {
  const isDark = useAtomValue(isDarkBackgroundAtom);
  const { state, toggleTimer, resetTimer, switchMode } = usePomodoroTimer({
    workDuration,
    breakDuration,
    onStateChange: onTimerUpdate,
  });

  const config = timerTypeConfig[state.timerType];
  const showModeSwitch = config.breakDuration > 0;

  return (
    <div className={cn("w-full max-w-md mx-auto p-6", className)}>
      {/* 头部区域 */}
      <div className="space-y-1 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getTimerIcon(state.timerType, isDark)}
            <h2 className={cn(
              "text-2xl font-semibold tracking-tight",
              isDark && "text-white"
            )}>
              {getTimerTitle(state.timerType)}
            </h2>
          </div>
          {showModeSwitch && (
            <div className="flex gap-2">
              <Button
                variant={state.mode === "work" ? "default" : "outline"}
                size="sm"
                onClick={() => switchMode("work")}
                className="rounded-full"
              >
                <Brain className="mr-1 h-3 w-3" />
                专注
              </Button>
              <Button
                variant={state.mode === "break" ? "secondary" : "outline"}
                size="sm"
                onClick={() => switchMode("break")}
                className="rounded-full"
              >
                <Coffee className="mr-1 h-3 w-3" />
                休息
              </Button>
            </div>
          )}
        </div>
        <p className={cn(
          "text-sm",
          isDark ? "text-white/70" : "text-muted-foreground"
        )}>
          {config.description}
        </p>
      </div>

      {/* 计时器区域 */}
      <TimerRenderer
        state={state}
        onToggle={toggleTimer}
        onReset={resetTimer}
        variant="default"
        showModeSwitch={false}
      />
    </div>
  );
}

export type { TimerMode };
