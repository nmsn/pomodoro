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

// Mount better-auth at /auth
app.all('/auth/*', async (c) => {
  return await auth.handler(c.req.raw)
})

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
