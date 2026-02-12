"use client";

import { useCallback, useState, useEffect } from "react";
import { PictureInPicture2, Maximize, Minimize } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { DrawerScrollableContent } from "@/components/ConfigDrawer";
import { useDocumentPiP } from "@/hooks/useDocumentPiP";
import { PiPTimerContainer } from "@/components/PipTimerContainer";
import { DynamicBackground } from "@/components/DynamicBackground";

export default function Home() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { isSupported, isOpen, pipWindow, openPiP, closePiP } = useDocumentPiP(
    {
      width: 320,
      height: 280,
    }
  );

  const handlePiPButtonClick = useCallback(async () => {
    if (!isOpen) {
      await openPiP();
    } else {
      closePiP();
    }
  }, [isOpen, openPiP, closePiP]);

  const handleFullscreenClick = useCallback(async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <DynamicBackground>
      <main className="min-h-screen flex items-center justify-center p-4 relative">
        {/* 当 PiP 窗口打开时隐藏主页面的番茄钟 */}
        {!isOpen && (
          <PomodoroTimer
            workDuration={25}
            breakDuration={5}
          // className="shadow-2xl"
          />
        )}

        {/* 设置按钮 - 右下角横向排列 */}
        <div className="fixed bottom-6 right-6 flex flex-row gap-2">
          {/* PiP 模式按钮 */}
          {isSupported && (
            <Button
              variant="outline"
              size="icon"
              onClick={handlePiPButtonClick}
              className="h-10 w-10 rounded-full shadow-lg bg-background/80 backdrop-blur-sm"
              title={isOpen ? "关闭画中画" : "画中画模式"}
            >
              <PictureInPicture2
                className={`h-4 w-4 ${isOpen ? "text-primary" : ""}`}
              />
            </Button>
          )}

          {/* 全屏按钮 */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleFullscreenClick}
            className="h-10 w-10 rounded-full shadow-lg bg-background/80 backdrop-blur-sm"
            title={isFullscreen ? "退出全屏" : "全屏模式"}
          >
            {isFullscreen ? (
              <Minimize className="h-4 w-4" />
            ) : (
              <Maximize className="h-4 w-4" />
            )}
          </Button>

          {/* 设置按钮 */}
          <DrawerScrollableContent />
        </div>

        {/* PiP 窗口内容 - 直接使用 jotai atoms，自动同步状态 */}
        {isOpen && pipWindow && <PiPTimerContainer pipWindow={pipWindow} />}
      </main>
    </DynamicBackground>
  );
}
