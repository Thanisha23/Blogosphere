import { Blog } from "../hooks";
import AppBar from "./AppBar";
import React, { useState } from "react";
import { Image } from "cloudinary-react";

interface FullBlogProps {
  blog: Blog;
}

const FullBlog: React.FC<FullBlogProps> = ({ blog }) => {
  const [isLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppBar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-7 max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="font-roboto font-extrabold text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-0 w-full sm:w-1/2">
            {blog.title}
          </h1>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-1/2 sm:justify-end font-roboto text-lg">
            <span className="text-slate-500 font-normal">Published by</span>
            <span className="font-semibold text-slate-800">- {blog.author.name}</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
          <div className="flex flex-col items-center w-full p-4 sm:p-6">
            {isLoading ? (
              <div className="animate-pulse flex items-center justify-center w-full h-48 sm:h-64 md:h-80 bg-gray-200 rounded">
                <svg className="w-10 h-10 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                  <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
                </svg>
              </div>
            ) : blog.imageId ? (
              <>
                <Image
                  cloudName={import.meta.env.VITE_CLOUD_NAME}
                  publicId={blog.imageId}
                  className="w-full h-48 sm:h-64 md:h-80 object-cover rounded-lg"
                />
                <div className="w-full mt-6">
                  <div
                    className="prose prose-lg max-w-none font-merriweather text-gray-800"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />
                </div>
              </>
            ) : (
              <div className="w-full">
                <div
                  className="prose prose-lg max-w-none font-merriweather text-gray-800"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullBlog;