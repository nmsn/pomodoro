"use client";

import { useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw, Coffee, Brain } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

type TimerMode = "work" | "break";

interface PomodoroTimerProps {
  workDuration?: number;
  breakDuration?: number;
  className?: string;
}

export function PomodoroTimer({
  workDuration = 25,
  breakDuration = 5,
  className,
}: PomodoroTimerProps) {
  const [mode, setMode] = useState<TimerMode>("work");
  const [timeLeft, setTimeLeft] = useState(workDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(100);

  const currentDuration = mode === "work" ? workDuration : breakDuration;

  useEffect(() => {
    setProgress((timeLeft / (currentDuration * 60)) * 100);
  }, [timeLeft, currentDuration]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = useCallback(() => {
    setIsActive((prev) => !prev);
  }, []);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTimeLeft(currentDuration * 60);
  }, [currentDuration]);

  const switchMode = useCallback(
    (newMode: TimerMode) => {
      setMode(newMode);
      setIsActive(false);
      setTimeLeft(
        (newMode === "work" ? workDuration : breakDuration) * 60
      );
    },
    [workDuration, breakDuration]
  );

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <Card className={cn("w-full max-w-md mx-auto", className)}>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            番茄钟
          </CardTitle>
          <div className="flex gap-2">
            <Badge
              variant={mode === "work" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => switchMode("work")}
            >
              <Brain className="mr-1 h-3 w-3" />
              专注
            </Badge>
            <Badge
              variant={mode === "break" ? "secondary" : "outline"}
              className="cursor-pointer"
              onClick={() => switchMode("break")}
            >
              <Coffee className="mr-1 h-3 w-3" />
              休息
            </Badge>
          </div>
        </div>
        <CardDescription>
          {mode === "work" ? "保持专注，高效完成任务" : "适当休息，恢复精力"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Timer Display */}
        <div className="flex flex-col items-center justify-center py-4">
          <div className="text-8xl font-bold tracking-tighter tabular-nums text-foreground">
            {formatTime(timeLeft)}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            {isActive ? (
              <span className="inline-flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                进行中
              </span>
            ) : (
              "已暂停"
            )}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0:00</span>
            <span>{currentDuration}:00</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={resetTimer}
            className="h-10 w-10 rounded-full"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            onClick={toggleTimer}
            className={cn(
              "h-16 w-16 rounded-full shadow-lg hover:shadow-xl transition-shadow",
              isActive && "bg-destructive hover:bg-destructive/90"
            )}
          >
            {isActive ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-0.5" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
