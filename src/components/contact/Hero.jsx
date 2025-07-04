import React from "react";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <motion.div
      className="w-full h-[40vh] flex justify-center items-center relative mb-5 md:my-20 mt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.div
        className="absolute h-[40vh] inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      >
        <img
          className="h-full w-full object-cover"
          src={
            "https://png.pngtree.com/thumb_back/fw800/background/20241009/pngtree-a-closeup-of-white-printer-nozzle-engaged-in-additive-manufacturing-showcasing-image_16328047.jpg"
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
        className="relative z-10 flex flex-col items-center py-40 h-auto px-5 md:px-15"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
      >
        <motion.h2
          className="text-white text-3xl font-bold drop-shadow-2xl md:font-extrabold md:text-5xl text-center md:text-start md:max-w-full mx-auto leading-tight"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut"}}
        >
          Connect with India’s AM Leadership
        </motion.h2>
      </motion.div>
    </motion.div>
  );
};

export default Hero;