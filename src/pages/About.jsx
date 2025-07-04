import React from 'react'
import Hero from '../components/about/Hero'
import Info from '../components/about/Info'
import Mission from '../components/about/Mission'
import Leadership from '../components/about/Leadership'
import Partners from '../components/home/Partners'
import CTA from '../components/about/CTA'
import Footer from '../components/home/Footer'

const About = () => {
  return (
    <div>
      <Hero/>
      <Info/>
      {/* <Mission/> */}
      <Leadership/>
      <Partners/>
      <CTA/>
      {/* <Footer/> */}
    </div>
  )
}

export default About