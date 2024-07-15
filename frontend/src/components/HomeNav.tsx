import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { NavButton } from "./NavButton";
import { RxCross2 } from "react-icons/rx";
import { RxHamburgerMenu } from "react-icons/rx";
const HomeNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`py-5 font-robotoCondensed bg-[#19191B] border-b border-b-slate-400 left-0 right-0 px-6 md:px-24 ${isScrolled ? 'fixed top-0' : 'relative'} z-50`}>
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
          {isOpen ? (
            <RxCross2 size={25} />
          ) : (
            <RxHamburgerMenu size={25} />
          )
          }
        </motion.button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden mt-4 gap-4 flex flex-col absolute left-0 right-0 bg-[#19191B] px-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="pb-4 flex flex-col gap-5">
            <NavButton to="/signup" mobile>Sign Up</NavButton>
            <NavButton to="/signin" mobile>Sign In</NavButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default HomeNav;