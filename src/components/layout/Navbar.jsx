import React from 'react'
import { Building2, ChevronDown } from 'lucide-react'
import { BellIcon } from 'lucide-react'
import { CircleQuestionMark } from 'lucide-react'
function Navbar() {
  return (
    <nav className='flex min-w-auto justify-between min-h-auto items-center  bg-white flex-wrap p-2 pr-10 pl-10'>
      <div className='flex gap-3'>
        <p className='text-gray-600 text-sm'>Workspace</p>
        <p className='text-gray-600 text-sm'>/</p>
        <p className='font-medium text-gray-950 text-sm '>Overview</p>
      </div>
      <div className='flex justify-center items-center gap-2'>
        <div className='flex gap-3'>
        <div className='items-center bg-white border border-gray-300 rounded-xl cursor-pointer p-1.5 text-gray-500'><BellIcon/></div>
        <div className='items-center bg-white border border-gray-300 rounded-xl cursor-pointer p-1.5 text-gray-500'><CircleQuestionMark/></div>
        </div>
        
          <button
          type="button"
          className={`outline-none cursor-pointer p-3 rounded-xl flex items-center gap-4 text-left transition-all w-[12rem] duration-200
          `}
        >
          <span className="font-medium text-sm rounded-full bg-violet-300 text-violet-800 p-2.5 w-8 h-8 flex items-center justify-center">
  A
</span>
          <div>
            <p
              className={`font-semibold text-xs`}
            >
              Aditya Yadav
            </p>

            <p className="text-[10px] text-slate-500 mt-1">
              Job seeker
            </p>
          </div>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </nav>
  )
}

export default Navbar
