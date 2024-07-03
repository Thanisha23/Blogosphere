import Avatar from "./Avatar"
import { Link } from "react-router-dom"

interface BlogCardProps {
    id:string
    authorName: string,
    title: string,
    content: string,
    publishedDate: string,
}


const BlogCard = ({
    id,authorName,title,content,publishedDate}: BlogCardProps) => {
  return (
   <Link className=" w-[60%]" to={`/blog/${id}`}>
    <div className="font-bonaNova">

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
</div>
   </Link>
  )
}

export default BlogCard