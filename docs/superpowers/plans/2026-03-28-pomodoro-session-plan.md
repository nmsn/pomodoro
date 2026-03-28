# Pomodoro Session Recording Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add pomodoro session recording to backend, with automatic tracking on timer completion and login prompt for unauthenticated users.

**Architecture:** Session tracking via new atoms in timer.ts, API call in lib/session.ts, useEffect hook in usePomoTimer monitors state changes and records sessions. Simple inline Toast component for login prompt.

**Tech Stack:** Next.js, Jotai atoms, Hono backend, Drizzle ORM

---

## File Structure

```
apps/web/src/
├── atoms/timer.ts          # Add CurrentSessionAtom, isModeSwitchingAtom, modify toggleTimerAtom, switchModeAtom
├── lib/session.ts          # Create: API call wrapper for POST /api/sessions
├── hooks/usePomoTimer.ts   # Add useEffect to detect stop and record session
├── components/
│   └── LoginToast.tsx      # Create: Simple inline toast for login prompt
└── components/PomoTimer.tsx  # Add LoginToast usage
```

---

## Task 1: Add atoms to timer.ts

**Files:**
- Modify: `apps/web/src/atoms/timer.ts:75-84` (after line 83)

- [ ] **Step 1: Add CurrentSession interface and atoms**

After line 83 (`export const elapsedTimeAtom = atom<number>(0);`), add:

```typescript
// Current session info for recording
export interface CurrentSession {
  timerType: TimerType;
  mode: TimerMode;
  startTime: number; // timestamp ms
}

export const currentSessionAtom = atom<CurrentSession | null>(null);

// Mark if mode is being switched (to avoid recording during mode switch)
export const isModeSwitchingAtom = atom(false);
```

- [ ] **Step 2: Run build to verify**

Run: `pnpm --filter=web build 2>&1 | grep -E "(error|Error|✓)"`
Expected: `✓ Compiled successfully`

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/atoms/timer.ts
git commit -m "feat(timer): add currentSessionAtom and isModeSwitchingAtom"
```

---

## Task 2: Create API call wrapper

**Files:**
- Create: `apps/web/src/lib/session.ts`

- [ ] **Step 1: Create lib/session.ts**

```typescript
import { apiFetch } from "@/lib/api";
import type { CurrentSession } from "@/atoms/timer";

export async function savePomodoroSession(
  session: CurrentSession,
  completed: boolean
): Promise<void> {
  const duration = Math.floor((Date.now() - session.startTime) / 1000);
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
  });
}
```

- [ ] **Step 2: Verify build**

Run: `pnpm --filter=web build 2>&1 | grep -E "(error|Error|✓)"`
Expected: `✓ Compiled successfully`

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/lib/session.ts
git commit -m "feat(session): add savePomodoroSession API wrapper"
```

---

## Task 3: Modify toggleTimerAtom to set currentSession on start

**Files:**
- Modify: `apps/web/src/atoms/timer.ts:155-158`

- [ ] **Step 1: Replace toggleTimerAtom**

Replace the current `toggleTimerAtom` (lines 155-158):

```typescript
// 切换计时器状态
export const toggleTimerAtom = atom(null, (get, set) => {
  const currentActive = get(isActiveAtom);
  if (!currentActive) {
    // 启动时：创建 session
    const timerType = get(timerTypeAtom);
    const mode = get(timerModeAtom);
    set(currentSessionAtom, {
      timerType,
      mode,
      startTime: Date.now(),
    });
  }
  set(isActiveAtom, !currentActive);
});
```

- [ ] **Step 2: Verify build**

