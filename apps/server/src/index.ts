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

// Mount better-auth routes - use app.mount for better-auth handler
app_mount('/api/auth', auth.handler)

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

// Helper to mount better-auth handler
function app_mount(path: string, handler: (request: Request) => Promise<Response>) {
  app.use(path + '/*', async (c) => {
    const response = await handler(c.req.raw)
    return response
  })
  app.use(path, async (c) => {
    const response = await handler(c.req.raw)
    return response
  })
}