import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import Redis from 'ioredis'
import * as schema from './schema'

const sqlite = new Database(process.env.DATABASE_URL || './data/pomodoro.db')
export const db = drizzle(sqlite, { schema })

export const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

export type DB = typeof db