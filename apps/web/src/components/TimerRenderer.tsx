"use client";

import { useAtomValue } from "jotai";
import { Play, Pause, RotateCcw, X, Brain, Coffee } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TimerState, TimerMode } from "@/hooks/usePomoTimer";
import { isActiveAtom } from "@/atoms/timer";
import { useConfirmAction } from "@/hooks/useConfirmAction";

export type TimerVariant = "default" | "mini";

export interface TimerRendererProps {
  state: TimerState;
  onToggle: () => void;
  onReset: () => void;
  onSwitchMode?: (mode: TimerMode) => void;
  onClose?: () => void;
  variant?: TimerVariant;
  showModeSwitch?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

export function TimerRenderer({
  state,
  onToggle,
  onReset,
  onSwitchMode,
  onClose,
  variant = "default",
  showModeSwitch = true,
  showCloseButton = false,
  className,
}: TimerRendererProps) {
  const isActiveState = useAtomValue(isActiveAtom);
  const isMini = variant === "mini";
  const { mode, timeString, progress, isActive, statusText } = state;

  const { confirm: confirmReset, Dialog: ResetDialog } = useConfirmAction({
    title: "重置计时器",
    message: "当前计时进度将丢失，确认要重置吗？",
    confirmText: "重置",
  });

  const { confirm: confirmSwitch, Dialog: SwitchDialog } = useConfirmAction({
    title: "切换模式",
    message:
      mode === "work"
        ? "专注计时进行中，切换将中断当前计时，确认吗？"
        : "休息时间进行中，切换将中断当前计时，确认吗？",
    confirmText: "切换",
  });

  return (
    <div
      className={cn(
        "relative flex flex-col items-center",
        isMini
          ? "w-full max-w-[280px] p-6"
          : "w-full max-w-2xl mx-auto px-4 py-8",
        className
      )}
    >
      {/* 关闭按钮 */}
      {showCloseButton && onClose && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="关闭"
          className="absolute top-2 right-2 h-8 w-8 rounded-lg cursor-pointer hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      {/* 模式切换（仅 default 模式显示） */}
      {showModeSwitch && onSwitchMode && !isMini && (
        <div className="flex items-center justify-between w-full max-w-md mb-6">
          <h2 className="text-lg font-medium tracking-tight text-foreground">
            {state.timerType === "pomodoro" ? "番茄钟" :
             state.timerType === "countdown" ? "倒计时" :
             state.timerType === "stopwatch" ? "码表" :
             state.timerType === "animedoro" ? "Animedoro" : "52/17"}
          </h2>
          <div className="flex gap-1.5 p-1 rounded-xl bg-muted/60 backdrop-blur-sm">
            <button
              onClick={() => confirmSwitch(() => onSwitchMode?.("work"), isActiveState)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer",
                mode === "work"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Brain className="h-3.5 w-3.5" />
              专注
            </button>
            <button
              onClick={() => confirmSwitch(() => onSwitchMode?.("break"), isActiveState)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer",
                mode === "break"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Coffee className="h-3.5 w-3.5" />
              休息
            </button>
          </div>
        </div>
      )}

      {/* 时间显示 */}
      <div
        className={cn(
          "font-medium tracking-wide tabular-nums text-center leading-none text-foreground",
          isMini ? "text-5xl" : "text-[6rem] sm:text-[7rem] lg:text-[8rem]"
        )}
      >
        {timeString}
      </div>

      {/* 状态文本 */}
      <p
        className={cn(
          "text-center text-muted-foreground mt-3",
          isMini ? "text-xs mt-2" : "text-sm mt-4"
        )}
      >
        {isActive ? (
          <span className="inline-flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            {isMini ? "进行中" : statusText}
          </span>
        ) : (
          isMini ? "已暂停" : statusText
        )}
      </p>

      {/* 进度条 */}
      <div className={cn("w-full mt-4", isMini ? "max-w-[200px]" : "max-w-[280px]")}>
        <div className={cn(
          "h-1.5 rounded-full overflow-hidden bg-muted/40"
        )}>
          <div
            className={cn(
              "h-full rounded-full transition-all duration-1000",
              mode === "work"
                ? "bg-gradient-to-r from-rose-500 to-orange-400"
                : "bg-gradient-to-r from-emerald-500 to-teal-400"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 控制按钮 */}
      <div
        className={cn(
          "flex items-center justify-center gap-4",
          isMini ? "mt-5" : "mt-8"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => confirmReset(onReset, isActiveState)}
          aria-label="重置计时器"
          className={cn(
            "h-10 w-10 rounded-full transition-all duration-200 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted",
            isMini ? "h-10 w-10" : "h-12 w-12"
          )}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>

        <Button
          size="icon"
          onClick={onToggle}
          aria-label={isActive ? "暂停" : "开始"}
          className={cn(
            "rounded-full shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer",
            "hover:scale-105 active:scale-95",
            isMini ? "h-14 w-14" : "h-16 w-16",
            isActive
              ? "bg-gradient-to-br from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 shadow-rose-500/30"
              : "bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-primary/30"
          )}
        >
          {isActive ? (
            <Pause className={cn(isMini ? "h-6 w-6" : "h-7 w-7")} />
          ) : (
            <Play className={cn(isMini ? "h-6 w-6" : "h-7 w-7", "ml-0.5")} />
          )}
        </Button>
      </div>

      <ResetDialog />
      <SwitchDialog />
    </div>
  );
}
