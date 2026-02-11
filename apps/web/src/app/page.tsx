"use client";

import { useCallback, useEffect, useRef } from "react";
import { PictureInPicture2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { DrawerScrollableContent } from "@/components/ConfigDrawer";
import { useDocumentPiP } from "@/hooks/useDocumentPiP";
import { PiPTimerContainer } from "@/components/PipTimerContainer";
import { TimerMode, TimerState } from "@/hooks/usePomodoroTimer";

export default function Home() {
  const { isSupported, isOpen, pipWindow, openPiP, closePiP, togglePiP } =
    useDocumentPiP({
      width: 320,
      height: 280,
    });

  // 用于存储 timer 的最新状态
  const timerStateRef = useRef<TimerState>({
    mode: "work",
    timeLeft: 25 * 60,
    isActive: false,
    progress: 100,
    timeString: "25:00",
    modeLabel: "专注模式",
    statusText: "准备开始",
  });

  // 处理番茄钟状态更新
  const handleTimerUpdate = useCallback(
    (state: TimerState) => {
      timerStateRef.current = state;
    },
    []
  );

  // 处理 PiP 窗口中的操作
  const handlePiPToggle = useCallback(() => {
    // 通过自定义事件通知主窗口的 PomodoroTimer
    window.dispatchEvent(new CustomEvent("PIP_TOGGLE_TIMER"));
  }, []);

  const handlePiPReset = useCallback(() => {
    window.dispatchEvent(new CustomEvent("PIP_RESET_TIMER"));
  }, []);



  // 监听 PiP 按钮点击
  const handlePiPButtonClick = useCallback(async () => {
    if (!isOpen) {
      await openPiP();
    } else {
      closePiP();
    }
  }, [isOpen, openPiP, closePiP]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4 relative">
      {/* 当 PiP 窗口打开时隐藏主页面的番茄钟 */}
      {!isOpen && (
        <PomodoroTimer
          workDuration={25}
          breakDuration={5}
          className="shadow-2xl"
          onTimerUpdate={handleTimerUpdate}
        />
      )}

      {/* 设置按钮 - 右下角 */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        {/* PiP 模式按钮 */}
        {isSupported && (
          <Button
            variant="outline"
            size="icon"
            onClick={handlePiPButtonClick}
            className="h-12 w-12 rounded-full shadow-lg bg-background/80 backdrop-blur-sm"
            title={isOpen ? "关闭画中画" : "画中画模式"}
          >
            <PictureInPicture2
              className={`h-5 w-5 ${isOpen ? "text-primary" : ""}`}
            />
          </Button>
        )}

        {/* 设置按钮 */}
        <DrawerScrollableContent />
      </div>

      {/* PiP 窗口内容 */}
      {isOpen && pipWindow && (
        <PiPTimerContainer
          pipWindow={pipWindow}
          timerState={timerStateRef.current}
          onToggle={handlePiPToggle}
          onReset={handlePiPReset}
        />
      )}
    </main>
  );
}
