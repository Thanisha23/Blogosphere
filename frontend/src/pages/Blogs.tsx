import AppBar from "../components/AppBar"
import BlogCard from "../components/BlogCard"
import Skeleton from "../components/Skeleton";
import { useBlogs } from "../hooks"
import { GoArrowLeft } from "react-icons/go";
import { GoArrowRight } from "react-icons/go";
import axios from "axios";
import { useEffect } from "react";
import {useuserStore} from "../store/userStore"
import {format,parseISO} from "date-fns"

const Blogs = () => {
    const setName = useuserStore((state) => state.setName)
    const { loading, blogs, currentPage, totalPages, nextPage, prevPage } = useBlogs();
    const formatDate = (dateString: string) => {
        try {
            const date = parseISO(dateString);
            return format(date, 'MMMM d, yyyy');
        } catch (error) {
            console.error('Error parsing date:', error);
            return 'Invalid Date';
        }
    };

    useEffect(() => {
        async function sendRequest() {
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/user/me`,{
                withCredentials: true,
                headers: {
                  "Authorization":localStorage.getItem("token"),
                  "Content-Type": "application/json",
                },
              }
            );
            setTimeout(() => {
                console.log(response.data.data.name);
                setName(response.data.data.name);
                localStorage.setItem("email",response.data.data.email)
              }, 0);
          } catch(error) {
                console.log(error);
          }
        }
        sendRequest();
    }, [])

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
                <div className="lg:flex-row flex-col md:flex-col flex justify-center items-center gap-[2rem] min-h-[70vh] mt-[9rem]">
                {blogs.map((blog) => (
                    <BlogCard 
                    blogId={blog.id}
                    deleteIcon={false}
                        to={`/blog/${blog.id}`}
                        key={blog.id}
                        authorName={blog.author.name || "Anonymous"} 
                        imageId={blog.imageId}
                        title={blog.title} 
                        content={blog.content} 
                        publishedDate={formatDate(blog.createdAt)} 
                    />
                ))}
            </div> 
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
        </div>
    ) 
}

export default Blogs