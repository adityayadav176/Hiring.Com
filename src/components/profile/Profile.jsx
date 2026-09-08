import React from 'react'
import { ArrowUpRightSquareIcon, BriefcaseIcon, CircleCheck, Code, Edit3, GraduationCap, MapPin, Percent, Building2, PlusIcon } from 'lucide-react';

function Profile() {
  return (
   <>   
   <section className='flex items-center justify-center w-auto h-auto gap-5 m-8 flex-col'>
        <div className='md:w-200 flex items-center  bg-white p-7 rounded-2xl shadow shadow-gray-300 justify-between'>
            <div className='flex gap-4'>
                <div className='p-8 rounded-2xl bg-violet-600 flex items-center justify-center'>
                    <span className='text-2xl font-extrabold text-white'>AY</span>
                </div>
                <div className='m-2'>
                    <h1 className='font-bold text-2xl'>Alex Morgan</h1>
                    <h2 className='text-violet-600 font-medium'>MERN Stack Developer</h2>

                    <div className='flex text-gray-700 font-medium text-sm'>
                        <MapPin/>
                        <p>Agra, UP, India</p>
                    </div>
                </div>
            </div>
            <div>
                <button className='flex bg-violet-700 p-2  rounded-xl gap-3 text-white'>
                    <Edit3/>
                    <span>Edit Profile</span>
                </button>
            </div>
        </div>

       <div className="w-200 h-auto bg-white p-5 rounded-2xl shadow shadow-gray-300">

  <div className="flex justify-between items-center">

    <div className="flex items-center gap-2">
      <CircleCheck
        size={18}
        className="text-violet-600"
      />

      <span className="font-bold text-gray-900">
        Profile Completion
      </span>
    </div>

    <span className="font-bold text-violet-600">
      75%
    </span>

  </div>

  <div className="w-full h-2 bg-gray-100 rounded-full mt-4 overflow-hidden">
    <div
      className="h-full w-[75%] bg-violet-600 rounded-full"
    ></div>
  </div>


  <p className="text-xs text-gray-500 mt-3">
    Complete your experience section to reach 100%.
  </p>

</div>
        
        <div className='w-200 bg-white p-5 h-auto gap-3 rounded-2xl shadow shadow-gray-300 flex flex-col'>
            <div className='flex gap-2'>
                <BriefcaseIcon className='text-violet-600'/>
                <p className='font-bold text-gray-900'>Job Preferences</p>
            </div>
            <div className='bg-green-100 border w-50 flex text-center justify-center border-green-500 text-green-800 p-2 rounded-xl gap-3 font-medium text-sm'>
                <span className="w-2 h-2 mt-1.5 bg-green-500 rounded-full inline-block"></span>
                <p>Actively looking for jobs</p>
            </div>
            <span className='text-gray-400 font-medium text-xs'>JOB TYPES</span>
            <div className='flex gap-3'>
                <div className='text-gray-600 bg-gray-100 border-gray-600 border p-1 rounded-xl w-17 flex text-sm  items-center justify-center'>Remote</div>
            <div className='text-gray-600 bg-gray-100 border-gray-600 border p-1 rounded-xl w-17 flex text-sm  items-center justify-center'>Hybrid</div>
            <div className='text-gray-600 bg-gray-100 border-gray-600 border p-1 rounded-xl w-17 flex text-sm  items-center justify-center'>On Site</div>
            </div>
            <span className='text-gray-400 font-medium text-xs'>EXPECTED SALARY</span>
            <div className='w-30 border rounded-xl border-gray-400 font-bold p-2 flex items-center bg-slate-100'>Based in INR</div>
        </div>

             <div className="w-200 bg-white h-auto p-5 rounded-2xl shadow shadow-gray-300">

  <div className="flex justify-between items-center">

    <div className="flex items-center">
      <span className="font-bold text-gray-900 mb-2">
       About
      </span>
    </div>
  </div>


  <p className="text-xs text-gray-500 mt-3">
    Full Stack Developer
  </p>

</div>
        <div className='w-200 bg-white h-auto p-5 rounded-2xl shadow shadow-gray-300'>
            <div className='flex justify-between mb-5'>
                <div className='font-bold text-gray-900 flex gap-3'>
                    <Code className='text-violet-600'/>
                <span>Skiils</span>
                </div>
                <button className='font-medium text-violet-600 cursor-pointer hover:underline'> 
                    Add Skill
                </button>
            </div>
            <div className='flex gap-3'>
            <div className='flex p-2 font-medium gap-2 bg-slate-100 rounded-xl'>
                <p>Node.js</p>
                <p className='text-violet-800 bg-violet-200 rounded-xl p-1 pl-2 pr-2 text-xs'>Expert</p>
            </div>
            <div className='flex p-2 font-medium gap-2 bg-slate-100 rounded-xl'>
                <p>React</p>
                <p className='text-violet-800 bg-violet-200 rounded-xl p-1 pl-2 pr-2 text-xs'>Intermediate</p>
            </div>
            </div>
        </div>
            

        <div className='w-200 bg-white p-5 h-auto gap-5 rounded-2xl shadow shadow-gray-300 flex flex-col'>
            <div className='flex justify-between'>
                <div className='font-bold text-gray-900 flex gap-3'>
                <Code className='text-violet-600'/>
                <span>Projects</span>
                </div>
                <button className='font-medium text-violet-600 cursor-pointer hover:underline'>
                    Add Project
                </button>
            </div>
            <div className='w-3xl bg-white h-auto p-5 rounded-2xl hover:text-violet-700 shadow hover:shadow hover:shadow-gray-300 shadow-gray-100 border hover:border-violet-200 border-gray-200'>
                <div className='flex justify-between '>
                    <span className='font-bold text-xl'>Hiring Platform</span>
                    <ArrowUpRightSquareIcon className='cursor-pointer text-slate-400 hover:text-slate-900'/>
                </div>
                <p className='text-slate-500 font-normal'>Microservice based hiring application</p>
                <div className='flex mt-4'>
                     <div className="flex flex-wrap gap-2">

  {/* Node.js */}
  <span className="group relative cursor-pointer text-gray-700 bg-gray-100 border border-gray-300 px-3 py-1.5 rounded-xl text-sm flex items-center justify-center ">
     <span>Node.js</span>

  </span>


  {/* React */}
  <span className="group relative cursor-pointer text-gray-700 bg-gray-100 border border-gray-300 px-3 py-1.5 rounded-xl text-sm flex items-center justify-center">

    <span>React</span>

  </span>


  {/* MongoDB */}
  <span className="group relative cursor-pointer text-gray-700 bg-gray-100 border border-gray-300 px-3 py-1.5 rounded-xl text-sm flex items-center justify-center">

    <span>MongoDB</span>

  </span>

</div>
             </div>
            </div>
        </div>

    
        <div className='w-200 bg-white p-5 h-auto gap-2 rounded-2xl shadow shadow-gray-300 flex flex-col'>
            <div className='flex justify-between p-3'>
                <div className='flex gap-2 font-bold text-gray-900'>
                <GraduationCap className='text-violet-600'/>
                <span>Education</span>
                </div>
                <button className='font-medium text-violet-600 cursor-pointer hover:underline'> 
                    Add Education
                </button>
            </div>
            <div className='md:w-3xl bg-gray-100 flex items-center gap-4 h-auto p-5 rounded-2xl'>
                <div className='flex text-violet-600 p-2 w-12 h-12  rounded-xl items-center justify-center  bg-white shadow shadow-gray-500 border border-slate-50'>
                    <Building2/>
                </div>
                <div>
                    <span className='font-bold'>DBRAU</span>
                    <p className='font-medium text-sm'>BCA in Computer Applications</p>
                    <p className='text-gray-500 text-xs mt-2'>2024 - 2027</p>
                </div>
            </div>
        </div>

        <div className='w-200 bg-white p-5 h-auto gap-5 rounded-2xl shadow shadow-gray-300 flex flex-col'>
            <div className='flex gap-2 font-bold text-gray-900'>
                <BriefcaseIcon className='text-violet-600'/>
                <span>Experience</span>
            </div>
            <div className='inset-0 rounded-2xl border-2 border-dashed border-gray-200 w-3xl bg-white h-auto gap-5 shadow shadow-gray-300 flex flex-col'>
                <div className='flex flex-wrap bg-gray-100 flex-col gap-3 items-center justify-center p-5'>
                    <div className='rounded-full p-3 text-gray-400 bg-gray-200'>
                        <BriefcaseIcon/>
                    </div>
                    <span className='font-bold text-sm'>No experience added</span>
                    <p className='text-xs m-2 text-gray-400'>Add your previous work experience to increase your chances of being noticed.</p>
                    <button className='p-2 pl-3 pr-3 rounded-xl text-violet-600 font-medium text-sm bg-violet-200 flex'>
                        <span>+ Add Experience</span>
                    </button>
                </div>
            </div>
        </div>
    </section>
   </>
  )
}

export default Profile
