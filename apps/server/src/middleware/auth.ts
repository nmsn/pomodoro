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