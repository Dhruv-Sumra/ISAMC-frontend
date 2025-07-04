import React, { useState, useEffect } from "react";

const ScrollUp = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300); 
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 text-2xl font-bold hover:bg-blue-300 cursor-pointer bg-blue-200 text-blue-500 px-3 py-1 rounded-sm shadow-lg transition-opacity ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      ^
    </button>
  );
};

export default ScrollUp;