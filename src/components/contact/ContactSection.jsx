import React from 'react'
import Getintouch from './Getintouch'
import Contactus from './Contactus'

const ContactSection = () => {
  return (
    <div className='flex p-5 flex-col md:flex-row justify-between h-auto w-full md:px-10'>
        <Getintouch/>
        <Contactus/>
    </div>
  )
}

export default ContactSection