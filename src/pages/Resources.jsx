import React from 'react'
import Hero from '../components/resources/Hero'
import SearchSection from '../components/resources/SearchSection'
import CaseStudy from '../components/resources/CaseStudy'
import Faqs from '../components/resources/Faqs'
import Footer from '../components/home/Footer'

const Resources = () => {
  return (
    <div>
        <Hero/>
        <SearchSection/>
        <CaseStudy/>
        <Faqs/>
        {/* <Footer/> */}
    </div>
  )
}

export default Resources