import { atom } from "jotai";

export type TimerType = "pomodoro" | "countdown" | "stopwatch" | "animedoro" | "52-17";
export type TimerMode = "work" | "break";

export interface TimerState {
  mode: TimerMode;
  timeLeft: number;
  isActive: boolean;
  progress: number;
  timeString: string;
  modeLabel: string;
  statusText: string;
  timerType: TimerType;
  elapsedTime: number; // 用于正计时
}

// 计时模式配置
export const timerTypeConfig: Record<TimerType, {
  name: string;
  description: string;
  workDuration: number;
  breakDuration: number;
  showDurations: boolean;
  isCountdown: boolean;
  isStopwatch: boolean;
}> = {
  pomodoro: {
    name: "番茄钟",
    description: "经典番茄工作法：专注与休息交替",
    workDuration: 25,
    breakDuration: 5,
    showDurations: true,
    isCountdown: true,
    isStopwatch: false,
  },
  countdown: {
    name: "倒计时",
    description: "自定义倒计时",
    workDuration: 30,
    breakDuration: 0,
    showDurations: true,
    isCountdown: true,
    isStopwatch: false,
  },
  stopwatch: {
    name: "码表",
    description: "从 0 开始正计时",
    workDuration: 0,
    breakDuration: 0,
    showDurations: false,
    isCountdown: false,
    isStopwatch: true,
  },
  animedoro: {
    name: "Animedoro",
    description: "看番剧/视频作为奖励的番茄变体",
    workDuration: 40,
    breakDuration: 20,
    showDurations: true,
    isCountdown: true,
    isStopwatch: false,
  },
  "52-17": {
    name: "52/17",
    description: "工作 52 分钟，休息 17 分钟",
    workDuration: 52,
    breakDuration: 17,
    showDurations: true,
    isCountdown: true,
    isStopwatch: false,
  },
};

// 基础状态 atoms
export const timerTypeAtom = atom<TimerType>("pomodoro");
export const timerModeAtom = atom<TimerMode>("work");
export const timeLeftAtom = atom<number>(25 * 60);
export const isActiveAtom = atom<boolean>(false);
export const workDurationAtom = atom<number>(25);
export const breakDurationAtom = atom<number>(5);
export const elapsedTimeAtom = atom<number>(0); // 正计时已用时间

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
  const timerType = get(timerTypeAtom);
  const mode = get(timerModeAtom);
  const timeLeft = get(timeLeftAtom);
  const isActive = get(isActiveAtom);
  const workDuration = get(workDurationAtom);
  const breakDuration = get(breakDurationAtom);
  const elapsedTime = get(elapsedTimeAtom);

  const config = timerTypeConfig[timerType];
  
  let currentDuration: number;
  let displayTime: number;
  let progress: number;
  
  if (config.isStopwatch) {
    // 正计时模式
    currentDuration = 0;
    displayTime = elapsedTime;
    progress = 0;
  } else {
    // 倒计时模式
    currentDuration = mode === "work" ? workDuration : breakDuration;
    displayTime = timeLeft;
    progress = currentDuration > 0 ? (timeLeft / (currentDuration * 60)) * 100 : 0;
  }
  
  const timeString = formatTime(displayTime);
  
  let modeLabel: string;
  let statusText: string;
  
  if (config.isStopwatch) {
    modeLabel = "码表模式";
    statusText = isActive ? "计时中..." : "准备开始";
  } else if (timerType === "countdown") {
    modeLabel = "倒计时";
    statusText = isActive ? "倒计时中..." : "准备开始";
  } else {
    modeLabel = mode === "work" ? "专注模式" : "休息模式";
    statusText = isActive
      ? mode === "work"
        ? "保持专注，高效工作"
        : "放松一下，充电恢复"
      : "准备开始";
  }

  return {
    mode,
    timeLeft: displayTime,
    isActive,
    progress,
    timeString,
    modeLabel,
    statusText,
    timerType,
    elapsedTime,
  };
});

// 切换计时器状态
export const toggleTimerAtom = atom(null, (get, set) => {
  set(isActiveAtom, !get(isActiveAtom));
});

// 重置计时器
export const resetTimerAtom = atom(null, (get, set) => {
  const mode = get(timerModeAtom);
  const workDuration = get(workDurationAtom);
  const breakDuration = get(breakDurationAtom);
  const timerType = get(timerTypeAtom);
  const config = timerTypeConfig[timerType];
  
  set(isActiveAtom, false);
  set(elapsedTimeAtom, 0);
  
  if (!config.isStopwatch) {
    set(timeLeftAtom, (mode === "work" ? workDuration : breakDuration) * 60);
  }
});

// 切换专注/休息模式
export const switchModeAtom = atom(null, (get, set, mode: TimerMode) => {
  const workDuration = get(workDurationAtom);
  const breakDuration = get(breakDurationAtom);
  set(timerModeAtom, mode);
  set(isActiveAtom, false);
  set(elapsedTimeAtom, 0);
  set(timeLeftAtom, (mode === "work" ? workDuration : breakDuration) * 60);
});

// 切换计时类型
export const switchTimerTypeAtom = atom(null, (get, set, type: TimerType) => {
  const config = timerTypeConfig[type];
  set(timerTypeAtom, type);
  set(timerModeAtom, "work");
  set(isActiveAtom, false);
  set(elapsedTimeAtom, 0);
  set(workDurationAtom, config.workDuration);
  set(breakDurationAtom, config.breakDuration);
  
  if (config.isStopwatch) {
    set(timeLeftAtom, 0);
  } else {
    set(timeLeftAtom, config.workDuration * 60);
  }
});

// 更新时长
export const updateDurationAtom = atom(
  null,
  (get, set, { type, duration }: { type: "work" | "break"; duration: number }) => {
    if (type === "work") {
      set(workDurationAtom, duration);
    } else {
      set(breakDurationAtom, duration);
    }
    
    // 如果当前在对应模式且未运行，更新时间
    const currentMode = get(timerModeAtom);
    const isActive = get(isActiveAtom);
    
    if (!isActive && currentMode === type) {
      set(timeLeftAtom, duration * 60);
    }
  }
);
