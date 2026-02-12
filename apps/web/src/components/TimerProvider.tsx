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
} from "@/atoms/timer";

export function TimerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isActive, setIsActive] = useAtom(isActiveAtom);
  const [timeLeft, setTimeLeft] = useAtom(timeLeftAtom);
  const [elapsedTime, setElapsedTime] = useAtom(elapsedTimeAtom);
  const mode = useAtomValue(timerModeAtom);
  const workDuration = useAtomValue(workDurationAtom);
  const breakDuration = useAtomValue(breakDurationAtom);
  const timerType = useAtomValue(timerTypeAtom);

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

    if (isActive) {
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
        setIsActive(false);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, elapsedTime, config.isStopwatch, setTimeLeft, setElapsedTime, setIsActive]);

  return <>{children}</>;
}
