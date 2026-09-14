import React from 'react'
import { MapPin, Check, FileText, ChevronRight } from 'lucide-react';

function ApplicationItem({application, statusStyle}) {
  return (
    <div className='rounded-xl border border-slate-200 bg-white px-5 py-5 transition duration-200 hover:border-slate-300 hover:shadow-[0_6px_25px_rgba(15,23,42,0.04)]'>
        <div className='flex items-start justify-between'>
          <div className='flex gap-3.5'>
              <div className='h-10 w-10 border shrink-0 items-center justify-center border-slate-200 rounded-lg  bg-slate-50 text-[13px] font-semibold text-slate-700 flex'>logo</div>
              <div className='min-w-0'>
                <p className='font-semibold text-slate-400 tracking-wide text-[11px] uppercase'>Google</p>
                <h2 className='mt-0.5 text-slate-900 text-[15px] font-semibold tracking-[-0.015em]'>Frontend Engineer</h2>
                <div className='mt-1.5 flex items-center gap-3 text-[11px] text-slate-400'>
                  <span className='flex items-center gap-1'><MapPin size={14}/> Mountain View, CA</span>
                  <span>•</span>
                  <span>Full Time</span>
                </div>
              </div>
          </div>
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${statusStyle(application?.status)}`}>Interview</span>
        </div>

        <div className='mt-7 px-2'>
          <div className='relative flex items-start justify-between'>
            <div className='absolute left-[7px] right-[7px] top-[7px] h-px bg-slate-200'/>
            {application?.steps?.map(
            (step) => (
              <div
                key={step.label}
                className="relative z-10 flex w-[25%] flex-col"
              >

                {/* Circle */}
                <div>

                  {step.completed ? (
                    <div className="flex h-[15px] w-[15px] items-center justify-center rounded-full bg-violet-600 ring-4 ring-white">

                      <Check
                        size={9}
                        strokeWidth={3}
                        className="text-white"
                      />

                    </div>
                  ) : (
                    <Circle
                      size={15}
                      strokeWidth={1.5}
                      className="fill-white text-slate-300"
                    />
                  )}

                </div>


                {/* Label */}
                <p
                  className={`mt-2 text-[10px] font-medium ${
                    step.completed
                      ? "text-slate-700"
                      : "text-slate-400"
                  }`}
                >
                  {step.label}
                </p>


                {/* Date */}
                {step.date && (
                  <p className="mt-0.5 text-[9px] text-slate-400">
                    {step.date}
                  </p>
                )}

              </div>
            )
          )}
          </div>
        </div>

        <div className='mt-6 flex items-center justify-between border-t border-slate-100 pt-4'>
          <div className='flex gap-5 items-center text-[10px] text-slate-400'>
            <span className='flex items-center gap-1.5'><FileText/> Aditya_Resume.pdf</span>
            <span>Applied Sep 10</span>
          </div>

          <button className='flex items-center gap-1 text-[11px] font-medium text-violet-600 transition hover:text-violet-700'>
            View application
            <ChevronRight size={13}/>
          </button>
        </div>
    </div>
  )
}

export default ApplicationItem
