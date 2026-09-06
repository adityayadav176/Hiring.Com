import React from 'react'
import { NavLink } from 'react-router-dom'
import { Building2, User } from "lucide-react";

function SignupForm() {
  return (
    <div className='bg-white max-w-sm rounded-xl border border-slate-200 p-6 h-[560px] mt-2 mb-2'>
      <div>
       <div className="flex gap-6 border-b border-slate-200">

 <div className="flex gap-8 border-b border-slate-200">

  <NavLink
    to="/login"
    className={({ isActive }) =>
      `pb-4 text-sm font-medium ${
        isActive
          ? "text-violet-600 border-b-2 border-violet-600"
          : "text-slate-500"
      }`
    }
  >
    Log in
  </NavLink>

  <NavLink
    to="/signup"
    className={({ isActive }) =>
      `pb-4 text-sm font-medium ${
        isActive
          ? "text-violet-600 border-b-2 border-violet-600"
          : "text-slate-500"
      }`
    }
  >
    Create account
  </NavLink>

</div>

</div>
        <div className='mt-4'>
          <h1 className='text-2xl font-bold'> Join Peer Hiring </h1>
          <p className='text-slate-500 font-medium text-xs mt-2 mb-4'>Choose how you’ll use Peer Hiring.</p>
          <button
  className="
    outline-none
    cursor-pointer
    mt-3
    p-3
    border
    border-slate-200
    rounded-xl
    w-full
    flex
    items-center
    gap-4
    text-left
    transition-all
    hover:border-violet-300
  "
>
  <User className="w-5 h-5 text-slate-500 shrink-0" />

  <div>
    <p className="font-semibold text-xs text-slate-900">
      Job seeker
    </p>

    <p className="text-[10px] text-slate-500 mt-1">
      Find your next opportunity
    </p>
  </div>
</button>
          <button
  className="
    outline-none
    cursor-pointer
    mt-3
    p-3
    border
    border-slate-200
    rounded-xl
    w-full
    flex
    items-center
    gap-4
    text-left
    transition-all
    hover:border-violet-300
  "
>
  <Building2 className="w-5 h-5 text-slate-500 shrink-0" />

  <div>
    <p className="font-semibold text-xs text-slate-900">
      Recruiter
    </p>

    <p className="text-[10px] text-slate-500 mt-1">
      Build your next great team
    </p>
  </div>
</button>
          <span className='text-slate-600 font-medium text-xs mt-3'>Work email</span>
          <input className='text-slate-500  outline-none font-medium mt-3 text-[12px] p-2.5 border-gray-200 focus:border-blue-500 border rounded-xl max-w-md w-full items-center justify-center flex' type="text" placeholder='you@company.com' />
          <span className='text-slate-600 font-medium text-xs mt-3'>Password</span>
          <input className='text-slate-500  outline-none font-medium mt-3 text-[12px] p-2.5 border-gray-200 focus:border-blue-500 border rounded-xl max-w-md w-full items-center justify-center flex' type="text" placeholder='.....' />
        </div>
        <button className='text-white mt-2 bg-blue-600 p-2.5 text-[12px] rounded-xl max-w-md w-full items-center justify-center flex'>Create Account</button>

    <div className="flex items-center gap-3 mt-5 mb-5">
    
    <div className="flex-1 border-t border-slate-200"></div>
        <span className="text-slate-400 font-medium text-[9px] whitespace-nowrap">
            or continue with
        </span>
    <div className="flex-1 border-t border-slate-200"></div>
    </div>
        <button className="w-full max-w-md flex items-center justify-center gap-2 p-2.5 mt-4 mb-4 border border-gray-200 rounded-xl text-slate-500 font-medium text-[12px] transition-all duration-200 hover:bg-slate-50"><span className="text-violet-600 text-xl leading-none">G</span>
  <span>
    Continue with Google
  </span>
</button>
        <p className='text-slate-500 flex justify-center gap-0.5 font-medium text-[8px]'>By continuing, you agree to our <NavLink
         className='text-blue-500' to="">Terms</NavLink> and <NavLink className='text-blue-500' to="">Privacy Policy.</NavLink></p>
      </div>
    </div>
  )
}

export default SignupForm
