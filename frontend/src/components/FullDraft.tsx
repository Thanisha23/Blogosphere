import { Blog } from "../hooks";
import AppBar from "./AppBar";
import React, { useState } from "react";
import { Image } from "cloudinary-react";
import Button from "./Button";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface FullDraftProps {
  blog: Blog;
}

interface FormInputs {
  id: string;
  title: string;
  content: string;
  published: boolean;
  imageId: string | null;
}

const FullDraft: React.FC<FullDraftProps> = ({ blog }) => {
  const navigate = useNavigate();
  const initialState: FormInputs = {
    id: blog.id,
    title: blog.title,
    content: blog.content,
    published: blog.published,
    imageId: blog.imageId
  };

  const [isLoading, setIsLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [editable, setEditable] = useState(false);
  const [updateInputs, setUpdateInputs] = useState<FormInputs>(initialState);

  async function updateRequest(publish: boolean = false) {
    setIsLoading(true);
    if (publish) {
      setIsPublishing(true);
    } else {
      setIsDrafting(true);
    }
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/update`,
        { ...updateInputs, published: publish },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data) {
        setEditable(false);
      }
      if(publish){
        toast.success("Published successfully!")
        navigate(`/blog/${response.data.id}`);
      }else{
        toast.success("Saved in your drafts successfully!")
        navigate('/drafts'); 
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating blog");
    } finally {
      setIsLoading(false);
      setIsDrafting(false);
      setIsPublishing(false);
    }
  }

  return (
    <>
      <AppBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-7">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="font-merriweather text-2xl sm:text-3xl font-bold mb-4 sm:mb-0 sm:w-1/2">
            {blog.title}
          </h1>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden mb-8">
          {isLoading ? (
            <div className="animate-pulse flex items-center justify-center w-full h-64 bg-gray-200">
              <svg className="w-10 h-10 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
              </svg>
            </div>
          ) : updateInputs.imageId ? (
            <div className="mb-6">
              <Image
                cloudName={import.meta.env.VITE_CLOUD_NAME}
                publicId={updateInputs.imageId}
                className="w-full h-auto object-cover rounded-t-lg"
              />
            </div>
          ) : null}

          <div className="px-6 py-4">
            <textarea
              readOnly={!editable}
              value={updateInputs.title}
              onChange={(e) => setUpdateInputs({ ...updateInputs, title: e.target.value })}
              className="font-merriweather text-2xl sm:text-3xl font-bold w-full mb-4 p-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-200"
              rows={2}
            />
            <textarea
              readOnly={!editable}
              value={updateInputs.content}
              onChange={(e) => setUpdateInputs({ ...updateInputs, content: e.target.value })}
              className="font-merriweather text-lg w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-200"
              rows={20}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:w-full">
          <button   
           disabled={isDrafting || isPublishing}  onClick={() => updateRequest(false)} className="w-full sm:w-1/3">
            <Button 
              mode="dark" 
              text={isDrafting ? "Saving..." : "Save as draft"}
            />
          </button>
          <div className="w-full  sm:w-1/3">
            {!editable ? (
              <button className="w-full"
              disabled={isDrafting || isPublishing}
              onClick={() => setEditable(true)}> 
                <Button 
                mode="dark" 
                text="Edit"
              />
              </button>
            ) : (
              <button   
              disabled={isDrafting || isPublishing} onClick={() => updateRequest(false)}>
                <Button 
                mode="dark" 
                text="Save"
              />
              </button>
            )}
          </div>
          <button 
              disabled={isPublishing || isDrafting}  onClick={() => updateRequest(true)} className="w-full sm:w-1/3">
            <Button 
              mode="dark" 
              text={isPublishing ? "Publishing..." : "Publish"}
             
            />
          </button>
        </div>
      </div>
    </>
  );
};

export default FullDraft;