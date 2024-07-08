import { Link } from "react-router-dom"
import { Image } from "cloudinary-react"
import { CLOUD_NAME } from "../config"
import AuthorAvatar from "./AuthorAvatar"

interface BlogCardProps {
    id: string
    authorName: string,
    title: string,
    content: string,
    publishedDate: string,
    imageId: string,
}

const BlogCard = ({
    id, authorName, title, content, publishedDate, imageId
}: BlogCardProps) => {
  return (
   <Link className="w-[60%] font-robotoCondensed max-w-[25rem]" to={`/blog/${id}`}>
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="w-full h-48 overflow-hidden">
        <Image 
          cloudName={CLOUD_NAME}
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

  {/* <div className="font-bonaNova">

<div className="flex justify-start items-center gap-5 ">
<Avatar size={"big"} authorName={authorName} />
<div>
{authorName} <span className="text-[0.4rem]">&#9679;</span> {publishedDate}
</div>
</div>
<div className="font-semibold text-2xl pt-4">
    {title}
</div>
<div>
    {content.slice(0,150) + "..."}
</div>
    <div className="pt-12">
        {`${Math.ceil(content.length / 100)} min read`}
    </div>
<div className="h-1 w-full bg-slate-500">

</div>
</div> */}