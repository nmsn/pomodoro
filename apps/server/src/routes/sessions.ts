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