"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAtomValue, useSetAtom } from "jotai";
import { TimerRenderer } from "./TimerRenderer";
import {
  timerStateAtom,
  toggleTimerAtom,
  resetTimerAtom,
} from "@/atoms/timer";
import { backgroundThemeAtom, backgroundThemes } from "@/atoms/background";

interface PiPTimerContainerProps {
  pipWindow: Window;
}

export function PiPTimerContainer({ pipWindow }: PiPTimerContainerProps) {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  // 直接使用 jotai atoms
  const timerState = useAtomValue(timerStateAtom);
  const toggleTimer = useSetAtom(toggleTimerAtom);
  const resetTimer = useSetAtom(resetTimerAtom);
  const currentTheme = useAtomValue(backgroundThemeAtom);

  useEffect(() => {
    if (!pipWindow) return;

    // 创建容器元素
    const div = pipWindow.document.createElement("div");
    div.id = "pip-root";
    pipWindow.document.body.appendChild(div);
    setContainer(div);

    // 复制主窗口的样式到 PiP 窗口
    const copyStyles = () => {
      // 复制所有 style 标签
      const styles = document.querySelectorAll("style");
      styles.forEach((style) => {
        const newStyle = pipWindow.document.createElement("style");
        newStyle.textContent = style.textContent;
        pipWindow.document.head.appendChild(newStyle);
      });

      // 复制 CSS 变量（主题色）
      const rootStyles = getComputedStyle(document.documentElement);
      const cssVariables = [
        "--background",
        "--foreground",
        "--card",
        "--card-foreground",
        "--popover",
        "--popover-foreground",
        "--primary",
        "--primary-foreground",
        "--secondary",
        "--secondary-foreground",
        "--muted",
        "--muted-foreground",
        "--accent",
        "--accent-foreground",
        "--destructive",
        "--destructive-foreground",
        "--border",
        "--input",
        "--ring",
        "--radius",
      ];

      cssVariables.forEach((variable) => {
        const value = rootStyles.getPropertyValue(variable);
        if (value) {
          pipWindow.document.documentElement.style.setProperty(variable, value);
        }
      });
    };

    copyStyles();

    // 设置基础样式
    pipWindow.document.body.style.margin = "0";
    pipWindow.document.body.style.padding = "0";
    pipWindow.document.body.style.minHeight = "100vh";
    pipWindow.document.body.style.color = "hsl(var(--foreground))";
    pipWindow.document.body.style.fontFamily =
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

    return () => {
      if (div.parentNode) {
        div.parentNode.removeChild(div);
      }
    };
  }, [pipWindow]);

  // 根据当前主题设置 PiP 窗口背景
  useEffect(() => {
    if (!pipWindow) return;

    const config = backgroundThemes[currentTheme];

    if (config.type === "solid") {
      // 纯色背景
      if (currentTheme === "solid-dark") {
        pipWindow.document.body.style.backgroundColor = "#0f172a";
      } else if (currentTheme === "solid-light") {
        pipWindow.document.body.style.backgroundColor = "#f8fafc";
      } else {
        pipWindow.document.body.style.backgroundColor = "hsl(var(--background))";
      }
    } else if (config.colors && config.colors.length > 0) {
      // Shader 背景使用渐变色
      const gradient = `linear-gradient(135deg, ${config.colors.join(", ")})`;
      pipWindow.document.body.style.background = gradient;
    }
  }, [pipWindow, currentTheme]);

  if (!container) return null;

  return createPortal(
    <div className="min-h-screen flex items-center justify-center p-4">
      <TimerRenderer
        state={timerState}
        onToggle={toggleTimer}
        onReset={resetTimer}
        variant="mini"
        showModeSwitch={false}
        showCloseButton={false}
      />
    </div>,
    container
  );
}
