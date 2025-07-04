import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import Spinner from "../ui/Spinner";
import api from "../../utils/api";  

const Publications = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEventsData = useCallback(async () => {
    try {
      const response = await api.get("/v1/db/partners"); 
      setPartners(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEventsData();
  }, [fetchEventsData]);

  const memoizedPartners = useMemo(() => partners, [partners]);

  if (loading) {
    return (
      <Spinner/>
    );
  }

  if (error) {
    return (
      <div className="w-full h-auto mt-10 py-10 flex justify-center items-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }


  const scrolleAnim = {
    animate: {
      x: ["0%", "-50%"],
      transition: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 20,
        ease: "linear",
      },
    },
  };

  return (
    <motion.div
      className="w-full h-auto mt-20 py-5"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      >
        <h2 className="text-4xl font-bold">Partners
          <div className="border-2 border-blue-500 w-1/5 md:w-1/17 m-auto"></div>
        </h2>
      </motion.div>


      <div className="overflow-hidden w-full mt-6">
        <motion.div
          className="flex px-10 space-x-6"
          variants={scrolleAnim}
          animate="animate"
        >
          {memoizedPartners.concat(memoizedPartners).map((item, index) => (
            <motion.div
              key={index}
              className="w-40 md:w-60 flex-shrink-0"
              whileHover={{ scale: 1.05 }}
            >
              <img src={item.img} alt={item.title} className="w-full object-cover" />
              <h2 className="text-center text-lg md:text-xl">{item.title}</h2>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div
        className="flex justify-center mt-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
      >
       
      </motion.div>
    </motion.div>
  );
};

export default Publications;