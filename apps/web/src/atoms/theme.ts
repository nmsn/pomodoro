import { atom } from "jotai";

export type ThemeMode = "light" | "dark" | "system";

// 当前主题模式
export const themeModeAtom = atom<ThemeMode>("system");

// 实际应用的主题（根据 system 模式计算得出）
export const appliedThemeAtom = atom<"light" | "dark">((get) => {
  const mode = get(themeModeAtom);

  if (mode === "system") {
    // 在客户端检测系统主题
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light"; // 服务端默认返回 light
  }

  return mode;
});

// 切换主题模式
export const setThemeModeAtom = atom(
  null,
  (get, set, mode: ThemeMode) => {
    set(themeModeAtom, mode);

    // 更新 document 的 class
    if (typeof document !== "undefined") {
      const root = document.documentElement;

      if (mode === "dark") {
        root.classList.add("dark");
      } else if (mode === "light") {
        root.classList.remove("dark");
      } else {
        // system 模式，根据系统偏好设置
        const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (systemDark) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
    }
  }
);

// 初始化主题（在应用启动时调用）
export const initThemeAtom = atom(null, (get, set) => {
  const mode = get(themeModeAtom);

  if (typeof document !== "undefined") {
    const root = document.documentElement;

    if (mode === "dark") {
      root.classList.add("dark");
    } else if (mode === "light") {
      root.classList.remove("dark");
    } else {
      // system 模式
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (systemDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }

      // 监听系统主题变化
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        if (e.matches) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      };

      mediaQuery.addEventListener("change", handleChange);
    }
  }
});
