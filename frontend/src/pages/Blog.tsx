import FullBlog from "../components/FullBlog";
import { useBlog } from "../hooks"
import { useParams } from "react-router-dom"
import type {Blog}  from "../hooks";
import AppBar from "../components/AppBar";
import Skeleton from "../components/Skeleton";


type BlogHookResult = {
    loading: boolean;
    blog: Blog | undefined;
}



const Blog = () => {
    const {id} = useParams();
    const {loading, blog}: BlogHookResult = useBlog({
        id: id || ""
    })
    
    if(loading) {
        return <>
        <AppBar />
        <div className="px-24 pt-[9rem]">
   <Skeleton />
   </div>
        </>
    }
  return (
    <div>
        
    <FullBlog blog={blog as Blog} />
    </div>
  )
}

export default Blog