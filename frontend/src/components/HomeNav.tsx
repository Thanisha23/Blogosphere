import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { NavButton } from "./NavButton";
const HomeNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="border-b py-5 font-robotoCondensed bg-[#19191B] border-b-slate-400 bottom-0 left-0 right-0 px-6 md:px-24 relative">
      <div className="flex items-center justify-between">
        <Link to={`/blogs`}>
          <img src="/blogo-new.jpeg" alt="" className="w-32 md:w-44 h-auto" />
        </Link>
        <div className="hidden md:flex justify-center items-center gap-6">
          <NavButton to="/signup">Sign Up</NavButton>
          <NavButton to="/signin">Sign In</NavButton>
        </div>
        <motion.button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
          whileTap={{ scale: 0.95 }}
        >
          {isOpen ? "✕" : "☰"}
        </motion.button>
      </div>
      {isOpen && (
        <motion.div
          className="md:hidden mt-4 flex flex-col gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <NavButton to="/signup" mobile>Sign Up</NavButton>
          <NavButton to="/signin" mobile>Sign In</NavButton>
        </motion.div>
      )}
    </nav>
  );
};



export default HomeNav;