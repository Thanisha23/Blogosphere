import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface NavButtonProps {
    to:string;
    children:ReactNode;
    mobile?:boolean
}

export const NavButton:React.FC<NavButtonProps> = ({ to, children, mobile = false }) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link
        to={to}
        className={`bg-white text-black text-[1rem] font-semibold rounded-lg px-4 py-2 ${
          mobile ? "block w-full text-center" : "flex justify-center items-center gap-2"
        }`}
      >
        {children}
      </Link>
    </motion.div>
  );