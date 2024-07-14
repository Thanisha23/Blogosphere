import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
const ToggleBar = () => {
    const navigate = useNavigate();
  return (
    <div className="bg-slate-100 px-4 py-1 rounded-lg flex-col flex justify-center items-center">
   <Link to="/myaccount"> <button>My account</button></Link>
    <Link to="/drafts"><button>My Drafts</button></Link>
    <button onClick={() => {
        try {
            localStorage.removeItem("token");
            localStorage.removeItem("email");
            localStorage.removeItem("userId");
            navigate("/");
            toast.success("Logged out!",{
                position: "top-center"
            })

        } catch (error) {
            alert(`Error Logging out! ${error}`)
        }

    }}>Log out</button>
   </div>
  )
}

export default ToggleBar