import React, { useEffect, useState } from "react";
import data from "../../data/db.json";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    setTestimonials(data.Testimonials);
  }, []);

  const settings = {
    dots: false, 
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <button className="slick-prev text-black text-xl">❮</button>,
    nextArrow: <button className="slick-next text-black text-xl">❯</button>,
    centerMode: true,
    centerPadding: "0",
    focusOnSelect: true,
    beforeChange: (c, next) => setCurrentSlide(next),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          centerMode: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: false,
        },
      },
    ],
  };

  return (
    <div className="w-full h-auto mt-10 py-10">
      <div className="text-center mb-6">
        <h2 className="text-4xl font-bold">Testimonials
          <div className="border-2 border-blue-500 w-1/3 md:w-1/13 m-auto"></div>
        </h2>
      </div>

      <div className="px-5 md:px-10">
        <Slider {...settings}>
          {testimonials.map((item, index) => (
            <div
              key={index}
              className={`px-2 py-4 h-auto md:h-80 transition-all duration-300 ease-in-out ${
                index === currentSlide
                  ? "scale-110 z-10"
                  : "scale-95 opacity-90"
              }`}
            >
              <div className="h-full bg-blue-50 shadow-md rounded-md flex flex-col items-center p-4 md:p-6">
                <img
                  src={item.img}
                  alt={item.title}
                  className="rounded-full w-16 h-16 md:w-20 md:h-20 object-cover"
                />
                <div className="text-center">
                  <h2 className="text-lg md:text-xl font-semibold mt-1">{item.title}</h2>
                  <p className="text-blue-500">{item.post}</p>
                  <p className="text-black mt-2">{item.body}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Testimonials;