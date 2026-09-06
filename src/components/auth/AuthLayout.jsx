import React from 'react'
import { Sparkles } from "lucide-react";
import peerLogo from "../../assests/peerLogo.png"

function AuthLayout() {
  return (
    <>
    <div className='h-full'>
    <div className='p-5 flex gap-2'>
      <img className='max-w-10' src={peerLogo} alt="" />
      <p className='text-lg font-bold text-black'>Peer.Hiring</p>
    </div>
    <div className='mt-52 items-start p-10 flex justify-center flex-wrap flex-col'>
    <div className='flex gap-3 mb-2'>
      {/* <Sparkles className="h-3 w-3 text-violet-500" /> */}
      <p className='text-violet-500 font-bold text-xs'>THE FUTURE OF WORK</p>
    </div>
    <div>
      <div className='text-4xl font-bold'> Find work that <br/><span className='text-violet-600 font-bold'>feels like you.</span></div>
      <p className='text-gray-500'>One tusted space for ambitions people and the teams they want to join</p>
    </div>
    <div className="flex items-center mt-10">
  {/* Avatars */}
  <div className="flex -space-x-1">
    <p className="w-6 h-6 rounded-full bg-violet-200 flex items-center justify-center text-[9px] font-bold text-violet-800">
      JM
    </p>

    <p className="w-6 h-6 rounded-full bg-violet-200 flex items-center justify-center text-[9px] font-bold text-violet-800">
      SK
    </p>

    <p className="w-6 h-6 rounded-full bg-violet-200 flex items-center justify-center text-[9px] font-bold text-violet-800">
      RB
    </p>
  </div>

  <span className="ml-1 font-bold text-gray-900 text-sm">
    12000+
  </span>

  <p className="ml-1 text-gray-500 text-sm">
    people finding better work
  </p>
</div>
    </div>
    </div>
    </>
  )
}

export default AuthLayout
