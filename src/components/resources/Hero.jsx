import React from "react";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <motion.div
      className="w-full h-[70vh] relative mt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
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
            "https://mir-s3-cdn-cf.behance.net/project_modules/1400/d1df3b140791961.6247d30e80686.jpg"
          }
          alt="Poster of Home page"
        />
        <motion.div
          className="absolute inset-0 bg-black opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 0.5, ease: "easeOut"}}
        />
      </motion.div>

      <motion.div
        className="relative z-10 flex flex-col items-start py-40 h-auto px-5 md:px-15"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
      >
        <motion.h2
          className="text-white text-3xl font-bold drop-shadow-2xl md:font-extrabold md:text-5xl text-center md:text-start md:max-w-full mx-auto leading-tight"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
        >
          ISAMC Resources Hub
        </motion.h2>

        <motion.h2
          className="mt-3 md:mt-0 text-white text-xl font-bold drop-shadow-2xl md:font-extrabold md:text-3xl text-center md:text-start md:max-w-full mx-auto leading-tight"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 1 }}
        >
          Tools, Standards & Knowledge for India’s AM Community
        </motion.h2>
      </motion.div>
    </motion.div>
  );
};

export default Hero;