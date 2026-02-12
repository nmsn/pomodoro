"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Coffee, Brain, Timer, Hourglass, Watch, Tv, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePomodoroTimer, TimerMode, TimerState } from "@/hooks/usePomodoroTimer";
import { TimerRenderer } from "./TimerRenderer";
import { timerTypeConfig, TimerType } from "@/atoms/timer";

interface PomodoroTimerProps {
  workDuration?: number;
  breakDuration?: number;
  className?: string;
  onTimerUpdate?: (state: TimerState) => void;
}

// 获取计时模式对应的图标
const getTimerIcon = (timerType: TimerType) => {
  switch (timerType) {
    case "pomodoro":
      return <Timer className="h-5 w-5" />;
    case "countdown":
      return <Hourglass className="h-5 w-5" />;
    case "stopwatch":
      return <Watch className="h-5 w-5" />;
    case "animedoro":
      return <Tv className="h-5 w-5" />;
    case "52-17":
      return <Calendar className="h-5 w-5" />;
    default:
      return <Timer className="h-5 w-5" />;
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
  const { state, toggleTimer, resetTimer, switchMode } = usePomodoroTimer({
    workDuration,
    breakDuration,
    onStateChange: onTimerUpdate,
  });

  const config = timerTypeConfig[state.timerType];
  const showModeSwitch = config.breakDuration > 0;

  return (
    <Card className={cn("w-full max-w-md mx-auto", className)}>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getTimerIcon(state.timerType)}
            <CardTitle className="text-2xl font-semibold tracking-tight">
              {getTimerTitle(state.timerType)}
            </CardTitle>
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
        <CardDescription>
          {config.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        <TimerRenderer
          state={state}
          onToggle={toggleTimer}
          onReset={resetTimer}
          variant="default"
          showModeSwitch={false}
        />
      </CardContent>
    </Card>
  );
}

export type { TimerMode };
