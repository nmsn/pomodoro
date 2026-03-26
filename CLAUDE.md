# Project: Pomo

A web-based pomodoro timer with multiple timer modes, themes, backgrounds, and cloud sync capabilities.

## Project Structure

```
pomodoro/
├── apps/
│   ├── web/               # Next.js frontend
│   └── server/            # Hono backend API
├── docs/superpowers/      # Design docs & plans
├── CLAUDE.md              # This file
└── AGENTS.md              # Agent instructions
```

## Apps

### apps/web
**Framework**: Next.js 16.1.6 (App Router)
**State**: Jotai atoms
**UI**: TailwindCSS 4 + shadcn/ui (Radix UI)
**Styles**: CSS variables for theming

**Key directories:**
- `src/atoms/` - Jotai state atoms (timer, theme, background)
- `src/components/` - React components
- `src/hooks/` - Custom hooks (usePomodoroTimer, useDocumentPiP)

### apps/server
**Framework**: Hono
**Database**: SQLite + Drizzle ORM + @libsql/client
**Auth**: better-auth + GitHub OAuth
**Validation**: Zod

**Key directories:**
- `src/db/schema/` - Database tables
- `src/routes/` - API routes
- `src/services/` - Business logic

## Tech Stack

| App | Framework | State | UI | Database |
|-----|----------|-------|-----|----------|
| web | Next.js 16 | Jotai | TailwindCSS 4 + shadcn/ui | - |
| server | Hono | - | - | SQLite + Drizzle |

## Timer Modes

| Mode | Work | Break | Type |
|------|------|-------|------|
| pomodoro | 25min | 5min | countdown |
| countdown | 30min | 0 | countdown |
| stopwatch | - | - | stopwatch |
| animedoro | 40min | 20min | countdown |
| 52-17 | 52min | 17min | countdown |

## Data Types (web)

**TimerType**: `"pomodoro" | "countdown" | "stopwatch" | "animedoro" | "52-17"`
**TimerMode**: `"work" | "break"`
**ThemeMode**: `"light" | "dark" | "system"`
**BackgroundTheme**: `"default" | "mesh-blue" | "mesh-purple" | "mesh-orange" | "mesh-green" | "grain-dark" | "grain-light" | "noise-color" | "warp-gradient" | "solid-dark" | "solid-light"`

## Commands

```bash
# Web (from root)
pnpm dev --filter=web

# Server (from root)
pnpm dev --filter=@pomodoro/server
pnpm db:push --filter=@pomodoro/server  # Push schema changes
```

## Design Docs

- [Spec](./docs/superpowers/specs/2026-03-25-pomodoro-server-design.md)
- [Plan](./docs/superpowers/plans/2026-03-25-pomodoro-server.md)
