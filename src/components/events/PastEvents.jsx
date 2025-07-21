import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Spinner from "../ui/Spinner";
import api from "../../utils/api";  
import { useNavigate } from 'react-router-dom';

const PastEvents = () => {
   const [events, setEvents] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const navigate = useNavigate();

   // useCallback to memoize fetchEventsData
   const fetchEventsData = useCallback(async () => {
     try {
       const response = await api.get("/v1/db/past-events");
       setEvents(response.data.data);
     } catch (err) {
       setError(err.response?.data?.message || err.message);
     } finally {
       setLoading(false);
     }
   }, []);

   useEffect(() => {
     fetchEventsData();
   }, [fetchEventsData]);

   // useMemo to memoize reversed events (for future extensibility)
   const memoizedReversedEvents = useMemo(() => [...events].reverse(), [events]);

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

  const slidesToShow = Math.min(memoizedReversedEvents.length, 3);

  const settings = {
    dots: memoizedReversedEvents.length > slidesToShow,
    infinite: memoizedReversedEvents.length > slidesToShow,
    dotsClass: "slick-dots custom-dots",
    speed: 500,
    slidesToShow,
    arrows: false,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(memoizedReversedEvents.length, 2),
          dots: memoizedReversedEvents.length > Math.min(memoizedReversedEvents.length, 2),
          infinite: memoizedReversedEvents.length > Math.min(memoizedReversedEvents.length, 2),
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          dots: memoizedReversedEvents.length > 1,
          infinite: memoizedReversedEvents.length > 1,
        },
      },
    ],
  };

  return (
    <motion.div
      className="w-full h-auto mt-10 py-10"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      >
        <h2 className="text-2xl md:text-4xl font-bold">Past Events
          <div className="border-2 border-blue-500 w-1/5 md:w-1/15 m-auto"></div>
        </h2>
      </motion.div>

      <motion.div
        className="text-center text-sm md:text-md mx-auto w-3/4 my-5"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
      >
        <p>
          Explore our archive of past ISAMC events—each one a milestone in scientific progress and community collaboration.
        </p>
      </motion.div>

      <div className="px-5 md:px-10">
        <Slider {...settings}>
          {memoizedReversedEvents
            .filter(item => item.title)
            .map((item, index) => {
              const eventId = item.id || item._id || index; // Fallback to index if no id/_id
              return (
                <motion.div
                  key={eventId}
                  className="relative pb-5 h-105 dark:text-black   bg-blue-50 shadow-md rounded-md flex flex-col items-center overflow-hidden cursor-pointer hover:shadow-lg transition"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  onClick={() => navigate(`/events/${eventId}`)}
                >
                  {(item.img || item.imageUrl) && (
                    <motion.img
                      src={item.img || item.imageUrl}
                      alt={item.title}
                      className="w-full h-40 object-cover"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      whileHover={{ scale: 1.01 }}
                    />
                  )}
                  <div className="p-4">
                    <div className="space-y-1">
                      <p>
                        <i className="fa-solid fa-calendar-days text-blue-600"></i>{" "}
                        {item.date?.day && item.date?.month ? (item.date.day + " " + item.date.month) : item.date}
                      </p>
                      {(item.location || item.venue) && (
                        <p>
                          <i className="fa-solid fa-location-dot text-blue-600"></i>{" "}
                          {item.location || item.venue}
                        </p>
                      )}
                    </div>
                    <h2 className="text-xl font-semibold mt-3">{item.title}</h2>
                    <p className="text-black mt-2">{item.body && item.body.length > 120 ? item.body.slice(0, 120) + '...' : item.body}</p>
                  </div>
                </motion.div>
              );
            })}
        </Slider>
      </div>
    </motion.div>
  );
};

export default PastEvents;