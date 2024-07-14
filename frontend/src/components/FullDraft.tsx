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
  const [editable, setEditable] = useState(false);
  const [updateInputs, setUpdateInputs] = useState<FormInputs>(initialState);

  async function updateRequest(publish: boolean = false) {
    setIsLoading(true);
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
        toast.success(response.data.message);
        setEditable(false);
        // Update the blog state here if needed
      }
      if(publish){
        navigate(`/blog/${response.data.id}`);
      }else{
        navigate('/drafts'); 
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating blog");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <AppBar />
      <div className="px-24 pt-[4rem] flex justify-between items-center w-[100%]">
        <div className="font-merriweather text-2xl w-[50%] pt-[0.7rem]">
          {blog.title}
        </div>
        <div className="flex justify-end items-center gap-4 w-[50%]">
          <div 
            onClick={() => updateRequest(false)}>
          <Button
            mode="dark"
            text="Save as draft"
          />
          </div>
          <div  onClick={() => setEditable(true)} className={editable ? "hidden" : "block"}>
            <Button
              mode="dark"
              text="Edit" 
            />
          </div>
          <div 
              onClick={() => updateRequest(false)} className={editable ? "block" : "hidden"}>
            <Button
              mode="dark"
              text="Save"
            />
          </div>
          <div 
            onClick={() => updateRequest(true)}>
          <Button
            mode="dark"
            text="Publish"
          />
          </div>
        </div>
      </div>
      {/* image,title,content section */}
      <div className="bg-white border border-transparent mb-[3rem] mt-12 rounded-lg pb-24">
        <div className="flex flex-col items-center w-full">
          {isLoading ? (
            <div className="animate-pulse flex items-center justify-center w-full h-64 bg-gray-200 rounded">
              <svg className="w-10 h-10 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
              </svg>
            </div>
          ) : updateInputs.imageId ? (
            <>
              <Image
                cloudName={import.meta.env.VITE_CLOUD_NAME}
                publicId={updateInputs.imageId}
                className="w-[80%] max-w-2xl object-contain rounded-lg mx-auto"
              />
              <textarea
                readOnly={!editable}
                value={updateInputs.title}
                onChange={(e) => setUpdateInputs({ ...updateInputs, title: e.target.value })}
                className="font-medium text-lg py-10 font-merriweather text-center w-[80%] max-w-2xl mx-auto rounded-b-lg focus:outline-none rounded-lg focus:border-gray-200 focus:ring-1 focus:ring-gray-200 mt-4"
                rows={2}
              />
            </>
          ) : null}
          <textarea
            readOnly={!editable}
            value={updateInputs.content}
            onChange={(e) => setUpdateInputs({ ...updateInputs, content: e.target.value })}
            className="font-medium text-lg py-10 font-merriweather w-[80%] max-w-2xl mx-auto rounded-b-lg focus:outline-none rounded-lg text-center focus:border-gray-200 focus:ring-1 focus:ring-gray-200 mt-4"
            rows={20}
          />
        </div>
      </div>
    </>
  );
};

export default FullDraft;