// import Avatar from "./Avatar"
import { Link } from "react-router-dom"
// import ToggleBar from "./ToggleBar"
// import { useState } from "react"

const HomeNav = () => {
//   const [toggle,setToggle] = useState(false);
  return (
    <div className="border-b py-5 font-robotoCondensed bg-[#19191B] border-b-slate-400 bottom-0 left-0 right-0  flex items-center justify-between px-24 relative">
        <Link to={`/blogs`} className="">
        <img src="/blogo-new.jpeg" alt="" width={180} height={150} /></Link>
        <div className="flex justify-center items-center gap-6">
        <Link to={`/signup`} className="bg-white text-black text-[1rem] font-semibold rounded-lg px-4 py-2">Sign Up</Link>
            <Link to={`/signin`} className="bg-white text-black text-[1rem] font-semibold rounded-lg px-4 py-2">Sign In</Link>
         


        </div>
      
    </div>
  )
}

export default HomeNav