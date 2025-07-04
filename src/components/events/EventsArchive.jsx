import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";

import Spinner from "../ui/Spinner";
import api from "../../utils/api";

const EventsArchive = () => {
   const [eventArchive, setEventArchive] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   // useCallback to memoize fetchEventsData
   const fetchEventsData = useCallback(async () => {
     try {
       const response = await api.get("/v1/db/events-archives");
       setEventArchive(response.data.data);
     } catch (err) {
       setError(err.response?.data?.message || err.message);
     } finally {
       setLoading(false);
     }
   }, []);

   useEffect(() => {
     fetchEventsData();
   }, [fetchEventsData]);

   // useMemo to memoize eventArchive (for future extensibility)
   const memoizedEventArchive = useMemo(() => eventArchive, [eventArchive]);

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
      className="w-full h-auto py-10 mt-10 md:px-15 px-5"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <motion.h2
        className="text-center text-2xl md:text-4xl font-bold"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      >
        Past Events Archive
        <div className="border-2 border-blue-500 w-1/3 md:w-1/7 m-auto"></div>
      </motion.h2>

      <div className="flex flex-col md:flex-row justify-between h-auto md:h-90 gap-10 md:gap-20 mt-6">
        <motion.div
          className="w-full md:w-1/3 h-full p-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
        >
          <h2 className="md:text-2xl font-medium">Events and Shows</h2>
          <p className="mt-3">
            Explore our archive of past ISAMC events each one a milestone in scientific progress and community collaboration.
          </p>
          <motion.a href="#" whileHover={{ scale: 1.05 }}>
            <button className="max-w-auto mt-6 transi text-white bg-blue-500 hover:bg-blue-600 py-1 md:py-1 cursor-pointer px-2 rounded-lg tracking-wide text-sm md:text-lg">
              Join upcoming events
            </button>
          </motion.a>
        </motion.div>

        <div className="w-full md:w-2/3 h-full ">
          <div className="md:p-4 flex flex-col gap-5 dark:text-black md:bg-blue-100 rounded-lg">
            {memoizedEventArchive.map((item, index) => (
              <motion.div
                key={index}
                className="w-full md:gap-7 h-auto md:h-25 rounded-sm bg-blue-50 p-2 md:p-1 flex flex-col md:flex-row justify-between items-center"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut", delay: index * 0.2 }}
              >
                <motion.div
                  className="w-full md:w-1/5 bg-blue-300 rounded-sm h-20 md:h-22 flex flex-col items-center justify-center mb-2 md:mb-0"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                >
                  <p className="md:text-3xl font-semibold">{item.date?.day}</p>
                  <p className="text-xs md:text-lg">{item.date?.month}</p>
                </motion.div>

                <div className="w-full md:w-4/5 rounded-sm h-full px-4 flex flex-col gap-1">
                  <p className="text-sm md:text-lg font-semibold">{item.title}</p>
                  <p className="text-xs md:text-lg">{item.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventsArchive;