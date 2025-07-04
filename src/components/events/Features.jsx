import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import Spinner from "../ui/Spinner";
import api from "../../utils/api";

const Features = () => {
     const [features, setFeatures] = useState([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);
  
     // useCallback to memoize fetchEventsData
     const fetchEventsData = useCallback(async () => {
       try {
         const response = await api.get("/v1/db/features-benefits");
         setFeatures(response.data.data);
       } catch (err) {
         setError(err.response?.data?.message || err.message);
       } finally {
         setLoading(false);
       }
     }, []);

     useEffect(() => {
       fetchEventsData();
     }, [fetchEventsData]);

     // useMemo to memoize features (for future extensibility)
     const memoizedFeatures = useMemo(() => features, [features]);

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

  return (
    <motion.div
      className="w-full h-auto mt-20 dark:bg-slate-600 bg-blue-50 py-5"
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
        <h2 className="text-2xl md:text-4xl font-bold">Features & Benefits
          <div className="border-2 border-blue-500 w-1/3 md:w-1/8 m-auto"></div>
        </h2>
      </motion.div>

      <div className="px-5  md:px-10 grid grid-cols-1 md:grid-cols-3  gap-6 mt-10">
        {memoizedFeatures.map((item, index) => (
          <motion.div
            key={index}
            className="p-4 rounded-md flex dark:text-black flex-col items-center text-center dark:bg-blue-200 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut", delay: index * 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.img
              src={item.img}
              alt={item.title}
              className="h-20 w-20 md:w-30 md:h-30 object-cover"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
              whileHover={{ scale: 1.1 }}
            />
            <h2 className="text-xl font-semibold mt-3">{item.title}</h2>
            <p className="text-black mt-2">{item.body}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Features;