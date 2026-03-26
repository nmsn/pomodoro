import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { user } from './users'

export const dailyStats = sqliteTable('daily_stats', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id),
  date: text('date').notNull(), // YYYY-MM-DD
  totalFocusMinutes: integer('total_focus_minutes').default(0),
  completedPomos: integer('completed_pomos').default(0),
})