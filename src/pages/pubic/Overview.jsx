import { ArrowUpRight, Bookmark, BriefcaseBusinessIcon, CalendarDaysIcon, Check, ChevronDown, Clock, Clock3, MapPin, MoreHorizontal, Paperclip, Search, User } from 'lucide-react'
import React from 'react'
import { Sparkles } from 'lucide-react';

function Overview() {       

  return (
    <div className='w-full bg-[#f7f8fc] px-4 py-5 sm:px-6 lg:px-8'>
        <section className='mb-7'>
            <div className='flex items-end justify-between gap-6'>
                <div>
                    <div className='font-semibold mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-indigo-600 '>
                        <Sparkles size={14}/>
                        Your career space
                    </div>

                    <h1 className='text-[34px] font-semibold leading-[1.1] tracking-[-0.035em] text-slate-950'>
                        Good morning, Aditya 
                        <span className='ml-1.5 text-[29px] text-amber-400'>✦</span>
                    </h1>

                    <p className='mt-2 text-[13px] text-slate-500'>Here's what's happening with your job search today.</p>

                </div>
                <button className='flex h-10 shrink-0 items-center gap-2 px-4 text-white text-[12px] font-semibold transition hover:bg-indigo-700 shadow-[0_5px_14px_rgba(79,70,229,0.22)] bg-indigo-600 border border-violet-400 py-2 rounded-[10px]'>
                    <Search/>
                    <span>Explore jobs</span>
                </button>
            </div>
        </section>

        <section className='grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4'>
            <StatCard
                icon={<Paperclip size={18}/>}
                iconClass="bg-indigo-50 text-indigo-600"
                title="Applications sent"
                value="12"
                footer={
                    <span className='text-emerald-500'>
                        ↗ 8% from last month
                    </span>
                }
            />
            <StatCard
                icon={<User size={18}/>}
                iconClass="bg-violet-50 text-violet-600"
                title="Profile completion"
                value="82%"
                footer={
                    "Keep going — almost there"
                }
            />
            <StatCard
                icon={<Bookmark size={18}/>}
                iconClass="bg-amber-50 text-amber-600"
                title="Saved jobs"
                value="24"
                footer={
                    "3 new matches this week"
                }
            />
            <StatCard
                icon={<CalendarDaysIcon size={18}/>}
                iconClass="bg-emerald-50 text-emerald-600"
                title="Upcoming interviews"
                value="12"
                footer={
                    "Next: Tomorrow at 10:00 AM"
                }
            />
        </section>

        <section className='mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.65fr_1fr]'>
                <div className='rounded-[14px] bg-white border border-slate-200 p-5'>
                    <div className='flex justify-between items-start'>
                        <div>
                            <h2 className='text-[16px] font-semibold text-slate-950 tracking-[0.01em ]'>Recommended for you</h2>
                        <p className='text-[12px] mt-1.5 text-slate-500'>Roles matched to your skills and preferences</p>
                        </div>
                        <button className='flex items-center justify-center gap-1 text-[12px] font-semibold text-indigo-600 hover:text-indigo-700'>
                            View All
                            <ArrowUpRight size={14}/>
                        </button>
                    </div>

                    <div className='mt-5 grid grid-cols-1 gap-3 md:grid-cols-2'>
                        <JobCard 
                            logo="L"
                            title="Senior Product Designer"
                            company="Northstar Labs"
                            type="Full-time"
                            location="Remote · Europe"
                            salary="$120k – $145k"
                            logoClass="bg-violet-100 text-violet-600"
                            skills={["Figma", "Prototyping", "SaaS"]}
                        />
                        <JobCard 
                            logo="L"
                            title="Senior Product Designer"
                            company="Northstar Labs"
                            type="Full-time"
                            location="Remote · Europe"
                            salary="$120k – $145k"
                            logoClass="bg-orange-100 text-orange-600"
                            skills={["Figma", "Prototyping", "SaaS"]}
                        />
                    </div>
                </div>

                <div className='rounded-[14px] bg-white border border-slate-200 p-5'>
                    <div className='flex justify-between items-start'>
                        <div>
                            <h3 className='text-[16px] font-semibold text-slate-950 tracking-[0.01em ]'>Complete your profile</h3>
                            <p className='text-[12px] mt-1.5 text-slate-500'>Stand out to the right employers</p>
                        </div>
                        <span className='text-[12px] text-indigo-600 font-semibold'>82%</span>
                    </div>

                    <div className='text-slate-100 mt-5 h-1.5 overflow-hidden rounded-full'>
                        <div className='h-full rounded-full bg-indigo-600' style={{ width: "82%"}}></div>
                    </div>
                    <div className='mt-5  space-y-3.5'>
                        <ProfileStep
                            title="Add a profile photo"
                            done
                        />
                        <ProfileStep
                            title="Write your professional headline"
                            done
                        />
                        <ProfileStep
                            title="Add your work experience"
                        />
                        <ProfileStep
                            title="Add your resume"
                        />
                    </div>
                </div>
        </section>

        <section className='mt-5 grid grid-cols-1 xl:grid-cols-[1.65fr_1fr] gap-5'>
            <div className='rounded-[14px] bg-white border border-slate-200 p-5'>
                <div className='flex items-start justify-between'>
                    <div>
                        <h2 className='text-[16px] font-semibold text-slate-950 tracking-[0.01em ]'>Application activity</h2>
                        <p className='text-[12px] mt-1.5 text-slate-500'>Your job search progress over the last 30 days</p>
                    </div>
                    <button className='border border-slate-200 text-slate-500 text-[10px] flex items-center justify-center gap-2 rounded-lg px-3 py-2'>
                        Last 30 days
                        <ChevronDown size={13}/>
                    </button>
                </div>
                        <ActivityChart/>
                <div>
                </div>
            </div>

            <div className="rounded-[14px] border border-slate-200 bg-white p-5">
            
                      <div className="flex items-start justify-between">
            
                        <div>
            
                          <h2 className="text-[16px] font-semibold text-slate-950">
                            Next interviews
                          </h2>
            
                          <p className="mt-1.5 text-[12px] text-slate-500">
                            Prepare for your conversations
                          </p>
            
                        </div>
            
                        <button className="flex items-center gap-1 text-[12px] font-semibold text-indigo-600">
                          View all
                          <ArrowUpRight size={14} />
                        </button>
            
                      </div>
            
            
                      <div className="mt-5 divide-y divide-slate-100">
            
                        <InterviewCard
                          day="18"
                          month="JUN"
                          title="Portfolio review"
                          company="Northstar Labs · Senior Product Designer"
                          time="Tomorrow, 10:00 AM"
                        />
            
                        <InterviewCard
                          day="21"
                          month="JUN"
                          title="Culture & values chat"
                          company="Lattice & Co. · Product Designer"
                          time="Friday, 2:30 PM"
                        />
            
                      </div>
            
                    </div>
        </section>
    </div>
  )
}

