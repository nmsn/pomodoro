# 番茄钟记录功能设计

## 概述

为 Pomodoro Timer 添加番茄钟完成记录功能，自动同步到后端，支持登录用户查看历史和统计数据。

## 用户场景

1. 用户完成一个番茄钟（计时器自然运行到 0）
2. 系统自动记录本次番茄钟到后端
3. 未登录用户显示 Toast 提示"登录后可保存记录"

## 前端改动

### 1. 新增 atom

文件：`apps/web/src/atoms/timer.ts`

```typescript
export interface CurrentSession {
  timerType: TimerType
  mode: TimerMode
  startTime: number // timestamp ms
}

export const currentSessionAtom = atom<CurrentSession | null>(null)
```

### 2. API 调用封装

文件：`apps/web/src/lib/api.ts` (或新建 `apps/web/src/lib/session.ts`)

```typescript
export async function savePomodoroSession(
  session: CurrentSession,
  completed: boolean
): Promise<void> {
  const duration = Math.floor((Date.now() - session.startTime) / 1000)
  await apiFetch("/api/sessions", {
    method: "POST",
    body: JSON.stringify({
      timerType: session.timerType,
      mode: session.mode,
      startTime: session.startTime,
      endTime: Date.now(),
      duration,
      completed,
    }),
  })
}
```

### 3. 修改 usePomoTimer

文件：`apps/web/src/hooks/usePomoTimer.ts`

- 新增 `useEffect`，监听 `isActiveAtom` 从 `true` → `false`
- 检测 mode 变化（work/break 切换时不记录，只在真正停止时记录）
- 调用 `savePomodoroSession`

```typescript
export function usePomoTimer(options: UsePomoTimerOptions = {}) {
  // ... existing code ...

  // 新增：监听停止，记录 session
  useEffect(() => {
    if (prevIsActiveRef.current && !isActive) {
      // 计时器从运行变为停止，记录 session
      // 需要判断是 mode 切换还是真正停止
    }
    prevIsActiveRef.current = isActive
  }, [isActive])
}
```

### 4. Toast 提示

文件：`apps/web/src/components/TimerRenderer.tsx` 或新建 Toast 组件

- 条件：计时器完成（completed=true）且用户未登录
- 显示内容："登录后可保存您的番茄钟记录"
- 时长：3 秒后自动消失
- 样式：底部居中，背景模糊，渐入渐出

## 后端

无需改动。

接口 `POST /api/sessions` 已存在，`createSession` 服务会自动更新 `dailyStats`。

## 数据流

```
用户点击开始
  → 设置 currentSessionAtom { timerType, mode, startTime }

用户停止（手动/自然结束）
  → useEffect 检测 isActive: true → false
  → 判断 completed（是否自然结束）
  → 调用 savePomodoroSession(currentSession, completed)
  → 如果 completed && mode=work，后端自动更新 dailyStats

未登录 + completed
  → 显示 Toast 提示登录
```

## 状态管理

- `currentSessionAtom`：记录当前进行中的番茄钟信息
- mode 切换时重置 `currentSessionAtom`（因为会开始新的 session）
- 停止时不重置，下一次开始时会覆盖

## 错误处理

- API 调用失败：静默处理，不影响计时器
- 网络问题：不做重试，数据丢失可接受

## 测试场景

1. 登录用户完成番茄钟 → 后端有记录，dailyStats 正确更新
2. 登录用户手动停止 → 后端有记录，completed=false
3. 未登录用户完成 → 显示 Toast，不调用 API
4. 切换 mode（work→break→work）→ 每个 mode 单独记录
