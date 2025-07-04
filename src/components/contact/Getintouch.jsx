import React from 'react'
import Mapbox from './Mapbox'

const Getintouch = () => {
  return (
    <div className='h-full w-full md:w-1/3 p-4'>
        <h2 className='md:text-3xl text-2xl font-semibold'>Get in touch
          <div className='border-2 border-blue-500 w-1/4'></div>
        </h2>

        <div className='w-full h-auto mt-10'>
            <h2 className='md:text-xl font-medium'>Landline number</h2>
            <p>+91-XX-XXXX-XXXX</p>
            <br />
            <h2 className='md:text-xl font-medium'>Mobile number</h2>
            <p>+91-XX-XXXX-XXXX</p>
            <br />
            <h2 className='md:text-xl font-medium'>Email </h2>
            <p>contact@isamc.org</p>
            <br />
            <h2 className='md:text-xl font-medium'>Office location </h2>
            <p>Flat No. 204, Floor No. 2, Herbelia, Manpada, Herbelia CHSL, ACME, Ozone, G. A. Road, Thane (W), Thane-400610. </p>

            <Mapbox/>
        </div>
    </div>
  )
}

export default Getintouch