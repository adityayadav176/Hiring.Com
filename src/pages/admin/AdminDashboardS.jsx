import { Activity, AlertCircle, ArrowUp, ArrowUpRight, BriefcaseBusinessIcon, Building2, CalendarDays, CheckCircle2, ChevronRight, Clock, Edit, FileText, Icon, PauseCircle, ShieldAlert, ShieldCheck, TrendingDown, TrendingUp, User, Users } from 'lucide-react'
import React, { useEffect } from 'react'
import { useAdmin } from '../../hooks/Hook'

function AdminDashboardS() {
    const {dashboard, handleGetAdminDashboard} = useAdmin();
    useEffect(() => {
        handleGetAdminDashboard();
    }, [])

    const handleclick = () => {
        alert("btn clicked!");
        console.log(dashboard);
    }
  return (
    <div className='min-h-screen bg-[#F7F8FC] px-6 py-7 lg:px-8'>
        <div className='mx-auto max-w-[1600px] space-y-6'>
            <div className='flex flex-col justify-between gap-4 md:flex-row md:items-end'>
                    <div>
                        <div className='flex mb-2 items-center gap-2'>
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            <span className='text-emerald-600 font-semibold uppercase tracking-[0.18em] text-xs'>Platform healthy</span>
                        </div>
                        <h1 className='font-bold tracking-tight text-3xl text-[#11152A] lg:text-4xl'>Control Center</h1>
                        <p className='mt-2 text-sm text-slate-500'>Monitor your platform's performance, growth and key metrics.</p>
                    </div>
                <button onClick={handleclick} className='flex gap-2 h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 shadow-sm transition hover:border-violet-200 hover:text-violet-600'>
                    <CalendarDays size={17}/>
                    Last 30 Days
                    <ChevronRight size={15}/>
                </button>
            </div>
            <section className='rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(30,41,59,0.03)]'>
                <div className='grid gap-5 xl:grid-cols-[1.7fr_0.8fr_0.8fr]'>
                    
                    {/* {pulse} */}
                    <div className='rounded-xl border border-slate-200 bg-gradient-to-br from-[#FAF9FF] to-white p-5'>
                        <div className='flex justify-between gap-6 flex-col lg:flex-row'>
                                <div className='flex gap-4'>
                                    <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600'>
                                        <Activity size={21}/>
                                    </div>
                                    <div>
                                        <h2 className='font-semibold text-[#11152A]'>Platform Pulse</h2>
                                        <p className='mt-1 max-w-[210px] text-xs leading-5 text-slate-500'>Live overview of your platform ecosystem</p>
                                    </div>
                                </div>
                            <div className='min-w-[220px]'>
                                <p className='text-3xl font-bold tracking-tight text-[#11152A]'>{dashboard?.users?.total}</p>
                                <p className='text-slate-500 mt-1 font-medium text-xs'>Total Users</p>
                                <div  className='mt-4 flex h-2 overflow-hidden rounded-full bg-slate-100'>
                                    <div className='bg-violet-600' style={{width: "65%"}}/>
                                    <div className='bg-violet-300' style={{width: "22%"}}/>
                                    <div className='bg-sky-300' style={{width: "13%"}}/>
                                </div>
                                <div className='mt-3 flex gap-5 text-[11px] text-slate-500'>
                                    <span>
                                        <b className='text-violet-600'>●</b>
                                        Candidates
                                    </span>
                                    <span>
                                        <b className='text-violet-400'>●</b>
                                        Recruiters
                                    </span>
                                    <span>
                                        <b className='text-sky-400'>●</b>
                                        Companies
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='rounded-xl border border-slate-200 p-5'>
                        <div className='flex justify-between items-start'>
                            <div className='flex h-10 w-10 justify-center items-center rounded-xl bg-emerald-50 text-emerald-600'>
                                <ShieldCheck size={20}/>
                            </div>
                            <span className='text-xs font-semibold text-emerald-500'>
                                ↑ 8%
                            </span>
                        </div>
                        <p className='mt-5 text-xs font-medium text-slate-500'>Verified</p>
                        <p className='mt-1 text-2xl font-bold text-[#11152A]'>{dashboard?.company?.verified}</p>
                        <p className='mt-1 text-[11px] text-slate-400'>{dashboard?.company?.total ? ((dashboard.company.verified / dashboard.company.total) * 100).toFixed(1) : 0}% of total companies</p>
                    </div>
                    <div className='rounded-xl border border-slate-200 p-5'>
                        <div className='flex justify-between items-start'>
                            <div className='flex h-10 w-10 justify-center items-center rounded-xl bg-orange-50 text-orange-600'>
                                <ShieldAlert size={20}/>
                            </div>
                            <span className='text-xs font-semibold text-orange-500'>
                                ↑ 5%
                            </span>
                        </div>
                        <p className='mt-5 text-xs font-medium text-slate-500'>Unverified Companies</p>
                        <p className='mt-1 text-2xl font-bold text-[#11152A]'>{dashboard?.company?.unVerified}</p>
                        <p className='mt-1 text-[11px] text-slate-400'>{dashboard?.company?.total ? ((dashboard.company.unVerified / dashboard.company.total) * 100).toFixed(1) : 0}% of total companies</p>
                    </div>
                </div>
            </section>

            <div className='grid gap-6 xl:grid-cols-[1.05fr_1fr]'>
                <section className='rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(30,41,59,0.03)]'>
                    <div className='mb-5 flex items-center justify-between'>
                        <div className=''>
                            <h2 className='font-semibold text-[#11152A]'>Users & Companies</h2>
                            <p className='mt-1 text-xs text-slate-400'>Platform account distribution</p>
                        </div>
                        <button className='flex items-center justify-center gap-1 text-xs font-semibold text-violet-600 hover:text-violet-700'>
                            View All
                            <ArrowUpRight/>
                        </button>
                    </div>

                    <div className='grid grid-cols-2 gap-3'>
                        <div className='group rounded-xl border border-slate-100 p-4 transition hover:border-violet-100 hover:bg-violet-50/30'>
                            <div className='flex items-start justify-between'>
                                <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600'>
                                    <Users size={18}/>
                                </div>
                                <span className='text-[10px] font-semibold text-emerald-500'>+12%</span>
                            </div>
                            <p className='font-medium text-slate-400 text-[11px] mt-4'>Total Users</p>
                            <p className='mt-1 text-xl font-bold text-[#11152A]'>{dashboard?.users?.total}</p>
                           <div className="mt-4 flex h-7 items-end gap-[3px]">
                      {[3, 5, 4, 7, 6, 8, 7, 10, 9, 12, 10, 14].map(
                        (height, index) => (
                          <div
                            key={index}
                            className="w-full rounded-sm bg-violet-200 transition group-hover:bg-violet-400"
                            style={{ height: `${height * 2}px` }}
                          />
                        )
                      )}
                    </div>
                        </div>
                        <div className='group rounded-xl border border-slate-100 p-4 transition hover:border-violet-100 hover:bg-violet-50/30'>
                            <div className='flex items-start justify-between'>
                                <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600'>
                                    <User size={18}/>
                                </div>
                                <span className='text-[10px] font-semibold text-emerald-500'>+12%</span>
                            </div>
                            <p className='font-medium text-slate-400 text-[11px] mt-4'>Candidates</p>
                            <p className='mt-1 text-xl font-bold text-[#11152A]'>{dashboard?.users?.candidate}</p>
                           <div className="mt-4 flex h-7 items-end gap-[3px]">
                      {[3, 5, 4, 7, 6, 8, 7, 10, 9, 12, 10, 14].map(
                        (height, index) => (
                          <div
                            key={index}
                            className="w-full rounded-sm bg-violet-200 transition group-hover:bg-violet-400"
                            style={{ height: `${height * 2}px` }}
                          />
                        )
                      )}
                    </div>
                        </div>
                        <div className='group rounded-xl border border-slate-100 p-4 transition hover:border-violet-100 hover:bg-violet-50/30'>
                            <div className='flex items-start justify-between'>
                                <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600'>
                                    <Users size={18}/>
                                </div>
                                <span className='text-[10px] font-semibold text-emerald-500'>+12%</span>
                            </div>
                            <p className='font-medium text-slate-400 text-[11px] mt-4'>Recruiters</p>
                            <p className='mt-1 text-xl font-bold text-[#11152A]'>{dashboard?.users?.recruiter}</p>
                           <div className="mt-4 flex h-7 items-end gap-[3px]">
                      {[3, 5, 4, 7, 6, 8, 7, 10, 9, 12, 10, 14].map(
                        (height, index) => (
                          <div
                            key={index}
                            className="w-full rounded-sm bg-violet-200 transition group-hover:bg-violet-400"
                            style={{ height: `${height * 2}px` }}
                          />
                        )
                      )}
                    </div>
                        </div>
                        <div className='group rounded-xl border border-slate-100 p-4 transition hover:border-violet-100 hover:bg-violet-50/30'>
                            <div className='flex items-start justify-between'>
                                <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600'>
                                    <Building2 size={18}/>
                                </div>
                                <span className='text-[10px] font-semibold text-emerald-500'>+12%</span>
                            </div>
                            <p className='font-medium text-slate-400 text-[11px] mt-4'>Companies</p>
                            <p className='mt-1 text-xl font-bold text-[#11152A]'>{dashboard?.company?.total}</p>
                           <div className="mt-4 flex h-7 items-end gap-[3px]">
                      {[3, 5, 4, 7, 6, 8, 7, 10, 9, 12, 10, 14].map(
                        (height, index) => (
                          <div
                            key={index}
                            className="w-full rounded-sm bg-violet-200 transition group-hover:bg-violet-400"
                            style={{ height: `${height * 2}px` }}
                          />
                        )
                      )}
                    </div>
                        </div>
                        <div className='rounded-xl border border-emerald-100 bg-emerald-50/30 p-4'>
                                <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600'>
                                    <CheckCircle2 size={18}/>
                                </div>
                            <p className='font-medium text-slate-400 text-[11px] mt-4'>Verified Companies</p>
                            <p className='mt-1 text-xl font-bold text-[#11152A]'>{dashboard?.company?.verified}</p>
                           <div className="mt-4 flex items-center  gap-1 text-[10px]  font-semibold text-emerald-500">
                             8% growth
                            <TrendingUp/>
                    </div>
                        </div>
                        <div className='rounded-xl border border-orange-100 bg-orange-50/30 p-4'>
                                <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100 text-orange-500'>
                                    <AlertCircle size={18}/>
                                </div>
                            <p className='font-medium text-slate-400 text-[11px] mt-4'>Unverified Companies</p>
                            <p className='mt-1 text-xl font-bold text-[#11152A]'>{dashboard?.company?.unVerified}</p>
                           <div className="mt-4 flex items-center  gap-1 text-[10px]  font-semibold text-orange-500">
                            5% decrease
                            <TrendingDown/>
                    </div>
                        </div>
                    </div>
                </section>

                <section className='rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(30,41,59,0.03)]'>
                        <div className="mb-5 flex items-center justify-between">
                                      <div>
                                        <h2 className="font-semibold text-[#11152A]">
                                          Jobs & Applications
                                        </h2>
                        
                                        <p className="mt-1 text-xs text-slate-400">
                                          Job lifecycle and hiring activity
                                        </p>
                                      </div>
                        
                                      <button className="flex items-center gap-1 text-xs font-semibold text-violet-600 hover:text-violet-700">
                                        View all
                                        <ArrowUpRight size={14} />
                                      </button>
                                    </div>
                        <div className='grid grid-cols-2 gap-3 lg:grid-cols-3'>
                            <div className='rounded-xl border border-slate-100 p-4 transition hover:border-violet-100 hover:shadow-sm'> 
                                        <div className='flex items-center justify-between'>
                                            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600'>
                                                <BriefcaseBusinessIcon size={16}/>
                                            </div>
                                            <span className='text-[10px] font-semibold text-emerald-500'>+16%</span>
                                        </div>
                                        <p className='mt-3 text-[10px] font-medium text-slate-400'>Total Jobs</p>
                                        <p className='mt-1 text-lg font-bold text-[#11152A]'>{dashboard?.job?.total}</p>
                                        <div className='mt-3 flex h-5 items-end gap-[2px]'>
                                            {[4, 7, 5, 8, 6, 10, 8, 11].map((height, i) => (
                                                <div key={i} className='w-full rounded-sm bg-violet-200' style={{height: `${height * 2}px`}}>  </div>
                                            ))}
                                        </div>
                            </div>
                            <div className='rounded-xl border border-slate-100 p-4 transition hover:border-violet-100 hover:shadow-sm'> 
                                        <div className='flex items-center justify-between'>
                                            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600'>
                                                <Activity size={16}/>
                                            </div>
                                            <span className='text-[10px] font-semibold text-emerald-500'>+16%</span>
                                        </div>
                                        <p className='mt-3 text-[10px] font-medium text-slate-400'>Active jobs</p>
                                        <p className='mt-1 text-lg font-bold text-[#11152A]'>{dashboard?.job?.active}</p>
                                        <div className='mt-3 flex h-5 items-end gap-[2px]'>
                                            {[4, 7, 5, 8, 6, 10, 8, 11].map((height, i) => (
                                                <div key={i} className='w-full rounded-sm bg-violet-200' style={{height: `${height * 2}px`}}>  </div>
                                            ))}
                                        </div>
                            </div>
                            <div className='rounded-xl border border-slate-100 p-4 transition hover:border-violet-100 hover:shadow-sm'> 
                                        <div className='flex items-center justify-between'>
                                            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600'>
                                                <BriefcaseBusinessIcon size={16}/>
                                            </div>
                                            <span className='text-[10px] font-semibold text-emerald-500'>+16%</span>
                                        </div>
                                        <p className='mt-3 text-[10px] font-medium text-slate-400'>Closed Jobs</p>
                                        <p className='mt-1 text-lg font-bold text-[#11152A]'>{dashboard?.job?.closed}</p>
                                        <div className='mt-3 flex h-5 items-end gap-[2px]'>
                                            {[4, 7, 5, 8, 6, 10, 8, 11].map((height, i) => (
                                                <div key={i} className='w-full rounded-sm bg-violet-200' style={{height: `${height * 2}px`}}>  </div>
                                            ))}
                                        </div>
                            </div>
                            <div className='rounded-xl border border-slate-100 p-4 transition hover:border-violet-100 hover:shadow-sm'> 
                                        <div className='flex items-center justify-between'>
                                            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600'>
                                                <Clock size={16}/>
                                            </div>
                                            <span className='text-[10px] font-semibold text-emerald-500'>+16%</span>
                                        </div>
                                        <p className='mt-3 text-[10px] font-medium text-slate-400'>Expired Jobs</p>
                                        <p className='mt-1 text-lg font-bold text-[#11152A]'>{dashboard?.job?.expired}</p>
                                        <div className='mt-3 flex h-5 items-end gap-[2px]'>
                                            {[4, 7, 5, 8, 6, 10, 8, 11].map((height, i) => (
                                                <div key={i} className='w-full rounded-sm bg-violet-200' style={{height: `${height * 2}px`}}>  </div>
                                            ))}
                                        </div>
                            </div>
                            <div className='rounded-xl border border-slate-100 p-4 transition hover:border-violet-100 hover:shadow-sm'> 
                                        <div className='flex items-center justify-between'>
                                            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600'>
                                                <Edit size={16}/>
                                            </div>
                                            <span className='text-[10px] font-semibold text-emerald-500'>+16%</span>
                                        </div>
                                        <p className='mt-3 text-[10px] font-medium text-slate-400'>Draft Jobs</p>
                                        <p className='mt-1 text-lg font-bold text-[#11152A]'>{dashboard?.job?.draft}</p>
                                        <div className='mt-3 flex h-5 items-end gap-[2px]'>
                                            {[4, 7, 5, 8, 6, 10, 8, 11].map((height, i) => (
                                                <div key={i} className='w-full rounded-sm bg-violet-200' style={{height: `${height * 2}px`}}>  </div>
                                            ))}
                                        </div>
                            </div>
                            <div className='rounded-xl border border-slate-100 p-4 transition hover:border-violet-100 hover:shadow-sm'> 
                                        <div className='flex items-center justify-between'>
                                            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600'>
                                                <PauseCircle size={16}/>
                                            </div>
                                            <span className='text-[10px] font-semibold text-emerald-500'>+16%</span>
                                        </div>
                                        <p className='mt-3 text-[10px] font-medium text-slate-400'>Paused Jobs</p>
                                        <p className='mt-1 text-lg font-bold text-[#11152A]'>{dashboard?.job?.paused}</p>
                                        <div className='mt-3 flex h-5 items-end gap-[2px]'>
                                            {[4, 7, 5, 8, 6, 10, 8, 11].map((height, i) => (
                                                <div key={i} className='w-full rounded-sm bg-violet-200' style={{height: `${height * 2}px`}}>  </div>
                                            ))}
                                        </div>
                            </div>
                            <div className='rounded-lg border border-violet-100 bg-violet-50/30 p-4 lg:col-span-2'>
                                <div className='flex items-start justify-between'>
                                    <div className='flex items-center justify-center h-9 w-9 rounded-lg bg-violet-100 text-violet-600'>
                                        <FileText size={18}/>
                                    </div>
                                    <span className='flex text-[10px] font-semibold text-emerald-500 justify-center items-center gap-1'>
                                        <ArrowUp size={13}/>
                                        22%
                                    </span>
                                </div>
                                <p className='mt-4 text-[11px] font-medium text-slate-400'>Total Applications</p>
                                <p className='mt-1 text-2xl font-bold text-[#11152A]'>{dashboard?.application?.total}</p>
                            </div>
                            <div className='rounded-lg border border-emerald-100 bg-violet-50/30 p-4'>
                                <div className='flex items-start justify-between'>
                                    <div className='flex items-center justify-center h-9 w-9 rounded-lg bg-emerald-100 text-emerald-600'>
                                        <CalendarDays size={18}/>
                                    </div>
                                    <span className='flex text-[10px] font-semibold text-emerald-500 justify-center items-center gap-1'>
                                        <ArrowUp size={13}/>
                                        22%
                                    </span>
                                </div>
                                <p className='mt-4 text-[11px] font-medium text-slate-400'>Total Interview</p>
                                <p className='mt-1 text-2xl font-bold text-[#11152A]'>{dashboard?.interview?.total}</p>
                            </div>
                        </div>
                </section>
            </div>
            <section className='rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(30,41,59,0.03)]'>
                <div className='mb-6 flex items-start justify-between'>
                    <div>
                        <h2 className='font-semibold text-[#11152A]'>Hiring Flow</h2>
                        <p className='mt-1 text-xs text-slate-400'>From job posting to interview — platform conversion</p>
                    </div>
                    <button className='flex gap-1 items-center text-xs font-semibold text-violet-600'>
                        Detailed report
                        <ArrowUpRight size={14}/>
                    </button>
                </div>
                <div className='grid items-center gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]'>
                    <div className='rounded-xl border border-slate-100 bg-slate-50/60 p-5'>
                    <div className='flex items-center gap-3'>
                        <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600'>
                            <BriefcaseBusinessIcon size={20}/>
                        </div>
                        <div>
                            <p className='text-xs text-slate-400'>Jobs Posted</p>
                            <p className='text-xl font-bold text-[#11152A]'>{dashboard?.job?.total}</p>
                        </div>
                    </div>
                    <div className='inline-flex mt-4 rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-semibold text-violet-600'>
                        100% 
                    </div>
                    
                </div>

                <div className='hidden text-center md:block'>
                    <p className='text-xs font-semibold text-violet-600'>74%</p>
                    <ArrowUpRight size={18} className='mx-auto text-violet-500'/>
                </div>
                    <div className='rounded-xl border border-slate-100 bg-slate-50/60 p-5'>
                    <div className='flex items-center gap-3'>
                        <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600'>
                            <BriefcaseBusinessIcon size={20}/>
                        </div>
                        <div>
                            <p className='text-xs text-slate-400'>Applications</p>
                            <p className='text-xl font-bold text-[#11152A]'>{dashboard?.application?.total}</p>
                        </div>
                    </div>
                    <div className='inline-flex mt-4 rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-semibold text-violet-600'>
                        74% 
                    </div>
                </div>
                <div className='hidden text-center md:block'>
                    <p className='text-xs font-semibold text-violet-600'>74%</p>
                    <ArrowUpRight size={18} className='mx-auto text-violet-500'/>
                </div>
                    <div className='rounded-xl border border-slate-100 bg-slate-50/60 p-5'>
                    <div className='flex items-center gap-3'>
                        <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600'>
                            <BriefcaseBusinessIcon size={20}/>
                        </div>
                        <div>
                            <p className='text-xs text-slate-400'>Interviews</p>
                            <p className='text-xl font-bold text-[#11152A]'>{dashboard?.interview?.total}</p>
                        </div>
                    </div>
                    <div className='inline-flex mt-4 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold text-emerald-600'>
                        74% 
                    </div>
                </div>
                </div>
            </section>

            <div className='grid gap-6 lg:grid-cols-2'>
                <section className='rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(30,41,59,0.03)]'>
                    <div className='mb-5 flex items-center justify-between'>
                        <div>
                            <h2 className='font-semibold text-[#11152A]'>Company Verification</h2>
                            <p className='text-slate-400 mt-1 text-xs'>Companies requiring admin attention</p>
                        </div>
                        <span className='rounded-full bg-orange-50 px-3 py-1 text-[10px] font-semibold text-orange-600'>356 pending</span>
                    </div>
                    <div className='space-y-3'>
                        <div className='flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3'>
                            <div className='flex items-center gap-3'>
                                <div className='flex h-9 w-9 items-center justify-center  rounded-full bg-violet-100 text-xs font-bold text-violet-600'>A</div>
                                <div>
                                    <p className='text-sm font-semibold text-[#11152A]'>TechNova Solutions</p>
                                    <p className='text-[10px] text-slate-400'>2 hours ago</p>
                                </div>
                            </div>
                            <div className='flex items-center gap-3'>
                                <div className='bg-orange-100 text-orange-600 rounded-full px-2.5 py-1 text-[9px] font-semibold'>Pending</div>
                                <button className='flex h-7 w-7 border border-slate-200 text-slate-400 hover:border-violet-200 hover:text-violet-600 justify-center items-center rounded-lg'>
                                    <ChevronRight size={14}/>
                                </button>
                            </div>
                        </div>
                        <div className='flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3'>
                            <div className='flex items-center gap-3'>
                                <div className='flex h-9 w-9 items-center justify-center  rounded-full bg-violet-100 text-xs font-bold text-violet-600'>B</div>
                                <div>
                                    <p className='text-sm font-semibold text-[#11152A]'>BrightMind Labs</p>
                                    <p className='text-[10px] text-slate-400'>5 hours ago</p>
                                </div>
                            </div>
                            <div className='flex items-center gap-3'>
                                <div className='bg-orange-100 text-orange-600 rounded-full px-2.5 py-1 text-[9px] font-semibold'>Pending</div>
                                <button className='flex h-7 w-7 border border-slate-200 text-slate-400 hover:border-violet-200 hover:text-violet-600 justify-center items-center rounded-lg'>
                                    <ChevronRight size={14}/>
                                </button>
                            </div>
                        </div>
                        <div className='flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3'>
                            <div className='flex items-center gap-3'>
                                <div className='flex h-9 w-9 items-center justify-center  rounded-full bg-violet-100 text-xs font-bold text-violet-600'>N</div>
                                <div>
                                    <p className='text-sm font-semibold text-[#11152A]'>NextGen Systems</p>
                                    <p className='text-[10px] text-slate-400'>8 hours ago</p>
                                </div>
                            </div>
                            <div className='flex items-center gap-3'>
                                <div className='bg-orange-100 text-orange-600 rounded-full px-2.5 py-1 text-[9px] font-semibold'>Pending</div>
                                <button className='flex h-7 w-7 border border-slate-200 text-slate-400 hover:border-violet-200 hover:text-violet-600 justify-center items-center rounded-lg'>
                                    <ChevronRight size={14}/>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
                <section className='rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(30,41,59,0.03)]'>
                    <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-[#11152A]">
                  Recent Platform Activity
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Latest events across Peer.Hiring
                </p>
              </div>

              <button className="text-xs font-semibold text-violet-600">
                View activity
              </button>
            </div>

            <div className="space-y-5">
                              <div className="flex gap-3">
                                <div className="relative">
                                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                                    <Building2 size={16} />
                                  </div>
                                    <div className="absolute left-1/2 top-9 h-6 w-px -translate-x-1/2 bg-slate-200" />
                                </div>
            
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-[#11152A]">
                                   New company registered
                                  </p>
            
                                  <p className="mt-1 truncate text-[11px] text-slate-400">
                                    TechNova Solutions completed registration
                                  </p>
            
                                  <p className="mt-1 text-[10px] text-slate-300">
                                    2 hours ago
                                  </p>
                                </div>
                              </div>            
                              <div className="flex gap-3">
                                <div className="relative">
                                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                                    <Building2 size={16} />
                                  </div>
                                    <div className="absolute left-1/2 top-9 h-6 w-px -translate-x-1/2 bg-slate-200" />
                                </div>
            
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-[#11152A]">
                                   New company registered
                                  </p>
            
                                  <p className="mt-1 truncate text-[11px] text-slate-400">
                                    TechNova Solutions completed registration
                                  </p>
            
                                  <p className="mt-1 text-[10px] text-slate-300">
                                    2 hours ago
                                  </p>
                                </div>
                              </div>            
                              <div className="flex gap-3">
                                <div className="relative">
                                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                                    <Building2 size={16} />
                                  </div>
                                    <div className="absolute left-1/2 top-9 h-6 w-px -translate-x-1/2 bg-slate-200" />
                                </div>
            
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-[#11152A]">
                                   New company registered
                                  </p>
            
                                  <p className="mt-1 truncate text-[11px] text-slate-400">
                                    TechNova Solutions completed registration
                                  </p>
            
                                  <p className="mt-1 text-[10px] text-slate-300">
                                    2 hours ago
                                  </p>
                                </div>
                              </div>            
                        </div>
                </section>
            </div>
        </div>
    </div>
  )
}

export default AdminDashboardS
