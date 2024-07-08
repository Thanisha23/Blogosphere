import { AiOutlineCopyrightCircle } from "react-icons/ai";

const Footer = () => {
  return (
    <div className="w-[100%] bg-slate-300 flex justify-between items-center">

        <div className="flex justify-center items-center gap-2">
            <AiOutlineCopyrightCircle />
            <div>2024 Blogging Platform</div>
        </div>
        <div className="flex justify-center items-center">
            <div>Terms of Service</div>
            <div>Privacy Policy</div>
        </div>



    </div>
  )
}

export default Footer