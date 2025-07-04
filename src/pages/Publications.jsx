import React from 'react'
import Hero from '../components/publications/Hero'
import Publications from '../components/publications/Publications'
import Generals from '../components/publications/Generals'
import Footer from '../components/home/Footer'
import Accordion from '../components/publications/Accordion'
import CTA from '../components/publications/CTA'

const PublicationsPage = () => {
  return (
    <div>
      <Hero/>
      <Publications/>
      <Generals/>
      <Accordion/>
      <CTA/>
      {/* <Footer/> */}
    </div>
  )
}

export default PublicationsPage
