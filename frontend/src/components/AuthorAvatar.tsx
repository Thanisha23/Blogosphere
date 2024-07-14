

interface AvatarProps {
    size:"small" | "big",
    authorName:string,
}
const AuthorAvatar = ({size = "small",authorName }: AvatarProps) => {
  
  return (
    <div 
  className={`relative inline-flex items-center justify-center font-roboto  border border-slate-400 bg-white rounded-full  h-10  w-10`}
>  <span className={`${size === "small" ? "text-xs" : "text-medium"} font-semibold text-[#19191B]`}>{authorName[0]}</span>   
</div>
  )
}

export default AuthorAvatar