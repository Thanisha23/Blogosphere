import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'
import { signupInput,signinInput } from 'blogosphere-common'
import bcrypt from "bcrypt"


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
    //checking if the user exists in user
    const existingUser = await prisma.user.findUnique({
     where:{
      email:body.email
     }
    })
    if(existingUser) {
      c.status(409);//conflict stauts
      return c.json({message: "User with this email already exists"})
    }

    const {success} = signupInput.safeParse(body);

    if(!success){
      //411 -> Incorrect inputs
      c.status(411);
      return c.json({
        message: "Inputs are not correct"
      })
    }
    
    const hashedPassword = await bcrypt.hash(body.password,10)
    try {
      const user = await prisma.user.create({
        data:{
          email:body.email,
          password:hashedPassword,
          name:body.name
        }
      });
      const jwt = await sign({id: user.id},c.env.JWT_SECRET);

       // Add CORS headers
  c.header('Access-Control-Allow-Origin', 'http://localhost:5173')
  c.header('Access-Control-Allow-Methods', 'POST, OPTIONS')
  c.header('Access-Control-Allow-Headers', 'Content-Type')
      return c.json({
        jwt:jwt,
        message:"Signup successful"
      })
    } catch (error) {
      c.status(403);
      return c.json({ error: "Error while signing up" });
     
    }
})


userRouter.post("/signin",async(c) => {
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();

  const {success} = signinInput.safeParse(body);
  if(!success){
    c.status(411);
    return c.json({
      message: "Inputs are not correct"
    })
  }


try {
  const user = await prisma.user.findFirst({
		where: {
			email: body.email
		}
	});

	if (!user) {
		c.status(403);
		return c.json({ error: "user not found" });
	}

  const isMatch = await bcrypt.compare(body.password,user.password)
  if(isMatch){
    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);

   // Add CORS headers
   c.header('Access-Control-Allow-Origin', 'http://localhost:5173')
   c.header('Access-Control-Allow-Methods', 'POST, OPTIONS')
   c.header('Access-Control-Allow-Headers', 'Content-Type')
	return c.json({
    jwt:jwt,
    message:"Successful Signin"
  })
  }else{
    return c.json({
      message: "Incorrect password!"
    })
  }
} catch (error) {
  c.status(500);
  return c.json({
      error:"Internal server error"
  })
}

})

