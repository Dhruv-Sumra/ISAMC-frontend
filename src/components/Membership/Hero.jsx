import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const handleJoinNow = () => {
    document.getElementById("tier")?.scrollIntoView({ behavior: "smooth" });
  };


  return (
    <motion.div
      className="w-full h-[70vh] relative mt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.div
        className="absolute h-[60vh] inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      >
        <img
          className="h-full w-full object-cover"
          src={
            "https://assets-global.website-files.com/6009ec8cda7f305645c9d91b/60108123d58c7f4754c2b6b5_6002086f72b727df6d01df3b_business-website-examples.jpeg"
          }
          alt="Poster of Home page"
        />
        <motion.div
          className="absolute inset-0 bg-black opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
        />
      </motion.div>

      <motion.div
        className="relative z-10 flex flex-col items-start py-40 h-screen px-5 md:px-15"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration:0.8, ease: "easeOut", delay: 0.6 }}
      >
        <motion.h2
          className="text-gray-200 text-3xl font-bold drop-shadow-2xl md:font-extrabold md:text-5xl text-center md:text-start md:max-w-full mx-auto leading-tight"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
        >
          Powering India’s AM Future Together
        </motion.h2>

        <div className="w-full md:gap-5 md:flex flex-col md:flex-row flex md:justify-center items-center">
          <motion.a
            href="#"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 1 }}
          >
            <motion.button
              className="w-full mt-6 transi text-white bg-blue-500 hover:bg-blue-600 py-1 md:py-2 cursor-pointer px-5 rounded-lg tracking-wide md:text-2xl"
              whileHover={{ scale: 1.05 }}
              onClick={handleJoinNow}
            >
              Join ISAMC
            </motion.button>
          </motion.a>

        
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Hero;