import React, { useEffect, useState, useCallback, useMemo } from 'react';
import data from '../../data/db.json';
import Spinner from "../ui/Spinner";
import api from "../../utils/api";
import { motion } from "framer-motion";

const Leadership = () => {
  const [leadership, setLeadership] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useCallback to memoize fetchEventsData
  const fetchEventsData = useCallback(async () => {
    try {
      const response = await api.get("/v1/db/leadership");
      setLeadership(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEventsData();
  }, [fetchEventsData]);

  // useMemo to memoize leadership (for future extensibility)
  const memoizedLeadership = useMemo(() => leadership, [leadership]);

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
    <section className="w-full bg-white dark:bg-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Our Leadership Team
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-6 max-w-2xl mx-auto">
            Meet the dedicated professionals who guide our organization with expertise and vision
          </p>
        </motion.div>

        {/* Leadership Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {memoizedLeadership.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
            >
              {/* Image Container */}
              <div className="relative p-8 pb-4">
                <div className="relative mx-auto w-32 h-32 rounded-full overflow-hidden shadow-lg">
                  <img 
                    src={item.imageUrl} 
                    alt={item.fullName} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="px-6 pb-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {item.fullName}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 font-semibold mb-3 text-sm">
                  {item.post}
                </p>
                {item.place && (
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-medium mb-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full inline-block">
                    {item.place}
                  </p>
                )}
                <div className="w-16 h-0.5 bg-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
                  {item.expertise}
                </p>
                
                {/* Social Links */}
                <div className="flex justify-center space-x-4">
                  {item.email && (
                    <a
                      href={`mailto:${item.email}`}
                      className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-200"
                      title="Send Email"
                    >
                      <i className="fas fa-envelope text-sm"></i>
                    </a>
                  )}
                  {item.linkedinUrl && item.websiteUrl ? (
                    // Both LinkedIn and Website available
                    <>
                      <a
                        href={item.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-200"
                        title="LinkedIn Profile"
                      >
                        <i className="fab fa-linkedin-in text-sm"></i>
                      </a>
                      <a
                        href={item.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-200"
                        title="Personal Website"
                      >
                        <i className="fas fa-globe text-sm"></i>
                      </a>
                    </>
                  ) : item.linkedinUrl ? (
                    // Only LinkedIn available
                    <a
                      href={item.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-200"
                      title="LinkedIn Profile"
                    >
                      <i className="fab fa-linkedin-in text-sm"></i>
                    </a>
                  ) : item.websiteUrl ? (
                    // Only Website available
                    <a
                      href={item.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-200"
                      title="Personal Website"
                    >
                      <i className="fas fa-globe text-sm"></i>
                    </a>
                  ) : null}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {memoizedLeadership.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <i className="fas fa-users text-6xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Leadership Team Coming Soon
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Our leadership team information will be available shortly.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Leadership;