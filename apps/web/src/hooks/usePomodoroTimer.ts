"use client";

import { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  timerStateAtom,
  workDurationAtom,
  breakDurationAtom,
  toggleTimerAtom,
  resetTimerAtom,
  switchModeAtom,
  TimerMode,
  TimerState,
  TimerType,
} from "@/atoms/timer";

export type { TimerMode, TimerState, TimerType };

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

  const state = useAtomValue(timerStateAtom);
  const setWorkDuration = useSetAtom(workDurationAtom);
  const setBreakDuration = useSetAtom(breakDurationAtom);

  const toggleTimer = useSetAtom(toggleTimerAtom);
  const resetTimer = useSetAtom(resetTimerAtom);
  const switchMode = useSetAtom(switchModeAtom);

  // 初始化时长设置
  useEffect(() => {
    setWorkDuration(workDuration);
    setBreakDuration(breakDuration);
  }, [workDuration, breakDuration, setWorkDuration, setBreakDuration]);

  // 通知外部状态变化
  useEffect(() => {
    onStateChange?.(state);
  }, [state, onStateChange]);

  return {
    state,
    toggleTimer,
    resetTimer,
    switchMode,
  };
}
