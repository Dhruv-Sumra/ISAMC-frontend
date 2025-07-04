import React from "react";
import { Link } from "react-router-dom";
import poster from "/src/assets/poster.jpeg";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";


const Hero = () => {
  const navigate = useNavigate();

  const handleJoinNow = () => {
      navigate("/membership");
  };

  return (
    <div className="w-full h-[90vh] relative overflow-hidden">
      <motion.div
        className="absolute h-[80vh] inset-0"
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <img
          className="h-full w-full object-cover"
          src={poster}
          alt="Poster of Home page"
        />
        <motion.div
          className="absolute inset-0 bg-black opacity-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1.5 }}
        />
      </motion.div>

      <motion.div
        className="relative z-10 flex flex-col items-start py-40 h-screen px-5 md:px-15"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
      >
        <motion.h2
          className="text-gray-200 mb-5 text-3xl font-bold drop-shadow-2xl md:font-extrabold md:text-5xl text-center md:text-start md:max-w-[50%] leading-tight"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
        >
          Advancing Additive Manufacturing and Characterization in India
        </motion.h2>

        <motion.div
          className="w-full md:block flex justify-center items-center"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 1 }}
        >
          <Link
            to="/membership"
            onClick={handleJoinNow}
            className="transi text-white bg-blue-500 hover:bg-blue-600 py-1 md:py-2 cursor-pointer px-5 rounded-lg tracking-wide text-xl md:text-2xl hover:scale-105 transition-transform duration-300"
          >
            Join Now
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;