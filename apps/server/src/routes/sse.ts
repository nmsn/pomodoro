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