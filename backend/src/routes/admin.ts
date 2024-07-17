import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from 'hono/jwt';

export const adminRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    },
    Variables: {
        prisma: PrismaClient,
        userId: string
    }
}>();

// Middleware to check if the user is an admin
adminRouter.use('/*', async (c, next) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    c.set('prisma',prisma as any);
    if (!c.req.path.endsWith('/users') || !c.req.path.endsWith('/users/delete') || !c.req.path.endsWith("/blogs") || !c.req.path.endsWith("/blogs/delete") ) {
      await next();
      return;
  }

    const authHeader = c.req.header("Authorization") || "" ;
    try {
        const payload = await verify(authHeader,c.env.JWT_SECRET);
        if(payload && payload.isAdmin) {
            const userId = payload.id;
            c.set("userId" ,userId as string);
            await next();
        }else{
            return c.json({error: "Unauthorized"}, 403);
        }
    } catch (error) {
        console.log("JWT verification error", error);
        return c.json({error: "Unauthorized"},403);
    }
  
});

// Get all users
adminRouter.get('/users', async (c) => {
    const prisma = c.get('prisma');
    const users = await prisma.user.findMany({
        select: { id: true, email: true, name: true }
    });
    return c.json({ users });
});

// Delete a user
adminRouter.delete('/users/delete', async (c) => {
    const prisma = c.get('prisma');
    const body = await c.req.json();
    const userId =body.userId;

    if(!userId) {
        return c.json({
          message: "UserId not available"
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
});

// Get all blogs
adminRouter.get('/blogs', async (c) => {
    const prisma = c.get('prisma');
    const blogs = await prisma.blog.findMany({
        include: { author: { select: { name: true, email: true } } }
    });
    return c.json({ blogs });
});

// Delete a blog
adminRouter.delete('/blogs/delete', async (c) => {
    const prisma = c.get('prisma');
    const body = await c.req.json()
    const blogId =body.blogId;

    await prisma.blog.delete({ where: { id: blogId } });
    return c.json({ message: 'Blog deleted successfully' });
});