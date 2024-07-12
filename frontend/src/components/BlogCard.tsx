import { Link } from "react-router-dom"
import { Image } from "cloudinary-react"
import AuthorAvatar from "./AuthorAvatar"

interface BlogCardProps {
    
    authorName: string,
    title: string,
    content: string,
    publishedDate: string,
    imageId: string,
    to:string
}

const BlogCard = ({
     authorName, title, content, publishedDate, imageId,to
}: BlogCardProps) => {
  return (
   <Link className="w-[60%] font-robotoCondensed max-w-[25rem]" to={to}>
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="w-full h-48 overflow-hidden">
        <Image 
          cloudName={import.meta.env.VITE_CLOUD_NAME}
          publicId={imageId}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <span className="bg-gradient-to-r from-rose-100 to-teal-100 rounded-lg text-[#19191B] text-xs font-medium px-2.5 py-0.5 ">
          {`${Math.ceil(content.length / 100)} min read`}
        </span>
        <h2 className="text-xl font-semibold mt-2">{title}</h2>
        <p className="text-gray-600 mt-2">{content.slice(0, 150) + "..."}</p>
        <div className="flex items-center mt-4">
          <AuthorAvatar size="big" authorName={authorName} />
          <div className="ml-2">
            <p className="font-medium">{authorName}</p>
            <p className="text-sm text-gray-500">{publishedDate}</p>
          </div>
        </div>
      </div>
    </div>
   </Link>
  )
}

export default BlogCard

