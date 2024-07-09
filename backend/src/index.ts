import { Hono } from 'hono'
import { userRouter } from './routes/user'
import { blogRouter } from './routes/blog'
import { cors } from 'hono/cors'

const app = new Hono<{
  Bindings:{
    FRONTEND_URL:string
  }
}>()
  app.use("*",async(c,next) => {
    const origin = c.env.FRONTEND_URL
    cors({
    origin:['http://localhost:5173',origin],
    allowMethods:['POST','GET','OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length'],
    credentials: true,
  })(c,next);

});

  // Add this to handle OPTIONS requests explicitly
app.options('*', (c) => {
  return c.text('', 204)
})


  app.route("/api/v1/user", userRouter)
  app.route("/api/v1/blog",blogRouter)

export default app
