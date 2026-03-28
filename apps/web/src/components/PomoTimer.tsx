"use client";

import { useAtomValue } from "jotai";
import { useState } from "react";
import { Timer, Hourglass, Watch, Tv, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePomoTimer, TimerMode, TimerState } from "@/hooks/usePomoTimer";
import { TimerRenderer } from "./TimerRenderer";
import { timerTypeConfig, TimerType } from "@/atoms/timer";
import { useSession } from "@/atoms/auth";
import { LoginToast } from "./LoginToast";
import { savePomodoroSession } from "@/lib/session";

interface PomoTimerProps {
  workDuration?: number;
  breakDuration?: number;
  className?: string;
  onTimerUpdate?: (state: TimerState) => void;
}

// 获取计时模式对应的图标
const getTimerIcon = (timerType: TimerType) => {
  const iconClass = "h-5 w-5 text-muted-foreground";
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
  const { data: session } = useSession();
  const [showLoginToast, setShowLoginToast] = useState(false);

  const { state, toggleTimer, resetTimer } = usePomoTimer({
    workDuration,
    breakDuration,
    onStateChange: onTimerUpdate,
    onSessionComplete: (sessionData, completed) => {
      if (session?.user) {
        savePomodoroSession(sessionData, completed);
      } else if (completed) {
        setShowLoginToast(true);
      }
    },
  });

  const config = timerTypeConfig[state.timerType];

  return (
    <div className={cn("w-full max-w-md mx-auto p-4", className)}>
      {/* 头部：计时器类型标识 */}
      <div className="flex items-center gap-2 mb-2">
        {getTimerIcon(state.timerType)}
        <span className="text-sm font-medium text-foreground">
          {getTimerTitle(state.timerType)}
        </span>
        <span className="text-muted-foreground/40">·</span>
        <span className="text-sm text-muted-foreground">
          {config.description}
        </span>
      </div>

      {/* 计时器区域 */}
      <TimerRenderer
        state={state}
        onToggle={toggleTimer}
        onReset={resetTimer}
        variant="default"
        showModeSwitch={true}
      />

      {showLoginToast && (
        <LoginToast onClose={() => setShowLoginToast(false)} />
      )}
    </div>
  );
}

export type { TimerMode };
