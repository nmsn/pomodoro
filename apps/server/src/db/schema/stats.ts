import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const dailyStats = sqliteTable('daily_stats', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  date: text('date').notNull(), // YYYY-MM-DD
  totalFocusMinutes: integer('total_focus_minutes').default(0),
  completedPomodoros: integer('completed_pomodoros').default(0),
})