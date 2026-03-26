"use client"

import { useAtom, useAtomValue } from "jotai"
import { Sun, Moon, Monitor, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import {
  backgroundThemeAtom,
  backgroundThemes,
  switchBackgroundThemeAtom,
  BackgroundTheme,
} from "@/atoms/background"
import {
  themeModeAtom,
  setThemeModeAtom,
  ThemeMode,
} from "@/atoms/theme"

export function AppearanceSettings() {
  const currentTheme = useAtomValue(backgroundThemeAtom)
  const [, switchTheme] = useAtom(switchBackgroundThemeAtom)
  const themeMode = useAtomValue(themeModeAtom)
  const [, setThemeMode] = useAtom(setThemeModeAtom)

  return (
    <div className="space-y-8">
      {/* 主题选择 */}
      <ThemeModeSection
        themeMode={themeMode}
        onThemeModeChange={setThemeMode}
      />

      <Separator className="bg-muted-foreground/10" />

      {/* 背景选择 */}
      <BackgroundSection
        currentTheme={currentTheme}
        onThemeChange={switchTheme}
      />
    </div>
  )
}

interface ThemeModeSectionProps {
  themeMode: ThemeMode
  onThemeModeChange: (mode: ThemeMode) => void
}

function ThemeModeSection({ themeMode, onThemeModeChange }: ThemeModeSectionProps) {
  const getThemeIcon = (mode: ThemeMode) => {
    switch (mode) {
      case "light":
        return <Sun className="h-5 w-5" />
      case "dark":
        return <Moon className="h-5 w-5" />
      case "system":
        return <Monitor className="h-5 w-5" />
    }
  }

  const getThemeLabel = (mode: ThemeMode) => {
    switch (mode) {
      case "light":
        return "浅色"
      case "dark":
        return "深色"
      case "system":
        return "跟随系统"
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold tracking-tight">主题</h3>
        <p className="text-sm text-muted-foreground mt-1">选择您喜欢的主题风格</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {(["light", "dark", "system"] as ThemeMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => onThemeModeChange(mode)}
            className={cn(
              "group relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer",
              themeMode === mode
                ? "border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-md hover:shadow-lg hover:scale-105"
                : "border-muted-foreground/10 bg-muted/30 hover:border-muted-foreground/20 hover:bg-muted/50 hover:shadow-md hover:scale-105"
            )}
          >
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200",
                themeMode === mode
                  ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-lg group-hover:scale-110"
                  : "bg-background text-muted-foreground border-2 border-muted-foreground/10 group-hover:scale-110"
              )}
            >
              {getThemeIcon(mode)}
            </div>
            <span
              className={cn(
                "text-sm font-medium",
                themeMode === mode ? "text-foreground font-semibold" : "text-muted-foreground"
              )}
            >
              {getThemeLabel(mode)}
            </span>
            {themeMode === mode && (
              <div className="absolute top-2 right-2">
                <div className="bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-full p-1 shadow-lg">
                  <Check className="h-3 w-3" />
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

interface BackgroundSectionProps {
  currentTheme: BackgroundTheme
  onThemeChange: (theme: BackgroundTheme) => void
}

function BackgroundSection({ currentTheme, onThemeChange }: BackgroundSectionProps) {
  const getPreviewStyle = (themeKey: BackgroundTheme): React.CSSProperties => {
    const config = backgroundThemes[themeKey]

    if (config.type === "solid") {
      return {
        background: themeKey === "solid-dark" ? "#0f172a" : "#f8fafc",
      }
    }

    if (config.colors && config.colors.length > 0) {
      const gradient = `linear-gradient(135deg, ${config.colors.join(", ")})`
      return { background: gradient }
    }

    return {}
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold tracking-tight">背景效果</h3>
        <p className="text-sm text-muted-foreground mt-1">选择动态背景效果</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {(Object.keys(backgroundThemes) as BackgroundTheme[]).map((themeKey) => {
          const config = backgroundThemes[themeKey]
          const isSelected = currentTheme === themeKey

          return (
            <BackgroundPreviewCard
              key={themeKey}
              themeKey={themeKey}
              config={config}
              isSelected={isSelected}
              onSelect={() => onThemeChange(themeKey)}
              previewStyle={getPreviewStyle(themeKey)}
            />
          )
        })}
      </div>
    </div>
  )
}

interface BackgroundPreviewCardProps {
  themeKey: BackgroundTheme
  config: (typeof backgroundThemes)[BackgroundTheme]
  isSelected: boolean
  onSelect: () => void
  previewStyle: React.CSSProperties
}

function BackgroundPreviewCard({
  themeKey,
  config,
  isSelected,
  onSelect,
  previewStyle,
}: BackgroundPreviewCardProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "group relative h-28 rounded-2xl border-2 overflow-hidden transition-all duration-200 cursor-pointer",
        isSelected
          ? "border-primary ring-2 ring-primary/20 shadow-lg hover:shadow-xl hover:scale-105"
          : "border-transparent hover:border-muted-foreground/20 hover:shadow-md hover:scale-105"
      )}
    >
      {/* 背景预览 */}
      <div
        className="absolute inset-0 transition-transform duration-300 group-hover:scale-110"
        style={previewStyle}
      />

      {/* 遮罩层 */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-200",
          isSelected ? "bg-black/20" : "bg-black/40 group-hover:bg-black/30"
        )}
      />

      {/* 选中标记 */}
      {isSelected && (
        <div className="absolute top-2 right-2 z-10">
          <div className="bg-gradient-to-br from-white to-white/90 text-black rounded-full p-1 shadow-lg">
            <Check className="h-3 w-3" />
          </div>
        </div>
      )}

      {/* 内容 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-3">
        <span className="font-semibold text-sm text-white drop-shadow-lg">{config.name}</span>
        <span className="text-xs text-white/80 drop-shadow-md line-clamp-1 mt-0.5">
          {config.description}
        </span>
      </div>
    </button>
  )
}
