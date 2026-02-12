import { atom } from "jotai";

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

// 基础状态 atoms
export const timerModeAtom = atom<TimerMode>("work");
export const timeLeftAtom = atom<number>(25 * 60);
export const isActiveAtom = atom<boolean>(false);
export const workDurationAtom = atom<number>(25);
export const breakDurationAtom = atom<number>(5);

// 格式化时间
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

// 派生状态 atom
export const timerStateAtom = atom<TimerState>((get) => {
  const mode = get(timerModeAtom);
  const timeLeft = get(timeLeftAtom);
  const isActive = get(isActiveAtom);
  const workDuration = get(workDurationAtom);
  const breakDuration = get(breakDurationAtom);

  const currentDuration = mode === "work" ? workDuration : breakDuration;
  const progress = (timeLeft / (currentDuration * 60)) * 100;
  const timeString = formatTime(timeLeft);
  const modeLabel = mode === "work" ? "专注模式" : "休息模式";
  const statusText = isActive
    ? mode === "work"
      ? "保持专注，高效工作"
      : "放松一下，充电恢复"
    : "准备开始";

  return {
    mode,
    timeLeft,
    isActive,
    progress,
    timeString,
    modeLabel,
    statusText,
  };
});

// 操作 atoms
export const toggleTimerAtom = atom(null, (get, set) => {
  set(isActiveAtom, !get(isActiveAtom));
});

export const resetTimerAtom = atom(null, (get, set) => {
  const mode = get(timerModeAtom);
  const workDuration = get(workDurationAtom);
  const breakDuration = get(breakDurationAtom);
  set(isActiveAtom, false);
  set(timeLeftAtom, (mode === "work" ? workDuration : breakDuration) * 60);
});

export const switchModeAtom = atom(null, (get, set, mode: TimerMode) => {
  const workDuration = get(workDurationAtom);
  const breakDuration = get(breakDurationAtom);
  set(timerModeAtom, mode);
  set(isActiveAtom, false);
  set(timeLeftAtom, (mode === "work" ? workDuration : breakDuration) * 60);
});
