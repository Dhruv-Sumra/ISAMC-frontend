import React from 'react';
import { NavLink } from 'react-router-dom';

const CTA = () => {
  return (
    <div className="px-5 mt-20 md:px-15 w-full h-auto flex flex-col md:flex-row justify-between items-center bg-gray-100 dark:bg-gray-800 p-8 rounded-lg">
      <div className="w-full md:w-2/3 mb-6 md:mb-0">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Ready to join India’s AM network?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Become a part of our growing community and unlock exclusive benefits.
        </p>
      </div>
      <div className="w-full md:w-1/3 text-center md:text-right">
        <NavLink to="/membership#tier">
          <button className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-105">
            Join ISAMC
          </button>
        </NavLink>
      </div>
    </div>
  );
};

export default CTA;