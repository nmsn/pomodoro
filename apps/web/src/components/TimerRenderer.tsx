"use client";

import { useAtomValue } from "jotai";
import { Play, Pause, RotateCcw, X, Brain, Coffee } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TimerState, TimerMode } from "@/hooks/usePomoTimer";
import { isDarkBackgroundAtom } from "@/atoms/background";

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
  const isDark = useAtomValue(isDarkBackgroundAtom);
  const isMini = variant === "mini";
  const { mode, timeString, progress, isActive, statusText } = state;

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
          className="absolute top-2 right-2 h-8 w-8 rounded-2xl cursor-pointer hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      {/* 模式切换（仅 default 模式显示） */}
      {showModeSwitch && onSwitchMode && !isMini && (
        <div className="flex items-center justify-between w-full max-w-md mb-8">
          <h2 className={cn(
            "text-2xl font-semibold tracking-tight",
            isDark && "text-white"
          )}>番茄钟</h2>
          <div className="flex gap-2">
            <Button
              variant={mode === "work" ? "default" : "outline"}
              size="icon"
              onClick={() => onSwitchMode("work")}
              aria-label="切换到专注模式"
              className="h-10 w-10 rounded-2xl cursor-pointer hover:scale-105 transition-transform"
              title="专注模式"
            >
              <Brain className="h-5 w-5" />
            </Button>
            <Button
              variant={mode === "break" ? "secondary" : "outline"}
              size="icon"
              onClick={() => onSwitchMode("break")}
              aria-label="切换到休息模式"
              className="h-10 w-10 rounded-2xl cursor-pointer hover:scale-105 transition-transform"
              title="休息模式"
            >
              <Coffee className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      {/* 时间显示 */}
      <div
        className={cn(
          "font-mono font-bold tracking-tighter tabular-nums text-center leading-none",
          isMini ? "text-6xl" : "text-[8rem] sm:text-[10rem] lg:text-[12rem]",
          isDark ? "text-white" : "text-foreground"
        )}
      >
        {timeString}
      </div>

      {/* 状态文本 */}
      <p
        className={cn(
          "text-center mt-4",
          isMini ? "text-xs mt-3" : "text-base mt-6",
          isDark ? "text-white/70" : "text-muted-foreground"
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
      <div className={cn("w-full mt-6", isMini ? "max-w-[200px]" : "max-w-[320px]")}>
        <div className={cn(
          "h-2.5 rounded-full overflow-hidden",
          isDark ? "bg-white/20" : "bg-primary/20"
        )}>
          <div
            className={cn(
              "h-full transition-all duration-1000 rounded-full",
              mode === "work" ? "bg-red-500" : "bg-green-500"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 控制按钮 */}
      <div
        className={cn(
          "flex items-center justify-center gap-4",
          isMini ? "mt-6" : "mt-10"
        )}
      >
        <Button
          variant="outline"
          size="icon"
          onClick={onReset}
          aria-label="重置计时器"
          className={cn(
            "rounded-full transition-all duration-200 cursor-pointer",
            "hover:shadow-lg hover:scale-105 active:scale-95",
            isMini ? "h-16 w-16" : "h-16 w-16",
            isDark && "bg-white/10 border-white/20 text-white hover:bg-white/20"
          )}
        >
          <RotateCcw className={cn(isMini ? "h-6 w-6" : "h-6 w-6")} />
        </Button>

        <Button
          size="icon"
          onClick={onToggle}
          aria-label={isActive ? "暂停" : "开始"}
          className={cn(
            "rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 cursor-pointer",
            "hover:scale-105 active:scale-95",
            isMini ? "h-16 w-16" : "h-16 w-16",
            isActive && "bg-destructive hover:bg-destructive/90"
          )}
        >
          {isActive ? (
            <Pause className={cn(isMini ? "h-7 w-7" : "h-7 w-7")} />
          ) : (
            <Play
              className={cn(
                isMini ? "h-7 w-7 ml-0.5" : "h-7 w-7 ml-0.5"
              )}
            />
          )}
        </Button>
      </div>
    </div>
  );
}
