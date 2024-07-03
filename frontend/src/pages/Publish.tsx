import axios from "axios"
import { BACKEND_URL } from "../config"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
const Publish = () => {
    const navigate = useNavigate();
    const [title,setTitle] = useState("");
    const [content,setContent] = useState("");
  return (
    <div className="flex-col flex">
        <input onChange={(e) => {
            setTitle(e.target.value)
        }} type="text" placeholder="enter title"/>
        <input onChange={(e) => {
            setContent(e.target.value)
        }} type="text" placeholder="enter content" />
        <button onClick={async () => {
          const response =  await axios.post(`${BACKEND_URL}/api/v1/blog`,{
                title,
                content
            },{
                headers:{
                    Authorization: localStorage.getItem("token")
                }
            });
            setTitle("");
            setContent("");
           if(response){
            navigate(`/blog/${response.data.id}`);

           }
        }}> Publish post</button>
    </div>
  )
}

export default Publish