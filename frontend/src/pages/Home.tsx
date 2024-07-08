import HomeNav from "../components/HomeNav"
import { motion } from "framer-motion"

const Home = () => {
  return (
    <>
      <HomeNav />
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col gap-5 justify-center items-center pt-[7rem] text-9xl font-antonSC px-9 text-[#19191B]"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          BLOGOSPHERE
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          - Coz blogs are cool!
        </motion.div>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="mx-auto pt-[7rem] flex justify-center items-center gap-[1rem] text-3xl font-antonSC"
      >
        {["Write", "Reach", "Resonate"].map((word, index) => (
          <motion.div
            key={word}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.5 + index * 0.2 }}
          >
            {word}
          </motion.div>
        ))}
      </motion.div>
    </>
  )
}

export default Home