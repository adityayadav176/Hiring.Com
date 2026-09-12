import React, { useContext, useState } from 'react'
import { Building2, CalendarDays, CircleHelp, FileText, LayoutGrid, Menu, MessagesSquare, Search, Settings, User } from 'lucide-react'
import { NavLink } from 'react-router-dom';
import { TitleContext } from '../../context/TitleContext';
function Sidebar({activePage, setActivePage}) {
  const [isSidebarOpen, setisSidebarOpen] = useState(false);
  const {setTitle} = useContext(TitleContext);
  return (
<div
    className={`w-full ${
        isSidebarOpen ? "md:w-64" : "md:w-25"
    } h-screen overflow-y-auto overscroll-contain shrink-0
    gap-4 p-4 bg-white flex flex-col`}
>
      <div className="flex items-center gap-2 sm:gap-3">
               <div className={`w-8 h-8 items-center shadow shadow-violet-800 justify-center ${isSidebarOpen ? "" : "ml-5"} flex rounded-xl object-contain bg-violet-700`}>
                <span className={`font-extrabold text-[17px] text-white`}>P</span>
               </div>
              { isSidebarOpen && (
               <p className="text-lg sm:text-xl font-bold text-slate-950">
                 Peer.Hiring
               </p>
)}
      </div>
       
        <button
          type="button"
          className={`outline-none cursor-pointer mt-3 p-3 border border-violet-200 rounded-xl w-full flex items-center gap-4 ${isSidebarOpen ? "text-left" : "justify-center"} transition-all duration-200
          `}
        >
          <Building2
            className={`w-5 h-5 shrink-0`}
          />
        
            {(isSidebarOpen && 

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
          )}
        </button>

        <div className='flex flex-wrap flex-col gap-1'>
          {(isSidebarOpen && 
          <span className='text-[10px] p-3 pl-5  text-slate-500 font-semibold'>WORKSPACE</span>)}
            <button
  type="button"
  onClick={() => {
    setActivePage("overview");
    setTitle("Overview");
  }}
  className={`w-full flex items-center gap-2 p-2 pl-5 rounded-xl text-sm font-medium ${
    activePage === "overview"
      ? "bg-[#EEF0FF] text-[#5950E6]"
      : "text-gray-500 hover:bg-gray-100"
  }`}
>
  <LayoutGrid
    className={`w-5 h-5 ${
      activePage === "overview"
        ? "text-[#5950E6]"
        : "text-gray-500"
    }`}
  />

  {isSidebarOpen && <span>Overview</span>}
</button>
        <button
    type="button"
    onClick={() => {
      setActivePage("jobs");
      setTitle("Find jobs");
    }}
    className={`w-full flex items-center gap-2 p-2 pl-5 rounded-xl text-sm font-medium ${
      activePage === "jobs"
        ? "bg-[#EEF0FF] text-[#5950E6]"
        : "text-gray-500 hover:bg-gray-100"
    }`}
  >
    <Search
      className={`w-5 h-5 ${
        activePage === "jobs"
          ? "text-[#5950E6]"
          : "text-gray-500"
      }`}
    />

    {isSidebarOpen && <span>Find jobs</span>}
  </button>
            <button
  type="button"
  onClick={() => {
    setActivePage("applications");
    setTitle("Applications");
  }}
  className={`w-full flex items-center gap-2 p-2 pl-5 rounded-xl text-sm font-medium ${
    activePage === "applications"
      ? "bg-[#EEF0FF] text-[#5950E6]"
      : "text-gray-500 hover:bg-gray-100"
  }`}
>
  <FileText
    className={`w-5 h-5 ${
      activePage === "applications"
        ? "text-[#5950E6]"
        : "text-gray-500"
    }`}
  />

  {isSidebarOpen && <span>Applications</span>}
</button>
            <button
  type="button"
  onClick={() => {
    setActivePage("interviews");
    setTitle("Interviews");
  }}
  className={`w-full flex items-center gap-2 p-2 pl-5 rounded-xl text-sm font-medium ${
    activePage === "interviews"
      ? "bg-[#EEF0FF] text-[#5950E6]"
      : "text-gray-500 hover:bg-gray-100"
  }`}
>
  <CalendarDays
    className={`w-5 h-5 ${
      activePage === "interviews"
        ? "text-[#5950E6]"
        : "text-gray-500"
    }`}
  />

  {isSidebarOpen && <span>Interviews</span>}
</button>
            <button
  type="button"
  onClick={() => {
    setActivePage("messages");
    setTitle("Messages");
  }}
  className={`w-full flex items-center gap-2 p-2 pl-5 rounded-xl text-sm font-medium ${
    activePage === "messages"
      ? "bg-[#EEF0FF] text-[#5950E6]"
      : "text-gray-500 hover:bg-gray-100"
  }`}
>
  <MessagesSquare
    className={`w-5 h-5 ${
      activePage === "messages"
        ? "text-[#5950E6]"
        : "text-gray-500"
    }`}
  />

  {isSidebarOpen && <span>Messages</span>}
</button>
                      {(isSidebarOpen && 
          <span className='text-[10px] p-3 pl-5  text-slate-500 font-semibold'>ACCOUNT</span>
          )}
           <button
    type="button"
    onClick={() => {
        setActivePage("profile")
        setTitle("My Profile")
    }}
    className={`w-full flex gap-2 p-2 pl-5 rounded-xl hover:bg-gray-100 text-sm font-medium ${
        activePage === "profile"
            ? "bg-[#EEF0FF] text-[#5950E6]"
            : "text-gray-500"
    }`}
>

  
    <User
        className={`w-5 h-5 ${
            activePage === "profile"
                ? "text-[#5950E6]"
                : "text-gray-500"
        }`}
    />

    {isSidebarOpen && (
        <span>My Profile</span>
    )}
</button>

            <NavLink onClick={()=>setTitle("Settings")} className={({isActive}) => `flex gap-2 p-2 pl-5 rounded-xl hover:bg-gray-100 text-sm  font-medium ${isActive  ? "bg-[#EEF0FF] text-[#5950E6]" : "text-gray-500 hover:bg-gray-100"}` }  to="/dashboard">
              {({isActive}) => (
              <>
              <Settings className={`w-5 h-5 ${isActive ? "bg-[#EEF0FF] text-[#5950E6]" : "text-gray-500"}` }/>
                 {(isSidebarOpen && <span>Settings</span>)}
                 </>
                 )}
            </NavLink>
        </div>
        
        <p to="" className={`outline-none cursor-pointer mt-3 p-3 border-violet-300 bg-[#EEF0FF] border rounded-xl w-full flex items-center gap-4 ${isSidebarOpen ? "text-left" : "justify-center"} transition-all duration-200`}>
          <CircleHelp className="w-5 h-5 text-indigo-500" />
          {(isSidebarOpen && 
          <div>
            <p className={`font-semibold text-sm`}>Need a halp?</p>
            <p className="text-[10px] text-slate-500 mt-1">Visit our help center</p>
          </div>
          )}
        </p>
        <div className={`${isSidebarOpen ? "" : "flex text-center justify-center"}`}>
          
          <button onClick={()=>setisSidebarOpen(!isSidebarOpen)} className="flex gap-2 p-2.5  font-medium  hover:bg-gray-100 rounded-xl text-gray-500 text-sm" to=""><Menu className="w-5 h-5 text-slate-400" />{(isSidebarOpen && <span> Collapse menu</span>)}</button>
        </div>
    </div>
  )
}

export default Sidebar
