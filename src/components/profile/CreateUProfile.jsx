import { BriefcaseBusiness, ExternalLink, GitBranch, GraduationCap, MapPin, Plus, Rocket, Trash, Trash2, UserRound, X } from 'lucide-react'
import React, { useState } from 'react'
import { FaGithub, FaLinkedin } from 'react-icons/fa';

function CreateUProfile({onClose}) {

    const handleSubmit = () => {
        console.log("Form Submit");
    }

    const sectionClass =  `rounded-2xl border border-slate-200 bg-white p-5 sm:p-6`

    const inputClass = `h-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 textm-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-50`

    const textareaClass = `w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-50`;

    const labelClass = `mb-1.5 block text-xs font-semibold text-slate-700`;

    const [error, setError] = useState(null);
  return (
    <div onMouseDown={(e) => {if(e.target = e.currentTarget) {onClose?.()}}} className='fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-[3px] sm:p-5'>
      <div onMouseDown={(e) => e.stopPropagation()} className='flex h-[95px] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-[#F8F9FC] shadow-[0_30px_100px_rgba(15,23,42,0.25)]'>
        <header className='shrink-0 border-b border-slate-200 bg-white px-5 py-4 sm:px-7'>
            <div className='flex items-center justify-between gap-4'>
                <div className='flex min-w-0 items-center gap-3'>
                    <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm'>
                        <UserRound size={19}/>
                    </div>
                    <div className='min-w-0'>
                        <h1 className='text-base font-bold tracking-tight text-slate-900'>Create your profile</h1>
                        <p className='mt-0.5 text-xs text-slate-500'>Create your profile Build a profile recruiters can discover.</p>
                    </div>
                </div>
                <div className='flex items-center gap-3'>
                    <div className='hidden w-36 sm:block'>
                        <div className='mb-1.5 flex items-center justify-between'>
                            <span className='text-slate-500 text-[11px] font-semibold'>Profile strength</span>
                            <span className='text-[11px] font-bold text-violet-600'>10%</span>
                        </div>
                        <div className='h-1.5 overflow-hidden rounded-full bg-slate-100'>
                            <div style={{width: "10%"}} className='h-full rounded-full bg-violet-600 transition-all duraiton-300'/>
                        </div>
                    </div>

                    {onClose && (
                        <button type="button" onClick={onClose} aria-label="Close profile form" className='flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-violet-100'>  
                            <X size={17}/>
                        </button>
                    )}
                </div>
            </div>

            <div className='mt-4 sm:hidden'>
                <div className='mb-1.5 flex items-center justify-between'>
                    <span className='text-[11px] font-semibold text-slate-500'>Profile strength</span>
                    <span className='text-[11px] font-bold text-violet-600'>10%</span>
                </div>

                <div className='h-1.5 overflow-hidden rounded-full bg-slate-100'>
                    <div className='h-full rounded-full bg-violet-600 transition-all duration-300' style={{width: "10%"}}/>
                </div>
            </div>
        </header>

        <form id='create-profile-form' onSubmit={handleSubmit} className='min-h-0 flex overflow-y-auto'>
            <div className='mx-auto max-w-4xl space-y-5 p-4 sm:p-6 lg:p-7'>
                {error && (
                    <div className='flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-5'>
                        <div className='flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold text-xs text-red-600'>!</div>
                        <p className='text-sm font-medium text-red-700'>{error}</p>
                    </div>
                )}

                <section className={sectionClass}>
                    <div className='mb-6'>
                        <div className='flex items-center gap-2.5'>
                            <div className='flex items-center justify-center h-8 w-8 rounded-lg bg-violet-50 text-violet-600'>
                                <UserRound size={16}/>
                            </div>
                            <div>
                                <h2 className='text-xs font-bold text-slate-900'>About you</h2>
                                <p className='mt-0.5 text-sx text-slate-500'>Introduce yourself professionally.</p>
                            </div>
                        </div>
                    </div>

                    <div className='space-y-5'>
                        <div>
                            <label className={labelClass}> Professional headline</label>
                            <input type="text" placeholder="e.g. Full Stack Developer | React & Node.js" className={inputClass}/>
                            <p className='mt-1.5 text-[11px] text-slate-400'>This is the first thing recruiters will see.</p>
                        </div>

                        <div>
                            <label className={labelClass}>About</label>
                            <textarea placeholder='Tell recruiters about your experience, strenghts, interests and career goals...' className={textareaClass}></textarea>
                        </div>

                        <div>
                            <div className='mb-2 flex items-center gap-2'>
                                <MapPin size={14} className='text-violet-600'/>
                                <span className='text-xs font-semibold text-slate-700'>Location</span>
                            </div>

                            <div className='grid gap-3 sm:grid-cols-3'>
                                <input type="text" className={inputClass} placeholder='City'/>
                                <input type="text" className={inputClass} placeholder='State'/>
                                <input type="text" className={inputClass} placeholder='Country'/>
                            </div>

                            <div>
                                <div className='mb-2 flex items-center gap-2'>
                                    <ExternalLink size={14} className="text-violet-600"/>
                                    <span className='text-xs font-semibold text-slate-700'>Proffessional links</span>
                                </div>

                                <div className='grid gap-3 md:grid-cols-3'>
                                    <div className='relative'>
                                        <FaGithub size={14} className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'/>
                                        <input type="text" placeholder='Github URL' className={`${inputClass} pl-9`}/>
                                    </div>

                                    <div className='relative'>
                                        <FaLinkedin size={14} className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'/>
                                        <input type="text" placeholder='LinkedIn URL' className={`${inputClass} pl-9`}/>
                                    </div>

                                    <div className='relative'>
                                        <ExternalLink size={14} className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'/>
                                        <input type="text" placeholder='Portfolio URL' className={`${inputClass} pl-9`}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className={sectionClass}>
                    <div className='mb-5 flex items-start justify-between gap-4'>
                    <div className='flex items-center gap-2.5'>
                        <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600'>
                            <Rocket size={16}/>
                        </div>

                        <div>
                            <h2 className="text-sm font-bold text-slate-900">Skills</h2>
                            <p className='mt-0.5 text-xs text-slate-500'>Add technologies you can work with.</p>
                        </div>
                    </div>

                    <span className='rounded-full bg-slate-100 px-2.5 py-1 font-bold text-slate-500 text-[11px]'>2</span>
                    </div>
                    <div className='grid gap-2  sm:grid-cols-[1fr_170px_auto]'>
                        <input type="text" placeholder="e.g. React.js" className={inputClass} onKeyDown={(e) => {if(e.key === "Enter") {e.preventDefault();}}}/>
                        <select className={`${inputClass} cursor-pointer`}>
                            <option value="beginner">
                                Beginner
                            </option>
                            <option value="intermediate">
                                Intermediate
                            </option>
                            <option value="advanced">
                                Advanced
                            </option>
                            <option value="expert">
                                Expert
                            </option>
                        </select>

                        <button type="button" className='inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800'>
                            <Plus size={15}/>
                            Add
                        </button>
                    </div>

                    {form.skills.length > 0 ? (
                        <div className='mt-4 flex flex-wrap gap-2'>
                            {form.skills.map((skill) => (
                                <div key={skill._id} className='inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2'>
                                    <span className='text-xs font-semibold text-slate-700'>{skills.name}</span>
                                    <span className='text-[10px] text-slate-400'>{skill.level}</span>
                                    <button type="button" className='text-slate-400 transition hover:text-red-500 '>
                                        <X size={13}/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='mt-4 rounded-xl border border-dashed border-slate-200 px-4 py-7 text-center'>
                            <p className='text-xs font-semibold text-slate-500'>No Skills added yet</p> 
                            <p className='mt-1 text-[11px] text-slate-400'>Add your strongest technologies above.</p>
                        </div>
                    )}
                </section>

                <section className={sectionClass}>
                    <div className='flex items-start justify-between gap-4'>
                        <div className='flex items-center gap-2.5'>
                            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600'>
                                <GraduationCap size={17}/>
                            </div>
                            <div>
                                <h2 className='text-sm font-bold text-slate-900'>Education</h2>
                                <p className='mt-0.5 text-xs text-slate-500'>Add your academic background.</p>
                            </div>
                        </div>

                        <button type="button" className='inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700'>
                            <Plus size={14}/>
                            Add
                        </button>
                    </div>

                    {editingEducation && (
                        <div className='mt-5 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200'>
                            <div className='grid gap-3 sm:grid-cols-2'>
                                <div className='sm:col-span-2'>
                                    <label className={labelClass}>Institute</label>
                                    <input type="text" placeholder='Collage / University' className={inputClass}/>
                                </div>

                                <div>
                                    <label className={labelClass}>Degree</label>
                                    <input type="text" placeholder='B.Tech' className={inputClass}/>
                                </div>

                                <div>
                                    <label className={labelClass}>Field</label>
                                    <input type="text" placeholder='Computer Science' className={inputClass}/>
                                </div>

                                <div>
                                    <label className={labelClass}>Start Year</label>
                                    <input type="number" placeholder='2024' className={inputClass}/>
                                </div>

                                <div>
                                    <label className={labelClass}>End year</label>
                                    <input type="number" placeholder='2028' className={inputClass}/>
                                </div>

                                <div>
                                    <label className={labelClass}>Grade / CGPA</label>
                                    <input type="text" placeholder='8.2 CGPA' className={inputClass}/>
                                </div>
                            </div>

                            <div className='mt-4 flex justify-end gap-2'>
                                <button type="button" className='h-9 rounded-lg px-3 text-xs font-semibold text-slate-600 hover:bg-white' >
                                    Cancel
                                </button>
                                <button type="button" className='h-9 rounded-lg bg-violet-600 px-4 text-xs font-semibold text-white hover:bg-violet-700'>
                                    Save education
                                </button>
                            </div>
                        </div>
                    )}

                    <div className='mt-4 space-y-2'>
                        {form.education.length > 0 ? (
                            form.education.map((item) => (
                                <div key={item._id} className='flex items-start justify-between gap-4 rounded-xl border boder-slate-200 p-4'>
                                    <div>
                                        <p className='text-sm font-semibold text-slate-900'>{item.degree} {item.field ? ` · ${item.field}` : ""}</p>
                                        <p className='mt-1 text-xs text-slate-500'>{item.institute}</p>
                                        <p className='mt-1 text-[11px] text-slate-400'>{item.startYear} {item.endYear ? `— ${item.endYear}` : ""} {item.grade ? ` · ${item.grade}` : ""}</p>
                                    </div>
                                    <button type="button" className='shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500'>
                                        <Trash size={15}/>
                                    </button>
                                </div>
                            ))
                        ) : !editingEducation ? (
                            <div className='rounded-xl border border-dashed border-slate-200 px-4 py-7 text-center text-xs font-medium text-slate-400'>
                                No education
                                added yet
                            </div>
                        ) : null}
                    </div>
                </section> 

                <section className={sectionClass}>
                    <div className='flex items-start justify-between gap-4'>
                        <div className='flex items-center gap-2.5'>
                            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600'>
                                <BriefcaseBusiness size={16}/>
                            </div>
                            <div>
                                <h2 className='text-sm font-bold text-slate-900'>Experience</h2>
                                <p className='mt-0.5 text-xs text-slate-500'>Show your professional experience.</p>
                            </div>
                        </div>

                        <button type="button" className='inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700'>
                            <Plus size={14}/>
                            Add
                        </button>
                    </div>

                    {editingExperience && (
                        <div className='mt-5 rounded-xl bg-slate-50p-4 ring-1 ring-slate-200'>
                            <div className='grid gap-3 sm:grid-cols-2'>
                                <div>
                                    <label className={labelClass}>Company</label>
                                    <input type="text" placeholder='Company name' className={inputClass}/>
                                </div>
                                <div>
                                    <label className={labelClass}>Position</label>
                                    <input type="text" placeholder='Software Developer' className={inputClass}/>
                                </div>
                                <div>
                                    <label className={labelClass}>Emplyment type</label>
                                    <select className={`${inputClass} cursor-pointer`}>
                                        <option value="full-time">Full-time</option>
                                        <option value="part-time">Part-time</option>
                                        <option value="internship">Internship</option>
                                        <option value="contract">Contract</option>
                                        <option value="freelance">Freelance</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Start date</label>
                                    <input type="date" className={inputClass}/>
                                </div>

                                {!editingExperience.currentWorking && (
                                    <div>
                                        <label>End date</label>
                                        <input type="date" className={inputClass}/>
                                    </div>
                                )}
                                
                                <label className='flex h-11 items-center  gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700'>
                                    <input type="checkbox" className='h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500'/>
                                    Currently Working here
                                </label>
                                <div className='sm:col-span-2'>
                                    <label className={labelClass}>
                                        Description
                                    </label>
                                    <textarea rows={4} placeholder='Describe your responsiblities, achivements and impace...' className={textareaClass}/>
                                </div>
                            </div>
                            <div className='mt-4 flex justify-end gap-2'>
                                <button type="button" className='h-9 rounded-lg px-3 text-xs font-semibold text-slate-600 hover:bg-white'>
                                    Cancel
                                </button>
                                <button className='h-9 rounded-lg bg-violet-600 px-4 text-xs font-semibold text-white hover:bg-violet-700'>
                                    Save experience
                                </button>
                            </div>
                        </div>
                    )}

                    <div className='mt-4 space-y-2'>
                        {form.experience.length > 0 ? (
                            form.experience.map((item) => (
                                <div className='flex items-start justify-between gap-4 rounded-xl border border-slate-200 p-4' key={item._id}>
                                    <div>
                                        <p className='text-sm font-semibold text-slate-900'>{item.position}</p>
                                        <p className='mt-1 text-xs font-medium text-slate-600'>{item.company}</p>
                                        <p className='mt-1 text-[11px] text-slate-400'>
                                            {item.emplymentType}
                                            {" . "}
                                            {item.startdate}
                                            {" - "}
                                            {item.currentlyWorking ? "Present" : item.endDate || "Present"}
                                        </p>

                                        {item.description && (
                                            <p className='mt-2 max-w-2xl text-xs leading-5 text-slate-500'>
                                                {item.description}
                                            </p>
                                        )}
                                    </div>

                                    <button type="button" className='shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500'>
                                        <Trash2 size={15}/>
                                    </button>
                                </div>
                            ))
                        ) : !editingExperience ? (
                            <div className='rounded-xl border border-dashed border-slate-200 px-4 py-7 text-center text-xs font-medium text-slate-400'>
                                No experience added yet
                            </div>
                        ) : null}
                    </div>
                </section>

                <section className={sectionClass}>
                    <div className='flex items-start justify-between gap-4'>
                        <div className='flex items-center gap-2.5'>
                            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600'>
                                <Rocket size={16}/>
                            </div>

                            <div>
                                <h2 className='text-sm font-bold text-slate-900'>Project</h2>
                                <p className='mt-0.5 text-xs text-slate-500'>Highlight work the proves your skills.</p>
                            </div>
                        </div>

                        <button type="button" className='inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700'> 
                            <Plus size={14}/>
                            Add
                        </button>
                    </div>

                    {editingProject && (
                        <div className='mt-5 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200'>
                            <div className='grid gap-3 sm:grid-cols-2'>
                                <div className='sm:col-span-2'>
                                    <label className={labelClass}>Project title</label>
                                    <input type="text" placeholder='Peer.Hiring' className={inputClass}/>
                                </div>

                                <div className='sm:col-span-2'>
                                    <label className={labelClass}>Description</label>
                                    <textarea rows={4} placeholder='What dit you build? What problem does it solve?' className={textareaClass}/>
                                </div>

                                <div>
                                    <label className={labelClass}>Github URL</label>
                                    <input type="text" placeholder='https://github.com/...' className={inputClass}/>
                                </div>

                                <div>
                                    <label className={labelClass}>Live URL</label>
                                    <input type="text" className={inputClass} placeholder='https://...'/>
                                </div>

                                <div>
                                    <label className={labelClass}>Start date</label>
                                    <input type="date" className={inputClass}/>
                                </div>

                                <div>
                                    <label className={labelClass}>End date</label>
                                    <input type="date" className={inputClass}/>
                                </div>

                                <div>
                                    <label className={labelClass}>Technologies</label>
                                    <div className='flex gap-2'>
                                        <input type="text" placeholder='React, Node.js, MongoDb' className={`${inputClass} flex-1`}/>
                                        <button type="button" className='h-11 w-11 shrink-0 rounded-xl bg-slate-900 text-white transition hover:bg-slate-800'>
                                            <Plus size={16}/>
                                        </button>
                                    </div>

                                    {editingProject
                                                                                    .technologies
                                                                                    .length >
                                                                                    0 && (
                                                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                                                        {editingProject.technologies.map(
                                                                                            (
                                                                                                item
                                                                                            ) => (
                                                                                                <span
                                                                                                    key={
                                                                                                        item
                                                                                                    }
                                                                                                    className="
                                                                                                        inline-flex
                                                                                                        items-center
                                                                                                        gap-1.5
                                                                                                        rounded-lg
                                                                                                        bg-violet-50
                                                                                                        px-2.5
                                                                                                        py-1.5
                                                                                                        text-xs
                                                                                                        font-medium
                                                                                                        text-violet-700
                                                                                                    "
                                                                                                >
                                                                                                    {
                                                                                                        item
                                                                                                    }
                                    
                                                                                                    <button
                                                                                                        type="button"
                                                                                                        onClick={() =>
                                                                                                            removeTechnology(
                                                                                                                item
                                                                                                            )
                                                                                                        }
                                                                                                    >
                                                                                                        <X
                                                                                                            size={
                                                                                                                12
                                                                                                            }
                                                                                                        />
                                                                                                    </button>
                                                                                                </span>
                                                                                            )
                                                                                        )}
                                                                                    </div>
                                                                                )}
                                </div>
                            </div>
                            <div className='mt-4 flex justify-end gap-2'>
                                <button type="button" className='h-9 rounded-lg px-3 text-xs font-semibold text-slate-600 hover:bg-white'>
                                    Cancel                                      
                                </button>
                                <button type="button" className='h-9 rounded-lg bg-violet-600 px-4 text-xs font-semibold text-white hover:bg-violet-700'>
                                     Save Project                                           
                                </button>
                            </div>
                        </div>
                    )}

                    <div className='mt-4 space-y-2'>
                        {form.projects.length > 0 ? (
                            form.projects.map((item) => (
                                <div className='flex items-start justify-between gap-4 rounded-xl border border-slate-200 p-4' key={item._id}>
                                    <div className='min-w-0'>
                                        <p className='text-sm font-semibold text-slate-900'>{item.title}</p>
                                        {project.description && (
                                            <p className='mt-1 line-clamp-2 text-xs leading5 text-slate-500'>{item.description}</p>
                                        )}

                                        {project.technologies.length > 0 && (
                                            <div className='mt-2 flex flex-wrap gap-1.5'>
                                                {project.technologies.map((item) => (
                                                    <span key={item} className='rounded-md bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600'>{item}</span>
                                                )
                                                )}
                                            </div>
                                        )}

                                        <div className='mt-2 flex fle-wrap gap-3 text-[11px] font-medium text-violet-600'>
                                            {project.githubUrl && (
                                                <span className='inline-flex items-center gap-1'>
                                                    <GitBranch size={12}/>
                                                    Github
                                                </span>
                                            )}

                                            {project.LiveUrl && (
                                                <span className='inline-flex items-center gap-1'>
                                                    <ExternalLink size={12}/>
                                                    Live
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <button type="button" className='shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500'>
                                            <Trash size={15}/>
                                    </button>
                                </div>
                            ))
                        ) : !editingProject ? (
                            <div className='rounded-xl border border-dashed border-slate-200 px-4 py-7 text-center text-xs font-medium text-slate-400'>
                                No Project added yet
                            </div>
                        ) : null}
                    </div>
                </section>
            </div>
        </form>
      </div>
    </div>
  )
}

export default CreateUProfile
