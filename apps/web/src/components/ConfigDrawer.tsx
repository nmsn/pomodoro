"use client"

import { useState } from "react"
import { Settings, Clock, Palette, Bell, User, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  TimerSettings,
  AppearanceSettings,
  NotificationSettings,
  AccountSettings,
} from "@/components/settings"

type NavItem = {
  id: string
  label: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    id: "timer",
    label: "计时器",
    icon: <Clock className="h-5 w-5" />,
  },
  {
    id: "appearance",
    label: "外观",
    icon: <Palette className="h-5 w-5" />,
  },
  {
    id: "notifications",
    label: "通知",
    icon: <Bell className="h-5 w-5" />,
  },
  {
    id: "account",
    label: "账户",
    icon: <User className="h-5 w-5" />,
  },
]

const contentMap: Record<string, React.ReactNode> = {
  timer: <TimerSettings />,
  appearance: <AppearanceSettings />,
  notifications: <NotificationSettings />,
  account: <AccountSettings />,
}

export function DrawerScrollableContent() {
  const [selectedNav, setSelectedNav] = useState<string>("timer")

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full shadow-lg bg-background/80 backdrop-blur-sm border-muted-foreground/20 hover:bg-background/90"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-0 border-l border-muted-foreground/10">
        <div className="flex h-[100vh]">
          {/* 左侧导航栏 */}
          <Sidebar
            navItems={navItems}
            selectedNav={selectedNav}
            onNavSelect={setSelectedNav}
          />

          {/* 右侧内容区域 */}
          <div className="flex-1 bg-background">
            <ScrollArea className="h-full">
              <div className="p-8 max-w-xl">
                {contentMap[selectedNav] || (
                  <div className="text-center text-muted-foreground py-12">
                    请选择左侧菜单查看设置
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

interface SidebarProps {
  navItems: NavItem[]
  selectedNav: string
  onNavSelect: (id: string) => void
}

function Sidebar({ navItems, selectedNav, onNavSelect }: SidebarProps) {
  const renderNavItem = (item: NavItem) => {
    const isSelected = selectedNav === item.id

    return (
      <button
        key={item.id}
        onClick={() => onNavSelect(item.id)}
        className={cn(
          "group w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 cursor-pointer relative overflow-hidden",
          isSelected
            ? "bg-gradient-to-r from-primary/90 to-primary text-primary-foreground shadow-lg"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        {isSelected && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/50 rounded-l-full" />
        )}
        <span
          className={cn(
            "transition-transform duration-200",
            "group-hover:scale-110"
          )}
        >
          {item.icon}
        </span>
        <span className="flex-1 text-left font-medium">{item.label}</span>
        {isSelected && (
          <svg className="w-5 h-5 opacity-70" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </button>
    )
  }

  return (
    <div className="w-60 border-r bg-muted/20 flex-shrink-0 flex flex-col">
      {/* 关闭按钮 */}
      <div className="p-4 border-b border-muted-foreground/10">
        <DrawerClose asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-2xl hover:bg-muted cursor-pointer"
          >
            <X className="h-4 w-4" />
          </Button>
        </DrawerClose>
      </div>
      <ScrollArea className="flex-1 py-3 px-2">
        <div className="space-y-1">
          {navItems.map((item) => renderNavItem(item))}
        </div>
      </ScrollArea>
    </div>
  )
}
