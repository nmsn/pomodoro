import { Hono } from 'hono'
import { z } from 'zod'
import { getSettings, updateSettings } from '../services/settings'
import { requireAuthMiddleware, type AuthVariables } from '../middleware/auth'

const app = new Hono<{ Variables: AuthVariables }>()

app.use('/*', requireAuthMiddleware)

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
  const userId = c.get('userId')!
  const settings = await getSettings(userId)
  return c.json({ success: true, data: settings })
})

app.patch('/', async (c) => {
  const userId = c.get('userId')!

  const body = await c.req.json()
  const parsed = updateSchema.safeParse(body)

  if (!parsed.success) {
    return c.json({ success: false, error: parsed.error.message }, 400)
  }

  const settings = await updateSettings(userId, parsed.data)
  return c.json({ success: true, data: settings })
})

export default app
