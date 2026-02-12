"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Coffee, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePomodoroTimer, TimerMode, TimerState } from "@/hooks/usePomodoroTimer";
import { TimerRenderer } from "./TimerRenderer";

interface PomodoroTimerProps {
  workDuration?: number;
  breakDuration?: number;
  className?: string;
  onTimerUpdate?: (state: TimerState) => void;
}

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

  return (
    <Card className={cn("w-full max-w-md mx-auto", className)}>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            番茄钟
          </CardTitle>
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
        </div>
        <CardDescription>
          {state.mode === "work"
            ? "保持专注，高效完成任务"
            : "适当休息，恢复精力"}
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
