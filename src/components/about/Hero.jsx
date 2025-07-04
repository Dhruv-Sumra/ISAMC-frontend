import React from "react";
import { motion } from "framer-motion";

const Hero = () => {
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
            "https://images.squarespace-cdn.com/content/v1/5adf16d696d4555c68034a46/1576657272703-2K4925U784IVYLBJ5NOY/DSC02669.jpg"
          }
          alt="Poster of Home page"
        />
        <motion.div
          className="absolute inset-0 bg-black opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        />
      </motion.div>

      <motion.div
        className="relative z-10 flex flex-col items-start py-40 h-screen px-5 md:px-15"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
      >
        <motion.h2
          className="text-gray-200 text-3xl font-bold drop-shadow-2xl md:font-extrabold md:text-5xl text-center md:text-start md:max-w-[50%] leading-tight"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
        >
          Pioneering India's Additive Manufacturing Future Since 2025
        </motion.h2>
      </motion.div>
    </motion.div>
  );
};



export default Hero;