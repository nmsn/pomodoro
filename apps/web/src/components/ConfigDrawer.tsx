"use client"

import { useState } from "react"
import { Settings, Clock, Palette, Bell, User, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

type NavItem = {
  id: string
  label: string
  icon: React.ReactNode
  children?: NavItem[]
}

const navItems: NavItem[] = [
  {
    id: "timer",
    label: "计时器",
    icon: <Clock className="h-4 w-4" />,
    children: [
      { id: "timer-focus", label: "专注时长", icon: <Clock className="h-4 w-4" /> },
      { id: "timer-break", label: "休息时长", icon: <Clock className="h-4 w-4" /> },
    ],
  },
  {
    id: "appearance",
    label: "外观",
    icon: <Palette className="h-4 w-4" />,
  },
  {
    id: "notifications",
    label: "通知",
    icon: <Bell className="h-4 w-4" />,
  },
  {
    id: "account",
    label: "账户",
    icon: <User className="h-4 w-4" />,
  },
]

function TimerSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">专注时长</h3>
        <p className="text-sm text-muted-foreground">设置每次专注的默认时长</p>
        <div className="mt-4 flex items-center gap-4">
          <Button variant="outline" size="sm">-</Button>
          <span className="text-2xl font-bold">25</span>
          <Button variant="outline" size="sm">+</Button>
          <span className="text-sm text-muted-foreground">分钟</span>
        </div>
      </div>
      <Separator />
      <div>
        <h3 className="text-lg font-medium">休息时长</h3>
        <p className="text-sm text-muted-foreground">设置每次休息的默认时长</p>
        <div className="mt-4 flex items-center gap-4">
          <Button variant="outline" size="sm">-</Button>
          <span className="text-2xl font-bold">5</span>
          <Button variant="outline" size="sm">+</Button>
          <span className="text-sm text-muted-foreground">分钟</span>
        </div>
      </div>
    </div>
  )
}

function AppearanceSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">主题</h3>
        <p className="text-sm text-muted-foreground">选择您喜欢的主题风格</p>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <Button variant="outline" className="h-20 flex flex-col gap-2">
            <div className="w-8 h-8 rounded-full bg-white border" />
            <span className="text-xs">浅色</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-900 border" />
            <span className="text-xs">深色</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white to-slate-900 border" />
            <span className="text-xs">跟随系统</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

function NotificationSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">通知设置</h3>
        <p className="text-sm text-muted-foreground">配置计时结束时的通知方式</p>
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">声音提醒</p>
              <p className="text-sm text-muted-foreground">计时结束时播放提示音</p>
            </div>
            <Button variant="outline" size="sm">开启</Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">桌面通知</p>
              <p className="text-sm text-muted-foreground">显示系统桌面通知</p>
            </div>
            <Button variant="outline" size="sm">开启</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function AccountSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">账户信息</h3>
        <p className="text-sm text-muted-foreground">管理您的账户设置</p>
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
              U
            </div>
            <div>
              <p className="font-medium">用户名</p>
              <p className="text-sm text-muted-foreground">user@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const contentMap: Record<string, React.ReactNode> = {
  timer: <TimerSettings />,
  "timer-focus": <TimerSettings />,
  "timer-break": <TimerSettings />,
  appearance: <AppearanceSettings />,
  notifications: <NotificationSettings />,
  account: <AccountSettings />,
}

export function DrawerScrollableContent() {
  const [selectedNav, setSelectedNav] = useState<string>("timer")
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  const renderNavItem = (item: NavItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.has(item.id)
    const isSelected = selectedNav === item.id

    return (
      <div key={item.id}>
        <Button
          variant={isSelected ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start gap-2",
            level > 0 && "pl-8"
          )}
          onClick={() => {
            if (hasChildren) {
              toggleExpand(item.id)
            }
            setSelectedNav(item.id)
          }}
        >
          {item.icon}
          <span className="flex-1 text-left">{item.label}</span>
          {hasChildren && (
            <ChevronRight
              className={cn(
                "h-4 w-4 transition-transform",
                isExpanded && "rotate-90"
              )}
            />
          )}
        </Button>
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {item.children!.map((child) => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon" className="h-12 w-12 rounded-full shadow-lg">
          <Settings className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="border-b">
          <DrawerTitle>设置</DrawerTitle>
          <DrawerDescription>配置您的番茄钟偏好</DrawerDescription>
        </DrawerHeader>

        <div className="flex h-[calc(100vh-12rem)]">
          {/* 左侧导航栏 */}
          <div className="w-56 border-r bg-muted/30 flex-shrink-0">
            <ScrollArea className="h-full py-4">
              <div className="px-2 space-y-1">
                {navItems.map((item) => renderNavItem(item))}
              </div>
            </ScrollArea>
          </div>

          {/* 右侧内容区域 */}
          <div className="flex-1 p-6">
            <ScrollArea className="h-full">
              {contentMap[selectedNav] || (
                <div className="text-center text-muted-foreground py-12">
                  请选择左侧菜单查看设置
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DrawerFooter className="border-t">
          <div className="flex justify-end gap-2">
            <Button>保存</Button>
            <DrawerClose asChild>
              <Button variant="outline">取消</Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
