"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface DocumentPictureInPictureOptions {
  width?: number;
  height?: number;
}

interface UseDocumentPiPReturn {
  isSupported: boolean;
  isOpen: boolean;
  pipWindow: Window | null;
  openPiP: () => Promise<Window | null>;
  closePiP: () => void;
  togglePiP: () => Promise<void>;
}

export function useDocumentPiP(
  options: DocumentPictureInPictureOptions = {}
): UseDocumentPiPReturn {
  const { width = 320, height = 280 } = options;

  const [isOpen, setIsOpen] = useState(false);
  const [pipWindow, setPipWindow] = useState<Window | null>(null);
  const pipWindowRef = useRef<Window | null>(null);

  // 检查浏览器是否支持
  const isSupported =
    typeof window !== "undefined" &&
    "documentPictureInPicture" in window;

  const openPiP = useCallback(async (): Promise<Window | null> => {
    if (!isSupported) {
      console.error("当前浏览器不支持 Document Picture-in-Picture API");
      return null;
    }

    // 如果已经打开，直接返回
    if (pipWindowRef.current) {
      return pipWindowRef.current;
    }

    try {
      // @ts-expect-error - documentPictureInPicture API 类型定义可能不存在
      const newPipWindow = await window.documentPictureInPicture.requestWindow({
        width,
        height,
      });

      // 复制样式到 PiP 窗口
      const styles = document.querySelectorAll(
        'style[data-emotion], style[data-styled], link[rel="stylesheet"]'
      );
      styles.forEach((style) => {
        newPipWindow.document.head.appendChild(style.cloneNode(true));
      });

      // 复制 Tailwind 样式
      const tailwindStyles = document.querySelector('style[data-tailwind]');
      if (tailwindStyles) {
        newPipWindow.document.head.appendChild(tailwindStyles.cloneNode(true));
      }

      // 设置窗口关闭事件
      newPipWindow.addEventListener("pagehide", () => {
        pipWindowRef.current = null;
        setPipWindow(null);
        setIsOpen(false);
      });

      pipWindowRef.current = newPipWindow;
      setPipWindow(newPipWindow);
      setIsOpen(true);

      return newPipWindow;
    } catch (error) {
      console.error("打开 PiP 窗口失败:", error);
      return null;
    }
  }, [isSupported, width, height]);

  const closePiP = useCallback(() => {
    if (pipWindowRef.current) {
      pipWindowRef.current.close();
      pipWindowRef.current = null;
      setPipWindow(null);
      setIsOpen(false);
    }
  }, []);

  const togglePiP = useCallback(async () => {
    if (isOpen) {
      closePiP();
    } else {
      await openPiP();
    }
  }, [isOpen, openPiP, closePiP]);

  // 清理
  useEffect(() => {
    return () => {
      closePiP();
    };
  }, [closePiP]);

  return {
    isSupported,
    isOpen,
    pipWindow,
    openPiP,
    closePiP,
    togglePiP,
  };
}
