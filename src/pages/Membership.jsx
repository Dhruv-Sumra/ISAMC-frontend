import React from 'react'
import Hero from '../components/Membership/Hero'
import Info from '../components/Membership/Info'
import Tier from '../components/Membership/Tier'
import Testimonials from '../components/Membership/Testimonials'
import Footer from '../components/home/Footer'
import CTA from '../components/Membership/CTA'

const Membership = () => {
  return (
    <div>
      <Hero/>
      <Tier/>
      <Info/>
      <Testimonials/> 
      <CTA/>
      {/* <Footer/> */}
    </div>
  )
}

export default Membership