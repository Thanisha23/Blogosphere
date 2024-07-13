import { Link } from "react-router-dom"
import { Image } from "cloudinary-react"
import AuthorAvatar from "./AuthorAvatar"
import { SlOptionsVertical } from "react-icons/sl";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";


interface BlogCardProps {
    authorName: string,
    title: string,
    content: string,
    publishedDate: string,
    imageId: string,
    to: string,
    deleteIcon: boolean,
    blogId:string,
    onDelete?: (blogId:string) => void,
}

const BlogCard = ({
    authorName, title, content, publishedDate, imageId, to, deleteIcon,blogId,onDelete
}: BlogCardProps) => {
    const [showDeleteOption, setShowDeleteOption] = useState(false);

    const handleToggleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation(); 
        setShowDeleteOption(!showDeleteOption);
    };

    async function deleteRequest(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        try {
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/userBlog/delete`, {
                data: { blogId },  
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token")
                },
              })
            if(response.data){
                toast.success("successfully deleted",response.data);
                setShowDeleteOption(false);
                if (onDelete) {
                    onDelete(blogId);
                }
            }else{
                toast.error("Failed to delete")
            }
        } catch (error) {
            console.log(error)
            toast.error("Error deleting the blog")
        }
}


    return (
       <div  className="w-[60%] font-robotoCondensed relative max-w-[25rem]">
         <Link to={to}>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {deleteIcon && (
                    <div className="absolute right-2 top-4">
                        <button onClick={handleToggleClick}>
                            <SlOptionsVertical size={20} />
                        </button>
                        {showDeleteOption && (
                            <button 
                                onClick={deleteRequest}
                                className="absolute mt-7 bg-white shadow-md rounded-md px-4 border border-slate-200 py-2 text-red-500 hover:bg-red-100 z-50"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                )}
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
       </div>
    )
}

export default BlogCard