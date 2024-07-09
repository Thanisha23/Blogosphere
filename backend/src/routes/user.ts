import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'
import { signupInput,signinInput } from 'blogosphere-common'
import * as bcrypt from "bcryptjs"


export const userRouter = new Hono<{
    Bindings:{
        DATABASE_URL:string,
        JWT_SECRET:string,
        FRONTEND_URL:string
    },
    Variables:{
        prisma:PrismaClient,
        userId:string
    }
}>();

  //function for hashing password
  async function hashPassword(password:string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password,salt);
  }

  //function for verifying password
  async function verifyPassword(password: string,hashedPassword: string): Promise<boolean>{
    return bcrypt.compare(password,hashedPassword)
  }

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
  
    const hashedPassword = await hashPassword(body.password);
    // const hashedPassword = await bcrypt.hash(body.password,10)
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
  c.header('Access-Control-Allow-Origin',c.env.FRONTEND_URL)
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
		return c.json({ message: "User not found" });
	}

  const isMatch = await verifyPassword(body.password,user.password)
  if(isMatch){
    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);

   // Add CORS headers
   c.header('Access-Control-Allow-Origin', c.env.FRONTEND_URL)
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
      message:"Internal server error"
  })
}

})




