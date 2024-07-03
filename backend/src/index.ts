import { Hono } from 'hono'
import { userRouter } from './routes/user'
import { blogRouter } from './routes/blog'
import { cors } from 'hono/cors'

const app = new Hono()
  app.use("*",cors({
    origin:['http://localhost:5173'],
    allowMethods:['POST','GET','OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length'],
    credentials: true,
  }))

  // Add this to handle OPTIONS requests explicitly
app.options('*', (c) => {
  return c.text('', 204)
})


  app.route("/api/v1/user", userRouter)
  app.route("/api/v1/blog",blogRouter)

export default app
