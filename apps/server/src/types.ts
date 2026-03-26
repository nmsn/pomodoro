import type { User, NewUser } from './db/schema/users'
import type { userSettings } from './db/schema/settings'
import type { pomoSession } from './db/schema/sessions'
import type { dailyStats } from './db/schema/stats'

export type { User, NewUser }

export interface Settings extends Omit<typeof userSettings.$inferSelect, 'updatedAt'> {
  updatedAt: number
}

export interface Session extends Omit<typeof pomoSession.$inferSelect, 'startTime' | 'endTime'> {
  startTime: number
  endTime: number | null
}

export interface DailyStat extends Omit<typeof dailyStats.$inferSelect, 'date'> {
  date: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

export interface SSEEvent {
  type: 'settings_update' | 'ping'
  data?: unknown
}