import { Hono } from 'hono'
import { getDailyStats, getWeeklyStats } from '../services/stats'
import { requireAuthMiddleware, type AuthVariables } from '../middleware/auth'

const app = new Hono<{ Variables: AuthVariables }>()

app.use('/*', requireAuthMiddleware)

app.get('/daily', async (c) => {
  const userId = c.get('userId')!

  const date = c.req.query('date') ?? new Date().toISOString().split('T')[0]
  const stats = await getDailyStats(userId, date)
  return c.json({ success: true, data: stats })
})

app.get('/weekly', async (c) => {
  const userId = c.get('userId')!

  const stats = await getWeeklyStats(userId)
  return c.json({ success: true, data: stats })
})

export default app