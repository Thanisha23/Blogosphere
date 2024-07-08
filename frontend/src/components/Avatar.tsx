import { useuserStore } from "../store/userStore"

interface AvatarProps {
    size:"small" | "big",
}
const Avatar = ({size = "small" }: AvatarProps) => {
  const {name} = useuserStore();
  return (
    <div 
  className={`relative inline-flex items-center justify-center font-robotoCondensed   bg-white rounded-full  h-10  w-10`}
>  <span className={`${size === "small" ? "text-xs" : "text-medium"} font-semibold text-[#19191B]`}>{name.slice(0,1)}</span>   
</div>
  )
}

export default Avatar