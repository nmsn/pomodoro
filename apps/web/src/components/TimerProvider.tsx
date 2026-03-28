"use client";

import { useEffect } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  isActiveAtom,
  timeLeftAtom,
  timerModeAtom,
  workDurationAtom,
  breakDurationAtom,
  timerTypeAtom,
  elapsedTimeAtom,
  timerTypeConfig,
  switchModeAtom,
  TimerMode,
} from "@/atoms/timer";
import { useUserSettingsSync } from "@/hooks/useUserSettingsSync";

export function TimerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // 登录后从后端加载用户设置
  useUserSettingsSync()

  const [isActive, setIsActive] = useAtom(isActiveAtom);
  const [timeLeft, setTimeLeft] = useAtom(timeLeftAtom);
  const setElapsedTime = useSetAtom(elapsedTimeAtom);
  const mode = useAtomValue(timerModeAtom);
  const workDuration = useAtomValue(workDurationAtom);
  const breakDuration = useAtomValue(breakDurationAtom);
  const timerType = useAtomValue(timerTypeAtom);
  const setSwitchMode = useSetAtom(switchModeAtom);

  const config = timerTypeConfig[timerType];

  // 初始化时间
  useEffect(() => {
    if (config.isStopwatch) {
      setTimeLeft(0);
    } else {
      setTimeLeft(workDuration * 60);
    }
  }, []);

  // 全局计时器逻辑 - 始终运行
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (!isActive) return;

    if (config.isStopwatch) {
      // 正计时模式
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else if (timeLeft > 0) {
      // 倒计时模式
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // 时间到：切换到下一个模式（switchModeAtom 内部会停止计时）
      const nextMode: TimerMode = mode === "work" ? "break" : "work";
      setSwitchMode(nextMode);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, config.isStopwatch, setTimeLeft, setElapsedTime, mode, setSwitchMode]);

  return <>{children}</>;
}
