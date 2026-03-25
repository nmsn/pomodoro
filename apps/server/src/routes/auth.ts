import { Hono } from 'hono'
import { auth } from '../lib/auth'

const app = new Hono()

// better-auth 导出 handler 作为 Hono 中间件
// @ts-ignore - better-auth 类型与 Hono 有轻微不兼容
app.route('/', auth.handler)

export default app