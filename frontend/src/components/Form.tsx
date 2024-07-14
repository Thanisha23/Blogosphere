import {  useState } from "react"
import {SignupInput,SigninInput} from "blogosphere-common"
import LabelledInputType from "./LabelledInputType"
import { Link,useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import "react-toastify/ReactToastify.css"
type FormInputs = SignupInput | SigninInput;

const Form = ({type} : {type: "signup" | "signin"}) => {

    const navigate = useNavigate();

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
            toast.success(response.data.message,{
              position: 'top-center',
            });
            console.log("Token stored:", jwt);
            navigate("/blogs");
          } else {
            console.error("Token not found in the response", response.data);
            // alert("Error: Token not found in the response");
            toast.error(`Token not found in the response:${response.data.message}`,{
              position:"top-center",
            });
          }
          
        } catch (error) {
          console.error("Error during request:", error);
          // alert(`Error while ${type === "signup" ? "signing up" : "logging in"}: ${error}`);
          toast.error(`Error while ${type === "signup" ? "signing up" : "logging in"}: ${error}`,{
            position:"top-center",
            // className:"",
          });
        }
}

  return (
    <div className="flex-col justify-center items-center font-roboto">


<h1 className="text-3xl font-bold text-center mb-1">Create an account</h1>
<h4 className="text-gray-500 text-center">{type === "signup" ? "Already have an account?"  : "Don't have an account?" } <Link className="underline" to={type === "signup" ? "/signin" : "/signup"}>{type === "signup" ? "signin"  : "signup" }</Link></h4>
<div className=" w-[60%] md:w-[50%] mx-auto mt-4 ">
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
    <input onClick={sendRequest} className="bg-black text-white cursor-pointer font-medium w-[100%] h-9 rounded-lg" type="button" value={type === "signup" ? "Sign Up" : "Sign In"} />
   </div>
</form>
</div>
    </div>
  )
}

export default Form