import { Hono } from 'hono'
import { auth } from '../lib/auth'

const app = new Hono()

// better-auth 会自动处理 /sign-in/github, /sign-out 等路由
app.route('/', auth)

export default app