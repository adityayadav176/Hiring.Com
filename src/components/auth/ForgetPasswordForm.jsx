import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

function ForgetPasswordForm() {
  const handlePasswordChange = () => {
    
  }
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  return (
    <div className='bg-white max-w-sm rounded-xl border border-slate-200 p-6 h-[560px] mt-2 mb-2'>
      <div>
       <div className="flex gap-6 border-slate-200">
</div>
        <div className='mt-4'>
          <h1 className='text-2xl font-bold'> Forget Your Password</h1>
          <p className='text-slate-500 font-medium text-xs mt-2 mb-4'>Enter a 6 digit otp to forget your account</p>
          <div className="mt-3">
  <span className="text-slate-600 font-medium text-xs">
    OTP
  </span>

  <div className="flex gap-2 mt-3">
    {[0, 1, 2, 3, 4, 5].map((index) => (
      <input
      onChange={(e)=>setOtp(e.target.value)}
      value={otp}
        key={index}
        type="text"
        maxLength={1}
        inputMode="numeric"
        autoComplete='false'
        className="w-11 h-11 text-center text-sm font-semibold text-slate-700 outline-none border border-gray-200 rounded-xl focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
      />
    ))}
  </div>
</div>
          <span className='text-slate-600 font-medium text-xs mt-3'>New Password</span>
          <input value={password} onChange={(e)=>setPassword(e.target.value)} className='text-slate-500 outline-none font-medium mt-3 text-[12px] p-2.5 border-gray-200 focus:border-blue-500 border rounded-xl max-w-md w-full items-center justify-center flex' type="password" placeholder='.....' />
          <span className='text-slate-600 font-medium text-xs mt-3'>Confirm Password</span>
          <input value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} className='text-slate-500 outline-none font-medium mt-3 text-[12px] p-2.5 border-gray-200 focus:border-blue-500 border rounded-xl max-w-md w-full items-center justify-center flex' type="password" placeholder='.....' />
        </div>
        <div className='flex items-center justify-between mt-4'>
          <div className='flex items-center mb-2 gap-2'>
            <input type="checkbox" required className='cursor-pointer'/>
            <span className='text-slate-400 font-medium text-[10px]'> Remember me </span>
          </div>
        </div>
        <button type='button' onClick={handlePasswordChange} className='text-white mt-2 mb-4 bg-blue-600 p-2.5 text-[12px] rounded-xl max-w-md w-full items-center justify-center flex cursor-pointer'>Forget Password</button>
        <p className='text-slate-500 flex justify-center gap-0.5 font-medium text-[8px]'>By continuing, you agree to our <NavLink
         className='text-blue-500' to="">Terms</NavLink> and <NavLink className='text-blue-500' to="">Privacy Policy.</NavLink></p>
      </div>
    </div>
  )
}

export default ForgetPasswordForm
