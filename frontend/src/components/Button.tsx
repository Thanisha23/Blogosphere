
interface ButtonProps {
    text: string,
    mode: "dark" | "light";
}

const Button = ({text,mode} : ButtonProps) => {
  return (
   
    <div className={`text-[1rem] font-robotoCondensed font-semibold cursor-pointer rounded-lg px-4 py-2 ${mode === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>{text}</div>
  )
}

export default Button