import React from "react";
import AppBar from "../components/AppBar";
import { useuserStore } from "../store/userStore";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MyAccount = () => {
  const navigate = useNavigate();
  const { name } = useuserStore();
  const userEmail = localStorage.getItem("email") || "";
  async function deleteAccount(e:React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const userId = localStorage.getItem("userId");
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/delete`,{
        data:{userId},
        withCredentials:true,
        headers:{
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("token")
        }
      })
      if(response.data){
        toast.success("Successfully deleted your account!");
        navigate("/");
      }else{
        toast.error("Failed to delete your account")
    }
    } catch (error) {
      console.log(error);
      toast.error("Error deleting the your account");
    }
  }

  return (
   <>
   <AppBar />

   <div className="flex flex-col font-robotoCondensed justify-center items-center pt-[9rem]">
      <div className="w-[10rem] h-[10rem] font-bold rounded-full bg-[#19191B] flex justify-center items-center text-6xl text-white">
        {name[0].toUpperCase()}
      </div>
      <div className="mt-[3rem] w-full max-w-xl px-7">
        <form className="w-full">
          <div className="mb-5">
            <label htmlFor="name" className="block mb-2 text-lg font-medium text-gray-900">
              Name
            </label>
            <input
              readOnly
              type="text"
              id="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              value={name}
            />
          </div>
          <div className="mb-5">
            <label htmlFor="email" className="block mb-2 text-lg font-medium text-gray-900">
              Email
            </label>
            <input
              readOnly
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              value={userEmail}
            />
          </div>
        </form>
      </div>
      <div onClick={deleteAccount} className="border cursor-pointer border-red-700 px-[5rem] p-4 mt-[3rem] rounded-lg font-medium bg-red-200">
        DELETE MY ACCOUNT
      </div>
    </div>
   </>
  );
};

export default MyAccount;