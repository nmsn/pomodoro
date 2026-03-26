import type { Context, Next } from 'hono'
import { auth } from '../lib/auth'

export interface AuthVariables {
  userId: string | undefined
  session: {
    id: string
    userId: string
    expiresAt: Date
  } | null
}

// 可选认证中间件 - 设置 userId，但不阻止未登录请求
export async function authMiddleware(c: Context, next: Next) {
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
  } else {
    c.set('userId', undefined)
    c.set('session', null)
  }

  await next()
}

// 必须认证中间件 - 未登录返回 401
export async function requireAuthMiddleware(c: Context, next: Next) {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })

  if (!session) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  c.set('userId', session.user.id)
  c.set('session', {
    id: session.session.id,
    userId: session.user.id,
    expiresAt: new Date(session.session.expiresAt),
  })

  await next()
}