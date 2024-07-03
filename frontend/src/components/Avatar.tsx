

interface AvatarProps {
    authorName : string,
    size:"small" | "big",
   
}

const Avatar = ({authorName,size = "small" }: AvatarProps) => {
  return (
    <div 
  className={`relative inline-flex items-center justify-center font-bonaNova overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 h-10  w-10`}
>



    <span className={`${size === "small" ? "text-xs" : "text-medium"}  text-gray-600 dark:text-gray-300`}>{authorName.slice(0,1)}</span>




    
</div>
  )
}

export default Avatar