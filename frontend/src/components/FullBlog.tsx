import { Blog } from "../hooks"
import AppBar from "./AppBar"
import React from "react";
import { Image } from "cloudinary-react";
import { CLOUD_NAME } from "../config";
interface FullBlogProps {
    blog: Blog;
  }



const FullBlog:React.FC<FullBlogProps> = ({blog}: {blog: Blog}) => {
  return (
    <div>
        <AppBar />
        {/* <div className="grid grid-cols-12 px-10 w-full pt-200"> */}
        <div className="flex flex-col gap-7">

        <div className="bg-red-200 col-span-8">
            <div className="text-3xl font-extrabold">
    {blog.title}
            </div>

        </div>
        <div>
            {blog.content}
        </div>
       {blog.imageId ? (
         <div>
         <Image
             cloudName={CLOUD_NAME}
             publicId={blog.imageId}
             className="w-[35rem] h-[35rem]"
           />
         </div>
       ): null}
    </div>
    </div>
  )
}

export default FullBlog