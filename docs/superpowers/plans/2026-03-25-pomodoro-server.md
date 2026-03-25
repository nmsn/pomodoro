# Pomodoro Server Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建 `apps/server` 后端服务，提供 GitHub OAuth 登录、用户配置同步、番茄钟使用统计功能

**Architecture:** Hono 框架 + SQLite(Drizzle ORM) + Redis(Session) + better-auth(GitHub OAuth) + SSE(实时推送)

**Tech Stack:** hono, drizzle-orm, better-auth, zod, drizzle-kit, better-sqlite3, ioredis

---

## 文件结构

```
apps/server/
├── src/
│   ├── db/
│   │   ├── index.ts              # Drizzle 客户端 + Redis 连接
│   │   └── schema/
│   │       ├── users.ts          # users 表
│   │       ├── settings.ts       # user_settings 表
│   │       ├── sessions.ts       # pomodoro_sessions 表
│   │       └── stats.ts          # daily_stats 表
│   ├── routes/
│   │   ├── auth.ts               # better-auth 路由
│   │   ├── settings.ts           # 设置 CRUD
│   │   ├── sessions.ts           # 会话记录
│   │   ├── stats.ts              # 统计查询
│   │   └── sse.ts                # SSE 实时推送
│   ├── middleware/
│   │   └── auth.ts               # 鉴权中间件 (从 better-auth session 提取 userId)
│   ├── services/
│   │   ├── settings.ts           # 设置服务
│   │   ├── session.ts            # 会话服务
│   │   └── stats.ts              # 统计服务
│   ├── lib/
│   │   └── sseClients.ts          # SSE 客户端管理器
│   ├── index.ts                  # 入口，注册所有路由
│   └── types.ts                  # 类型定义
├── drizzle.config.ts             # Drizzle 配置
├── package.json
├── tsconfig.json
└── .env.example                  # 环境变量示例
```

---

## Task 1: 项目脚手架

