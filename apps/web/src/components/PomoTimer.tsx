"use client";

import { useAtomValue } from "jotai";
import { useState } from "react";
import { Coffee, Brain, Timer, Hourglass, Watch, Tv, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePomoTimer, TimerMode, TimerState } from "@/hooks/usePomoTimer";
import { TimerRenderer } from "./TimerRenderer";
import { timerTypeConfig, TimerType, isActiveAtom } from "@/atoms/timer";
import { isDarkBackgroundAtom } from "@/atoms/background";
import { useSession } from "@/atoms/auth";
import { LoginToast } from "./LoginToast";
import { savePomodoroSession } from "@/lib/session";
import { useConfirmAction } from "@/hooks/useConfirmAction";

interface PomoTimerProps {
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

export function PomoTimer({
  workDuration = 25,
  breakDuration = 5,
  className,
  onTimerUpdate,
}: PomoTimerProps) {
  const isDark = useAtomValue(isDarkBackgroundAtom);
  const isActiveState = useAtomValue(isActiveAtom);
  const { data: session } = useSession();
  const [showLoginToast, setShowLoginToast] = useState(false);

  const { state, toggleTimer, resetTimer, switchMode } = usePomoTimer({
    workDuration,
    breakDuration,
    onStateChange: onTimerUpdate,
    onSessionComplete: (sessionData, completed) => {
      if (session?.user) {
        // Logged in - save session
        savePomodoroSession(sessionData, completed);
      } else if (completed) {
        // Not logged in and completed - show login toast
        setShowLoginToast(true);
      }
    },
  });

  const { confirm: confirmSwitch, Dialog: SwitchDialog } = useConfirmAction({
    title: "切换模式",
    message:
      state.mode === "work"
        ? "专注计时进行中，切换将中断当前计时，确认吗？"
        : "休息时间进行中，切换将中断当前计时，确认吗？",
    confirmText: "切换",
  });

  const config = timerTypeConfig[state.timerType];
  const showModeSwitch = config.breakDuration > 0;

  return (
    <div className={cn("w-full max-w-md mx-auto p-4", className)}>
      {/* 头部区域 */}
      <div className="space-y-1 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getTimerIcon(state.timerType, isDark)}
            <h2 className={cn(
              "text-xl font-semibold tracking-tight",
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
                onClick={() => confirmSwitch(() => switchMode("work"), isActiveState)}
                className="rounded-lg"
              >
                <Brain className="mr-1 h-3 w-3" />
                专注
              </Button>
              <Button
                variant={state.mode === "break" ? "default" : "outline"}
                size="sm"
                onClick={() => confirmSwitch(() => switchMode("break"), isActiveState)}
                className="rounded-lg"
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

      {showLoginToast && (
        <LoginToast onClose={() => setShowLoginToast(false)} />
      )}

      <SwitchDialog />
    </div>
  );
}

export type { TimerMode };
