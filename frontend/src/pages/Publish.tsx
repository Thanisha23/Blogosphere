import axios from "axios"
import { BACKEND_URL,CLOUDINARY_URL,CLOUD_NAME } from "../config"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {Image} from "cloudinary-react";

const Publish = () => {
    const navigate = useNavigate();
    const [title,setTitle] = useState("");
    const [content,setContent] = useState("");
    const [imageSelected,setImageSelected] = useState<File | null>(null);
    const [publicId,setPublicId] = useState<string | null>(null);
    const uploadImage = (

    ) => {
        if(imageSelected) {
            const formData = new FormData();
            formData.append("file",imageSelected);
            formData.append("upload_preset","blogs-images");

            axios.post(CLOUDINARY_URL,formData).then((response) => {
                console.log(response);
                setPublicId(response.data.public_id)
            });
        }
    }
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

        <div className="flex justify-center items-center pt-[2rem]">
            <input type="file" onChange={(e) => {
                if(e.target.files && e.target.files[0]){
                    setImageSelected(e.target.files[0])
                }
            }} />

            <button onClick={uploadImage}>Upload Image</button>
        </div>

        <div className="pt-[3rem]">
                {publicId && (
                    <Image cloudName={CLOUD_NAME} publicId = {publicId} className="w-[35rem] h-[35rem]"  />
                )}
        </div>
    </div>
  )
}

export default Publish