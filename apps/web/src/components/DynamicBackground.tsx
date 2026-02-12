"use client";

import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { backgroundThemeAtom, backgroundThemes } from "@/atoms/background";
import { cn } from "@/lib/utils";

// 动态导入 shader 组件
import { MeshGradient } from "@paper-design/shaders-react";

interface DynamicBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function DynamicBackground({ children, className }: DynamicBackgroundProps) {
  const [mounted, setMounted] = useState(false);
  const currentTheme = useAtomValue(backgroundThemeAtom);
  const config = backgroundThemes[currentTheme];

  useEffect(() => {
    setMounted(true);
  }, []);

  // 服务端渲染或客户端未挂载时，使用纯色背景避免 hydration 不匹配
  if (!mounted || config.type === "solid") {
    return (
      <div className={cn("min-h-screen w-full", config.solidColor, className)}>
        {children}
      </div>
    );
  }

  // 客户端挂载后，渲染 shader 背景
  return (
    <div className={cn("relative min-h-screen w-full", className)}>
      <MeshGradient
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: -1 }}
        colors={config.colors || ["#3b82f6", "#8b5cf6"]}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
