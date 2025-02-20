import { Hono } from 'hono'
import { userRouter } from './routes/user'
import { blogRouter } from './routes/blog'
import { cors } from 'hono/cors'
import { adminRouter } from './routes/admin'

const app = new Hono<{
  Bindings:{
    FRONTEND_URL:string
  }
}>()
  app.use("*",async(c,next) => {
    // const origin = c.env.FRONTEND_URL
    const frontendUrls = c.env.FRONTEND_URL.split(",");
    return cors({
    // origin:[origin],
    origin:frontendUrls,
    allowMethods:['POST','GET','PUT','DELETE','OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length'],
    credentials: true,
  })(c,next);

});

  
app.options('*', (c) => {
  return c.text('', 204)
})


  app.route("/api/v1/user", userRouter)
  app.route("/api/v1/blog",blogRouter)
  app.route("/api/admin",adminRouter)

export default app
