import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { user } from './users'

export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  token: text('token').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export const pomoSession = sqliteTable('pomo_session', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id),
  timerType: text('timer_type').notNull(),
  mode: text('mode').notNull(), // 'work' | 'break'
  startTime: integer('start_time', { mode: 'timestamp' }).notNull(),
  endTime: integer('end_time', { mode: 'timestamp' }),
  duration: integer('duration').notNull().default(0), // seconds
  completed: integer('completed', { mode: 'boolean' }).default(false),
})