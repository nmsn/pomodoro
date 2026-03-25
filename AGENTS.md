# Agent Instructions

## Project Context

This is a monorepo with two apps:
- **web**: A Next.js pomodoro timer frontend using Jotai for state
- **server**: A Hono backend for user auth and data sync

## Web App Patterns

### State Management (Jotai)
- `src/atoms/timer.ts` - Timer state atoms
- `src/atoms/theme.ts` - Theme mode atoms
- `src/atoms/background.ts` - Background effect atoms

Atoms follow this pattern:
```typescript
// Read-only atom
export const timerTypeAtom = atom<TimerType>("pomodoro")

// Derived atom
export const timerStateAtom = atom<TimerState>((get) => {
  return { ... }
})

// Write-only atom (action)
export const toggleTimerAtom = atom(null, (get, set) => {
  set(isActiveAtom, !get(isActiveAtom))
})
```

### Components
- Use `cn()` from `lib/utils.ts` for class merging
- shadcn/ui components in `components/ui/`
- Timer components in root `components/`

## Server App Patterns

### API Structure
- `src/routes/` - Route handlers (auth, settings, sessions, stats, sse)
- `src/services/` - Business logic
- `src/middleware/auth.ts` - Session-based auth middleware

### Database
- Drizzle ORM with SQLite via @libsql/client
- Schemas in `src/db/schema/`
- Run `pnpm db:push` after schema changes

## Development

1. Use `pnpm` for package management
2. Use `--filter` to target specific apps
3. Server runs on port 3001, web on 3000
4. Use worktrees for feature branches
