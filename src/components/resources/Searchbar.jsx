import React, { useState } from "react";
import { Link } from "react-router-dom";

const Searchbar = () => {
  const titles = [
    "3D Printing Research",
    "Open-Source AM Tools",
    "Industry Trends",
    "AM Sustainability",
    "Webinars Archive",
    "Grants & Funding",
    "AM Careers",
    "Materials & Processes",
    "Community Forums",
  ];

  const [query, setQuery] = useState("");
  const [isClick, setIsClick] = useState(true);

  const handleClick = () => {
    setIsClick(!isClick);
  };

  const filteredItems = titles
    .filter((item) => item.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => a.localeCompare(b));

  return (
    <div className="w-9/10 md:w-1/4 rounded-br-sm rounded-tr-sm dark:text-black bg-blue-50 p-4">
      <Link to={"#"}>
        <button
          onClick={handleClick}
          className={`relative cursor-pointer block w-full`}
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-blue-200 rounded-sm p-1 mt-2 w-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <i className="absolute right-4 top-4 fa-solid fa-magnifying-glass"></i>
        </button>
      </Link>

      <h2 className="text-blue-500 mt-4 font-bold">Topics</h2>
      <ul className={`${query ? 'absolute' : 'relative'} z-10 w-full md:w-auto h-auto max-h-60 overflow-auto bg-blue-100 rounded-sm mt-2`}>
        {query && filteredItems.length === 0 ? (
          <li className="p-2 text-sm text-gray-500">No results found</li>
        ) : (
          (query ? filteredItems : titles).map((item, index) => (
            <li key={index} className="p-2 text-sm hover:bg-blue-200">
              {item}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Searchbar;