Run: `pnpm --filter=web build 2>&1 | grep -E "(error|Error|✓)"`
Expected: `✓ Compiled successfully`

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/atoms/timer.ts
git commit -m "feat(timer): set currentSessionAtom when timer starts"
```

---

## Task 4: Modify switchModeAtom to set isModeSwitching flag

**Files:**
- Modify: `apps/web/src/atoms/timer.ts:176-184`

- [ ] **Step 1: Replace switchModeAtom**

Replace the current `switchModeAtom` (lines 176-184):

```typescript
// 切换专注/休息模式
export const switchModeAtom = atom(null, (get, set, mode: TimerMode) => {
  const workDuration = get(workDurationAtom);
  const breakDuration = get(breakDurationAtom);
  set(isModeSwitchingAtom, true); // Mark mode switching
  set(timerModeAtom, mode);
  set(isActiveAtom, false);
  set(elapsedTimeAtom, 0);
  set(timeLeftAtom, (mode === "work" ? workDuration : breakDuration) * 60);
  set(isModeSwitchingAtom, false); // Reset after switch
});
```

- [ ] **Step 2: Verify build**

Run: `pnpm --filter=web build 2>&1 | grep -E "(error|Error|✓)"`
Expected: `✓ Compiled successfully`

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/atoms/timer.ts
git commit -m "feat(timer): add isModeSwitchingAtom flag in switchModeAtom"
```

---

## Task 5: Add useEffect to usePomoTimer to record session

**Files:**
- Modify: `apps/web/src/hooks/usePomoTimer.ts`
- Modify: `apps/web/src/components/PomoTimer.tsx`

The approach: `usePomoTimer` exposes an `onSessionComplete` callback that the component provides. This allows the component (which can use `useSession`) to handle auth check and Toast display.

- [ ] **Step 1: Update UsePomoTimerOptions and add atoms import**

Replace the imports section:

```typescript
"use client";

import { useEffect, useRef } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  timerStateAtom,
  workDurationAtom,
  breakDurationAtom,
  toggleTimerAtom,
  resetTimerAtom,
  switchModeAtom,
  isActiveAtom,
  timeLeftAtom,
  currentSessionAtom,
  isModeSwitchingAtom,
  TimerMode,
  TimerState,
  TimerType,
} from "@/atoms/timer";
```

- [ ] **Step 2: Add onSessionComplete to UsePomoTimerOptions**

Replace the interface section (after imports):

```typescript
export interface UsePomoTimerOptions {
  workDuration?: number;
  breakDuration?: number;
  onStateChange?: (state: TimerState) => void;
  /** Callback when timer stops - component handles auth check and recording */
  onSessionComplete?: (session: { timerType: TimerType; mode: TimerMode; startTime: number }, completed: boolean) => void;
}
```

- [ ] **Step 3: Update function signature and add atoms**

Replace the function signature and add atom values:

```typescript
export function usePomoTimer(
  options: UsePomoTimerOptions = {}
): UsePomoTimerReturn {
  const { workDuration = 25, breakDuration = 5, onStateChange, onSessionComplete } = options;
```

Add after `const switchMode = useSetAtom(switchModeAtom);`:

```typescript
  const isActive = useAtomValue(isActiveAtom);
  const timeLeft = useAtomValue(timeLeftAtom);
  const currentSession = useAtomValue(currentSessionAtom);
  const isModeSwitching = useAtomValue(isModeSwitchingAtom);
```

- [ ] **Step 4: Replace session recording useEffect**

Replace the existing `// Session recording effect` section:

```typescript
  // Session recording effect
  const prevActiveRef = useRef(false);

  useEffect(() => {
    if (prevActiveRef.current && !isActive) {
      // Timer stopped - check if it's a mode switch
      if (isModeSwitching) {
        // Mode switch in progress, don't record yet
        prevActiveRef.current = isActive;
        return;
      }
      // Real stop - notify component to handle auth check and recording
      if (currentSession && onSessionComplete) {
        const completed = timeLeft === 0;
        onSessionComplete(currentSession, completed);
      }
    }
    prevActiveRef.current = isActive;
  }, [isActive, isModeSwitching, currentSession, timeLeft, onSessionComplete]);
```

- [ ] **Step 5: Verify build**

