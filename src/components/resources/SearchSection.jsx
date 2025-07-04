import React from 'react'
import Searchbar from './Searchbar'
import Cards from './Cards'

const SearchSection = () => {
  return (
    <div className='mt-6 gap-10 w-full h-auto md:h-[60vh] flex flex-col relative md:flex-row justify-between items-center'>

      <Searchbar/>
      <Cards/> 
    </div>
  )
}

export default SearchSection