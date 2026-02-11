"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export type TimerMode = "work" | "break";

export interface TimerState {
  mode: TimerMode;
  timeLeft: number;
  isActive: boolean;
  progress: number;
  timeString: string;
  modeLabel: string;
  statusText: string;
}

export interface UsePomodoroTimerOptions {
  workDuration?: number;
  breakDuration?: number;
  onStateChange?: (state: TimerState) => void;
}

export interface UsePomodoroTimerReturn {
  state: TimerState;
  toggleTimer: () => void;
  resetTimer: () => void;
  switchMode: (mode: TimerMode) => void;
}

export function usePomodoroTimer(
  options: UsePomodoroTimerOptions = {}
): UsePomodoroTimerReturn {
  const { workDuration = 25, breakDuration = 5, onStateChange } = options;

  const [mode, setMode] = useState<TimerMode>("work");
  const [timeLeft, setTimeLeft] = useState(workDuration * 60);
  const [isActive, setIsActive] = useState(false);

  const currentDuration = mode === "work" ? workDuration : breakDuration;

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }, []);

  const progress = (timeLeft / (currentDuration * 60)) * 100;
  const timeString = formatTime(timeLeft);
  const modeLabel = mode === "work" ? "专注模式" : "休息模式";
  const statusText = isActive
    ? mode === "work"
      ? "保持专注，高效工作"
      : "放松一下，充电恢复"
    : "准备开始";

  const state: TimerState = {
    mode,
    timeLeft,
    isActive,
    progress,
    timeString,
    modeLabel,
    statusText,
  };

  // 通知外部状态变化
  useEffect(() => {
    onStateChange?.(state);
  }, [state, onStateChange]);

  // 计时器逻辑
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
      setTimeLeft((newMode === "work" ? workDuration : breakDuration) * 60);
    },
    [workDuration, breakDuration]
  );

  return {
    state,
    toggleTimer,
    resetTimer,
    switchMode,
  };
}
