import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import Spinner from "../components/ui/Spinner";
import api from "../utils/api";

const AllPublications = () => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEventsData = useCallback(async () => {
    try {
      const response = await api.get("/v1/db/publications");
      setPublications(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEventsData();
  }, [fetchEventsData]);

  const filteredPublications = publications;

  if (loading) {
    return <Spinner />;
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
      className="w-full min-h-screen mt-20 bg-gradient-to-b from-blue-50 to-white py-10"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 dark:text-blue-300 mb-2 transition-colors duration-300">
          All Publications
        </h1>
        <div className="border-b-4 border-blue-500 w-24 mx-auto mb-4"></div>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
          Browse the complete collection of research papers, technical reports, and educational materials on additive manufacturing.
        </p>
      </div>
      <div className="px-5 md:px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 mt-6">
        {filteredPublications.map((item, index) => (
          <motion.div
            key={index}
            className="bg-white dark:bg-blue-100 dark:text-black shadow rounded-xl overflow-hidden flex flex-col transition-transform duration-100 hover:scale-102 border border-blue-200"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.10, ease: 'easeOut' }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.img
              src={item.img}
              alt={item.title}
              className="aspect-video w-full object-cover max-h-48 md:max-h-56"
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.10, ease: 'easeOut' }}
              whileHover={{ scale: 1.01 }}
            />
            <div className="flex-1 flex flex-col justify-between p-4">
              <h2 className="text-base md:text-lg font-bold mb-2 text-blue-900 truncate">{item.title}</h2>
              <p className="text-xs md:text-sm text-gray-700 mb-2 line-clamp-3">{item.body}</p>
              <a href={item.pdfUrl || "#"} target="_blank" rel="noopener noreferrer" className="mt-2 text-blue-600 hover:underline font-semibold">Download PDF</a>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AllPublications; 