import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

function SendPasswordResetOtpForm() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const handleSendOtp = async() => {
        try {
            const response = await fetch("http://localhost:9000/api/v1/auth/SendPasswordResetOtp", {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                credentials: "include",
                body: JSON.stringify({email})
            })
    
            const data = await response.json();
    
            if(!response.ok) {
              alert(data.message);
                throw new Error(data.message || "Otp Sending Failed..");
            }  
          navigate("/forgetPassword");
        } catch (error) {
            console.log(error);
        }
    }
 return (
    <div className='bg-white max-w-sm rounded-xl border border-slate-200 p-6 h-[560px] mt-2 mb-2'>
      <div>
       <div className="flex gap-6 border-slate-200">
</div>
        <div className='mt-4'>
          <h1 className='text-2xl font-bold'>Find Your Account</h1>
          <p className='text-slate-500 font-medium text-xs mt-2 mb-4'>Enter your email to forget Your password.</p>
          <span className='text-slate-600 font-medium text-xs mt-3'>Email</span>
          <input onChange={(e)=>setEmail(e.target.value)} value={email} className='text-slate-500 outline-none font-medium mt-3 text-[12px] p-2.5 border-gray-200 focus:border-blue-500 border rounded-xl max-w-md w-full items-center justify-center flex' type="email" placeholder='Peer@example.com' />
        </div>
        <div className='flex items-center justify-between mt-4'>
          <div className='flex items-center mb-2 gap-2'>
            <input type="checkbox" required className='cursor-pointer'/>
            <span className='text-slate-400 font-medium text-[10px]'> Remember me </span>
          </div>
        </div>
        <button onClick={handleSendOtp} type='button' className='text-white mt-2 bg-blue-600 p-2.5 text-[12px] rounded-xl max-w-md w-full items-center justify-center flex cursor-pointer'>Send Otp</button>

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

export default SendPasswordResetOtpForm