const InterviewCard = ({
  day,
  month,
  title,
  company,
  time,
}) => {
  return (
    <div className="flex gap-3 py-4 first:pt-0">

      <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-[10px] bg-violet-50">

        <span className="text-[16px] font-semibold leading-none text-indigo-600">
          {day}
        </span>

        <span className="mt-1 text-[7px] font-bold tracking-wider text-indigo-500">
          {month}
        </span>

      </div>


      <div className="min-w-0 flex-1">

        <div className="flex items-start justify-between">

          <h3 className="text-[12px] font-semibold text-slate-900">
            {title}
          </h3>

          <button className="text-slate-400">
            <MoreHorizontal size={15} />
          </button>

        </div>

        <p className="mt-1 text-[10px] text-slate-500">
          {company}
        </p>

        <div className="mt-2 flex items-center gap-1 text-[10px] font-medium text-indigo-600">

          <Clock3 size={11} />

          {time}

        </div>

      </div>

    </div>
  );
};

const ActivityChart = () => {
    return (
        <div className='relative mt-5 h-[205px]'>
            <div className='absolute inset-0 flex flex-col  justify-between'>
                {[12, 8, 4, 0].map((value) => (<div key={value} className='flex items-center gap-2'>
                    <span className='w-4 text-[9px] text-slate-400'>{value}</span>
                    <div className='h-px flex-1 bg-slate-100'/>
                </div>))}
            </div>
             <div className="absolute bottom-5 left-6 right-0 top-1">

        <svg
          viewBox="0 0 700 190"
          className="h-full w-full"
          preserveAspectRatio="none"
        >

          <defs>

            <linearGradient
              id="homeChartGradient"
              x1="0"
              x2="0"
              y1="0"
              y2="1"
            >

              <stop
                offset="0%"
                stopColor="#4f46e5"
                stopOpacity="0.14"
              />

              <stop
                offset="100%"
                stopColor="#4f46e5"
                stopOpacity="0"
              />

            </linearGradient>

          </defs>


          <path
            d="
              M0 165
              C40 162 55 145 85 140
              C115 135 130 150 60 145
              C190 140 195 118 225 110
              C255 102 270 120 300 108
              C330 96 335 75 365 70
              C395 65 410 92 435 80
              C465 66 475 48 505 43
              C535 38 550 62 575 58
              C605 53 620 35 650 23
              C670 15 685 10 700 5
              L700 190
              L0 190
              Z
            "
            fill="url(#homeChartGradient)"
          />


          <path
            d="
              M0 165
              C40 162 55 145 85 140
              C115 135 130 150 160 145
              C190 140 195 118 225 110
              C255 102 270 120 300 108
              C330 96 335 75 365 70
              C395 65 410 92 435 80
              C465 66 475 48 505 43
              C535 38 550 62 575 58
              C605 53 620 35 650 23
              C670 15 685 10 700 5
            "
            fill="none"
            stroke="#4f46e5"
            strokeWidth="3"
            strokeLinecap="round"
          />

        </svg>

      </div>
        </div>
    )
}

