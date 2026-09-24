import { Bell, BriefcaseBusiness, ChevronDown, LogOut, MessageSquare, Search, Settings, User } from 'lucide-react'
import React, { useState } from 'react'

function RecruiterNavbar() {
    const [openProfile, setOpenProfile] = useState(false);

    const recruiter = {
    name: "Aditya Yadav",
    role: "Recruiter",
    avatar: "https://i.pravatar.cc/150?img=12"
  };
  return (
    <header className=' sticky top-0 z-50 h-18 w-full border-b border-gray-200/80 bg-white/90 backdrop:blur-xl'>
        <div className='flex h-full items-center justify-between px-4 md:px-6'>
            <div className='flex items-center gap-5'>
                <div className='flex items-center gap-2.5'>
                    <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-[#6D28D9] shadow-sm shadow-violet-200'>
                        <BriefcaseBusiness size={19} className='text-white' strokeWidth={2.2}/>
                    </div>
                    <div className='hidden sm:block'>
                        <h1 className='font-bold tracking-tight text-gray-900 text-[17px]'>Peer<span className='text-[#6D28D9]'>.</span>Hiring</h1>
                    </div>
                </div>
                <div className='hidden h-7 w-px bg-gray-200 md:block'/>
                    <div className='hidden items-center gap-2 md:flex'>
                        <span className='rounded-lg bg-violet-50 px-2.5 py-1 text-xs text-[#6D28D9] font-semibold'>Recruiter</span>
                        <span className='text-sm font-medium text-gray-500'>Workspace</span>
                    </div>
            </div>

            <div className='hidden max-w-md flex-1 px-8 lg:block'>
                <div className='group relative'>
                    <Search size={18} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition group-focus-within:text-[#6D28D9]'/>
                    <input type="text" placeholder='Search Candidates, jobs...'  className='h-10 w-full rounded-xl border border-gray-200 bg-gray-50/80 pl-10 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-50'/>
                    <div className='absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-md border border-gray-200 bg-white px-1.5 py-0.5  text-[10px] font-medium text-gray-400 xl:flex'>
                        <span>⌘</span>
                        <span>K</span>
                    </div>
                </div>
            </div>
            <div className='flex items-center gap-1.5'>
                <button className='flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 lg:hidden' title='Search'>
                    <Search size={19}/>
                </button>

                <button className='relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition hover:bg-violet-50 hover:text-[#6D28D9]' title='Message'>
                    <MessageSquare size={19}/>
                    <span className='absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#6D28D9]'></span>
                </button>
                <button className='relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition hover:bg-violet-50 hover:text-[#6D28D9]' title='Notifications'>
                    <Bell size={19}/>
                    <span className='absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold text-white bg-[#6D28D9]'>3</span>
                </button>

                <div className='mx-2 hidden h-7 w-px bg-gray-200 sm:block'/>

                <div className='relative'>
                    <button onClick={() => setOpenProfile(!openProfile)} className='flex items-center gap-2 rounded-xl p-1.5 pr-2 transition hover:bg-gray-100'>
                        <div className="h-9 w-9 overflow-hidden rounded-full bg-violet-100 ring-2 ring-white">
  {recruiter.avatar ? (
    <img
      src={recruiter.avatar}
      alt={recruiter.name}
      className="h-full w-full object-cover"
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center text-sm font-bold text-[#6D28D9]">
      {recruiter.name
        .split(" ")
        .map((name) => name[0])
        .join("")}
    </div>
  )}
</div>
                        <div className='hidden text-left lg:block'>
                            <p className='max-w-28 truncate text-sm font-semibold text-gray-800'>{recruiter.name}</p>
                            <p className='text-[11px] text-gray-400'>{recruiter.role}</p>
                        </div>
                        <ChevronDown size={16} className={`hidden text-gray-400 transition-transform lg:block ${openProfile ? "rotate-180" : ""}`}/>
                    </button>

                    {openProfile && (
                        <div className='absolute right-0 top-13 w-60 overflow-hidden rounded-2xl border border-gray-200 bg-white p-2 shadow-xl shadow-gray-200/50'>
                            <div className='border-b border-gray-100 px-3 py-3'>
                                <p className='text-sm font-semibold text-gray-900'>{recruiter.name}</p>
                                <p className='mt-0.5 text-xs text-gray-500'>Recruiter Account</p>
                            </div>
                            <div className='mt-1'>
                                <button className='flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-600 transition hover:bg-gray-50 hover:text-gray-900'>
                                    <User size={17}/>
                                    Profile
                                </button>
                                <button className='flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-600 transition hover:bg-gray-50 hover:text-gray-900'>
                                    <Settings size={17}/>
                                    Settings
                                </button>
                                <div className='my-1 border-t border-gray-100'/>
                                <button className='flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-500 transition hover:bg-red-50'>
                                    <LogOut size={17}/>
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </header>
  )
}

export default RecruiterNavbar