Run: `pnpm --filter=web build 2>&1 | grep -E "(error|Error|✓)"`
Expected: `✓ Compiled successfully`

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/hooks/usePomoTimer.ts
git commit -m "feat(timer): add onSessionComplete callback for auth-aware recording"
```

---

## Task 6: Create LoginToast component

**Files:**
- Create: `apps/web/src/components/LoginToast.tsx`

- [ ] **Step 1: Create LoginToast component**

```typescript
"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoginToastProps {
  message?: string;
  onClose?: () => void;
}

export function LoginToast({
  message = "登录后可保存您的番茄钟记录",
  onClose,
}: LoginToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-20 left-1/2 -translate-x-1/2 z-50",
        "px-4 py-3 rounded-lg shadow-lg",
        "bg-background/95 backdrop-blur-sm border border-border",
        "animate-in fade-in slide-in-from-bottom-2 duration-300",
        "flex items-center gap-3"
      )}
    >
      <span className="text-sm text-foreground">{message}</span>
      <button
        onClick={() => {
          setVisible(false);
          onClose?.();
        }}
        className="p-1 hover:bg-muted rounded cursor-pointer"
      >
        <X className="h-4 w-4 text-muted-foreground" />
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `pnpm --filter=web build 2>&1 | grep -E "(error|Error|✓)"`
Expected: `✓ Compiled successfully`

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/LoginToast.tsx
git commit -m "feat(ui): add LoginToast component"
```

---

## Task 7: Integrate LoginToast into PomoTimer

**Files:**
- Modify: `apps/web/src/components/PomoTimer.tsx`

- [ ] **Step 1: Add imports**

Add to imports (after line 10):
```typescript
import { useSession } from "@/atoms/auth";
import { LoginToast } from "./LoginToast";
import { savePomodoroSession } from "@/lib/session";
import { useState } from "react";
```

- [ ] **Step 2: Add state and modify usePomoTimer**

Add to component body (after `const isDark = ...`):
```typescript
const { data: session } = useSession();
const [showLoginToast, setShowLoginToast] = useState(false);
```

Replace the `usePomoTimer` call:

```typescript
const { state, toggleTimer, resetTimer, switchMode } = usePomoTimer({
  workDuration,
  breakDuration,
  onSessionComplete: (sessionData, completed) => {
    if (session?.user) {
      // Logged in - save session
      savePomodoroSession(sessionData, completed);
    } else if (completed) {
      // Not logged in and completed - show login toast
      setShowLoginToast(true);
    }
  },
});
```

- [ ] **Step 3: Add Toast rendering**

Add before closing `</div>`:
```tsx
{showLoginToast && (
  <LoginToast onClose={() => setShowLoginToast(false)} />
)}
```

- [ ] **Step 4: Verify build**

Run: `pnpm --filter=web build 2>&1 | grep -E "(error|Error|✓)"`
Expected: `✓ Compiled successfully`

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/components/PomoTimer.tsx
git commit -m "feat(timer): integrate LoginToast and auth check for session recording"
```

---

## Task 8: Verify end-to-end

- [ ] **Step 1: Start both servers**

```bash
# Terminal 1: Start backend
cd apps/server && pnpm dev

# Terminal 2: Start frontend
cd apps/web && pnpm dev
```

- [ ] **Step 2: Test scenarios**

1. Login → Start timer → Let it complete → Check backend `pomo_session` table
2. Login → Start timer → Manually stop → Check `completed=false`
3. Not login → Start timer → Let it complete → See login toast
4. Login → Start timer → Switch mode → Check both sessions recorded

---

## Summary

| Task | Description |
|------|-------------|
| 1 | Add `CurrentSessionAtom` and `isModeSwitchingAtom` to timer.ts |
| 2 | Create `lib/session.ts` with API wrapper |
| 3 | Modify `toggleTimerAtom` to set `currentSessionAtom` on start |
| 4 | Modify `switchModeAtom` to set `isModeSwitchingAtom` flag |
| 5 | Add `useEffect` to `usePomoTimer` to record on stop |
| 6 | Create `LoginToast` component |
| 7 | Integrate `LoginToast` into `PomoTimer` |
| 8 | End-to-end verification |
