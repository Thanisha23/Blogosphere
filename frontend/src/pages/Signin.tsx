import Form from "../components/Form"
import Quote from "../components/Quote"


const Signin = () => {
  return (
    <div className="flex justify-center items-center w-[100%] h-[100vh]">
    <div className="lg:w-[50%] w-[100%]">
    <Form type="signin"  />
    </div>
   <div className="w-[50%] hidden lg:block">
   <Quote />
   </div>
  </div>
  )
}

export default Signin