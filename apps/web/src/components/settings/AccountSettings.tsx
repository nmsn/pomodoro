"use client"

export function AccountSettings() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">账户信息</h3>
          <p className="text-sm text-muted-foreground mt-1">管理您的账户设置</p>
        </div>
        <div className="p-5 rounded-2xl bg-muted/50 border border-muted-foreground/5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg">
              U
            </div>
            <div>
              <p className="font-semibold">用户名</p>
              <p className="text-sm text-muted-foreground">user@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
