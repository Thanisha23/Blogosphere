import Avatar from "./Avatar"
import { Link } from "react-router-dom"

const AppBar = () => {
  return (
    <div className="border-b py-4 border-b-slate-400 flex items-center justify-between px-16 font-bonaNova">
        <Link to={`/blogs`} className="font-semibold text-lg">Blogosphere</Link>
        <div className="flex justify-center items-center gap-6">
            <Link to={`/publish`} className="bg-green-400 p-2 rounded-lg">Publish</Link>
            <Avatar size={"big"} authorName="Tanu" />

        </div>
    </div>
  )
}

export default AppBar