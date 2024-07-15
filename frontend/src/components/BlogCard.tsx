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
    blogId: string,
    onDelete?: (blogId: string) => void,
}

const BlogCard = ({
    authorName, title, content, publishedDate, imageId, to, deleteIcon, blogId, onDelete
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
                toast.success("Successfully deleted", response.data);
                setShowDeleteOption(false);
                if (onDelete) {
                    onDelete(blogId);
                }
            } else {
                toast.error("Failed to delete")
            }
        } catch (error) {
            console.log(error)
            toast.error("Error deleting the blog")
        }
    }

    return (
        <div className="w-full max-w-sm mx-auto font-roboto relative">
            <Link to={to} className="block">
                <div className="bg-white shadow-lg rounded-xl overflow-hidden transition-transform duration-300 hover:scale-105">
                    {deleteIcon && (
                        <div className="absolute right-2 top-2 z-10">
                            <button 
                                onClick={handleToggleClick}
                                className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
                            >
                                <SlOptionsVertical size={20} />
                            </button>
                            {showDeleteOption && (
                                <button 
                                    onClick={deleteRequest}
                                    className="absolute right-0 mt-2 bg-white shadow-lg rounded-md px-4 py-2 text-red-500 hover:bg-red-50 transition-colors duration-200"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    )}
                    <div className="w-full h-48 sm:h-56 overflow-hidden">
                        <Image 
                            cloudName={import.meta.env.VITE_CLOUD_NAME}
                            publicId={imageId}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                    </div>
                    <div className="p-4 sm:p-6">
                        <span className="inline-block bg-gradient-to-r from-rose-100 to-teal-100 rounded-full text-[#19191B] text-xs font-medium px-3 py-1 mb-2">
                            {`${Math.ceil(content.length / 100)} min read`}
                        </span>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 line-clamp-2">{title}</h2>
                        <p className="text-gray-600 mb-4 line-clamp-3">{content}</p>
                        <div className="flex items-center">
                            <AuthorAvatar size="big" authorName={authorName} />
                            <div className="ml-3">
                                <p className="font-semibold text-gray-800">{authorName}</p>
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