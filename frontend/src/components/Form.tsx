import {  useState } from "react"
import {SignupInput,SigninInput} from "blogosphere-common"
import LabelledInputType from "./LabelledInputType"
import { Link,useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import "react-toastify/ReactToastify.css"
import { isAdminStore } from "../store/isAdminStore"
import { useAuthStore } from "../store/useAuthStore"

type FormInputs = SignupInput | SigninInput;

const Form = ({type} : {type: "signup" | "signin"}) => {
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);

  const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
  const setIsAdmin = isAdminStore((state) => state.setIsAdmin)
    const initialState: FormInputs = type === "signup" ? {
        name: "",
        email: "",
        password:""
    } : {
        email: "",
        password:""
    }

    const [postInputs,setPostInputs] = useState<FormInputs>(initialState);

    async function sendRequest() {
      if (isLoading) return; // Prevent multiple calls if already loading
      setIsLoading(true);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
          postInputs,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
    
        const jwt = response.data.jwt;
        const userId = response.data.userId;
        if (jwt && userId) {
          localStorage.setItem("token", jwt);
          localStorage.setItem("userId", userId);
          setIsAdmin(response.data.isAdmin)
          toast.success(
            type === "signup" 
              ? "Account created successfully! Welcome aboard." 
              : "Welcome back! You've successfully signed in.",
            {
              position: 'top-center',
            }
          );
          console.log("Token stored:", jwt);
          if(response.data.isAdmin){
            navigate("/admin");
          }else{
            setIsAuthenticated(true);
            navigate("/blogs");
          }
        } else {
          console.error("Token not found in the response", response.data);
          toast.error(
            "Oops! Something went wrong with authentication. Please try again.",
            {
              position: "top-center",
            }
          );
        }
        
      } catch (error) {
        console.error("Error during request:", error);
        if (axios.isAxiosError(error) && error.response) {
          // Handle specific error responses
          switch (error.response.status) {
            case 409:
              toast.error("This email is already registered. Try signing in instead.", {
                position: "top-center",
              });
              break;
            case 411:
              toast.error("Please check your inputs and try again.", {
                position: "top-center",
              });
              break;
            case 403:
              toast.error("Incorrect email or password. Please try again.", {
                position: "top-center",
              });
              break;
            default:
              toast.error(
                `An unexpected error occurred. Please try again later. (${error.response.status})`,
                {
                  position: "top-center",
                }
              );
          }
        } else {
          toast.error(
            `Unable to connect to the server. Please check your internet connection and try again.`,
            {
              position: "top-center",
            }
          );
        }
      } finally {
        setIsLoading(false);
      }
    }

  return (
    <div className="flex-col justify-center items-center font-roboto">


<h1 className="text-3xl font-bold text-center mb-1">Create an account</h1>
<h4 className="text-gray-500 text-center">{type === "signup" ? "Already have an account?"  : "Don't have an account?" } <Link className="underline" to={type === "signup" ? "/signin" : "/signup"}>{type === "signup" ? "signin"  : "signup" }</Link></h4>
<div className=" w-[75%] md:w-[50%] mx-auto mt-4 ">
<form className="">
  {type === "signup" ? (
     <div className="flex-col flex gap-2">
     <LabelledInputType label = "Name" placeholder="Enter your name" onChange={(e) => {
          setPostInputs({
              ...postInputs,
              name:e.target.value
          })
     }} type="text" />
     </div>
  ) : null}
   <div className="flex-col flex mt-4 gap-2">
   <LabelledInputType label = "Email" placeholder="Enter your email" onChange={(e) => {
        setPostInputs({
            ...postInputs,
            email:e.target.value
        })
   }} type="text" />
   </div>
   <div className="flex-col flex mt-4 gap-2">
   <LabelledInputType label = "Password" placeholder="Enter your password" onChange={(e) => {
        setPostInputs({
            ...postInputs,
            password:e.target.value
        })
   }} type="password" />
   </div>
   <div className="mt-6">
    {/* {JSON.stringify(postInputs)} */}
    <button 
  onClick={sendRequest} 
  disabled={isLoading}
  className={`bg-black text-white cursor-pointer font-medium w-[100%] h-9 rounded-lg ${
    isLoading ? 'opacity-50 cursor-not-allowed' : ''
  }`}
>
  {isLoading 
    ? (type === "signup" ? "Signing Up..." : "Signing In...") 
    : (type === "signup" ? "Sign Up" : "Sign In")
  }
</button>
   </div>
</form>
</div>
    </div>
  )
}

export default Form