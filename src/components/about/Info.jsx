import React from 'react'

const Info = () => {
  // Animation classes
  const fadeInUp =
    'opacity-0 translate-y-8 animate-fade-in-up will-change-transform will-change-opacity';

  return (
    <div className="px-2 md:px-8 py-8  md:w-3/4 dark:text-white">
      <h2
        className={`text-2xl md:text-3xl font-bold text-left mb-6 ${fadeInUp} animation-delay-0`}
      >
        Shaping the future of scientific advancement
      </h2>
      <div className="space-y-5 dark:text-white">
        <p
          className={`md:text-lg text-gray-800 dark:text-white text-left ${fadeInUp} animation-delay-1`}
        >
          ISAMC is committed to transforming India's manufacturing landscape by promoting the adoption and innovation of Additive Manufacturing and Smart Technologies across sectors.
        </p>
        <p
          className={`md:text-lg text-gray-800 dark:text-white text-left ${fadeInUp} animation-delay-2`}
        >
          Through collaborative research, industry engagement, and policy advocacy, ISAMC serves as a catalyst for accelerating 3D printing and advanced manufacturing capabilities in India.
        </p>
        <p
          className={`md:text-lg text-gray-800 text-left dark:text-white ${fadeInUp} animation-delay-3`}
        >
          We work closely with educational institutions, research organizations, and industrial partners to build a strong ecosystem for additive manufacturing and digital fabrication.
        </p>
        <p
          className={`md:text-lg text-gray-800 text-left ${fadeInUp}  dark:text-white animation-delay-4`}
        >
          Our initiatives include technical workshops, global conferences, strategic collaborations, and knowledge dissemination to empower professionals and advance national goals like 'Make in India'.
        </p>
        <p
          className={`md:text-lg text-gray-800 text-left ${fadeInUp} dark:text-white animation-delay-5`}
        >
          ISAMC envisions India as a global hub for next-generation manufacturing by fostering innovation, skill development, and sustainable technology deployment.
        </p>
      </div>
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(32px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .animation-delay-0 { animation-delay: 0.3s; }
        .animation-delay-1 { animation-delay: 0.5s; }
        .animation-delay-2 { animation-delay: 0.7s; }
        .animation-delay-3 { animation-delay: 0.9s; }
        .animation-delay-4 { animation-delay: 0.11s; }
        .animation-delay-5 { animation-delay: 1.13s; }
      `}</style>
    </div>
  )
}

export default Info