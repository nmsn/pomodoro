import { Hono } from 'hono'
import { requireAuthMiddleware, type AuthVariables } from '../middleware/auth'
import { addSSEClient, removeSSEClient } from '../lib/sseClients'

const app = new Hono<{ Variables: AuthVariables }>()

app.use('/*', requireAuthMiddleware)

app.get('/', async (c) => {
  const userId = c.get('userId')!

  const encoder = new TextEncoder()
  let controllerRef: ReadableStreamDefaultController | null = null
  let intervalRef: ReturnType<typeof setInterval> | null = null

  const stream = new ReadableStream({
    start(controller) {
      controllerRef = controller
      addSSEClient(userId, controller)

      controller.enqueue(encoder.encode(`event: ping\ndata: {}\n\n`))

      intervalRef = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`event: ping\ndata: {}\n\n`))
        } catch {
          clearInterval(intervalRef!)
        }
      }, 30000)
    },
    cancel() {
      if (intervalRef) {
        clearInterval(intervalRef)
      }
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