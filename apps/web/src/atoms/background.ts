import { atom } from "jotai";

export type BackgroundTheme = 
  | "default"
  | "mesh-blue"
  | "mesh-purple"
  | "mesh-orange"
  | "mesh-green"
  | "grain-dark"
  | "grain-light"
  | "noise-color"
  | "warp-gradient"
  | "solid-dark"
  | "solid-light";

export interface BackgroundConfig {
  name: string;
  description: string;
  type: "shader" | "solid";
  shader?: string;
  colors?: string[];
  solidColor?: string;
  isDark: boolean;
}

// 计算颜色亮度的函数
function getLuminance(hexColor: string): number {
  // 移除 # 号
  const hex = hexColor.replace("#", "");
  
  // 转换为 RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  // 计算亮度 (使用相对亮度公式)
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  
  return luminance;
}

// 判断背景是否为深色
export function isBackgroundDark(theme: BackgroundTheme): boolean {
  const config = backgroundThemes[theme];
  
  if (config.type === "solid") {
    // 纯色背景根据 solidColor 判断
    if (theme === "solid-dark") return true;
    if (theme === "solid-light") return false;
    // 默认渐变
    return false;
  }
  
  // Shader 背景根据主要颜色判断
  if (config.colors && config.colors.length > 0) {
    // 使用第一个颜色作为参考
    const primaryColor = config.colors[0];
    const luminance = getLuminance(primaryColor);
    // 亮度小于 0.5 认为是深色背景
    return luminance < 0.5;
  }
  
  return false;
}

export const backgroundThemes: Record<BackgroundTheme, BackgroundConfig> = {
  default: {
    name: "默认渐变",
    description: "经典的蓝紫色渐变背景",
    type: "solid",
    solidColor: "bg-gradient-to-br from-background to-muted",
    isDark: false,
  },
  "mesh-blue": {
    name: "蓝色网格",
    description: "流动的蓝色网格渐变",
    type: "shader",
    shader: "MeshGradient",
    colors: ["#3b82f6", "#06b6d4", "#6366f1", "#8b5cf6"],
    isDark: false,
  },
  "mesh-purple": {
    name: "紫色梦幻",
    description: "浪漫的紫色渐变效果",
    type: "shader",
    shader: "MeshGradient",
    colors: ["#8b5cf6", "#a855f7", "#d946ef", "#ec4899"],
    isDark: true,
  },
  "mesh-orange": {
    name: "日落橙",
    description: "温暖的日落色调",
    type: "shader",
    shader: "MeshGradient",
    colors: ["#f97316", "#fb923c", "#fbbf24", "#f59e0b"],
    isDark: false,
  },
  "mesh-green": {
    name: "自然绿",
    description: "清新的绿色渐变",
    type: "shader",
    shader: "MeshGradient",
    colors: ["#10b981", "#34d399", "#6ee7b7", "#059669"],
    isDark: false,
  },
  "grain-dark": {
    name: "深色颗粒",
    description: "深色颗粒质感背景",
    type: "shader",
    shader: "GrainGradient",
    colors: ["#1a1a2e", "#16213e", "#0f3460"],
    isDark: true,
  },
  "grain-light": {
    name: "浅色颗粒",
    description: "浅色颗粒质感背景",
    type: "shader",
    shader: "GrainGradient",
    colors: ["#f8fafc", "#e2e8f0", "#cbd5e1"],
    isDark: false,
  },
  "noise-color": {
    name: "彩色噪点",
    description: "动态彩色噪点效果",
    type: "shader",
    shader: "PerlinNoise",
    colors: ["#6366f1", "#ec4899", "#f59e0b"],
    isDark: true,
  },
  "warp-gradient": {
    name: "扭曲渐变",
    description: "流动的扭曲渐变效果",
    type: "shader",
    shader: "Warp",
    colors: ["#3b82f6", "#8b5cf6", "#ec4899"],
    isDark: true,
  },
  "solid-dark": {
    name: "深色纯色",
    description: "简洁的深色背景",
    type: "solid",
    solidColor: "bg-slate-900",
    isDark: true,
  },
  "solid-light": {
    name: "浅色纯色",
    description: "简洁的浅色背景",
    type: "solid",
    solidColor: "bg-slate-50",
    isDark: false,
  },
};

// 当前背景主题
export const backgroundThemeAtom = atom<BackgroundTheme>("default");

// 切换背景主题
export const switchBackgroundThemeAtom = atom(
  null,
  (get, set, theme: BackgroundTheme) => {
    set(backgroundThemeAtom, theme);
  }
);

// 当前背景是否为深色
export const isDarkBackgroundAtom = atom((get) => {
  const theme = get(backgroundThemeAtom);
  return backgroundThemes[theme].isDark;
});