const ProfileStep = ({title, done=false}) => {
    return(
        <div className='flex items-start justify-between'>
            <div className='flex items-start gap-2.5'>
                {done ? (<span className='h-5 w-5 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-500'><Check size={12} strokeWidth={2.5}/></span>) : (<span className='h-5 w-5 flex items-center justify-center rounded-full border border-slate-200 text-slate-500 text-[9px]'>3</span>)}
                <span className='text-[10px] text-slate-600'>{title}</span>
            </div>

            <span className={`text-[10px] ${done ? "text-emerald-500" : "text-indigo-600"}`}>{done ? "Done" : "Add now"}</span>
        </div>
    )
}


const JobCard = ({logo, title, company, type, skills, salary, logoClass, location}) => {
    return (
        <div className='bg-white border border-slate-200 p-4 transition hover:shadow-sm hover:border-indigo-200 rounded-xl'>
            <div className='flex items-start justify-between'>   
                <div className={`h-9 w-9 p-2 rounded-[10px] text-[13px] font-semibold  flex items-center justify-center ${logoClass}`}>{logo}</div>
                <button className='text-slate-400 hover:text-indigo-600'>
                    <Bookmark size={16}/>
                </button>
            </div>

            <h3 className='text-slate-950 font-semibold text-[13px] mt-4'>{title}</h3>
            <div className='mt-1 flex items-center gap-1.5 text-[10px] text-slate-500'>
                {company}
                <span className='flex h-3.5 w-3.5 items-center justify-center rounded-full  bg-indigo-100 text-indigo-600'>
                    <Check size={8} strokeWidth={3}/>
                </span>
            </div>

            <div className='border-t my-3 border-slate-100'/>
            <div className='flex gap-3 text-[10px] text-slate-500'>
                    <span className='flex items-center gap-1'>
                        <MapPin size={12}/>
                        {location}
                    </span>

                    <span className='flex items-center gap-1'>
                        <BriefcaseBusinessIcon size={12}/>
                        {type}
                    </span>
            </div>

            <div className='border-t my-3 border-slate-100'/>

            <div className='flex justify-between gap-2 items-center'>
                    <span className='text-[12px] font-semibold text-slate-900'>
                        {salary}
                    </span>
                    <div className='flex gap-1'>
                        {skills.map((skill) => (<span key={skill} className='rounded bg-slate-100 px-1.5 text-slate-600  py-1 text-[8px]'>{skill}</span>))}
                    </div>
            </div>
        </div>
    )
}

const StatCard = ({icon, iconClass, title, value, footer}) => {
    return (
        <div className='h-[112px] rounded-[13px] border border-slate-200 bg-white  px-4 py-4'>
            <div className='flex items-start gap-3'>
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] ${iconClass}`}>
                    {icon}
                </div>
                <div className='min-w-0'>
                    <p className='text-[11px] leading-4 text-slate-500'>{title}</p>
                    <p className='text-[25px] mt-1 font-semibold leading-none tracking-[-0.02em] text-slate-900'>{value}</p>
                </div>
            </div>
            <div className='mt-4 text-[10px] text-slate-500'>
                {footer}
            </div>
        </div>
    );
};

export default Overview
