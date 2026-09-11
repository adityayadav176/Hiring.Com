import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {useAuth} from "../../hooks/Hook"

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {handleLogin} = useAuth();
  const handleSubmit = async() => {
    await handleLogin({email, password});
  };
  return (
    <div className='bg-white max-w-sm rounded-xl border border-slate-200 p-6 h-[560px] mt-2 mb-2'>
      <div>
       <div className="flex gap-6 border-b border-slate-200">

  <NavLink
    to="/login"
    className={({ isActive }) =>
      `pb-4 text-xs font-medium transition-colors
      ${
        isActive
          ? "text-violet-600 border-b-2 border-violet-600"
          : "text-slate-500 hover:text-violet-500"
      }`
    }
  >
    Log in
  </NavLink>

  <NavLink
    to="/signup"
    className={({ isActive }) =>
      `pb-4 text-xs font-medium transition-colors
      ${
        isActive
          ? "text-violet-600 border-b-2 border-violet-600"
          : "text-slate-500 hover:text-violet-500"
      }`
    }
  >
    Create account
  </NavLink>

</div>
        <div className='mt-4'>
          <h1 className='text-2xl font-bold'> Welcome back </h1>
          <p className='text-slate-500 font-medium text-xs mt-2 mb-4'>Enter your details to continue your search.</p>
          <span className='text-slate-600 font-medium text-xs mt-3'>Work email</span>
          <input required onChange={(e) => setEmail(e.target.value)} value={email} className='text-slate-500  outline-none font-medium mt-3 text-[12px] p-2.5 border-gray-200 focus:border-blue-500 border rounded-xl max-w-md w-full items-center justify-center flex' type="email" placeholder='you@company.com' />
          <span className='text-slate-600 font-medium text-xs mt-3'>Password</span>
          <input required onChange={(e)=>setPassword(e.target.value)} value={password} className='text-slate-500 outline-none font-medium mt-3 text-[12px] p-2.5 border-gray-200 focus:border-blue-500 border rounded-xl max-w-md w-full items-center justify-center flex' type="password" placeholder='.....' />
        </div>
        <div className='flex items-center justify-between mt-4'>
          <div className='flex items-center mb-2 gap-2'>
            <input type="checkbox" required className='cursor-pointer'/>
            <span className='text-slate-400 font-medium text-[10px]'> Remember me </span>
          </div>
          <NavLink className='font-medium text-[8px] flex justify-end text-blue-600 hover:text-blue-800' to="/sendPasswordResetOpt">Forget Password?</NavLink> 
        </div>
        <button type='button' onClick={handleSubmit} className='text-white mt-2 bg-blue-600 p-2.5 text-[12px] rounded-xl max-w-md w-full items-center justify-center flex cursor-pointer'>Log in </button>

    <div className="flex items-center gap-3 mt-5 mb-5">
  
    <div className="flex-1 border-t border-slate-200"></div>
        <span className="text-slate-400 font-medium text-[9px] whitespace-nowrap">
            or continue with
        </span>
    <div className="flex-1 border-t border-slate-200"></div>
    </div>
        <button className="w-full cursor-pointer max-w-md flex items-center justify-center gap-2 p-2.5 mt-4 mb-4 border border-gray-200 rounded-xl text-slate-500 font-medium text-[12px] transition-all duration-200 hover:bg-slate-50"><span className="text-violet-600 text-xl leading-none">G</span>
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

export default LoginForm
