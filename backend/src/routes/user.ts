import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'

export const userRouter = new Hono<{
    Bindings:{
        DATABASE_URL:string,
        JWT_SECRET:string
    },
    Variables:{
        prisma:PrismaClient,
        userId:string
    }
}>();

userRouter.post("/signup",async(c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    
    const body = await c.req.json();
    try {
      const user = await prisma.user.create({
        data:{
          email:body.email,
          password:body.password,
          name:body.name
        }
      });
      const jwt = await sign({id: user.id},c.env.JWT_SECRET)
      return c.json({
        jwt:jwt,
        message:"Signup successful"
      })
    } catch (error) {
      c.status(403);
      return c.json({ error: "error while signing up" });
     
    }
})


userRouter.post("/signin",async(c) => {
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();
try {
  const user = await prisma.user.findUnique({
		where: {
			email: body.email
		}
	});

	if (!user) {
		c.status(403);
		return c.json({ error: "user not found" });
	}
  const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
	return c.json({
    jwt:jwt,
    message:"Successful Signin"
  })
} catch (error) {
  c.status(500);
  return c.json({
      error:"Internal server error"
  })
}

})

