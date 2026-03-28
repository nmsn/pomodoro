# 番茄钟记录功能设计

## 概述

为 Pomodoro Timer 添加番茄钟完成记录功能，自动同步到后端，支持登录用户查看历史和统计数据。

## 用户场景

1. 用户完成一个番茄钟（计时器自然运行到 0）
2. 系统自动记录本次番茄钟到后端
3. 未登录用户显示 Toast 提示"登录后可保存记录"

## 前端改动

### 1. 新增 atoms

文件：`apps/web/src/atoms/timer.ts`

```typescript
export interface CurrentSession {
  timerType: TimerType
  mode: TimerMode
  startTime: number // timestamp ms
}

export const currentSessionAtom = atom<CurrentSession | null>(null)

// 标记是否正在切换 mode，切换时不记录 session
export const isModeSwitchingAtom = atom(false)
```

### 2. API 调用封装

文件：`apps/web/src/lib/session.ts`

```typescript
import { apiFetch } from "@/lib/api"
import type { CurrentSession } from "@/atoms/timer"

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

### 3. 修改 atoms

#### 3.1 修改 switchModeAtom

文件：`apps/web/src/atoms/timer.ts`

在 `switchModeAtom` 中，切换前设置 `isModeSwitchingAtom(true)`：

```typescript
export const switchModeAtom = atom(null, (get, set, mode: TimerMode) => {
  // ... existing code ...
  set(isModeSwitchingAtom, true) // 新增：标记即将切换 mode
  set(timerModeAtom, mode)
  // ... rest of code ...
})
```

#### 3.2 修改 toggleTimerAtom

文件：`apps/web/src/atoms/timer.ts`

启动时设置 `currentSessionAtom`，停止时不需要额外操作（由 useEffect 处理）：

```typescript
export const toggleTimerAtom = atom(null, (get, set) => {
  const currentActive = get(isActiveAtom)
  if (!currentActive) {
    // 启动时：创建 session
    const timerType = get(timerTypeAtom)
    const mode = get(timerModeAtom)
    set(currentSessionAtom, {
      timerType,
      mode,
      startTime: Date.now(),
    })
  }
  set(isActiveAtom, !currentActive)
})
```

### 4. 修改 usePomoTimer

文件：`apps/web/src/hooks/usePomoTimer.ts`

新增 `useEffect`，监听 `isActiveAtom` 变化，记录 session：

```typescript
export function usePomoTimer(options: UsePomoTimerOptions = {}) {
  const state = useAtomValue(timerStateAtom)
  const setWorkDuration = useSetAtom(workDurationAtom)
  const setBreakDuration = useSetAtom(breakDurationAtom)
  const toggleTimer = useSetAtom(toggleTimerAtom)
  const resetTimer = useSetAtom(resetTimerAtom)
  const switchMode = useSetAtom(switchModeAtom)
  const isActive = useAtomValue(isActiveAtom)
  const timeLeft = useAtomValue(timeLeftAtom)
  const currentSession = useAtomValue(currentSessionAtom)
  const isModeSwitching = useAtomValue(isModeSwitchingAtom)

  // 新增：监听停止，记录 session
  const prevActiveRef = useRef(false)

  useEffect(() => {
    if (prevActiveRef.current && !isActive) {
      // 停止时检查是否在切换 mode
      if (isModeSwitching) {
        // mode 切换，不记录，等待下一次真正停止
        return
      }
      // 真正停止，记录 session
      if (currentSession) {
        // completed 由计时器是否自然结束决定（timeLeft === 0）
        const completed = timeLeft === 0
        savePomodoroSession(currentSession, completed)
      }
    }
    prevActiveRef.current = isActive
  }, [isActive, isModeSwitching, currentSession, timeLeft])

  // ... rest of code ...
}
```

### 5. Toast 提示

文件：`apps/web/src/components/PomoTimer.tsx` 或 `TimerRenderer.tsx`

- 条件：计时器完成（completed=true）且用户未登录
- 显示内容："登录后可保存您的番茄钟记录"
- 时长：3 秒后自动消失
- 样式：底部居中，背景模糊，渐入渐出

**Auth 检查**：在调用 `savePomodoroSession` 前使用 `useSession()` 检查 `session?.user` 是否存在

```typescript
// 在 PomoTimer 或 TimerRenderer 中
const { data: session } = useSession()

// 当 completed=true 时
if (session?.user) {
  savePomodoroSession(currentSession, completed)
} else {
  // 显示 Toast
}
```

## 后端

无需改动。

接口 `POST /api/sessions` 已存在，`createSession` 服务会自动更新 `dailyStats`。

## 数据流

```
用户点击开始
  → toggleTimerAtom: 设置 currentSessionAtom { timerType, mode, startTime }
  → 设置 isActiveAtom = true

用户停止（手动/自然结束）
  → useEffect 检测 isActive: true → false
  → 检查 isModeSwitchingAtom（mode 切换时为 true）
  → 如果是 mode 切换：不记录，等待下一次停止
  → 如果是真正停止：
      → completed = (timeLeft === 0)
      → 已登录：调用 savePomodoroSession
      → 未登录 + completed：显示 Toast 提示登录
```

## 状态管理

- `currentSessionAtom`：记录当前进行中的番茄钟信息
- `isModeSwitchingAtom`：mode 切换时为 true，切换完成后 useEffect 重置为 false
- mode 切换时：自动开始新的 session（toggleTimerAtom 会覆盖 currentSessionAtom）
- 停止时不重置，下一次开始时会覆盖

## 错误处理

- API 调用失败：静默处理，不影响计时器
- 网络问题：不做重试，数据丢失可接受

## 测试场景

1. 登录用户完成番茄钟 → 后端有记录，dailyStats 正确更新
2. 登录用户手动停止 → 后端有记录，completed=false
3. 未登录用户完成 → 显示 Toast，不调用 API
4. 切换 mode（work→break→work）→ 每个 mode 单独记录
