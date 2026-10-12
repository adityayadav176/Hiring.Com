import { ArrowLeft, BriefcaseBusiness, Building2, CalendarDays, CheckCircle2, CircleDollarSign, FileText, MapPin, MessageSquareCheck, MessageSquareText, ShieldCheck, Sparkles, X } from 'lucide-react'
import React, { useState } from 'react'

function ApplyJob({job, resumes, onClose, onSuccess}) {
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);
  const steps = [
    {id: 1, level: "Select Resume", icon: FileText},
    {id: 2, level: "Application Details", icon: MessageSquareText},
    {id: 3, level: "Review & Submit", icon: CheckCircle2},
  ]
  return (
    <div className='fixed inset-0 z-[100] overflow-y-auto bg-slate-950/50'>
      <div className="min-h-screen bg-[#F5F6FA] text-slate-800">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur">
                <div className="mx-auto flex h-[68px] max-w-[1800px] items-center justify-between gap-4 px-4 sm:px-6 xl:px-8">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                      <BriefcaseBusiness size={21} />
                    </div>
        
                    <div className="min-w-0">
                      <h1 className="truncate text-base font-bold tracking-tight text-slate-900">
                        Job Application
                      </h1>
                      <p className="hidden text-xs text-slate-500 sm:block">
                        Complete your application with Peer.Hiring
                      </p>
                    </div>
                  </div>
        
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 sm:text-sm"
                  >
                    <X size={15} />
                    <span className="hidden sm:inline">Exit application</span>
                    <span className="sm:hidden">Exit</span>
                  </button>
                </div>
              </header>
        <main className='mx-auto max-w-[1800px] px-3 py-4 sm:px-5 sm:py-6 xl:px-8'>
          {success ? (
            <section className='mx-auto mt-10 max-w-xl rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm sm:px-10'>
                <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600'>
                  <CheckCircle2 size={35}/>
                </div>
                <h2 className='mt-5 text-xl font-bold text-slate-900'>Application submitted successfully</h2>
                 <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Your application for{" "}
              <strong className="text-slate-800">{"Junior Full Stack Developer"}</strong> at {" "}
              <strong className="text-slate-800">{"aditya&CCO"}</strong>{" "}
              has been submitted.
            </p>
                <div className='mt-6 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 text-left'>
                  <div className='flex items-center gap-3'>
                    <FileText size={22} className=' shrink-0 text-emerald-700'/>
                    <div className='min-w-0'>
                      <p className='text-sm truncate font-semibold text-slate-800'>{ "Selected Resume"}</p>
                      <p className='mt-1 text-xs text-slate-500'>Included with your application</p>
                    </div>
                  </div>
                </div>
                <button onClick={onClose} className='mt-6 rounded-lg bg-violet-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-800'>
                    Done
                </button>
            </section>
          ) : (
            <>
            <div className='mb-5'>
              <button onClick={onClose} className='mb-3 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-violet-700'>
                <ArrowLeft size={15} />
                Back to jobs
              </button>
              <div className='flex flex-col justify-between gap-3 sm:flex-row sm:items-end'>
              <div>
                <h2 className='text-xl font-bold tracking-tight text-slate-900 sm:text-2xl'>Apply for this position</h2>
                <p className='mt-1 text-sm text-slate-500'>Review the role, choose your resume, and submit your application.</p>
              </div>
              <div className='flex items-center gap-2 self-start rounded-lg border border-violet-100 text-xs bg-white px-3 py-2 font-medium text-violet-700 sm:self-auto'>
                <ShieldCheck size={15}/>
                Secure application
              </div>
              </div>
            </div>

            <div className='grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(260px,0.85fr)_minmax(430px,1.4fr)_minmax(260px,0.85fr)] 2xl:gap-5'>
                <aside className='min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm'>
                  <div className='border-b border-slate-100 bg-gradient-to-br from-violet-50 to-white p-4 sm:p-5'>
                      <div className='flex items-center gap-3'>
                          <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl overflow-hidden border border-slate-200 bg-slate-950 text-white'>
                              <Building2 size={22}/>
                          </div>
                          <div className='min-w-0'>
                              <h3 className='truncate text-sm font-bold text-slate-900'>aditya&CCO</h3>
                              <p className='mt-0.5 text-xs text-slate-500'>Job opportunity</p>
                          </div>
                      </div>
                      <h2 className='mt-5 text-lg font-bold leading-6 tracking-tight text-slate-900'>Junior Full Stack Developer</h2>
                      <div className='mt-4 flex flex-wrap gap-2'>
                          <span className='rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-slate-600'>Full Time</span>
                          <span className='rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-slate-600'>Remote</span>
                      </div>
                  </div>
                  <div className='p-4 sm:p-5'>
                      <div className='space-y-3.5'>
                          <div className='flex items-start gap-2.5'>
                              <MapPin size={16} className='mt-0.5 shrink-0 text-slate-400'/>
                              <div className='min-w-0'>
                                  <p className='text-[11px] text-slate-400'>Location</p>
                                  <p className='mt-0.5 break-words text-xs font-medium leading-5 text-slate-700'>Banglore, Karantaka, India</p>
                              </div>
                          </div>
                          <div className='flex items-start gap-2.5'>
                              <CircleDollarSign size={16} className='mt-0.5 shrink-0 text-slate-400'/>
                              <div className='min-w-0'>
                                  <p className='text-[11px] text-slate-400'>Compensation</p>
                                  <p className='mt-0.5 break-words text-xs font-medium leading-5 text-slate-700'>₹5,00,000 – ₹9,00,000</p>
                              </div>
                          </div>
                          <div className='flex items-start gap-2.5'>
                              <CalendarDays size={16} className='mt-0.5 shrink-0 text-slate-400'/>
                              <div className='min-w-0'>
                                  <p className='text-[11px] text-slate-400'>Application deadline</p>
                                  <p className='mt-0.5 break-words text-xs font-medium leading-5 text-slate-700'>Apply before 16 Oct 2026</p>
                              </div>
                          </div>
                          <div className='my-5 h-px bg-slate-200'/>
                          <section>
                            <h3 className='text-xs font-bold text-slate-900'>About the role</h3>
                            <p className='mt-2 whitespace-pre-line text-xs leading-5 text-slate-600'>We are looking for a motivated Junior Full Stack Developer to join our engineering team and build scalable web applications.</p>
                          </section>
                          <section className='mt-5'>
                            <h3 className='text-xs font-bold text-slate-900'>Key responsibilities</h3>
                            <ul className='mt-3 space-y-2.5'>
                              <li className='flex items-start gap-2 text-xs leading-5 text-slate-600'>
                                <CheckCircle2 className='mt-0.5 shrink-0 text-violet-600' size={14}/>
                                <span>Develop and maintain web applications</span>
                              </li>
                              <li className='flex items-start gap-2 text-xs leading-5 text-slate-600'>
                                <CheckCircle2 className='mt-0.5 shrink-0 text-violet-600' size={14}/>
                                <span>Build reusable React components</span>
                              </li>
                              <li className='flex items-start gap-2 text-xs leading-5 text-slate-600'>
                                <CheckCircle2 className='mt-0.5 shrink-0 text-violet-600' size={14}/>
                                <span>Develop REST APIs using Node.js and Express</span>
                              </li>
                            </ul>
                          </section>
                          <section className='mt-5'>
                            <h3 className='text-xs font-bold text-slate-900'>Required skills</h3>
                            <div className='mt-2.5 flex flex-wrap gap-1.5'>
                              <span className='rounded-md border border-violet-100 bg-violet-50 px-2 py-1 text-[10px] font-medium text-violet-700' >JavaScript</span>
                              <span className='rounded-md border border-violet-100 bg-violet-50 px-2 py-1 text-[10px] font-medium text-violet-700' >React</span>
                              <span className='rounded-md border border-violet-100 bg-violet-50 px-2 py-1 text-[10px] font-medium text-violet-700' >Node.js</span>
                              <span className='rounded-md border border-violet-100 bg-violet-50 px-2 py-1 text-[10px] font-medium text-violet-700' >Express</span>
                              <span className='rounded-md border border-violet-100 bg-violet-50 px-2 py-1 text-[10px] font-medium text-violet-700' >Mongodb</span>
                              <span className='rounded-md border border-violet-100 bg-violet-50 px-2 py-1 text-[10px] font-medium text-violet-700' >Git</span>
                            </div>
                          </section>
                          <div className='mt-5 rounded-lg border border-violet-100 bg-violet-50/70 p-3'>
                            <div className='flex items-start gap-2.5'>
                                <Sparkles size={16} className='mt-0.5 shrink-0 text-violet-700'/>
                                <div>
                                  <p className='text-xs font-semibold text-violet-900'>Make your application count</p>
                                  <p className='mt-1 text-[11px] leading-5 text-violet-800/80'>Choose a resume that highlights the skills most relevant to this role.</p>
                                </div>
                            </div>
                          </div>
                      </div>
                  </div>
                </aside>

                <section className='flex min-w-0 flex-col overflow-hidden rounded-xl border-slate-200 bg-white shadow-sm'>
                    <div className='border-b border-slate-100 px-4 py-4 sm:px-5'>
                        <div className='flex items-center justify-between gap-3'>
                            <div>
                              <p className='text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-700'>Application workflow</p>
                              <h2 className='mt-1 text-base font-bold text-slate-900'>Select Resume</h2>
                            </div>
                            <span className='shrink-0 rounded-lg bg-slate-100 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600'>Step 1 of 3</span>
                        </div>
                        <div className='mt-4 grid grid-cols-3 gap-2'>
                            {steps.map((item) => {
                              const active = item.id === step;
                              const complete = item.id < step;

                              return (
                                <button className='min-w-0 text-left disabled:cursor-default'>
                                    <div className={`h-1 rounded-full ${active || complete ? "bg-violet-600" : "bg-slate-100"}`}/>
                                    <p className={`mt-2 truncate text-[10px] font-semibold sm:text-[11px] ${active ? "text-violet-700" : complete ? "text-slate-700" : "text-slate-400"}`}>{item.level}</p>
                                </button>
                              );
                            })}
                        </div>
                    </div>
                </section>
            </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default ApplyJob
