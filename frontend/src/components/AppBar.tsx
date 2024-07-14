import Avatar from "./Avatar"
import { Link } from "react-router-dom"
import ToggleBar from "./ToggleBar"
import { useState } from "react"

const AppBar = () => {
  const [toggle,setToggle] = useState(false);
  return (
    <div className="relative z-50 mb-28">
      <div className="border-b py-5 font-roboto bg-[#19191B] border-b-slate-400 fixed top-0 left-0 right-0 flex items-center justify-between px-24">
        <Link to={`/blogs`} className="">
        <img src="/blogo-new.jpeg" alt="" width={180} height={150} /></Link>
        <div className="flex justify-center items-center gap-6">
        <Link to={`/myblogs`} className="bg-white text-black text-[1rem] font-semibold rounded-lg px-4 py-2">My Blogs</Link>
            <Link to={`/publish`} className="bg-white text-black text-[1rem] font-semibold rounded-lg px-4 py-2">Publish</Link>
           <div className="cursor-pointer" onClick={() => {
              setToggle(prev => !prev)
           }}>
           <Avatar  size={"big"}  />
           </div>


        </div>
      {toggle ?   <div className="absolute top-[4rem] right-4">
        <ToggleBar />
        </div> : null}
        </div>
    </div>
  )
}

export default AppBar