import { db } from '../db'
import { dailyStats } from '../db/schema/stats'
import { eq, and, gte, desc } from 'drizzle-orm'

export async function getDailyStats(userId: string, date: string) {
  const stats = await db.query.dailyStats.findFirst({
    where: and(
      eq(dailyStats.userId, userId),
      eq(dailyStats.date, date)
    ),
  })
  return stats
}

export async function getWeeklyStats(userId: string) {
  const today = new Date()
  const weekAgo = new Date(today)
  weekAgo.setDate(weekAgo.getDate() - 7)

  const stats = await db.query.dailyStats.findMany({
    where: and(
      eq(dailyStats.userId, userId),
      gte(dailyStats.date, weekAgo.toISOString().split('T')[0])
    ),
    orderBy: [desc(dailyStats.date)],
  })

  // Fill in missing days with zeros
  const result = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const existing = stats.find(s => s.date === dateStr)
    result.push(existing || {
      id: '',
      userId,
      date: dateStr,
      totalFocusMinutes: 0,
      completedPomodoros: 0,
    })
  }

  return result
}