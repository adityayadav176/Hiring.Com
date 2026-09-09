import React, { useContext, useEffect, useState } from 'react'
import { Building2, ChevronDown, Menu } from 'lucide-react'
import { BellIcon } from 'lucide-react'
import { CircleQuestionMark } from 'lucide-react'
import { TitleContext } from '../../context/TitleContext'
function Navbar({setActivePage, setTitle}) {

  const {title} = useContext(TitleContext); 
  return (
    <nav className='flex min-w-auto sm:flex justify-between min-h-auto items-center bg-white flex-wrap p-2 pr-10 pl-10'>
      <div className='flex gap-3'>
        <Menu className='md:hidden'/>
        <p className='text-gray-600 text-sm'>Workspace</p>
        <p className='text-gray-600 text-sm'>/</p>
        <p className='font-medium text-gray-950 text-sm '>{title}</p>
      </div>
      <div className='flex justify-center items-center gap-2'>
        <div className='flex gap-3'>
        <div className='items-center bg-white border border-gray-300 rounded-xl cursor-pointer p-1.5 text-gray-500'><BellIcon/></div>
        <div className='items-center bg-white border border-gray-300 rounded-xl cursor-pointer p-1.5 text-gray-500'><CircleQuestionMark/></div>
        </div>
        
          <button
          type="button"
          className={`outline-none hidden cursor-pointer p-3 rounded-xl md:flex items-center gap-4 text-left transition-all w-[12rem] duration-200
          `}
        >
          <span className="font-medium text-sm rounded-full bg-violet-300 text-violet-800 p-2.5 w-8 h-8 flex items-center justify-center">
  A
</span>
          <button type='button' onClick={()=> {setActivePage("profile"), setTitle("My Profile")} }>
            <p
              className={`font-semibold text-xs`}
            >
              Aditya Yadav
            </p>

            <p className="text-[10px] text-slate-500 mt-1">
              Job seeker
            </p>
          </button>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </nav>
  )
}

export default Navbar
