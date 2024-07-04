import AppBar from "../components/AppBar"
import BlogCard from "../components/BlogCard"
import { useBlogs } from "../hooks"

const Blogs = () => {
    const { loading, blogs, currentPage, totalPages, nextPage, prevPage } = useBlogs();

    if (loading) {
        return <div>loading...</div>
    }
  
    return (
        <div>
            <AppBar />
            <div className="flex-col flex justify-center items-center gap-[2rem] min-h-[100vh] mt-[3rem]">
                {blogs.map((blog) => (
                    <BlogCard 
                        key={blog.id}
                        id={blog.id} 
                        authorName={blog.author.name || "Anonymous"} 
                        title={blog.title} 
                        content={blog.content} 
                        publishedDate={"2nd Feb 2024"} 
                    />
                ))}
                
                <div className="flex justify-center gap-4 mt-4">
                    <button 
                        onClick={prevPage} 
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                    >
                        Previous
                    </button>
                    <span>{currentPage} of {totalPages}</span>
                    <button 
                        onClick={nextPage} 
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    ) 
}

export default Blogs