**Files:**
- Create: `apps/server/package.json`
- Create: `apps/server/tsconfig.json`
- Create: `apps/server/.env.example`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@pomodoro/server",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  },
  "dependencies": {
    "hono": "^4.0.0",
    "@hono/node-server": "^1.0.0",
    "better-auth": "^1.0.0",
    "drizzle-orm": "^0.38.0",
    "better-sqlite3": "^11.0.0",
    "drizzle-kit": "^0.30.0",
    "ioredis": "^5.0.0",
    "zod": "^3.0.0",
    "nanoid": "^5.0.0"
  },
  "devDependencies": {
    "@types/better-sqlite3": "^7.0.0",
    "@types/ioredis": "^4.0.0",
    "@types/nanoid": "^3.0.0",
    "tsx": "^4.0.0",
    "typescript": "^5.0.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "resolveJsonModule": true,
    "declaration": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create .env.example**

```env
DATABASE_URL=./data/pomodoro.db
REDIS_URL=redis://localhost:6379
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
BETTER_AUTH_SECRET=your_better_auth_secret
```

- [ ] **Step 4: Commit**

```bash
git add apps/server/package.json apps/server/tsconfig.json apps/server/.env.example
git commit -m "feat(server): scaffold project structure"
```

---

## Task 2: 数据库 Schema

**Files:**
- Create: `apps/server/src/db/index.ts`
- Create: `apps/server/src/db/schema/users.ts`
- Create: `apps/server/src/db/schema/settings.ts`
- Create: `apps/server/src/db/schema/sessions.ts`
- Create: `apps/server/src/db/schema/stats.ts`
- Create: `apps/server/src/db/schema/index.ts`
- Create: `apps/server/drizzle.config.ts`

- [ ] **Step 1: Create drizzle.config.ts**

```ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schema/index.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DATABASE_URL || './data/pomodoro.db',
  },
})
```

- [ ] **Step 2: Create users.ts schema**

```ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email'),
  name: text('name'),
  avatarUrl: text('avatar_url'),
  githubId: text('github_id'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
```

- [ ] **Step 3: Create settings.ts schema**

```ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const userSettings = sqliteTable('user_settings', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  theme: text('theme').default('system'),
  background: text('background').default('default'),
  workDuration: integer('work_duration').default(25),
  breakDuration: integer('break_duration').default(5),
  timerType: text('timer_type').default('pomodoro'),
  soundEnabled: integer('sound_enabled', { mode: 'boolean' }).default(true),
  notificationsEnabled: integer('notifications_enabled', { mode: 'boolean' }).default(true),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})
```

- [ ] **Step 4: Create sessions.ts schema**

```ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const pomodoroSessions = sqliteTable('pomodoro_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  timerType: text('timer_type').notNull(),
  mode: text('mode').notNull(), // 'work' | 'break'
  startTime: integer('start_time', { mode: 'timestamp' }).notNull(),
  endTime: integer('end_time', { mode: 'timestamp' }),
  duration: integer('duration').notNull().default(0), // seconds
  completed: integer('completed', { mode: 'boolean' }).default(false),
})
```

- [ ] **Step 5: Create stats.ts schema**

```ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const dailyStats = sqliteTable('daily_stats', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  date: text('date').notNull(), // YYYY-MM-DD
  totalFocusMinutes: integer('total_focus_minutes').default(0),
  completedPomodoros: integer('completed_pomodoros').default(0),
})
```

- [ ] **Step 6: Create schema/index.ts**

```ts
export * from './users'
export * from './settings'
export * from './sessions'
export * from './stats'
```

- [ ] **Step 7: Create db/index.ts (Drizzle client + Redis)**

```ts
import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import Redis from 'ioredis'
import * as schema from './schema'

const sqlite = new Database(process.env.DATABASE_URL || './data/pomodoro.db')
export const db = drizzle(sqlite, { schema })

export const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

export type DB = typeof db
```

- [ ] **Step 8: Commit**

```bash
git add apps/server/src/db/ apps/server/drizzle.config.ts
git commit -m "feat(server): add database schema with drizzle"
```

---

## Task 3: 类型定义

**Files:**
- Create: `apps/server/src/types.ts`

- [ ] **Step 1: Create types.ts**

```ts
import { User, NewUser } from './db/schema/users'
import { userSettings } from './db/schema/settings'
import { pomodoroSessions } from './db/schema/sessions'
import { dailyStats } from './db/schema/stats'

export type { User, NewUser }

export interface Settings extends Omit<typeof userSettings.$inferSelect, 'updatedAt'> {
  updatedAt: number
}

export interface Session extends Omit<typeof pomodoroSessions.$inferSelect, 'startTime' | 'endTime'> {
  startTime: number
  endTime: number | null
}

export interface DailyStat extends Omit<typeof dailyStats.$inferSelect, 'date'> {
  date: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

export interface SSEEvent {
  type: 'settings_update' | 'ping'
  data?: unknown
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/server/src/types.ts
git commit -m "feat(server): add type definitions"
```

---

## Task 4: better-auth 集成

**Files:**
- Create: `apps/server/src/lib/auth.ts`
- Create: `apps/server/src/routes/auth.ts`

- [ ] **Step 1: Create auth.ts (better-auth instance)**

```ts
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '../db'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
  }),
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  advanced: {
    generateCustomUserId: () => crypto.randomUUID(),
  },
})

export type Auth = typeof auth
```

- [ ] **Step 2: Create auth.ts routes**

better-auth 自身已经处理好了 session 验证，这里只需直接挂载其 handler。

```ts
import { Hono } from 'hono'
import { auth } from '../lib/auth'

const app = new Hono()

// better-auth 会自动处理 /sign-in/github, /sign-out 等路由
app.route('/', auth)

export default app
```

- [ ] **Step 3: Commit**

```bash
git add apps/server/src/lib/auth.ts apps/server/src/routes/auth.ts
git commit -m "feat(server): integrate better-auth with GitHub OAuth"
```

---

## Task 5: 鉴权中间件

**Files:**
- Create: `apps/server/src/middleware/auth.ts`

- [ ] **Step 1: Create auth middleware**

```ts
import { Context, Next } from 'hono'
import { auth } from '../lib/auth'

export interface AuthVariables {
  userId: string
  session: {
    id: string
    userId: string
    expiresAt: Date
  } | null
}

export async function authMiddleware(c: Context, next: Next) {
  // better-auth 会自动从 cookie 中解析 session
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })

  if (session) {
    c.set('userId', session.user.id)
    c.set('session', {
      id: session.session.id,
      userId: session.user.id,
      expiresAt: new Date(session.session.expiresAt),
    })
  }

  await next()
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/server/src/middleware/auth.ts
git commit -m "feat(server): add auth middleware"
```

---

## Task 6: SSE 客户端管理

**Files:**
- Create: `apps/server/src/lib/sseClients.ts`

- [ ] **Step 1: Create SSE clients manager**

```ts
type SSEClient = {
  userId: string
  controller: ReadableStreamDefaultController
}

const clients = new Map<string, Set<SSEClient>>()

export function addSSEClient(userId: string, controller: ReadableStreamDefaultController) {
  if (!clients.has(userId)) {
    clients.set(userId, new Set())
  }
  clients.get(userId)!.add({ userId, controller })
}

export function removeSSEClient(userId: string, controller: ReadableStreamDefaultController) {
  const userClients = clients.get(userId)
  if (userClients) {
    userClients.forEach(client => {
      if (client.controller === controller) {
        userClients.delete(client)
      }
    })
    if (userClients.size === 0) {
      clients.delete(userId)
    }
  }
}

export function broadcastToUser(userId: string, event: string, data: unknown) {
  const userClients = clients.get(userId)
  if (userClients) {
    const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
    userClients.forEach(client => {
      try {
        client.controller.enqueue(new TextEncoder().encode(message))
      } catch {
        // Client disconnected
      }
    })
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/server/src/lib/sseClients.ts
git commit -m "feat(server): add SSE client manager"
```

---

## Task 7: 设置服务与路由

**Files:**
- Create: `apps/server/src/services/settings.ts`
- Create: `apps/server/src/routes/settings.ts`

- [ ] **Step 1: Create settings service**

```ts
import { db } from '../db'
import { userSettings } from '../db/schema/settings'
import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { broadcastToUser } from '../lib/sseClients'

export interface UpdateSettingsInput {
  theme?: string
  background?: string
  workDuration?: number
  breakDuration?: number
  timerType?: string
  soundEnabled?: boolean
  notificationsEnabled?: boolean
}

export async function getSettings(userId: string) {
  const settings = await db.query.userSettings.findFirst({
    where: eq(userSettings.userId, userId),
  })
  return settings
}

export async function createSettings(userId: string) {
  const id = nanoid()
  const [settings] = await db.insert(userSettings).values({
    id,
    userId,
    theme: 'system',
    background: 'default',
    workDuration: 25,
    breakDuration: 5,
    timerType: 'pomodoro',
    soundEnabled: true,
    notificationsEnabled: true,
  }).returning()
  return settings
}

export async function updateSettings(userId: string, input: UpdateSettingsInput) {
  let settings = await getSettings(userId)
  if (!settings) {
    settings = await createSettings(userId)
  }

  const [updated] = await db.update(userSettings)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(userSettings.userId, userId))
    .returning()

  // Broadcast to all connected clients of this user
  broadcastToUser(userId, 'settings_update', updated)

  return updated
}
```

- [ ] **Step 2: Create settings routes**

```ts
import { Hono } from 'hono'
import { z } from 'zod'
import { getSettings, updateSettings } from '../services/settings'
import { authMiddleware } from '../middleware/auth'

const app = new Hono()

app.use('/*', authMiddleware)

const updateSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  background: z.string().optional(),
  workDuration: z.number().min(1).max(120).optional(),
  breakDuration: z.number().min(1).max(60).optional(),
  timerType: z.string().optional(),
  soundEnabled: z.boolean().optional(),
  notificationsEnabled: z.boolean().optional(),
})

app.get('/', async (c) => {
  const userId = c.get('userId')
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const settings = await getSettings(userId)
  return c.json({ success: true, data: settings })
})

app.patch('/', async (c) => {
  const userId = c.get('userId')
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const body = await c.req.json()
  const parsed = updateSchema.safeParse(body)

  if (!parsed.success) {
    return c.json({ success: false, error: parsed.error.message }, 400)
  }

  const settings = await updateSettings(userId, parsed.data)
  return c.json({ success: true, data: settings })
})

export default app
```

- [ ] **Step 3: Commit**

```bash
git add apps/server/src/services/settings.ts apps/server/src/routes/settings.ts
git commit -m "feat(server): add settings service and routes"
```

---

## Task 8: 会话服务与路由

**Files:**
- Create: `apps/server/src/services/session.ts`
- Create: `apps/server/src/routes/sessions.ts`

- [ ] **Step 1: Create session service**

```ts
import { db } from '../db'
import { pomodoroSessions } from '../db/schema/sessions'
import { dailyStats } from '../db/schema/stats'
import { eq, and, desc } from 'drizzle-orm'
import { nanoid } from 'nanoid'

export interface CreateSessionInput {
  timerType: string
  mode: 'work' | 'break'
  startTime: number
  endTime: number
  duration: number
  completed: boolean
}

export async function createSession(userId: string, input: CreateSessionInput) {
  const id = nanoid()

  const [session] = await db.insert(pomodoroSessions).values({
    id,
    userId,
    ...input,
  }).returning()

  // Update daily stats if this was a completed work session
  if (input.completed && input.mode === 'work') {
    const today = new Date().toISOString().split('T')[0]
    const focusMinutes = Math.floor(input.duration / 60)

    const existing = await db.query.dailyStats.findFirst({
      where: and(
        eq(dailyStats.userId, userId),
        eq(dailyStats.date, today)
      ),
    })

    if (existing) {
      await db.update(dailyStats)
        .set({
          totalFocusMinutes: existing.totalFocusMinutes + focusMinutes,
          completedPomodoros: existing.completedPomodoros + 1,
        })
        .where(eq(dailyStats.id, existing.id))
    } else {
      await db.insert(dailyStats).values({
        id: nanoid(),
        userId,
        date: today,
        totalFocusMinutes: focusMinutes,
        completedPomodoros: 1,
      })
    }
  }

  return session
}

export async function getSessions(userId: string, limit = 50) {
  const sessions = await db.query.pomodoroSessions.findMany({
    where: eq(pomodoroSessions.userId, userId),
    orderBy: [desc(pomodoroSessions.startTime)],
    limit,
  })
  return sessions
}
```

- [ ] **Step 2: Create sessions routes**

```ts
import { Hono } from 'hono'
import { z } from 'zod'
import { createSession, getSessions } from '../services/session'
import { authMiddleware } from '../middleware/auth'

const app = new Hono()

app.use('/*', authMiddleware)

const createSessionSchema = z.object({
  timerType: z.string(),
  mode: z.enum(['work', 'break']),
  startTime: z.number(),
  endTime: z.number(),
  duration: z.number(),
  completed: z.boolean(),
})

app.post('/', async (c) => {
  const userId = c.get('userId')
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const body = await c.req.json()
  const parsed = createSessionSchema.safeParse(body)

  if (!parsed.success) {
    return c.json({ success: false, error: parsed.error.message }, 400)
  }

  const session = await createSession(userId, parsed.data)
  return c.json({ success: true, data: session }, 201)
})

app.get('/', async (c) => {
  const userId = c.get('userId')
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const limit = parseInt(c.req.query('limit') || '50')
  const sessions = await getSessions(userId, limit)
  return c.json({ success: true, data: sessions })
})

export default app
```

- [ ] **Step 3: Commit**

```bash
git add apps/server/src/services/session.ts apps/server/src/routes/sessions.ts
git commit -m "feat(server): add session service and routes"
```

---

## Task 9: 统计服务与路由

**Files:**
- Create: `apps/server/src/services/stats.ts`
- Create: `apps/server/src/routes/stats.ts`

- [ ] **Step 1: Create stats service**

```ts
import { db } from '../db'
import { dailyStats } from '../db/schema/stats'
import { eq, and, gte, lte, desc } from 'drizzle-orm'

export async function getDailyStats(userId: string, date: string) {
  const stats = await db.query.dailyStats.findFirst({
    where: and(
      eq(dailyStats.userId, userId),
      eq(dailyStats.date, date)
    ),
  })
  return stats
}

export async function getWeeklyStats(userId: string) {
  const today = new Date()
  const weekAgo = new Date(today)
  weekAgo.setDate(weekAgo.getDate() - 7)

  const stats = await db.query.dailyStats.findMany({
    where: and(
      eq(dailyStats.userId, userId),
      gte(dailyStats.date, weekAgo.toISOString().split('T')[0])
    ),
    orderBy: [desc(dailyStats.date)],
  })

  // Fill in missing days with zeros
  const result = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const existing = stats.find(s => s.date === dateStr)
    result.push(existing || {
      id: '',
      userId,
      date: dateStr,
      totalFocusMinutes: 0,
      completedPomodoros: 0,
    })
  }

  return result
}
```

- [ ] **Step 2: Create stats routes**

```ts
import { Hono } from 'hono'
import { getDailyStats, getWeeklyStats } from '../services/stats'
import { authMiddleware } from '../middleware/auth'

const app = new Hono()

app.use('/*', authMiddleware)

app.get('/daily', async (c) => {
  const userId = c.get('userId')
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const date = c.req.query('date') || new Date().toISOString().split('T')[0]
  const stats = await getDailyStats(userId, date)
  return c.json({ success: true, data: stats })
})

app.get('/weekly', async (c) => {
  const userId = c.get('userId')
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const stats = await getWeeklyStats(userId)
  return c.json({ success: true, data: stats })
})

export default app
```

- [ ] **Step 3: Commit**

```bash
git add apps/server/src/services/stats.ts apps/server/src/routes/stats.ts
git commit -m "feat(server): add stats service and routes"
```

---

## Task 10: SSE 路由

**Files:**
- Create: `apps/server/src/routes/sse.ts`

- [ ] **Step 1: Create SSE routes**

```ts
import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'
import { addSSEClient, removeSSEClient } from '../lib/sseClients'

const app = new Hono()

app.use('/*', authMiddleware)

app.get('/', async (c) => {
  const userId = c.get('userId')
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const encoder = new TextEncoder()
  let controllerRef: ReadableStreamDefaultController | null = null

  const stream = new ReadableStream({
    start(controller) {
      controllerRef = controller
      addSSEClient(userId, controller)

      // Send initial ping
      controller.enqueue(encoder.encode(`event: ping\ndata: {}\n\n`))

      // Keep-alive ping every 30 seconds
      const interval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`event: ping\ndata: {}\n\n`))
        } catch {
          clearInterval(interval)
        }
      }, 30000)
    },
    cancel() {
      if (controllerRef) {
        removeSSEClient(userId, controllerRef)
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
})

export default app
```

- [ ] **Step 2: Commit**

```bash
git add apps/server/src/routes/sse.ts
git commit -m "feat(server): add SSE routes for real-time updates"
```

---

## Task 11: 主入口

**Files:**
- Create: `apps/server/src/index.ts`

- [ ] **Step 1: Create main entry point**

```ts
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { auth } from './lib/auth'
import settingsRoute from './routes/settings'
import sessionsRoute from './routes/sessions'
import statsRoute from './routes/stats'
import sseRoute from './routes/sse'

const app = new Hono()

// CORS for web app
app.use('/*', cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}))

// Health check
app.get('/health', (c) => c.json({ status: 'ok' }))

// Mount better-auth routes
app.route('/api/auth', auth.handler)

// Mount API routes
app.route('/api/settings', settingsRoute)
app.route('/api/sessions', sessionsRoute)
app.route('/api/stats', statsRoute)
app.route('/api/sse', sseRoute)

const port = parseInt(process.env.PORT || '3001')

console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})
```

- [ ] **Step 2: Commit**

```bash
git add apps/server/src/index.ts
git commit -m "feat(server): add main entry point with all routes"
```

---

## Task 12: 初始化数据库迁移

- [ ] **Step 1: Run database push**

```bash
cd apps/server && pnpm install
cd apps/server && pnpm db:push
```

- [ ] **Step 2: Commit schema migration**

```bash
git add drizzle/
git commit -m "feat(server): add database migrations"
```

---

## 验收标准

- [ ] GitHub OAuth 登录正常
- [ ] 用户设置可正常读写
- [ ] 设置变更后 SSE 推送成功
- [ ] 番茄钟会话可正常记录
- [ ] 统计数据查询正常
