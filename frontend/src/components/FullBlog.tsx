/* eslint-disable @typescript-eslint/no-unused-vars */
import { Blog } from "../hooks";
import AppBar from "./AppBar";
import React, { useState } from "react";
import { Image } from "cloudinary-react";
import { CLOUD_NAME } from "../config";
import Button from "./Button";
interface FullBlogProps {
    blog: Blog;
  }

const FullBlog:React.FC<FullBlogProps> = ({blog}: {blog: Blog}) =>
{
  const [isLoading] = useState(false); 

 
  return (
    <>
<AppBar />
<div className="px-24 pt-[4rem] flex justify-between items-center w-[100%]">
   <div className="font-antonSC text-2xl w-[50%] pt-[0.7rem]">
  {blog.title}
    </div>
    <div className="flex justify-end items-center gap-4 w-[50%]">
     <Button mode="dark" text="Save as draft" />
     <div>
     <Button mode="dark" text="Publish" />
     </div>
    </div>
   </div>
{/* image,title,content section */}
<div className="bg-white border border-transparent mb-[3rem] mt-12 rounded-lg pb-24">
  <div className="flex flex-col items-center w-full">
    {isLoading ? (
      <div className="animate-pulse flex items-center justify-center w-full h-64 bg-gray-200 rounded">
        <svg className="w-10 h-10 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
          <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
        </svg>
      </div>
    ) : blog.imageId ? (
      <>
        <Image
          cloudName={CLOUD_NAME}
          publicId={blog.imageId}
          className="w-[80%] max-w-2xl object-contain rounded-lg mx-auto"
        />
        <textarea
          readOnly
          className="font-medium text-lg py-10 font-robotoCondensed text-center w-[80%] max-w-2xl mx-auto rounded-b-lg focus:outline-none rounded-lg focus:border-gray-200 focus:ring-1 focus:ring-gray-200 mt-4"
          rows={20}
        >
          {blog.content}
        </textarea>
      </>
    ) : (
      <textarea
        readOnly
        className="font-medium text-lg py-10 font-robotoCondensed w-[80%] max-w-2xl mx-auto rounded-b-lg focus:outline-none rounded-lg text-center focus:border-gray-200 focus:ring-1 focus:ring-gray-200 mt-4"
        rows={20}
      >
        {blog.content}
      </textarea>
    )}
  </div>
</div>
 </>
  )
}

export default FullBlog