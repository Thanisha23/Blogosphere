import React, { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Avatar from "./Avatar";
import ToggleBar from "./ToggleBar";
import { RxCross2, RxHamburgerMenu } from "react-icons/rx";
import { NavButton } from "./NavButton";
import { FaPenFancy } from "react-icons/fa";
import { toast } from "react-toastify";

interface LinkProps {
  to: string;
  children: ReactNode;
}

const AppBar = () => {
  const [toggle, setToggle] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("userId");
      toast.success("Logged out!", {
        position: "top-center"
      });
    } catch (error) {
      alert(`Error Logging out! ${error}`);
    }
  };
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#19191B] text-white font-robotoCondensed shadow-lg">
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        <div className="flex justify-between h-20 md:h-[5.5rem]">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/blogs">
              <img className="h-9 md:h-12 w-auto sm:h-10" src="/blogo-new.jpeg" alt="Logo" />
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <NavButton to="/myblogs">My Blogs</NavButton>
            <NavButton to="/publish">
              <div>New</div>
              <div><FaPenFancy size={15} /></div>
            </NavButton>
            <motion.div 
              className="cursor-pointer relative"
              onClick={() => setToggle(prev => !prev)}
              whileTap={{ scale: 0.95 }}
            >
              <Avatar size="big" />
              <AnimatePresence>
                {toggle && (
                  <motion.div 
                    className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ToggleBar />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
          <div className="flex items-center sm:hidden">
            <motion.button
              className="inline-flex items-center justify-center p-2 rounded-md text-white focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {mobileMenuOpen ? <RxCross2 size={25} /> : <RxHamburgerMenu size={25} />}
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="sm:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <MobileNavLink to="/myblogs">My Blogs</MobileNavLink>
              <MobileNavLink to="/publish"><div className="flex justify-start items-center gap-2"><div>New</div><div><FaPenFancy size={15} /></div></div></MobileNavLink>
              <MobileNavLink to="/myaccount">My account</MobileNavLink>
              <MobileNavLink to="/drafts">My Drafts</MobileNavLink>
              <div onClick={handleLogout} className="hover:bg-white hover:text-[#19191B] block px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out" >Logout</div>

              <motion.div 
                className="cursor-pointer flex justify-center" 
                whileTap={{ scale: 0.95 }}
              >
                <div className="border-t-2 text-center rounded-full border-t-white w-[100%] pt-4">
                  <Avatar size="big" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const MobileNavLink: React.FC<LinkProps> = ({ to, children }) => (
  <Link
    to={to}
    className="hover:bg-white hover:text-[#19191B] block px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out"
  >
    {children}
  </Link>
);



export default AppBar;