import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Spinner from "../ui/Spinner";
import api from "../../utils/api";    

const CaseStudy = () => {
     const [caseStudy, setCaseStudy] = useState([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);
   
     // useCallback to memoize fetchEventsData
     const fetchEventsData = useCallback(async () => {
       try {
         const response = await api.get("/v1/db/case-studies");   
         setCaseStudy(response.data.data);
       } catch (err) {
         setError(err.message);
       } finally {
         setLoading(false);
       }
     }, []);

     useEffect(() => {
       fetchEventsData();
     }, [fetchEventsData]);

     // useMemo to memoize caseStudy (if you want to sort/filter)
     const memoizedCaseStudy = useMemo(() => caseStudy, [caseStudy]);

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

  const settings = {
    dots: true,
    infinite: true,
    dotsClass: "slick-dots custom-dots",
    speed: 500,
    slidesToShow: 3,
    arrows: false,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <motion.div
      className="w-full h-auto mt-15 md:mt-30 py-5 relative"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <motion.div
        className="md:pl-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
      >
        <h2 className="text-center text-xl md:text-3xl font-bold">Case studies
          <div className="border-2 border-blue-500 w-1/15 m-auto"></div>
        </h2>
      </motion.div>

      <div className="px-5 md:px-10 mt-10">
        <Slider {...settings}>
          {memoizedCaseStudy.map((item, index) => (
            <motion.div
              key={index}
              className="bg-blue-50 dark:text-black min-h-90 shadow-md rounded-md relative flex flex-col items-center overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut" }}
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

export default CaseStudy;