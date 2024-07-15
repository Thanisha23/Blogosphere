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
        className="flex flex-col md:gap-5 gap-2 justify-center items-center text-center pt-[11rem] lg:pt-[9rem] text-5xl md:text-6xl lg:text-9xl font-antonSC md:px-9 px-2 text-[#19191B]"
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
        className="mx-auto pt-[4rem] md:pt-[3rem] lg:pt-[6rem] flex justify-center items-center gap-[1rem] text-2xl md:text-3xl font-antonSC"
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