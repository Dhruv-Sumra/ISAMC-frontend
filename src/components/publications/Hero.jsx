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
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
      >
        <img
          className="h-full w-full object-cover"
          src={
            "https://th.bing.com/th/id/R.68d38d52507f9befeeca40e35e236ac6?rik=yZVqG3nzZOJXjg&riu=http%3a%2f%2fweandthecolor.com%2fwp-content%2fuploads%2f2016%2f08%2fBased-on-simple-lines-and-patterns.jpg&ehk=wlJjD1mIfopk9CP%2b%2fPdKqC7Q9flQrvrWoJwXKR3IMFA%3d&risl=&pid=ImgRaw&r=0"
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
        className="relative z-10 flex flex-col items-start gap-5 py-40 h-screen px-5 md:px-15"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
      >
        <motion.h2
          className="text-gray-200 md:mx-0 mx-auto text-3xl font-bold drop-shadow-2xl md:font-extrabold md:text-5xl text-center md:text-start md:max-w-[50%] leading-tight"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
        >
          ISAMC publications
        </motion.h2>

        <motion.p
          className="text-gray-200 text-xl font-bold drop-shadow-2xl md:font-extrabold md:text-3xl text-center md:text-start md:max-w-[50%] leading-tight"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 1 }}
        >
          Advancing Additive Manufacturing Knowledge Through Open Research
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default Hero;