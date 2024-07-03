import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from 'hono/jwt'
import { createBlog,updateBlog } from 'blogosphere-common'

export const blogRouter = new Hono<{
    Bindings:{
        DATABASE_URL:string
        JWT_SECRET:string
    },
    Variables:{
        prisma:PrismaClient,
        userId:string
    }
}>();

blogRouter.use("/*",async(c,next) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    c.set("prisma",prisma as any);
   
    if (c.req.method === 'GET') {
        await next();
        return;
      }


    const authHeader = c.req.header("Authorization") || "";
    
    try {
        const user = await verify(authHeader,c.env.JWT_SECRET);
        if(user){
            // const userId = user.id;
            c.set("userId",user.id as any);
    
            await next();
        }else{
            c.status(403);
    
            return c.json({
                message:"You are not logged in!"
            })
        }
    } catch (error) {
        console.log("jwt verification error: ",error);
        c.status(403);
        return c.json({
            message:"Invalid token",
        })
      }

})

  //We should add pagination here...i.e returning only first 10 blogs and then user can request more 10 later
  blogRouter.get('/bulk', async(c) => {
    const prisma = c.get("prisma");

   try {
    const blogs = await prisma.blog.findMany({
        select: {
            content :true,
            title: true,
            id: true,
            author: {
                select: {
                    name:true
                }
            }
        }
    });
  

    if(blogs.length === 0){
        return c.json({
            message:"No blog posts found"
        },404);
    }
    return c.json({
        blogs
    });
   } catch (error) {
    console.error("error fetching blogs", error);
    c.status(500);
    return c.json({ message: "Error while fetching blogs" });
  }
  })


  blogRouter.get('/count', async (c) => {
    const prisma = c.get("prisma");
    try {
      const count = await prisma.blog.count();
      return c.json({ count });
    } catch (error) {
      console.error('Error counting blogs:', error);
      return c.json({ error: 'Failed to count blogs' }, 500);
    }
  });

blogRouter.get('/:id', async(c) => {
    const id = c.req.param("id");
   const prisma = c.get("prisma");

   try {
    const blog = await prisma.blog.findUnique({
        where:{
            id: id
        },
        select: {
            id:true,
            title: true,
            content: true,
            author: {
               select: {
                name: true
               }
            }
        }
    })
    if(!blog){
        return c.json({
            error:"Blog post not found"
        },404)
    }

    return c.json({
        blog
    })
   } catch (error) {
    c.status(411);
    return c.json({
        message:"Error while fetching the requested blog post"
    });
   }
  })






blogRouter.post("/hi",(c) => {
   return c.text("middleware successful")
})


blogRouter.post("/",async (c) => {
    const prisma = c.get("prisma");
    const userId = c.get("userId");
    const body = await c.req.json();
    const {success} = createBlog.safeParse(body);
    if (!success) {
		c.status(411);
		return c.json({ error: "Inputs are not correct"});
	}
    try {
        const blog = await prisma.blog.create({
            data:{
                title:body.title,
                content:body.content,
                authorId:userId
            }
        })
        return c.json({
            id:blog.id
        })
    } catch (error) {
        console.error("error creating blog",error);
        return c.json({
            error:"Failed to create blog post"
        }, 500)
       }
})

blogRouter.put('/',async (c) => {
    const userId = c.get("userId"); 
    const prisma = c.get("prisma")
    const body = await c.req.json();
    const {success} = updateBlog.safeParse(body);
    if (!success) {
		c.status(411);
		return c.json({ error: "Inputs are not correct"});
	}
 try {
    const blog = await prisma.blog.update({
  
        where:{
            id:body.id,
            authorId:userId
        },
        data:{
            title:body.title,
            content:body.content,
        }
    })
    return c.json({
        id:blog.id,
        message:"Updated blog!"
    })
 } catch (error) {
    return c.json({
        message:"Error in updating blog"
    })
 }
  })




