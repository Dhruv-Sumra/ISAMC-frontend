import React, { useEffect, useState } from 'react';
import data from '../../data/db.json';

const Accordion = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [accodion , setAccordion] = useState([])
    const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };


    useEffect(()=>{
        setAccordion(data.papers)
    })

  return (
    <div className="w-full h-auto mt-20 py-5 md:px-0 px-5">

       <div className="w-full md:max-w-3/4 md:px-10 mt-6">

      <button
        className="cursor-pointer relative w-full mb-3 text-left px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
              className={`transition-transform duration-300 absolute right-4 ${
                isOpen ? "rotate-180" : "rotate-0"
              }`}
            >
              ▼
            </span>
        {isOpen ? "Hide Archives" : "View Archives "} 
        
      </button>

      {isOpen && accodion.map((paper, index) => (
        <div key={index} className="mb-2 ml-5 rounded-md shadow-md">
          <button
            className="w-full flex justify-between items-center px-4 py-2 bg-blue-300 text-black font-semibold rounded-t-md"
            onClick={() => toggleAccordion(index)}
          >
            {paper.title}
            <span
              className={`transition-transform duration-300 ${
                activeIndex === index ? "rotate-180" : "rotate-0"
              }`}
            >
              ▼
            </span>
          </button>

          {activeIndex === index && (
            <div className="bg-blue-50 p-4 rounded-b-md w-full">
              <p className="text-sm text-gray-600">{paper.date}</p>
              <p className="mt-2">{paper.summary}</p>
            </div>
          )}
        </div>
      ))}

    </div>

    </div>
  );
};

export default Accordion;
