"use client"

import { Button } from "@/components/ui/button"

export function NotificationSettings() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">通知设置</h3>
          <p className="text-sm text-muted-foreground mt-1">配置计时结束时的通知方式</p>
        </div>
        <div className="space-y-3">
          <SettingToggle
            title="声音提醒"
            description="计时结束时播放提示音"
          />
          <SettingToggle
            title="桌面通知"
            description="显示系统桌面通知"
          />
        </div>
      </div>
    </div>
  )
}

interface SettingToggleProps {
  title: string
  description: string
}

function SettingToggle({ title, description }: SettingToggleProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/50 border border-muted-foreground/5">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Button variant="outline" size="sm" className="rounded-full px-4">
        开启
      </Button>
    </div>
  )
}
