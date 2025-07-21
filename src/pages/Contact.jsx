import React from 'react'
import Hero from '../components/contact/Hero'
import ContactSection from '../components/contact/ContactSection'
import Footer from '../components/home/Footer'

const Contact = () => {
  return (
    <div>
        <Hero/>
        <ContactSection/>
        {/* Zone Contacts Section - full width, single line */}
        <div className="w-full mt-10 mb-6 px-2 md:px-6">
          <h3 className="text-xl md:text-2xl font-bold mb-4 text-center">Zonal Contacts</h3>
          <div className="flex flex-col md:flex-row justify-between items-stretch gap-4 overflow-x-auto w-full">
            <div className="flex-1 min-w-[220px] bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-lg p-4 shadow text-center transition-colors">
              <span className="font-semibold text-blue-700 dark:text-blue-300">East Zone:</span> <span className="text-gray-800 dark:text-gray-100">Dr. Anjali Sen,</span> <a href="mailto:anjali.sen@isamc.org" className="text-blue-600 dark:text-blue-400 underline">anjali.sen@isamc.org</a>, <span className="text-gray-800 dark:text-gray-100">+91 98765 43210, Kolkata, West Bengal</span>
            </div>
            <div className="flex-1 min-w-[220px] bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-lg p-4 shadow text-center transition-colors">
              <span className="font-semibold text-blue-700 dark:text-blue-300">West Zone:</span> <span className="text-gray-800 dark:text-gray-100">Mr. Rajesh Patel,</span> <a href="mailto:rajesh.patel@isamc.org" className="text-blue-600 dark:text-blue-400 underline">rajesh.patel@isamc.org</a>, <span className="text-gray-800 dark:text-gray-100">+91 91234 56789, Mumbai, Maharashtra</span>
            </div>
            <div className="flex-1 min-w-[220px] bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-lg p-4 shadow text-center transition-colors">
              <span className="font-semibold text-blue-700 dark:text-blue-300">North Zone:</span> <span className="text-gray-800 dark:text-gray-100">Dr. Neha Sharma,</span> <a href="mailto:neha.sharma@isamc.org" className="text-blue-600 dark:text-blue-400 underline">neha.sharma@isamc.org</a>, <span className="text-gray-800 dark:text-gray-100">+91 99887 66554, Delhi</span>
            </div>
            <div className="flex-1 min-w-[220px] bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-lg p-4 shadow text-center transition-colors">
              <span className="font-semibold text-blue-700 dark:text-blue-300">South Zone:</span> <span className="text-gray-800 dark:text-gray-100">Prof. Suresh Kumar,</span> <a href="mailto:suresh.kumar@isamc.org" className="text-blue-600 dark:text-blue-400 underline">suresh.kumar@isamc.org</a>, <span className="text-gray-800 dark:text-gray-100">+91 90000 12345, Bengaluru, Karnataka</span>
            </div>
          </div>
        </div>
        {/* <Footer/> */}
    </div>
  )
}

export default Contact