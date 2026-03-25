type SSEClient = {
  controller: ReadableStreamDefaultController
}

const clients = new Map<string, Set<SSEClient>>()

export function addSSEClient(userId: string, controller: ReadableStreamDefaultController) {
  if (!clients.has(userId)) {
    clients.set(userId, new Set())
  }
  clients.get(userId)!.add({ controller })
}

export function removeSSEClient(userId: string, controller: ReadableStreamDefaultController) {
  const userClients = clients.get(userId)
  if (userClients) {
    for (const client of userClients) {
      if (client.controller === controller) {
        userClients.delete(client)
        break
      }
    }
    if (userClients.size === 0) {
      clients.delete(userId)
    }
  }
}

export function broadcastToUser(userId: string, event: string, data: unknown) {
  const userClients = clients.get(userId)
  if (userClients) {
    const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
    for (const client of userClients) {
      try {
        client.controller.enqueue(new TextEncoder().encode(message))
      } catch {
        // Client disconnected
      }
    }
  }
}