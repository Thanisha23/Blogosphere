import AppBar from "../components/AppBar"
import BlogCard from "../components/BlogCard"
import { useBlogs } from "../hooks"
const Blogs = () => {
    const {loading,blogs} = useBlogs();

    if(loading) {
        return (
            <div>
                loading...
            </div>
        )
    }
  
  return (

   <div>
    <AppBar />
     <div className="flex-col flex justify-center items-center gap-[2rem]  h-[100vh] mt-[3rem]">
        {blogs.map((blog) => (
            <BlogCard id={blog.id} authorName={blog.author.name || "Anonymous"} title={blog.title} content={blog.content} publishedDate={"2nd Feb 2024"} />
        ))}
       
    </div>
   </div>
  ) 
}

export default Blogs