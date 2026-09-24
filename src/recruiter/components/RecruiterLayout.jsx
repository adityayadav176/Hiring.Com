import React from 'react'
import RecruiterNavbar from './RecruiterNavbar';
import { Outlet } from 'react-router-dom';
import RecruiterSide from './RecruiterSide';

function RecruiterLayout() {
  return (
    <div className='min-h-screen bg-[#F7F8FC]'>
       <RecruiterNavbar/>

       <div className='flex'>
            <RecruiterSide/>

            <main className='flex-1 min-w-0 md:ml-25'> 
                <div className='px-4 py-5 md:px-6 lg:px-6'>
                    <Outlet/>
                </div>
            </main>
       </div>
    </div>
  )
}

export default RecruiterLayout
