"use client";

import { useEffect, useRef } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  timerStateAtom,
  workDurationAtom,
  breakDurationAtom,
  toggleTimerAtom,
  resetTimerAtom,
  switchModeAtom,
  isActiveAtom,
  timeLeftAtom,
  currentSessionAtom,
  isModeSwitchingAtom,
  TimerMode,
  TimerState,
  TimerType,
} from "@/atoms/timer";

export type { TimerMode, TimerState, TimerType };

export interface UsePomoTimerOptions {
  workDuration?: number;
  breakDuration?: number;
  onStateChange?: (state: TimerState) => void;
  /** Callback when timer stops - component handles auth check and recording */
  onSessionComplete?: (session: { timerType: TimerType; mode: TimerMode; startTime: number }, completed: boolean) => void;
}

export interface UsePomoTimerReturn {
  state: TimerState;
  toggleTimer: () => void;
  resetTimer: () => void;
  switchMode: (mode: TimerMode) => void;
}

export function usePomoTimer(
  options: UsePomoTimerOptions = {}
): UsePomoTimerReturn {
  const { workDuration = 25, breakDuration = 5, onStateChange, onSessionComplete } = options;

  const state = useAtomValue(timerStateAtom);
  const setWorkDuration = useSetAtom(workDurationAtom);
  const setBreakDuration = useSetAtom(breakDurationAtom);

  const toggleTimer = useSetAtom(toggleTimerAtom);
  const resetTimer = useSetAtom(resetTimerAtom);
  const switchMode = useSetAtom(switchModeAtom);

  const isActive = useAtomValue(isActiveAtom);
  const timeLeft = useAtomValue(timeLeftAtom);
  const currentSession = useAtomValue(currentSessionAtom);
  const isModeSwitching = useAtomValue(isModeSwitchingAtom);

  // 初始化时长设置
  useEffect(() => {
    setWorkDuration(workDuration);
    setBreakDuration(breakDuration);
  }, [workDuration, breakDuration, setWorkDuration, setBreakDuration]);

  // 通知外部状态变化
  useEffect(() => {
    onStateChange?.(state);
  }, [state, onStateChange]);

  // Session recording effect
  const prevActiveRef = useRef(false);

  useEffect(() => {
    if (prevActiveRef.current && !isActive) {
      // Timer stopped - check if it's a mode switch
      if (isModeSwitching) {
        // Mode switch in progress, don't record yet
        prevActiveRef.current = isActive;
        return;
      }
      // Real stop - notify component to handle auth check and recording
      if (currentSession && onSessionComplete) {
        const completed = timeLeft === 0;
        onSessionComplete(currentSession, completed);
      }
    }
    prevActiveRef.current = isActive;
  }, [isActive, isModeSwitching, currentSession, timeLeft, onSessionComplete]);

  return {
    state,
    toggleTimer,
    resetTimer,
    switchMode,
  };
}
