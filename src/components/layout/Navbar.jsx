import React, { useContext, useEffect, useState } from 'react'
import { Building2, ChevronDown, Menu } from 'lucide-react'
import { BellIcon } from 'lucide-react'
import { CircleQuestionMark } from 'lucide-react'
import { TitleContext } from '../../context/TitleContext'
import { useAuth } from '../../hooks/Hook'
function Navbar({setActivePage, setTitle}) {
  const {user} = useAuth();
  console.log(user);

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
  onClick={() => {
    setActivePage("profile");
    setTitle("My Profile");
  }}
  className="
    hidden md:flex items-center gap-3
    w-[12rem] rounded-xl p-2.5
    text-left cursor-pointer
    transition-all duration-200
    hover:bg-slate-50
  "
>
  <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-semibold text-sm">
    {user?.avatar ? (
      <img
        src={user?.avatar?.url}
        alt={user?.name || "User"}
        className="h-full w-full object-cover"
      />
    ) : (
      user?.name?.charAt(0)?.toUpperCase() || "A"
    )}
  </div>

  <div className="min-w-0 flex-1">
    <p className="truncate text-xs font-semibold text-slate-900">
      {user?.name || "USER"}
    </p>

    <p className="mt-1 text-[10px] text-slate-500">
      {user?.role || "User"}
    </p>
  </div>

  <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
</button>
      </div>
    </nav>
  )
}

export default Navbar
