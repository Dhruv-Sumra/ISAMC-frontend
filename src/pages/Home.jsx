import React from 'react'
import Hero from '../components/home/Hero'
import Mission from '../components/home/Mission'
import Aboutus from '../components/home/Aboutus'
import Events from '../components/home/Events'
import Member from '../components/home/Member'
import Publications from '../components/home/Publications'
import Partners from '../components/home/Partners'
import News from '../components/home/News'
import Footer from '../components/home/Footer'
import ScrollUp from '../components/home/ScrollUp'


const Home = () => {
  return (
    <div>
        <Hero/>    
        <Aboutus/> 
        <Mission/>  
        <Events/>
        <Member/>
        <Publications/>
        <Partners/>
        <News/>
        {/* <Footer/> */}
        <ScrollUp/>
    </div>
  )
}

export default Home