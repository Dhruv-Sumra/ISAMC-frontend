import React from "react";
import { motion } from "framer-motion";

const Aboutus = () => {
  return (
    <motion.div
      className="px-5 md:px-15 w-full h-auto space-x-3 flex justify-between align-middle"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <motion.div 
        className="md:w-3/5 w-full"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.h2 
          className="text-4xl font-bold "
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
        >
          About us 
          <div className="border-2 border-blue-500 w-2/5 md:w-2/14"></div>
        </motion.h2>

        <motion.p
          className="text-lg font-semibold mb-2 mt-10 md:mt-15"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
        >
        </motion.p>

        <motion.p
          className="w-2/3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
        >
          ISAMC drives innovation by fostering research, industry collaboration, and global partnerships in additive manufacturing supporting national policies, promoting R&D, and making India a global hub for 3D Printing excellence.
        </motion.p>

        <a href="/about">
          <motion.button
            whileHover={{ scale: 1.01 }}
            className="mt-5 transi text-white bg-blue-500 hover:bg-blue-600 py-1 md:py-2 cursor-pointer px-3 md:px-5 rounded-lg tracking-wide md:text-2xl text-xl"
          >
            Read more
          </motion.button>
        </a>
      </motion.div>

      <motion.div 
        className="md:w-2/5 hover:scale-101 transition-all duration-300 hidden md:block"
        initial={{ opacity: 0, scale: 0.9}}
        whileInView={{ opacity: 1, scale: 0.9 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
      >
        <img
          className="w-full h-full shadow-lg card_scale"
          src="https://itamco.com/wp-content/uploads/2020/01/DZ2A7991_EDIT-scaled.jpg"
          alt=""
        />
      </motion.div>
    </motion.div>
  );
};

export default Aboutus;