import Avatar from "./Avatar"
import { Link } from "react-router-dom"
import ToggleBar from "./ToggleBar"
import { useState } from "react"

const AppBar = () => {
  const [toggle,setToggle] = useState(false);
  return (
    <div className="border-b py-4 border-b-slate-400 flex items-center justify-between px-16 font-bonaNova relative">
        <Link to={`/blogs`} className="font-semibold text-lg">Blogosphere</Link>
        <div className="flex justify-center items-center gap-6">
            <Link to={`/publish`} className="bg-green-400 p-2 rounded-lg">Publish</Link>
           <div className="cursor-pointer" onClick={() => {
              setToggle(prev => !prev)
           }}>
           <Avatar  size={"big"} authorName="Tanu" />
           </div>


        </div>
      {toggle ?   <div className="absolute top-[4rem] right-4">
        <ToggleBar />
        </div> : null}
    </div>
  )
}

export default AppBar