import axios from "axios";
import { BACKEND_URL, CLOUDINARY_URL, CLOUD_NAME } from "../config";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image } from "cloudinary-react";


interface BlogCreationRequest {
    title: string;
    content: string;
    imageId?: string;
  }
  

const Publish = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageSelected, setImageSelected] = useState<File | null>(null);
  const [publicId, setPublicId] = useState<string | null>(null);

  const uploadImage = async () => {
    if (imageSelected) {
      const formData = new FormData();
      formData.append("file", imageSelected);
      formData.append("upload_preset", "blogs-images");

      try {
        const response = await axios.post(CLOUDINARY_URL, formData);
        console.log(response);
        setPublicId(response.data.public_id);
      } catch (error) {
        console.error("Error uploading image", error);
      }
    }
  };

  const publishPost = async () => {
    const blogData: BlogCreationRequest = {
      title,
      content
    };

    if (publicId) {
      blogData.imageId = publicId;
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/blog`,
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
      if (response) {
        navigate(`/blog/${response.data.id}`);
      }
    } catch (error) {
      console.error("Error publishing post", error);
    }
  };

  return (
    <div className="flex-col flex">
      <input
        onChange={(e) => {
          setTitle(e.target.value);
        }}
        type="text"
        placeholder="Enter title"
        value={title}
      />
      <input
        onChange={(e) => {
          setContent(e.target.value);
        }}
        type="text"
        placeholder="Enter content"
        value={content}
      />
      <div className="flex justify-center items-center pt-[2rem]">
        <input
          type="file"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setImageSelected(e.target.files[0]);
            }
          }}
        />
        <button onClick={uploadImage}>Upload Image</button>
      </div>
      <button onClick={publishPost}>Publish post</button>

      <div className="pt-[3rem]">
        {publicId && (
          <Image
            cloudName={CLOUD_NAME}
            publicId={publicId}
            className="w-[35rem] h-[35rem]"
          />
        )}
      </div>
    </div>
  );
};

export default Publish;
