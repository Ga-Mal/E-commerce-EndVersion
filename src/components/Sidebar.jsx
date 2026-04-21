import React from 'react'
import { NavLink } from 'react-router-dom'

function Sidebar() {
  const baseStyle = `w-full block rounded-2xl text-center py-2 text-[20px] my-2 hover:opacity-80 hover:scale-105 transition-all duration-200`
  return (
    <div className='md:w-[20%] bg-(--border-color) md:h-[calc(100vh-250px)] ml-2 mb-4 rounded-2xl p-4 '>
        <h2 className='text-center font-bold'>Navigation</h2>
        <ul>
            <li> <NavLink to='orders' className={({isActive}) => `${baseStyle} ${isActive ? "bg-gray-400" : "bg-(--primary-color)"}`}>Orders</NavLink></li>
            <li> <NavLink to='customers' className={({isActive}) => `${baseStyle} ${isActive ? "bg-gray-400" : "bg-(--primary-color)"}`}>Customers</NavLink></li>
            <li> <NavLink to='products' className={({isActive}) => `${baseStyle} ${isActive ? "bg-gray-400" : "bg-(--primary-color)"}`}>Products</NavLink></li>
            <li> <NavLink to='categories' className={({isActive}) => `${baseStyle} ${isActive ? "bg-gray-400" : "bg-(--primary-color)"}`}>Categories</NavLink></li>
            <li> <NavLink to='reviews' className={({isActive}) => `${baseStyle} ${isActive ? "bg-gray-400" : "bg-(--primary-color)"}`}>Reviews</NavLink></li>
        </ul>
    </div>
  )
}

export default Sidebar