# Pomodoro Server PRD

## 1. 项目概述

**项目名称**: Pomodoro Server
**项目位置**: `apps/server`
**项目类型**: RESTful API 后端服务

### 技术栈

| 模块 | 技术 |
|------|------|
| 框架 | Hono |
| 数据库 | SQLite + Drizzle ORM |
| 缓存/Session | Redis |
| 认证 | better-auth + GitHub OAuth |
| 数据验证 | Zod |
| 实时同步 | Server-Sent Events (SSE) |

### 目标

- 提供 GitHub OAuth 登录
- 存储用户番茄钟使用统计数据
- 同步用户在多设备间的偏好设置（主题、背景、计时器配置等）

---

## 2. 项目结构

```
apps/server/
├── src/
│   ├── db/
│   │   ├── index.ts          # Drizzle 客户端
│   │   └── schema/
│   │       ├── users.ts      # 用户表
│   │       ├── settings.ts   # 用户设置表
│   │       ├── sessions.ts   # 番茄钟会话表
│   │       └── stats.ts      # 每日统计表
│   ├── routes/
│   │   ├── auth.ts           # better-auth 路由
│   │   ├── settings.ts       # 设置 CRUD
│   │   ├── sessions.ts       # 会话记录
│   │   ├── stats.ts          # 统计查询
│   │   └── sse.ts            # SSE 实时推送
│   ├── middleware/
│   │   └── auth.ts           # 鉴权中间件
│   ├── services/
│   │   ├── settings.ts       # 设置服务
│   │   ├── session.ts        # 会话服务
│   │   └── stats.ts          # 统计服务
│   ├── index.ts              # 入口
│   └── types.ts              # 类型定义
├── drizzle.config.ts
├── package.json
└── tsconfig.json
```

---

## 3. 数据库 Schema

### users 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | text (PK) | better-auth 生成 |
| email | text | 用户邮箱 |
| name | text | 用户名 |
| avatarUrl | text | 头像 URL |
| githubId | text | GitHub ID |
| createdAt | integer | 创建时间戳 |
| updatedAt | integer | 更新时间戳 |

### user_settings 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | text (PK) | UUID |
| userId | text (FK) | 关联 users.id |
| theme | text | 主题模式: "light" / "dark" / "system" |
| background | text | 背景效果 |
| workDuration | integer | 专注时长（分钟） |
| breakDuration | integer | 休息时长（分钟） |
| timerType | text | 计时器类型 |
| soundEnabled | integer | 声音开关 (0/1) |
| notificationsEnabled | integer | 通知开关 (0/1) |
| updatedAt | integer | 更新时间戳 |

### pomodoro_sessions 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | text (PK) | UUID |
| userId | text (FK) | 关联 users.id |
| timerType | text | 计时器类型 |
| mode | text | 工作/休息模式: "work" / "break" |
| startTime | integer | 开始时间戳 |
| endTime | integer | 结束时间戳 |
| duration | integer | 实际时长（秒） |
| completed | integer | 是否完成 (0/1) |

### daily_stats 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | text (PK) | UUID |
| userId | text (FK) | 关联 users.id |
| date | text | 日期 (YYYY-MM-DD) |
| totalFocusMinutes | integer | 当日累计专注分钟数 |
| completedPomodoros | integer | 当日完成番茄数 |

---

## 4. API 端点

### 认证 (better-auth 内置)

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/auth/*` | better-auth 内置路由 (登录/登出/会话) |
| POST | `/api/auth/sign-in/github` | GitHub OAuth 登录 |
| POST | `/api/auth/sign-out` | 登出 |

### 用户设置

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/settings` | 获取当前用户设置 |
| PATCH | `/api/settings` | 更新设置（自动 SSE 推送） |

### 番茄钟会话

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/sessions` | 记录一个番茄钟会话 |
| GET | `/api/sessions` | 查询会话历史 |

### 统计数据

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/stats/daily` | 每日统计数据 |
| GET | `/api/stats/weekly` | 周统计数据 |

### 实时推送

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/sse` | SSE 实时推送（设置变更通知） |

---

## 5. 核心功能流程

### 5.1 GitHub 登录流程

1. 用户点击 "通过 GitHub 登录"
2. 前端跳转到 `/api/auth/sign-in/github`
3. better-auth 处理 OAuth 流程
4. 登录成功后，session 存入 Redis
5. 返回用户信息给前端

### 5.2 设置同步流程

1. 用户修改设置（如切换主题）
2. 前端调用 `PATCH /api/settings`
3. 后端更新数据库
4. 后端通过 SSE 推送变更到所有在线客户端
5. 前端接收 SSE 事件，更新本地状态

### 5.3 会话记录流程

1. 用户完成一个番茄钟
2. 前端调用 `POST /api/sessions` 记录会话
3. 后端写入 sessions 表
4. 后端更新/插入 daily_stats 表

---

## 6. 后续扩展

- **Docker 部署**: 预留 `Dockerfile` 和 `docker-compose.yml` 空位
- **周/月统计**: 可扩展 `weekly_stats` / `monthly_stats` 表
- **PiP 配置同步**: 可扩展画中画窗口设置

---

## 7. 验收标准

- [ ] GitHub OAuth 登录正常
- [ ] 用户设置可正常读写
- [ ] 设置变更后 SSE 推送成功
- [ ] 番茄钟会话可正常记录
- [ ] 统计数据查询正常
