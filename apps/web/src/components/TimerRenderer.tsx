"use client";

import { Play, Pause, RotateCcw, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TimerState, TimerMode } from "@/hooks/usePomodoroTimer";

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
  const isMini = variant === "mini";
  const { mode, timeString, modeLabel, progress, isActive, statusText } = state;

  return (
    <div
      className={cn(
        "relative",
        isMini
          ? "w-full max-w-[280px] bg-card border rounded-xl shadow-lg p-6"
          : "w-full max-w-md mx-auto",
        className
      )}
    >
      {/* 关闭按钮 */}
      {showCloseButton && onClose && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-2 right-2 h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      {/* 模式切换（仅 default 模式显示） */}
      {showModeSwitch && onSwitchMode && !isMini && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold tracking-tight">番茄钟</h2>
          <div className="flex gap-2">
            <Button
              variant={mode === "work" ? "default" : "outline"}
              size="sm"
              onClick={() => onSwitchMode("work")}
              className="rounded-full"
            >
              专注
            </Button>
            <Button
              variant={mode === "break" ? "secondary" : "outline"}
              size="sm"
              onClick={() => onSwitchMode("break")}
              className="rounded-full"
            >
              休息
            </Button>
          </div>
        </div>
      )}

      {/* 模式标签 */}
      <div
        className={cn(
          "font-medium text-center",
          isMini ? "text-sm mb-2" : "text-base mb-4",
          mode === "work"
            ? "text-red-600 dark:text-red-400"
            : "text-green-600 dark:text-green-400"
        )}
      >
        {modeLabel}
      </div>

      {/* 时间显示 */}
      <div
        className={cn(
          "font-bold tracking-tighter tabular-nums text-foreground text-center",
          isMini ? "text-5xl" : "text-8xl"
        )}
      >
        {timeString}
      </div>

      {/* 状态文本 */}
      <p
        className={cn(
          "text-muted-foreground text-center mt-2",
          isMini ? "text-xs" : "text-sm"
        )}
      >
        {isActive ? (
          <span className="inline-flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            {isMini ? "进行中" : statusText}
          </span>
        ) : (
          isMini ? "已暂停" : statusText
        )}
      </p>

      {/* 进度条 */}
      <div className={cn("w-full mt-4", isMini ? "" : "max-w-[300px] mx-auto")}>
        <div className="h-2 bg-primary/20 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-1000",
              mode === "work" ? "bg-red-500" : "bg-green-500"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 控制按钮 */}
      <div
        className={cn(
          "flex items-center justify-center gap-3 mt-4",
          isMini ? "" : "mt-8"
        )}
      >
        <Button
          variant="outline"
          size="icon"
          onClick={onReset}
          className="h-10 w-10 rounded-full"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>

        <Button
          size="icon"
          onClick={onToggle}
          className={cn(
            "rounded-full shadow-lg hover:shadow-xl transition-shadow",
            isMini ? "h-16 w-16" : "h-20 w-20",
            isActive && "bg-destructive hover:bg-destructive/90"
          )}
        >
          {isActive ? (
            <Pause className={cn(isMini ? "h-6 w-6" : "h-8 w-8")} />
          ) : (
            <Play
              className={cn(
                isMini ? "h-6 w-6 ml-0.5" : "h-8 w-8 ml-1"
              )}
            />
          )}
        </Button>
      </div>
    </div>
  );
}
