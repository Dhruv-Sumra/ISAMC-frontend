import React from 'react'
import Hero from '../components/resources/Hero'
import SearchSection from '../components/resources/SearchSection'
import VideoSection from '../components/resources/VideoSection'
import BlogSection from '../components/resources/BlogSection'
import CaseStudy from '../components/resources/CaseStudy'
import Faqs from '../components/resources/Faqs'
import Footer from '../components/home/Footer'
import { useNavigate } from 'react-router-dom';

const Resources = () => {
  const navigate = useNavigate();
  return (
    <div>
        <Hero/>
        <SearchSection/>
        <VideoSection/>
        <BlogSection/>
        <CaseStudy/>
        <Faqs/>
        {/* <Footer/> */}
    </div>
  )
}

export default Resources