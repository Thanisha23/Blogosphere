import z from "zod";

export const signupInput = z.object({
    email:z.string().email(),
    password:z.string().min(6),
    name:z.string().optional(),
})

export const signinInput = z.object({
    email:z.string().email(),
    password:z.string().min(6),
})

export const createBlog = z.object({
    title: z.string(),
    content: z.string(),
    imageId: z.string().optional(),
    published: z.boolean().default(false),
})

export const updateBlog = z.object({
    title: z.string(),
    content: z.string(),
    id:z.string(),
    imageId: z.string().optional().nullable(),
})

//type inference in zod

export type SignupInput = z.infer<typeof signupInput>;

export type SigninInput = z.infer<typeof signinInput>;

export type CreateBlog = z.infer<typeof createBlog>;

export type UpdateBlog = z.infer<typeof updateBlog>;