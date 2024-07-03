import { Blog } from "../hooks"
import AppBar from "./AppBar"
import React from "react";
interface FullBlogProps {
    blog: Blog;
  }



const FullBlog:React.FC<FullBlogProps> = ({blog}: {blog: Blog}) => {
  return (
    <div>
        <AppBar />
        <div className="grid grid-cols-12 px-10 w-full pt-200">
        

        <div className="bg-red-200 col-span-8">
            <div className="text-3xl font-extrabold">
    {blog.title}

            </div>

        </div>
        <div>
            {blog.content}
        </div>
    </div>
    </div>
  )
}

export default FullBlog