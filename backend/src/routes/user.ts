import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from 'hono/jwt'
import { signupInput, signinInput } from 'blogosphere-common'
import * as bcrypt from "bcryptjs"

export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string,
        FRONTEND_URL: string,
        ADMIN_SECRET:string
    },
    Variables: {
        prisma: PrismaClient,
        userId: string,
        isAdmin: boolean,

    }
}>();

// Middleware for setting up Prisma
userRouter.use('*', async (c, next) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    c.set("prisma", prisma as any);
    await next();
});

// Middleware for authentication (excluding signup and signin)
userRouter.use('*', async (c, next) => {
    // Bypass authentication for signup and signin routes
    if (c.req.path.endsWith('/signup') || c.req.path.endsWith('/signin') || c.req.path.endsWith("/admin-signup")) {
        await next();
        return;
    }

    const authHeader = c.req.header("Authorization") || "";
    
    try {
        const user = await verify(authHeader, c.env.JWT_SECRET);
        if (user) {
            c.set("userId", user.id as any);
            c.set("isAdmin", user.isAdmin as boolean);
            await next();
        } else {
            c.status(403);
            return c.json({ message: "You are not logged in!" });
        }
    } catch (error) {
        console.log("jwt verification error: ", error);
        c.status(403);
        return c.json({ message: "Invalid token" });
    }
});

async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}

// Signup route
userRouter.post("/signup", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    
    const body = await c.req.json();
    const { success } = signupInput.safeParse(body);

    if (!success) {
        c.status(411);
        return c.json({ message: "Inputs are not correct" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: body.email } });
    if (existingUser) {
        c.status(409);
        return c.json({ message: "User with this email already exists" });
    }

    const hashedPassword = await hashPassword(body.password);
    
    try {
        const user = await prisma.user.create({
            data: {
                email: body.email,
                password: hashedPassword,
                name: body.name,
                isAdmin: false
            }
        });
        const jwt = await sign({ id: user.id, isAdmin: user.isAdmin }, c.env.JWT_SECRET);

        c.header('Access-Control-Allow-Origin', c.env.FRONTEND_URL);
        c.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
        c.header('Access-Control-Allow-Headers', 'Content-Type');
        
        return c.json({
            jwt: jwt,
            message: "Signup successful",
            userId: user.id,
            isAdmin: user.isAdmin
        });
    } catch (error) {
        c.status(403);
        return c.json({ error: "Error while signing up" });
    }
});

// Signin route
userRouter.post("/signin", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();
    const { success } = signinInput.safeParse(body);
    
    if (!success) {
        c.status(411);
        return c.json({ message: "Inputs are not correct" });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email: body.email } });

        if (!user) {
            c.status(403);
            return c.json({ message: "User not found" });
        }

        const isMatch = await verifyPassword(body.password, user.password);
        if (isMatch) {
            const jwt = await sign({ id: user.id, isAdmin: user.isAdmin }, c.env.JWT_SECRET);

            c.header('Access-Control-Allow-Origin', c.env.FRONTEND_URL);
            c.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
            c.header('Access-Control-Allow-Headers', 'Content-Type');

            return c.json({
                jwt: jwt,
                message: "Successful Signin",
                userId: user.id,
                isAdmin: user.isAdmin
            });
        } else {
            return c.json({ message: "Incorrect password!" });
        }
    } catch (error) {
        c.status(500);
        return c.json({ message: "Internal server error" });
    }
});


//delete my account
userRouter.delete("/delete",async(c) => {
    const prisma = new PrismaClient({
          datasourceUrl: c.env?.DATABASE_URL	,
      }).$extends(withAccelerate());
  
    const body = await c.req.json();
    const userId = body.userId;
  
    if(!userId) {
      return c.json({
        message: "Unauthorised"
      },401);
    }
  
    try {
      const user = await prisma.user.findUnique({
        where: {id: userId}
      });
      if(!user){
        return c.json({
          message:"User not found"
        },404);
      }
     const deletedUser =  await prisma.user.delete({
        where:{id:userId},
        include:{posts:true}
      })
      return c.json({
        message:"Account and associated blogs deleted successfully!",
        deletedBlogs:deletedUser.posts.length
      },200)
    } catch (error) {
      console.log("Error deleting user",error);
      return c.json({ message: "Internal server error"}, 500);
  
    }
  })

  
userRouter.post("/admin-signup",async(c) => {
   const prisma =  c.get("prisma");
   const body = await c.req.json();
   const {email,password,name,adminSecret} = body;

   //to chk if adminSecret is matched
   if(adminSecret !== c.env.ADMIN_SECRET) {
    c.status(403);
    return c.json({
        message: "Invalid admin secret"
    });
   }

   const existingUser = await prisma.user.findUnique({
    where:{
        email
    }
   });

   if(existingUser) {
    c.status(409);
    return c.json({
        message:"User with this email already exists"
    });
   }

   const hashedPassword = await hashPassword(password);
   try {
    const user = await prisma.user.create({
        data:{
            email,
            password:hashedPassword,
            name,
            isAdmin:true
        }
    });

    const jwt = await sign({
        id: user.id,
        isAdmin:user.isAdmin
    },c.env.JWT_SECRET);

    return c.json({
        jwt,
        message:"Admin signup successful",
        userId: user.id,
        isAdmin: user.isAdmin
    })
   } catch (error) {
    c.status(500);
    return c.json({
        error:"Error while sigining up admin"
    })
   }
})