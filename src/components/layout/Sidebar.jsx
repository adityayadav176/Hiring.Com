import React from 'react'
import { Building2, Calendar, CalendarDays, CircleHelp, FileText, LayoutGrid, Menu, MessagesSquare, Search, Settings, User } from 'lucide-react'
import { NavLink } from 'react-router-dom';
function Sidebar() {
  return (
    <div className="w-full md:w-64 h-auto gap-4 -r -slate-200  p-4 bg-white flex flex-col">
      <div className="flex items-center gap-2 sm:gap-3">
               <div className='w-5 h-5 sm:w-8 items-center shadow shadow-violet-800 justify-center flex sm:h-8 rounded-xl object-contain bg-violet-700'>
                <span className='font-extrabold text-[17px] text-white'>P</span>
               </div>
     
               <p className="text-lg sm:text-xl font-bold text-slate-950">
                 Peer.Hiring
               </p>
      </div>
        <button
          type="button"
          className={`outline-none cursor-pointer mt-3 p-3 border border-violet-200 rounded-xl w-full flex items-center gap-4 text-left transition-all duration-200
          `}
        >
          <Building2
            className={`w-5 h-5 shrink-0`}
          />

          <div>
            <p
              className={`font-semibold text-xs`}
            >
              Job seeker
            </p>

            <p className="text-[10px] text-slate-500 mt-1">
              Find your next opportunity
            </p>
          </div>
        </button>

        <div className='flex flex-wrap flex-col gap-1'>
          <span className='text-[10px] p-3 pl-5  text-slate-500 font-semibold'>WORKSPACE</span>
            <NavLink className={({isActive}) => `flex gap-2 p-2 pl-5 rounded-xl hover:bg-gray-100 text-sm font-medium ${isActive  ? "bg-[#EEF0FF] text-[#5950E6]" : "text-gray-500 hover:bg-gray-100"}` }  to="/">
              {({isActive}) => (
              <>
              <LayoutGrid className={`w-5 h-5 ${isActive ? "bg-[#EEF0FF] text-[#5950E6]" : "text-gray-500"}` }/>
                 <span>Overview</span>
                 </>
                 )}
            </NavLink>
            <NavLink className={({isActive}) => `flex gap-2 p-2 pl-5 rounded-xl hover:bg-gray-100 text-sm font-medium ${isActive  ? "bg-[#EEF0FF] text-[#5950E6]" : "text-gray-500 hover:bg-gray-100"}` }  to="/dashboard">
              {({isActive}) => (
              <>
              <Search className={`w-5 h-5 ${isActive ? "bg-[#EEF0FF] text-[#5950E6]" : "text-gray-500"}` }/>
                 <span>Find jobs</span>
                 </>
                 )}
            </NavLink>
            <NavLink className={({isActive}) => `flex gap-2 p-2 pl-5 rounded-xl hover:bg-gray-100 text-sm  font-medium  ${isActive  ? "bg-[#EEF0FF] text-[#5950E6]" : "text-gray-500 hover:bg-gray-100"}` }  to="/dashboard">
              {({isActive}) => (
              <>
              <FileText className={`w-5 h-5 ${isActive ? "bg-[#EEF0FF] text-[#5950E6]" : "text-gray-500"}` }/>
                 <span>Applications</span>
                 </>
                 )}
            </NavLink>
            <NavLink className={({isActive}) => `flex gap-2 p-2 pl-5 rounded-xl hover:bg-gray-100 text-sm  font-medium ${isActive  ? "bg-[#EEF0FF] text-[#5950E6]" : "text-gray-500 hover:bg-gray-100"}` }  to="/dashboard">
              {({isActive}) => (
              <>
              <CalendarDays className={`w-5 h-5 ${isActive ? "bg-[#EEF0FF] text-[#5950E6]" : "text-gray-500"}` }/>
                 <span>Interviews</span>
                 </>
                 )}
            </NavLink>
            <NavLink className={({isActive}) => `flex gap-2 p-2 pl-5 rounded-xl hover:bg-gray-100 text-sm  font-medium ${isActive  ? "bg-[#EEF0FF] text-[#5950E6]" : "text-gray-500 hover:bg-gray-100"}` }  to="/dashboard">
              {({isActive}) => (
              <>
              <MessagesSquare className={`w-5 h-5 ${isActive ? "bg-[#EEF0FF] text-[#5950E6]" : "text-gray-500"}` }/>
                 <span>Messages</span>
                 </>
                 )}
            </NavLink>
                      
          <span className='text-[10px] p-3 pl-5  text-slate-500 font-semibold'>ACCOUNT</span>
            <NavLink className={({isActive}) => `flex gap-2 p-2 pl-5 rounded-xl hover:bg-gray-100 text-sm  font-medium  ${isActive  ? "bg-[#EEF0FF] text-[#5950E6]" : "text-gray-500 hover:bg-gray-100"}` }  to="/dashboard">
              {({isActive}) => (
              <>
              <User className={`w-5 h-5 ${isActive ? "bg-[#EEF0FF] text-[#5950E6]" : "text-gray-500"}` }/>
                 <span>My Profile</span>
                 </>
                 )}
            </NavLink>
            <NavLink className={({isActive}) => `flex gap-2 p-2 pl-5 rounded-xl hover:bg-gray-100 text-sm  font-medium ${isActive  ? "bg-[#EEF0FF] text-[#5950E6]" : "text-gray-500 hover:bg-gray-100"}` }  to="/dashboard">
              {({isActive}) => (
              <>
              <Settings className={`w-5 h-5 ${isActive ? "bg-[#EEF0FF] text-[#5950E6]" : "text-gray-500"}` }/>
                 <span>Settings</span>
                 </>
                 )}
            </NavLink>
        </div>
        <NavLink to="/dashboard" className={`outline-none cursor-pointer mt-3 p-3 border-violet-300 bg-[#EEF0FF] border rounded-xl w-full flex items-center gap-4 text-left transition-all duration-200`}>
          <CircleHelp className="w-5 h-5 text-indigo-500" />
          <div>
            <p className={`font-semibold text-sm`}>Need a halp?</p>
            <p className="text-[10px] text-slate-500 mt-1">Visit our help center</p>
          </div>
        </NavLink>
        <div>
          
          <NavLink className="flex gap-2 p-2.5  font-medium  hover:bg-gray-100 rounded-xl text-gray-500 text-sm" to="/"><Menu className="w-5 h-5 text-slate-400" /> Collapse menu</NavLink>
        </div>
    </div>
  )
}

export default Sidebar
