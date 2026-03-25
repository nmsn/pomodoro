import { db } from '../db'
import { userSettings } from '../db/schema/settings'
import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { broadcastToUser } from '../lib/sseClients'

export interface UpdateSettingsInput {
  theme?: string
  background?: string
  workDuration?: number
  breakDuration?: number
  timerType?: string
  soundEnabled?: boolean
  notificationsEnabled?: boolean
}

export async function getSettings(userId: string) {
  const settings = await db.query.userSettings.findFirst({
    where: eq(userSettings.userId, userId),
  })
  return settings
}

export async function createSettings(userId: string) {
  const id = nanoid()
  const [settings] = await db.insert(userSettings).values({
    id,
    userId,
    theme: 'system',
    background: 'default',
    workDuration: 25,
    breakDuration: 5,
    timerType: 'pomodoro',
    soundEnabled: true,
    notificationsEnabled: true,
  }).returning()
  return settings
}

export async function updateSettings(userId: string, input: UpdateSettingsInput) {
  let settings = await getSettings(userId)
  if (!settings) {
    settings = await createSettings(userId)
  }

  const [updated] = await db.update(userSettings)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(userSettings.userId, userId))
    .returning()

  // Broadcast to all connected clients of this user
  broadcastToUser(userId, 'settings_update', updated)

  return updated
}