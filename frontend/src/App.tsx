import { BrowserRouter,Routes,Route } from "react-router-dom"
import Signup from "./pages/Signup"
import Signin from "./pages/Signin"
import Blog from "./pages/Blog"
import Blogs from "./pages/Blogs"
import Publish from "./pages/Publish"
import { ToastContainer } from "react-toastify"
import Home from "./pages/Home"
import Drafts from "./pages/Drafts"



const App = () => {
  return (
   <>
    <BrowserRouter>
    <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/blog/:id" element={<Blog/>}/>
          <Route path="/blogs" element={<Blogs/>}/>
          <Route path="/publish" element={<Publish/>}/>
          <Route path="/drafts" element={<Drafts />} />
          <Route />
         
      </Routes>
    </BrowserRouter>
   
   </>
  )
}

export default App