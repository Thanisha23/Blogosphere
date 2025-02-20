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
   

    // the above routes can bypass the authentication thus cannot have access to headers i.e token
    /*
  //so the for eg- c.req.method === 'GET' && !c.req.path.endsWith('/user/me') if req method is 'GET' and doesn't end with /user/me then it will bypass the authorization i.e wont be able to access the token
*/
if (c.req.method === 'GET' && !c.req.path.endsWith('/user/me') && !c.req.path.endsWith("/user/drafts") && !c.req.path.endsWith("/user/myblogs") || c.req.method === 'PUT' || c.req.method === 'DELETE' && !c.req.path.endsWith("/delete")){
        await next();
        return;
      }
    const authHeader = c.req.header("Authorization") || "";
    
    try {
        const user = await verify(authHeader,c.env.JWT_SECRET);
        if(user){
            // const userId = user.id;
            console.log("Setting userId:", user.id);
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
  //We should add pagination here...i.e returning only first 3 blogs and then user can request more 3 later
  blogRouter.get('/bulk', async(c) => {
    const prisma = c.get("prisma");

   try {
    const blogs = await prisma.blog.findMany({
        where:{
            published:true
        },
        select: {
            content :true,
            title: true,
            id: true,
            author: {
                select: {
                    name:true
                }
            },
            imageId : true,
            createdAt:true
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
            },
            imageId: true,
            createdAt:true
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

  blogRouter.get("/user/me", async (c) => {
    console.log("Entering /user/me route");
    const prisma = c.get("prisma");
    const userId = c.get("userId");
console.log(`userId from context:${userId}`);
    if (!userId) {
        c.status(401);
        return c.json({ message: "Unauthorized: User ID not found" });
    }

    try {
        const currentUser = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                email: true,
                name: true,
                
            }
        });

        if (!currentUser) {
            c.status(404);
            return c.json({ message: "User not found" });
        }

        return c.json({ data:currentUser });
    } catch (error) {
        console.error("Error finding current user:", error);
        c.status(500);
        return c.json({ message: "Error while finding the current user" });
    }
});


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
                imageId:body.imageId || null,
                authorId:userId,
                published:body.published || false
            }
        })
        return c.json({
            id:blog.id,
            published:blog.published,
            createdAt:blog.createdAt
        })
    } catch (error) {
        console.error("error creating blog",error);
        return c.json({
            error:"Failed to create blog post"
        }, 500)
       }
})

blogRouter.get("/user/drafts",async(c) => {
    const prisma = c.get("prisma");
    const userId = c.get("userId");

    try {
        const drafts = await prisma.blog.findMany({
            where:{
                authorId: userId,
                published:false
            },
            select:{
                id:true,
                title:true,
                content:true,
                imageId:true,
                createdAt:true
            }
        });
        return c.json({ drafts});
    } catch (error) {
        console.log("Error fetching drafts",error);
        return c.json({ error: "Failed to fetch drafts"},500);
    }
    
})



blogRouter.get("/user/me", async (c) => {
    console.log("Entering /user/me route");
    const prisma = c.get("prisma");
    const userId = c.get("userId");
console.log(`userId from context:${userId}`);
    if (!userId) {
        c.status(401);
        return c.json({ message: "Unauthorized: User ID not found" });
    }

    try {
        const currentUser = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                email: true,
                name: true
            }
        });

        if (!currentUser) {
            c.status(404);
            return c.json({ message: "User not found" });
        }

        return c.json({ data:currentUser });
    } catch (error) {
        console.error("Error finding current user:", error);
        c.status(500);
        return c.json({ message: "Error while finding the current user" });
    }
});

blogRouter.get("/user/myblogs",async (c) => {
    const prisma = c.get("prisma");
    const userId = c.get("userId");
    console.log("Fetching blogs for user:",userId);
    if(!userId){
        console.log("user Id not found in context");
        return c.json({
            error: "Unauthorized: User ID not found"
        });
    }
        try {
            const blogs = await prisma.blog.findMany({
                where:{
                    authorId:userId,
                    published:true
                },
                select:{
                    id:true,
                    title:true,
                    content:true,
                    imageId:true,
                   createdAt:true
                }
            });
            console.log(`Found ${blogs.length} blogs for user ${userId}`);

            if(blogs.length === 0){
                return c.json({
                    blog:[],
                    message:"No Blogs found for this user"
                });
            }

            return c.json({
                blogs
            })
        } catch (error) {
            console.log("Error fetching my blogs",error);
            return c.json({
                error:"Failed to fetch my blogs"
            },500);
        }
   
})

blogRouter.put('/update',async (c) => {
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
            imageId: body.imageId  || null,
            published:body.published
        }
    })
    return c.json({
        id:blog.id,
        published:blog.published,
        message:"Updated blog!"
    })
 } catch (error) {
    return c.json({
        message:"Error in updating blog"
    })
 }
  })
  blogRouter.delete('/userBlog/delete', async (c) => {
    const userId = c.get("userId"); 
    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }
  
    const prisma = c.get("prisma");
    const body = await c.req.json();
    const blogId = body.blogId;
  
    if (!blogId) {
      return c.json({ error: "Blog ID is required" }, 400);
    }
  
    try {
      const blog = await prisma.blog.findUnique({
        where: { id: blogId }
      });
  
      if (!blog) {
        return c.json({ error: "Blog not found" }, 404);
      }
  
      if (blog.authorId !== userId) {
        return c.json({ error: "Unauthorized to delete this blog" }, 403);
      }
  
      await prisma.blog.delete({
        where: { id: blogId }
      });
  
      return c.json({ message: "Blog deleted successfully" });
    } catch (error) {
      console.error("Error deleting blog:", error);
      return c.json({ error: "Error deleting the blog" }, 500);
    }
  });

  blogRouter.delete('/delete', async (c) => {
    const userId = c.get("userId"); 
    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }
  
    const prisma = c.get("prisma");
    const body = await c.req.json();
    const blogId = body.blogId;
  
    if (!blogId) {
      return c.json({ error: "Blog ID is required" }, 400);
    }
  
    try {
      const blog = await prisma.blog.findUnique({
        where: { id: blogId }
      });
  
      if (!blog) {
        return c.json({ error: "Blog not found" }, 404);
      }
  
      if (blog.authorId !== userId) {
        return c.json({ error: "Unauthorized to delete this blog" }, 403);
      }
  
      await prisma.blog.delete({
        where: { id: blogId }
      });
  
      return c.json({ message: "Blog deleted successfully" });
    } catch (error) {
      console.error("Error deleting blog:", error);
      return c.json({ error: "Error deleting the blog" }, 500);
    }
  });