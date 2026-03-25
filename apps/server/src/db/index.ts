import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import * as schema from './schema'

const dbUrl = process.env.DATABASE_URL || './data/pomodoro.db'
const sqlite = createClient({ url: dbUrl.startsWith('file:') ? dbUrl : `file:${dbUrl}` })
export const db = drizzle(sqlite, { schema })

export type DB = typeof db