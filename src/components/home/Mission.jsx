import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import Spinner from "../ui/Spinner";
import api from "../../utils/api";      

const Mission = () => {
  const [mission, setMission] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useCallback to memoize fetchMissionData
  const fetchMissionData = useCallback(async () => {
    try {
      const response = await api.get("/v1/db/home-mission");  
      setMission(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMissionData();
  }, [fetchMissionData]);

  const memoizedMission = useMemo(() => mission, [mission]);

  if (loading) {
    return (
      <Spinner/>
    );
  }

  if (error) {
    return (
      <div className="w-full h-auto mt-20 bg-blue-50 py-5 flex justify-center items-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <motion.div
      className="w-full h-auto mt-20 bg-blue-50 dark:bg-slate-600 py-5"
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
        <h2 className="text-2xl md:text-4xl font-bold">Mission & Objectives
          <div className="border-2 border-blue-500 w-2/5 md:w-2/11 m-auto"></div>
        </h2>
        <p className="px-5 text-sm md:text-xl mt-3">
          ISAMC is committed to advancing the field of additive manufacturing through key strategic objectives.
        </p>
      </motion.div>

      <div className="px-5 md:px-5 grid grid-cols-1 md:grid-cols-5 gap-6 mt-6">
        {memoizedMission.map((item, index) => (
          <motion.div
            key={item.id || index}
            className="hover:scale-101 transition-all duration-300 bg-blue-100 dark:bg-blue-200 dark:text-black shadow-md p-3 rounded-md flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut", delay: index * 0.2 }}
          >
            <motion.img
              src={item.img}
              alt={item.title}
              className="h-30 w-30 md:w-30 md:h-30 rounded-full object-cover"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
            />
            <h2 className="text-lg font-semibold mt-3">{item.title}</h2>
            <p className="text-black text-sm mt-2">{item.body}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Mission;