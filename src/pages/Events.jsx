import React from 'react'
import Hero from '../components/events/Hero'
import UpEvents from '../components/events/Events'
import PastEvents from '../components/events/PastEvents'
import Partners from '../components/home/Partners'
import Footer from '../components/home/Footer'
import Features from '../components/events/Features'
import EventsArchive from '../components/events/EventsArchive'


const Events = () => {
  return (
    <div>
      <Hero/>
      <UpEvents/>
      <PastEvents/>
      <Features/>
      <EventsArchive/>
      <Partners/>
      {/* <Footer/> */}
    </div>
  )
}

export default Events