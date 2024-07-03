import { ChangeEvent } from "react"




interface LabelledInput{
    label:string,
    placeholder:string,
    onChange:(e : ChangeEvent<HTMLInputElement>) => void;
    type:string,
}

const LabelledInputType = ({label,placeholder,onChange,type} : LabelledInput) => {
  return (
   <>
   <label className="text-base font-medium">{label}</label>
   <input onChange={onChange} placeholder={placeholder} className="border border-gray-300 h-9 rounded-lg p-4" type={type} />
   </>
  )
}

export default LabelledInputType