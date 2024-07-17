import { BrowserRouter,Routes,Route, Navigate } from "react-router-dom"
import Signup from "./pages/Signup"
import Signin from "./pages/Signin"
import Blog from "./pages/Blog"
import Blogs from "./pages/Blogs"
import Publish from "./pages/Publish"
import { ToastContainer } from "react-toastify"
import Home from "./pages/Home"
import Drafts from "./pages/Drafts"
import MyBlogs from "./pages/MyBlogs"
import Draft from "./pages/Draft"
import MyAccount from "./pages/MyAccount"
import { isAdminStore } from "./store/isAdminStore"
import AdminDashboard from "./pages/AdminDashboard"
import PrivateRoute from "./components/PrivateRoute"


const App = () => {
  const isAdmin = isAdminStore((state) => state.isAdmin)
  return (
   <>
    <BrowserRouter>
    <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />}/>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/blog/:id" element={<Blog/>}/>
          <Route path="/blogs" element={<Blogs/>}/>
          
          <Route element={<PrivateRoute />}>
          <Route path="/publish" element={<Publish/>}/>
          <Route path="/drafts" element={<Drafts />} />
          <Route path="/draft/:id" element={<Draft />} />
          <Route path="/myblogs" element={<MyBlogs />} />
          <Route path="/myaccount" element={<MyAccount />} />
          </Route>
          <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />} />
        
          
         
      </Routes>
    </BrowserRouter>
   
   </>
  )
}

export default App