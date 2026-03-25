import { db } from '../db'
import { pomodoroSessions } from '../db/schema/sessions'
import { dailyStats } from '../db/schema/stats'
import { eq, and, desc } from 'drizzle-orm'
import { nanoid } from 'nanoid'

export interface CreateSessionInput {
  timerType: string
  mode: 'work' | 'break'
  startTime: number
  endTime: number
  duration: number
  completed: boolean
}

export async function createSession(userId: string, input: CreateSessionInput) {
  const id = nanoid()

  const [session] = await db.insert(pomodoroSessions).values({
    id,
    userId,
    ...input,
  }).returning()

  // Update daily stats if this was a completed work session
  if (input.completed && input.mode === 'work') {
    const today = new Date().toISOString().split('T')[0]
    const focusMinutes = Math.floor(input.duration / 60)

    const existing = await db.query.dailyStats.findFirst({
      where: and(
        eq(dailyStats.userId, userId),
        eq(dailyStats.date, today)
      ),
    })

    if (existing) {
      await db.update(dailyStats)
        .set({
          totalFocusMinutes: existing.totalFocusMinutes + focusMinutes,
          completedPomodoros: existing.completedPomodoros + 1,
        })
        .where(eq(dailyStats.id, existing.id))
    } else {
      await db.insert(dailyStats).values({
        id: nanoid(),
        userId,
        date: today,
        totalFocusMinutes: focusMinutes,
        completedPomodoros: 1,
      })
    }
  }

  return session
}

export async function getSessions(userId: string, limit = 50) {
  const sessions = await db.query.pomodoroSessions.findMany({
    where: eq(pomodoroSessions.userId, userId),
    orderBy: [desc(pomodoroSessions.startTime)],
    limit,
  })
  return sessions
}