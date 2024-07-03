import Form from "../components/Form"
import Quote from "../components/Quote"


const Signup = () => {
  return (
    <div className="flex justify-center items-center w-[100%]">
      <div className="w-[50%]">
      <Form type="signup"/>
      </div>
     <div className="w-[50%]">
     <Quote />
     </div>
    </div>
  )
}

export default Signup