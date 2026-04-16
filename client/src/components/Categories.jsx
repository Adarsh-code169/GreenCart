import React from 'react'
import { categories } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

const Categories = () => {

  const { navigate } = useAppContext();

  return (
    <div className='mt-16'>
      <p className='text-2xl md:text-3xl font-medium'>
        Categories
      </p>

      <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mt-6 gap-3 sm:gap-6'>
        {categories.map((category, index) => (
          <div key={index} className='group cursor-pointer py-3 sm:py-5 px-2 sm:px-3 gap-1 sm:gap-2 rounded-lg flex flex-col justify-center items-center h-full transition-all'
            style={{ backgroundColor: category.bgColor }}
            onClick={() => {
              navigate(`/product-category/${category.path}`)
            }}
          >
            <img src={category.image} alt={category.text} className='group-hover:scale-105 transition w-12 sm:w-20 md:w-24 lg:w-28' />
            <p className='text-[10px] sm:text-xs md:text-sm font-medium text-center leading-tight'>{category.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Categories
