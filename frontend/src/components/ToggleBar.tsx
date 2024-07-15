import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, Variants } from "framer-motion";

interface ToggleBarItemProps {
  to: string;
  children: React.ReactNode;
  variants: Variants;
}

const ToggleBarItem: React.FC<ToggleBarItemProps> = ({ to, children, variants }) => (
  <motion.div variants={variants}>
    <Link 
      to={to}
      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-150"
    >
      {children}
    </Link>
  </motion.div>
);

const ToggleBar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("userId");
      navigate("/");
      toast.success("Logged out!", {
        position: "top-center"
      });
    } catch (error) {
      alert(`Error Logging out! ${error}`);
    }
  };

  const menuItemVariants: Variants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div 
      className="bg-white shadow-lg rounded-lg overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
      }}
    >
      <ToggleBarItem to="/myaccount" variants={menuItemVariants}>My account</ToggleBarItem>
      <ToggleBarItem to="/drafts" variants={menuItemVariants}>My Drafts</ToggleBarItem>
      <motion.button
        variants={menuItemVariants}
        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-150"
        onClick={handleLogout}
      >
        Log out
      </motion.button>
    </motion.div>
  );
};

export default ToggleBar;