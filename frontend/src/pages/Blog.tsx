import FullBlog from "../components/FullBlog";
import { useBlog } from "../hooks"
import { useParams } from "react-router-dom"
import type {Blog}  from "../hooks";


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
        return <div>
            loading...
        </div>
    }
  return (
    <div>
        
    <FullBlog blog={blog as Blog} />
    </div>
  )
}

export default Blog