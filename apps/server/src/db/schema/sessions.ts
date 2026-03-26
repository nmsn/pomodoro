import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { users } from './users'

export const pomoSessions = sqliteTable('pomo_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  timerType: text('timer_type').notNull(),
  mode: text('mode').notNull(), // 'work' | 'break'
  startTime: integer('start_time', { mode: 'timestamp' }).notNull(),
  endTime: integer('end_time', { mode: 'timestamp' }),
  duration: integer('duration').notNull().default(0), // seconds
  completed: integer('completed', { mode: 'boolean' }).default(false),
})