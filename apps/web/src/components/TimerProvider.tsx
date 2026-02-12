"use client";

import { useEffect } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  isActiveAtom,
  timeLeftAtom,
  timerModeAtom,
  workDurationAtom,
  breakDurationAtom,
} from "@/atoms/timer";

export function TimerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isActive, setIsActive] = useAtom(isActiveAtom);
  const [timeLeft, setTimeLeft] = useAtom(timeLeftAtom);
  const mode = useAtomValue(timerModeAtom);
  const workDuration = useAtomValue(workDurationAtom);
  const breakDuration = useAtomValue(breakDurationAtom);

  // 初始化时间
  useEffect(() => {
    setTimeLeft(workDuration * 60);
  }, []);

  // 全局计时器逻辑 - 始终运行
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
  }, [isActive, timeLeft, setTimeLeft, setIsActive]);

  return <>{children}</>;
}
