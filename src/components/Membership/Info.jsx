import React from "react";
import { motion } from "framer-motion";

const Info = () => {
  const items = [
    { text: "Unlock exclusive access to India’s leading Additive Manufacturing community, resources, and opportunities." },
    { text: "Stay ahead with discounted registrations, research exposure, and collaboration platforms across industry and academia." },
    { text: "Be part of a national movement shaping the future of 3D printing and smart manufacturing technologies." },
    { text: "Network with experts, attend premier events, and contribute to policy and standard development in the AM sector." },
    { text: "Empower your career or institution through training, awards, publishing opportunities, and global partnerships." },
    { text: "Join a trusted knowledge hub driving innovation, education, and industrial transformation in additive manufacturing." }
  ];

  return (
    <motion.div
      className="px-5 md:px-15 w-full h-auto flex flex-col justify-between"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      >
        <h2 className="text-xl md:text-3xl font-semibold mb-5">Why Become a Member?</h2>
      </motion.div>

      {items.map((item, index) => (
        <motion.div
          key={index}
          className="mt-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
        >
          {/* <h2 className="text-lg md:text-xl font-medium">{item.title}</h2> */}
          <p className="mt-1 text-lg w-full md:w-4/5"><li>{item.text}</li></p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Info;