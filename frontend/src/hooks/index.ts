import { useEffect, useState } from "react"
import axios from "axios"
import { blogIdStore } from "../store/blogIdStore";

export interface Blog {
    "content" : string;
    "title": string;
    "id" : string;
    "author" : {
    "name" : string
    }
    "imageId":string,
    "published":boolean,
    "createdAt":string
  
}

export interface Draft {
    content: string;
    title:string;
    id:string;
    imageId:string;

}

export const useBlogs = (postsPerPage = 3) => {
    const [loading,setLoading] = useState(true);
    const [blogs,setBlogs] = useState<Blog[]>([]);
    const [currentPage,setCurrentPage] = useState(1);
    const [totalPages,setTotalPages] = useState(0);


    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/bulk`,{
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


export const useBlog = ({id} : {id : string}) => {
    const [loading,setLoading] = useState(true);
    const [blog,setBlog] = useState<Blog>();

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/${id}`,{
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

export const useDrafts = (postsPerPage = 3) => {
    const [loading,setLoading] = useState(true);
    const [drafts,setDrafts] = useState<Draft[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/user/drafts`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            setDrafts(response.data.drafts);
            setTotalPages(Math.ceil(response.data.drafts.length / postsPerPage));
            setLoading(false);
        }).catch(error => {
            console.error('Error fetching drafts:', error);
            setLoading(false);
        });
    }, [postsPerPage]);

    const nextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    }

    const prevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    }

    const paginatedDrafts = drafts.slice(
        (currentPage - 1) * postsPerPage,
        currentPage * postsPerPage
    );

    return {
        loading,
        drafts: paginatedDrafts,
        currentPage,
        totalPages,
        nextPage,
        prevPage
    }
}



export const useMyBlogs = (postsPerPage = 3) => {
    const [loading,setLoading] = useState(true);
    const [blogs,setBlogs] = useState<Blog[]>([]);
    const [currentPage,setCurrentPage] = useState(1);
    const [totalPages,setTotalPages] = useState(0);
    const {deletedIds} = blogIdStore();

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/user/myblogs`,{
            headers: {
                Authorization : localStorage.getItem("token")
            }
        }).then(response => {
            setBlogs(response.data.blogs || []);
            setTotalPages(Math.ceil((response.data.blogs?.length || 0) / postsPerPage));
            setLoading(false);
        }).catch(error => {
            console.error('Error fetching my blogs:', error);
            setLoading(false);
        });
    },[postsPerPage,deletedIds])

    const nextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    }

    const prevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    }

    const paginatedBlogs =blogs.length > 0 ?  blogs.slice(
        (currentPage - 1) * postsPerPage,
        currentPage * postsPerPage
    ) : [];


  return {
        loading,
        blogs: paginatedBlogs,
        currentPage,
        totalPages,
        nextPage,
        prevPage
  }

}