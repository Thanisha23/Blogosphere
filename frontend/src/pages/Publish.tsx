import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image } from "cloudinary-react";
import AppBar from "../components/AppBar";
import Button from "../components/Button";
import { FiUpload } from "react-icons/fi";
import { toast } from "react-toastify";

interface BlogCreationRequest {
    title: string;
    content: string;
    imageId?: string;
    published: boolean;
}

const Publish = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageSelected, setImageSelected] = useState<File | null>(null);
  const [publicId, setPublicId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);

  const saveDraft = async () => {
    if (isDrafting || isPublishing) return;
    setIsDrafting(true);
    await publishPost(false);
    setIsDrafting(false);
  }

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "blogs-images");
  
    try {
      const response = await axios.post(import.meta.env.VITE_CLOUDINARY_URL, formData);
      console.log(response);
      return {
        publicId: response.data.public_id,
        url: response.data.secure_url
      };
    } catch (error) {
      console.error("Error uploading image", error);
      toast.error("Failed to upload image. Please try again.");
      throw error;
    }
  };

  const publishPost = async (published = true) => {
    if (isPublishing || isDrafting) return;
    if (published) {
      setIsPublishing(true);
    } else {
      setIsDrafting(true);
    }
    
    let uploadedPublicId = null;
  
    if (imageSelected) {
      try {
        setIsLoading(true);
        const { publicId: uploadedId } = await uploadImage(imageSelected);
        uploadedPublicId = uploadedId;
        setPublicId(uploadedId);
      } catch (error) {
        console.error("Error uploading image", error);
        setIsPublishing(false);
        setIsDrafting(false);
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
          toast.success("Your blog has been published successfully!");
          navigate(`/blog/${response.data.id}`);
        } else {
          toast.success("Your blog has been saved as a draft.");
          navigate('/drafts');  
        }
      }
    } catch (error) {
      console.error("Error publishing post", error);
      toast.error("Failed to publish the blog. Please try again.");
    } finally {
      setIsPublishing(false);
      setIsDrafting(false);
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
    <div className="min-h-screen bg-gray-100">
      <AppBar />
      <input type="file" id="fileInput" className="hidden" onChange={handleFileChange} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="font-extrabold text-3xl sm:text-4xl font-roboto mb-4 sm:mb-0">
            Write a Blog Post
          </h1>
          
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
          <div className="relative w-full h-48 sm:h-64 md:h-80">
            {/* skeleton from flowbite */}
            {isLoading ? (
              <div className="animate-pulse flex items-center justify-center w-full h-full bg-gray-200">
                <svg className="w-10 h-10 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                  <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
                </svg>
              </div>
            ) : publicId ? (
              <Image
                cloudName={import.meta.env.VITE_CLOUD_NAME}
                publicId={publicId}
                className="w-full h-full object-cover"
              />
            ) : imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-200">
                <svg className="w-10 h-10 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                  <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
                </svg>
              </div>
            )}

            <button 
              className="absolute right-4 top-4 z-10 text-white bg-gray-800 bg-opacity-50 hover:bg-opacity-70 p-2 rounded-full transition-colors duration-200"
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              <FiUpload size={20} />
            </button>
          </div>

          <div className="p-6">
            <textarea
              className="font-bold font-roboto text-2xl sm:text-3xl w-full mb-6 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#19191B] transition-all duration-200"
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your blog title here..."
              value={title}
              rows={2}
            ></textarea>
            <textarea
              className="font-normal font-roboto text-base sm:text-lg w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#19191B] transition-all duration-200"
              onChange={(e) => setContent(e.target.value)}
              rows={15}
              placeholder="Start writing your blog post here..."
              value={content}
            ></textarea>
          </div>
        </div>

        {/*  */}
        <div className="flex flex-col sm:flex-row gap-4 pt-7 sm:w-full">
            <button 
              disabled={isDrafting || isPublishing} 
              onClick={saveDraft}
              className="w-full sm:w-[50%] "
            >
              <Button 
                mode="dark" 
                text={isDrafting ? "Saving..." : "Save as draft"}
              />
            </button>
            <button 
              disabled={isPublishing || isDrafting} 
              onClick={() => publishPost(true)}
              className="w-full sm:w-[50%]"
            >
              <Button 
                mode="dark" 
                text={isPublishing ? "Publishing..." : "Publish"} 
              />
            </button>
          </div>
      </div>
    </div>
  );
};

export default Publish;