import React from 'react'
import { assets, features } from '../assets/assets'

const BottomBanner = () => {
  return (
    <div className='relative mt-24' >
        <img src={assets.bottom_banner_image} alt='banner' className='w-full hidden md:block' />
        <img src={assets.bottom_banner_image_sm} alt='banner' className='w-full md:hidden' />


      <div className='absolute inset-0 flex flex-col items-center md:items-end justify-center px-6 md:pr-18 lg:pr-24'>
        <div className="max-w-md">
          <h1 className='text-2xl md:text-3xl font-bold text-primary mb-6 text-center md:text-left'>Why We Are the Best??</h1>
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className='flex items-center gap-4 group'>
                <div className="bg-white/80 p-2 rounded-xl shadow-sm group-hover:bg-white transition-colors">
                  <img src={feature.icon} alt={feature.title} className='w-8 md:w-11 min-w-[32px]'/>
                </div>
                <div>
                  <h3 className='text-base md:text-xl font-bold text-gray-800'>{feature.title}</h3>
                  <p className='text-gray-500 text-xs md:text-sm leading-tight'>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    
  )
}

export default BottomBanner