import { useEffect, useState } from "react"
import axios from "axios"
import { BACKEND_URL } from "../config";

export interface Blog {
    "content" : string;
    "title": string;
    "id" : string;
    "author" : {
    "name" : string
    }
}

export const useBlogs = (postsPerPage = 3) => {
    const [loading,setLoading] = useState(true);
    const [blogs,setBlogs] = useState<Blog[]>([]);
    const [currentPage,setCurrentPage] = useState(1);
    const [totalPages,setTotalPages] = useState(0);


    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/blog/bulk`,{
            headers: {
                Authorization : localStorage.getItem("token")
            }
        }).then(response => {
            setBlogs(response.data.blogs);
            setTotalPages(Math.ceil(response.data.blogs.length / postsPerPage));
            setLoading(false);
        })
    },[postsPerPage])

    const nextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    }

    const prevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    }

    const paginatedBlogs = blogs.slice(
        (currentPage - 1) * postsPerPage,
        currentPage * postsPerPage
    );


  return {
    loading,
        blogs: paginatedBlogs,
        currentPage,
        totalPages,
        nextPage,
        prevPage
  }

}

// export const useBlogs = () => {
//     const [loading,setLoading] = useState(true);
//     const [blogs,setBlogs] = useState([]);
//     const [currentPage,setCurrentPage] = useState(1);
//     const [blogsPerPage,setBlogsPerPage] = useState(5);

//     useEffect(() => {
       
//             try {
//                 axios.get(`${BACKEND_URL}/api/v1/blog/bulk`,{
//                                 headers: {
//                                     Authorization : localStorage.getItem("token")
//                                 }
//                             }).then(response => {
//                                 setBlogs(response.data.blogs);
//                                 setLoading(false);
//                             })
//             } catch (error) {
//                 console.log(error);
//             }

        
//     },[])
// }

export const useBlog = ({id} : {id : string}) => {
    const [loading,setLoading] = useState(true);
    const [blog,setBlog] = useState<Blog>();

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/blog/${id}`,{
            headers: {
                Authorization : localStorage.getItem("token")
            }
        }).then(response => {
            setBlog(response.data.blog);
            setLoading(false);
        })
    
    },[id])
  return {
    loading,
    blog
  }
}