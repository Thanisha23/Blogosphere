import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image } from "cloudinary-react";
import AppBar from "../components/AppBar";
import Button from "../components/Button";
import { FiUpload } from "react-icons/fi";

interface BlogCreationRequest {
    title: string;
    content: string;
    imageId?: string;
    published:boolean;
  }
  

const Publish = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageSelected, setImageSelected] = useState<File | null>(null);
  const [publicId, setPublicId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading,setIsLoading] = useState(false);


    const saveDraft = async() => {
      await publishPost(false);
    }

  

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "blogs-images");
  
    try {
      const response = await axios.post(import.meta.env.VITE_CLOUDINARY_URL, formData);
      console.log(response);
      return  {
        publicId: response.data.public_id,
        url: response.data.secure_url
      };
    } catch (error) {
      console.error("Error uploading image", error);
      throw error;
    }
  };

  const publishPost = async (published = true) => {
    let uploadedPublicId = null;
  
    if (imageSelected) {
      try {
        setIsLoading(true);
        const { publicId: uploadedId } = await uploadImage(imageSelected);
        uploadedPublicId = uploadedId;
        setPublicId(uploadedId);
      } catch (error) {
        console.error("Error uploading image", error);
        return;
      } finally {
        setIsLoading(false);
      }
    }
  
    const blogData: BlogCreationRequest = {
      title,
      content,
      published
    };
  
    if (uploadedPublicId) {
      blogData.imageId = uploadedPublicId;
    }
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog`,
        blogData,
        {
          headers: {
            Authorization: localStorage.getItem("token")
          }
        }
      );
      setTitle("");
      setContent("");
      setPublicId(null);
      setImageSelected(null);
      setImagePreview(null);


      if (response) {
        console.log(`Blog Id - ${response.data.id}`)
        if (published) {
            navigate(`/blog/${response.data.id}`);
        } else {
            navigate('/drafts');  // Redirect to drafts page
        }
    }
} catch (error) {
      console.error("Error publishing post", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsLoading(true);
      setImageSelected(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          setImagePreview(event.target.result as string);
          setIsLoading(false);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <>
    <AppBar />
    {/*  */}
<input type="file" id="fileInput" className="hidden" onChange={handleFileChange} />
{/*  */}
   <div className="px-24 pt-[4rem] flex justify-between items-center">
   <div className="font-bold text-2xl font-castoro pt-[0.7rem]">
      Write a Blog Post
    </div>
    <div className="flex justify-center items-center gap-4">
    <div onClick={saveDraft}>
    <Button mode="dark" text="Save as draft" />
    </div>
     <div onClick={() => publishPost(true)}>
     <Button mode="dark" text="Publish" />
     </div>
    </div>
   </div>
{/* image,title,content section */}
<div className="bg-white border border-gray-200 mx-24 mb-[3rem] mt-24 rounded-lg pb-24">
        <div className="relative w-full h-64">
          {isLoading ? (
            <div className="animate-pulse flex items-center justify-center w-full h-64 bg-gray-200 rounded">
              <svg className="w-10 h-10 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
              </svg>
            </div>
          ) : publicId ? (
            <Image
              cloudName={import.meta.env.VITE_CLOUD_NAME}
              publicId={publicId}
              className="w-full h-64 object-cover"
            />
          ) :  imagePreview ? (
            <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover" />
          )  : (
            <div className="flex items-center justify-center w-full h-64 bg-gray-200 rounded">
              <svg className="w-10 h-10 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
              </svg>
            </div>
          )}


          <div className="cursor-pointer absolute right-4 top-4 z-10 text-black bg-white p-2 rounded-lg">
          <FiUpload 
      
      size={25} 
      onClick={() => document.getElementById("fileInput")?.click()}
    />
          </div>
        </div>

        <div className="flex-col flex gap-2">
          <textarea
            className="font-bold text-2xl py-10 px-6 font-castoro w-[100%] rounded-b-lg focus:outline-none focus:border-gray-200 focus:ring-1 focus:ring-gray-200"
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your blog title here..."
            value={title}
          ></textarea>
          <textarea
            className="font-semibold text-lg py-10 px-6 font-castoro w-[60%] ml-10 rounded-b-lg focus:outline-none rounded-lg focus:border-gray-200 focus:ring-1 focus:ring-gray-200"
            onChange={(e) => setContent(e.target.value)}
            rows={20}
            placeholder="Start writing your blog post here..."
            value={content}
          ></textarea>
        </div>
      </div>
   
    </>
  );
};

export default Publish;
