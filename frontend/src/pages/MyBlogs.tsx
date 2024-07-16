import AppBar from "../components/AppBar"
import BlogCard from "../components/BlogCard"
import Skeleton from "../components/Skeleton";
import { useMyBlogs } from "../hooks"
import { GoArrowLeft } from "react-icons/go";
import { GoArrowRight } from "react-icons/go";
import { useuserStore } from "../store/userStore";
import { useMemo, useCallback } from "react";
import { blogIdStore } from "../store/blogIdStore";
const MyBlogs = () => {
    const { addDeletedId, deletedIds } = blogIdStore();
    const { loading, blogs: fetchedBlogs, currentPage, totalPages, nextPage, prevPage } = useMyBlogs();
    const { name } = useuserStore();

    const blogs = useMemo(() => 
        fetchedBlogs.filter(blog => !deletedIds.includes(blog.id)),
        [fetchedBlogs, deletedIds]
    );
    const handleDelete = useCallback(async (blogId: string) => {
        addDeletedId(blogId);
    }, [addDeletedId]);
    if (loading) {
        return (
            <>
                <AppBar />
                <div className="px-24 pt-[9rem] flex flex-col gap-6">
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                </div>
            </>
        )
    }

    return (
        <div className="pb-16">
            <AppBar />
            <div className="max-w-7xl mx-auto px-5 sm:px-6">
            {blogs.length > 0 ? (
                <>
                <div className="lg:flex-row flex-col md:flex-col flex justify-center items-center gap-[2rem] min-h-[70vh] mt-[9rem] mx-auto">
                   { blogs.map((blog) => (
                        <BlogCard 
                            blogId={blog.id}
                            deleteIcon={true}
                            to={`/blog/${blog.id}`}
                            key={blog.id}
                            authorName={name} 
                            imageId={blog.imageId}
                            title={blog.title} 
                            content={blog.content} 
                            publishedDate={new Date(blog.createdAt).toLocaleDateString()} 
                            onDelete={handleDelete}
                        />
                    ))}
                        </div>
                         <div className="fixed bottom-0 left-0 right-0 flex justify-center items-center gap-4 py-4 bg-white shadow-md">
                         <button 
                             onClick={prevPage} 
                             disabled={currentPage === 1}
                             className="px-4 py-2 bg-[#19191B] text-white rounded disabled:bg-gray-300"
                         >
                             <GoArrowLeft size={20} />
                         </button>
                         <span className="text-lg font-medium">{currentPage} of {totalPages}</span>
                         <button 
                             onClick={nextPage} 
                             disabled={currentPage === totalPages}
                             className="px-4 py-2 bg-[#19191B] text-white rounded disabled:bg-gray-300"
                         >
                             <GoArrowRight size={20} />
                         </button>
                     </div>
                     </>
                        
            ):(

                <div className='flex justify-center items-center pt-[16rem] font-medium text-3xl'>
                NO BLOGS FOUND
            </div>
            )}
            </div>
            </div>
           
        )}
export default MyBlogs