import React from 'react'
import { Link } from 'react-router-dom'

const CTA = () => {
   return (
    <div className="px-5 mt-15 md:px-10 w-full h-auto space-x-3 flex justify-between align-middle">
      <div className=" w-full">
        <h2 className="text-lg md:text-3xl font-semibold"> READY TO CONTRIBUTE TO AM RESEARCH?</h2>

        <Link to="/submit-paper">
          <button className="text-white bg-blue-500 hover:bg-blue-600 py-1 md:py-1 mt-4  cursor-pointer px-2 md:px-3 rounded-lg tracking-wide md:text-lg">
            Submit paper
          </button>
        </Link>
        </div>
 
         
        </div>
  )
}

export default CTA