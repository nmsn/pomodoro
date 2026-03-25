import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { users } from './users'

export const userSettings = sqliteTable('user_settings', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  theme: text('theme').default('system'),
  background: text('background').default('default'),
  workDuration: integer('work_duration').default(25),
  breakDuration: integer('break_duration').default(5),
  timerType: text('timer_type').default('pomodoro'),
  soundEnabled: integer('sound_enabled', { mode: 'boolean' }).default(true),
  notificationsEnabled: integer('notifications_enabled', { mode: 'boolean' }).default(true),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})