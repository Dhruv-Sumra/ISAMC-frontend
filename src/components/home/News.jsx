import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import Spinner from "../ui/Spinner";
import api from "../../utils/api";    

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useCallback to memoize fetchEventsData
  const fetchEventsData = useCallback(async () => {
    try {
      const response = await api.get("/v1/db/latest-news"); 
      setNews(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEventsData();
  }, [fetchEventsData]);

  // useMemo to memoize news (for future extensibility)
  const memoizedNews = useMemo(() => news, [news]);

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
    <motion.section
      className="w-full bg-white dark:bg-gray-900 py-16"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <div className="items-center mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              Latest News
            </h2>
            <div className="w-1/9 h-0.5 bg-blue-600 dark:bg-blue-400 mr-4"></div>
          </div>
        </motion.div>

        {/* Featured News (First Article) */}
        {memoizedNews.length > 0 && (
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          >
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm bg-white dark:bg-gray-800">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="relative overflow-hidden">
                  <img
                    src={memoizedNews[0].imageUrl}
                    alt={memoizedNews[0].title}
                    className="w-full h-64 lg:h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 dark:bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded uppercase tracking-wide">
                      Featured
                    </span>
                  </div>
                </div>
                <div className="p-6 lg:p-8 flex flex-col justify-center">
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs mb-3">
                    <i className="fa-solid fa-calendar-days mr-1 text-blue-600 dark:text-blue-400"></i>
                    <time dateTime={memoizedNews[0].date}>{memoizedNews[0].date}</time>
                    <span className="mx-2">•</span>
                    <span>ISAMC News</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 leading-tight overflow-hidden">
                    {memoizedNews[0].title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4 overflow-hidden">
                    {memoizedNews[0].body}
                  </p>
                  <a 
                    href={memoizedNews[0].referenceUrl || "#"} 
                    target={memoizedNews[0].referenceUrl ? "_blank" : undefined}
                    rel={memoizedNews[0].referenceUrl ? "noopener noreferrer" : undefined}
                    className={`inline-flex items-center font-medium text-sm transition-colors duration-200 ${
                      memoizedNews[0].referenceUrl 
                        ? "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer" 
                        : "text-gray-400 cursor-not-allowed"
                    }`}
                    onClick={!memoizedNews[0].referenceUrl ? (e) => e.preventDefault() : undefined}
                  >
                    {memoizedNews[0].referenceUrl ? "Read more" : ""}
                    {memoizedNews[0].referenceUrl && <i className="fa-solid fa-arrow-right ml-1 text-xs"></i>}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* News List */}
        <div className="space-y-0">
          {memoizedNews.slice(1).map((item, index) => (
            <motion.article
              key={index}
              className="border-b border-gray-100 dark:border-gray-700 py-6 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800 px-2 -mx-2 rounded transition-colors duration-200"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut", delay: (index + 1) * 0.1 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                  <div className="relative overflow-hidden rounded-md">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                </div>
                <div className="md:col-span-3 flex flex-col justify-center">
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs mb-2">
                    <i className="fa-solid fa-calendar-days mr-1 text-blue-600 dark:text-blue-400"></i>
                    <time dateTime={item.date}>{item.date}</time>
                    <span className="mx-2">•</span>
                    <span>ISAMC News</span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 leading-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 overflow-hidden">
                    {item.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3 overflow-hidden">
                    {item.body}
                  </p>
                  <a 
                    href={item.referenceUrl || "#"} 
                    target={item.referenceUrl ? "_blank" : undefined}
                    rel={item.referenceUrl ? "noopener noreferrer" : undefined}
                    className={`inline-flex items-center font-medium text-sm transition-colors duration-200 ${
                      item.referenceUrl 
                        ? "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer" 
                        : "text-gray-400 cursor-not-allowed"
                    }`}
                    onClick={!item.referenceUrl ? (e) => e.preventDefault() : undefined}
                  >
                    {item.referenceUrl ? "Read more" : ""}
                    <i className="fa-solid fa-arrow-right ml-1 text-xs"></i>
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default News;