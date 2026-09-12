import { Bookmark, BriefcaseBusiness, Building2, CalendarDays, CheckCircle2, Clock3, DollarSign, MapPin, Send, Users, X } from 'lucide-react'
import React from 'react'
import { useJob } from '../../hooks/Hook'

function JobDetails({job}) {
    const {selectedJobs, setSelectedJobs} = useJob();
  return (
    <div className='fixed inset-0 z-40 bg-slate-950/30 backdrop:blur-[2px]'>
      <aside className='bg-white right-0 z-50 flex h-screen w-[650px] max-w-[92vw] flex-col overflow-hidden fixed shadow-2xl top-0'>
        <div className='border-b border-slate-200 bg-white px-7 py-5 shrink-0'>
            <div className='flex justify-between items-start'>
            <div className='flex items-center gap-4'>
                <div className='h-14 w-14 flex shrink-0 items-center justify-center overflow-hidden  bg-[#F0EDFF] rounded-2xl text-[#6D28D9] text-xl font-bold'>M</div>
                <div>
                    <p className='font-medium text-slate-500 text-sm'>{job?.companyid?.name || "Microsoft"}</p>
                    <h1 className='text-xl font-bold mt-1 tracking-tight text-slate-900'>{job?.title}</h1>
                </div>
            </div>
                <div className='flex gap-2 items-center'>
                    <button className='h-10 w-10 border text-slate-500 transition hover:border-violet-200 hover:text-[#6D28D9] hover:bg-violet-50 border-slate-200 cursor-pointer flex items-center justify-center rounded-xl'>
                        <Bookmark size={18}/>
                    </button>
                    <button onClick={() => setSelectedJobs(null)} className='h-10 w-10 border text-slate-500 transition hover:border-violet-200 hover:text-[#6D28D9] hover:bg-violet-50 border-slate-200 cursor-pointer flex items-center justify-center rounded-xl'>
                        <X size={19}/>
                    </button>
                </div>
            </div>
            <div className='flex gap-2 mt-5 flex-wrap'>
                <span className='rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700'>{job?.employmentType}</span>
                <span className='rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600'>{job?.workSpaceType}</span>
                <span className='rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600'>{job?.experienceLevel}</span>
                    {job?.status === "OPEN" ? (
    <span className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
        <CheckCircle2 size={13} />
        OPEN
    </span>
) : job?.status === "CLOSED" ? (
    <span className="flex items-center justify-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700">
        <CheckCircle2 size={13} />
        CLOSED
    </span>
) : (
    <span className="flex items-center justify-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700">
        <CheckCircle2 size={13} />
        EXPIRED
    </span>
)}
            </div>
        </div>

        <div className='flex-1 overflow-y-auto'>
            <div className='py-6 px-7'>
                <section>
                    <h2 className='font-bold uppercase text-sm tracking-wide text-slate-400'>JOB OVERVIEW</h2>
                    <div className='grid mt-4 grid-cols-2 gap-3'>
                        <div className='rounded-xl border border-slate-200 bg-slate-50/60 p-4'>
                            <div className='flex items-center gap-2 text-slate-400'>
                                <MapPin size={17}/>
                                <span className='font-medium text-xs'>Location</span>
                            </div>
                            <p className='font-semibold mt-2 text-sm text-slate-800'>{job?.location ? `${job?.location?.city}, ${job?.location?.state}, ${job?.location?.country}` : "Location Not Show"}</p>
                        </div>
                        <div className='rounded-xl border border-slate-200 bg-slate-50/60 p-4'>
                            <div className='flex items-center gap-2 text-slate-400'>
                                <BriefcaseBusiness size={17}/>
                                <span className='font-medium text-xs'>Employment</span>
                            </div>
                            <p className='font-semibold mt-2 text-sm text-slate-800'>{job?.employmentType}</p>
                        </div>
                        <div className='rounded-xl border border-slate-200 bg-slate-50/60 p-4'>
                            <div className='flex items-center gap-2 text-slate-400'>
                                <DollarSign size={17}/>
                                <span className='font-medium text-xs'>Salary</span>
                            </div>
                            <p className='font-semibold mt-2 text-sm text-slate-800'>{`${job?.salary?.min} - ${job?.salary.max}`}</p>
                            {job?.salary?.isNagotiable ? <p className='mt-1 text-xs text-emerald-600'>Negotiable</p> : ""}
                        </div>
                        <div className='rounded-xl border border-slate-200 bg-slate-50/60 p-4'>
                            <div className='flex items-center gap-2 text-slate-400'>
                                <Users size={17}/>
                                <span className='font-medium text-xs'>Experience</span>
                            </div>
                            <p className='font-semibold mt-2 text-sm text-slate-800'>{job.experienceLevel}</p>
                        </div>
                    </div>
                </section>

                <section className='mt-8'>
                        <h2 className='font-bold text-slate-900 text-base'>About this role</h2>
                        <p className='text-slate-600 text-sm  leading-7 mt-3'>{job?.description}</p>
                </section>

                <section className='mt-8'>
                    <h2 className='font-bold text-slate-900 text-base'>Responsibilities</h2>
                    <ul className='mt-4 space-y-3'>
                        {job?.responsibilities?.length > 0 ? job.responsibilities.map((item, index) => (<li key={index} className='flex gap-3 text-sm text-slate-600 leading-6'>
                            <CheckCircle2 size={17} className='text-[#6D28D9] mt-1 shrink-0'/>
                            <span>{item}</span>
                        </li>)) :  <li className="text-sm text-slate-500">No responsibilities required</li>}
                    </ul>
                </section>

                <search className='mt-8'>
                    <h2 className='font-bold text-slate-900 text-base'>Requirements</h2>
                    <ul className='mt-4 space-y-3'>
                        {job?.requirements.length > 0 ? job.requirements.map((item, index) => (<li key={index} className='flex gap-3 text-sm text-slate-600 leading-6'>
                            <span className='rounded-full bg-[#6D28D9] shrink-0 mt-2 h-1.5 w-1.5 '></span>
                            <span>{item}</span>
                        </li>)) : <li className="text-sm text-slate-500">No requirements required</li>}
                    </ul>
                </search>

                <section className='mt-8'>
                        <h2 className='font-bold text-slate-900 text-base'>Skills</h2>
                        <div className='flex gap-2 flex-wrap mt-4'>
                            {job?.skills.length > 0 ? job.skills.map((item, index) => (<span key={index} className='border border-slate-200 bg-white text-slate-600 text-xs px-3 py-1.5 rounded-b-lg font-semibold'>{item}</span>)) : <div className='text-sm text-slate-500'>No Skills Required Anymore</div> }
                        </div>
                </section>

                <section className='mt-8'>
                        <h2 className='font-bold text-slate-900 text-base'>Additional Information</h2>
                        <div className='mt-4 space-x-3'>
                            <div className='flex justify-between border-b border-b-slate-100 pb-3 items-center'>
                                <div className='flex items-center gap-2 text-slate-500'>
                                    <Building2 size={16}/>
                                    <span className='text-sm'>Openings</span>
                                </div>
                                <span className='text-sm font-semibold text-slate-800'>{job?.openings || "0"}</span>
                            </div>
                        </div>
                        <div className='mt-4 space-x-3'>
                            <div className='flex justify-between border-b border-b-slate-100 pb-3 items-center'>
                                <div className='flex items-center gap-2 text-slate-500'>
                                    <Users size={16}/>
                                    <span className='text-sm'>Applicants</span>
                                </div>
                                <span className='text-sm font-semibold text-slate-800'>{job?.applicantsCount || "0"}</span>
                            </div>
                        </div>
                        <div className='mt-4 space-x-3'>
                            <div className='flex justify-between border-b border-b-slate-100 pb-3 items-center'>
                                <div className='flex items-center gap-2 text-slate-500'>
                                    <Users size={16}/>
                                    <span className='text-sm'>Posted</span>
                                </div>
                                <span className='text-sm font-semibold text-slate-800'>{ job?.CreatedAt ||"4 days ago"}</span>
                            </div>
                        </div>
                        <div className='mt-4 space-x-3'>
                            <div className='flex justify-between border-b border-b-slate-100 pb-3 items-center'>
                                <div className='flex items-center gap-2 text-slate-500'>
                                    <Clock3 size={16}/>
                                    <span className='text-sm'>Application deadline</span>
                                </div>
                                <span className='text-sm font-semibold text-slate-800'>{job?.applicationDeadline || "Walk Throw Interview"}</span>
                            </div>
                        </div>
                        <div className='mt-4 space-x-3'>
                            <div className='flex justify-between border-b border-b-slate-100 pb-3 items-center'>
                                <div className='flex items-center gap-2 text-slate-500'>
                                    <CalendarDays size={16}/>
                                    <span className='text-sm'>Category</span>
                                </div>
                                <span className='text-sm font-semibold text-slate-800'>{job?.title}</span>
                            </div>
                        </div>
                </section>
                <div className='h-28'/>
            </div>
        </div>

        <div className='shrink-0 border-t border-slate-200 bg-white px-7 py-4'>
            <div className='flex items-center gap-3'>
                <button className='flex flex-1 justify-center items-center px-5 rounded-xl text-sm font-semibold shadow-sm shadow-violet-200 transition-all  hover:bg-[#5B21B6] actice:scale-[0.99] hover:shadow-md py-3 text-white gap-2  bg-[#6D28D9] '>
                    <Send/>
                    Apply Now
                </button>
                <button className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-violet-200 hover:bg-violet-50 hover:text-[#6D28D9]'>
                    <Bookmark/>
                </button>
            </div>
        </div>
      </aside>
    </div>
  )
}

export default JobDetails
