import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Spinner from "../ui/Spinner";
import api from "../../utils/api";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");

  // const filters = ["All", "AI", "Tech", "Health", "Startup"];

  const fetchEventsData = useCallback(async () => {
    try {
      const response = await api.get("/v1/db/upcoming-events");
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

  // const filteredEvents = useMemo(() => {
  //   if (activeFilter === "All") return events;
  //   return events.filter((event) => event.category === activeFilter);
  // }, [events, activeFilter]);

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
  


  const slidesToShow = Math.min(events.length, 3);

  const settings = {
    dots: true,
    infinite: events.length > slidesToShow,
    dotsClass: "slick-dots custom-dots",
    speed: 500,
    slidesToShow,
    arrows: false,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: Math.min(events.length, 2) },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 },
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
        <h2 className="text-2xl md:text-4xl font-bold">Upcoming Events
          <div className="border-2 border-blue-500 w-1/3 md:w-1/8 m-auto"></div>
        </h2>
      </motion.div>

      <motion.div
        className="flex justify-between md:justify-start w-full md:text-lg md:py-5 text-xs my-5 md:my-4 md:space-x-3 px-5 md:px-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
      >
          {/* {filters.map((filter) => (
          <motion.button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1 rounded-md transition cursor-pointer ${
              activeFilter === filter
                ? "bg-blue-500 text-white"
                : "bg-blue-200 text-black hover:bg-blue-100"
            }`}
            whileHover={{ scale: 1.1 }}
          >
            {filter}
          </motion.button>
        ))} */}
      </motion.div>

      <div className="px-5 md:px-10">
        <Slider {...settings}>
          {events.map((item, index) => (
            <motion.div
              key={index}
              className="relative pb-5 h-100 dark:text-black bg-blue-50 shadow-md rounded-md flex flex-col items-center overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <motion.img
                src={item.img}
                alt={item.title}
                className="w-full h-40 object-cover"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: "easeOut"}}
                whileHover={{ scale: 1.01 }}
              />

              <div className="p-4">
                <div className="space-y-1">
                  <p>
                    <i className="fa-solid fa-calendar-days text-blue-600"></i>{" "}
                    {item.date}
                  </p>
                </div>
                <h2 className="text-xl font-semibold mt-3">{item.title}</h2>
                <p className="text-black mt-2">{item.body}</p>
              </div>
            </motion.div>
          ))}
        </Slider>
      </div>
    </motion.div>
  );
};

export default Events;