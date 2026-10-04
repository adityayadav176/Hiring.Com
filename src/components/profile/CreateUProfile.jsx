import { BriefcaseBusiness, Check, ExternalLink, GitBranch, GraduationCap, MapPin, Plus, Rocket, Trash, Trash2, UserRound, X } from 'lucide-react'
import React, { useEffect, useState } from "react";
import { FaGithub, FaLinkedin } from 'react-icons/fa';

function CreateUProfile({onClose, open = true, onSubmit, resumes = [], loading = false, initialData = null}) {

    const handleSubmit = async(e) => {
        e.preventDefault();

        setError("");

        if(!form.headline.trim()) {
            setError("Please Add Your Proffession Heading");
            return;
        }

        if(form.skills.length === 0) {
            setError("Please Add Atleast One Skill");
            return;
        }

        const payload = {
            headline: form.headline.trim(),
            bio: form.bio.trim(),
            location: {
                city: form.location.city.trim(),
                state: form.location.state.trim(),
                country: form.location.country.trim() || "India"
            },
            socialLinks: {
                github: form.socialLinks.github.trim(),
                linkedin: form.socialLinks.linkedin.trim(),
                portfolio: form.socialLinks.portfolio.trim(),
            },
            skills: form.skills.map((skill) => ({
                name: skill.name.trim(),
                level: skill.level.trim(),
            })),
            education: form.education.map((item) => ({
                institute: item.institute.trim(),
                degree: item.degree.trim(),
                field: item.field.trim(),
                startYear: item.startYear ? Number(item.startYear) : undefined,
                endYear: item.endYear ? Number(item.endYear) : undefined,
                grade: item.grade.trim(),
            })),
            experience: form.experience.map((item) =>  ({
                company: item.company.trim(),
                position: item.position.trim(),
                employmentType: item.employmentType.trim(),
                startDate: item.startDate || undefined,
                endDate: item.currentlyWorking ? undefined : item.endDate || undefined,
                currentlyWorking: Boolean(item.currentlyWorking),
                description: item.description.trim(),
            })),
            projects: form.projects.map((project) => ({
                title: project.title.trim(),
                description: project.description.trim(),
                githubUrl: project.githubUrl.trim(),
                liveUrl: project.liveUrl.trim(),
                image: {
                    url: project.image?.url || "",
                    public_id: project.image?.public_id || "",
                },
                technologies: project.technologies.filter(Boolean),
                startDate: project.startDate || undefined,
                endDate: project.endDate || undefined,
            })),
            resumeId: form.resumeId || undefined,
            preferences: {
                lookingForJob: form.preferences.lookingForJob,
                preferredJobType: form.preferences.preferredJobType,
                workMode: form.preferences.workMode,
                expectedSalary: {
                    min: form.preferences.expectedSalary.min ? Number(form.preferences.expectedSalary.min) : undefined,
                    max: form.preferences.expectedSalary.max ? Number(form.preferences.expectedSalary.max) : undefined,
                    currency: "INR",
                }
            }
        }
        try {
            if(typeof onSubmit === "function") {
                await onSubmit(payload);
            }
        } catch (error) {
            console.log("Create Profile Error : ", error);
            setError(error?.message || "Unable to save profile");
        }
    } 

    const [editingEducation, setEditingEducation] = useState(null);
    const [editingExperience, setEditingExperience] = useState(null);
    const [editingProject, setEditingProject] = useState(null);

    const [technology, setTechnology] = useState("");
    const [skillName, setSkillName] = useState("");
    const [skillLevel, setSkillLevel] = useState("intermediate");
    const [error, setError] = useState(null);

    const createForm = (data = {}) => ({
        headline: data?.headline || "",
        bio: data?.bio || "",

        location: {
            city: data?.location?.city || "",
            state: data?.location?.state || "",
            country: data?.location?.country || ""
        },

        socialLinks: {
            github: data?.socialLinks?.github || "",
            linkedin: data?.socialLinks?.linkedin || "",
            portfolio: data?.socialLinks?.portfolio || ""
        },

        skills: Array.isArray(data?.skills)
            ? data.skills.map((skill) => ({
                  _id: skill._id || createId(),
                  name: skill.name || "",
                  level: skill.level || "intermediate",
              }))
            : [],

        education: Array.isArray(data?.education)
              ? data.education.map((item) => ({
                _id: item._id || createId(),
                institute: item.institute || "",
                degree: item.degree || "",
                field: item.field || "",
                startYear: item.startYear || "",
                endYear: item.endYear || "",
                grade: item.grade || "",
              })) : [],

        experience: Array.isArray(data?.experience)
              ? data.experience.map((item) => ({
                _id: item._id || createId(),
                company: item.company || "",
                position: item.position || "",
                employmentType: item.employmentType || "full-time",
                startDate: item.startDate || "",
                endDate: item.endDate || "",
                currentlyWorking: item.currentlyWorking || false,
                description: item.description || ""
              })) : [],
 
        projects: Array.isArray(data?.projects)
              ? data.projects.map((item) => ({
                _id: item._id || createId(),
                title: item.title || "",
                description: item.description || "",
                liveUrl: item.liveUrl || "",
                githubUrl: item.githubUrl || "",

                image: {
                    url: item?.image?.url || "",
                    public_id: item?.image?.public_id || "",
                },

                 technologies: Array.isArray(
                      item?.technologies
                  )
                      ? item.technologies
                      : [],

                startDate: item.startDate || "",
                endDate: item.endDate || "",
              })) : [],


        preferences: {
            lookingForJob: data?.preferences?.lookingForJob !== undefined ? data.preferences.lookingForJob : true,

            preferredJobType: data?.preferences?.preferredJobType || "full-time",

            workMode: data?.preferences?.workMode || "remote",

            expectedSalary: {
                min: data?.preferences?.expectedSalary?.min,
                max: data?.preferences?.expectedSalary.max,
                currency: data?.preferences?.expectedSalary?.currency || "INR"
            }
        },

        resumeId: data?.resumeId || ""
    })

    const [form, setForm] = useState(() => createForm(initialData));

    const update = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const updateLocation = (field, value) => {
        setForm((prev) => ({...prev, location: {
            ...prev.location,
            [field]: value,
        }}))
    }

    const updateSocial = (field, value) => {
        setForm((prev) => ({
            ...prev,
            socialLinks: {
                ...prev.socialLinks,
                [field]: value,
            }
        }))
    }

    const updatePreferences = (field, value) => {
        setForm((prev) => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                [field]: value,
            }
        }))
    }

    const updateSalary = (field, value) => {
        setForm((prev) => ({
            ...prev,
            preferences: {
                ...prev.preferences,

                expectedSalary: {
                    ...prev.preferences.expectedSalary,
                    [field]:value
                }
            }
        }))
    }

        const addSkill = () => {
        const name = skillName.trim();

        if (!name) return;

        const exists = form.skills.some(
            (skill) =>
                skill.name.toLowerCase() ===
                name.toLowerCase()
        );

        if (exists) {
            setSkillName("");
            return;
        }

        setForm((prev) => ({
            ...prev,

            skills: [
                ...prev.skills,

                {
                    _id: createId(),
                    name,
                    level: skillLevel,
                },
            ],
        }));

        setSkillName("");
    };

    const removeSkill = (id) => {
        setForm((prev) => ({
            ...prev,

            skills: prev.skills.filter((skill) => skill._id !== id)
        }))
    }

    const addEducation = () => {
        setEditingEducation({
            _id: createId(),
            institute: "",
            degree: "",
            field: "",
            startYear: "",
            endYear: "",
            grade: "",
        })
    }

    const saveEducation = () => {
        if(!editingEducation?.institute?.trim() || !editingEducation?.degree?.trim()) {
            return;
        }

        setForm((prev) => {
            const exists = prev.education.some((item) => item._id === editingEducation._id);

            return {
                ...prev,

                education: exists ? prev.education.map((item) => item._id === editingEducation._id ? editingEducation : item) : [...prev.education, editingEducation],
            }
        })

        setEditingEducation(null);
    }

    const removeEducation = (id) => {
        setForm((prev) => ({
            ...prev,

            education: prev.education.filter((item) => item._id !== id)
        }))
    }


    const addExperience = () => {
        setEditingExperience({
            _id: createId(),
            company: "",
            position: "",
            employmentType: "full-time",
            startDate: "",
            endDate: "",
            currentlyWorking : false,
            description: ""
        });
    };

    const saveExperience = () => {
        if(!editingExperience?.company?.trim() || !editingExperience?.position?.trim()) {
            return;
        }

        const data = {
            ...editingExperience,

            company: editingExperience?.company?.trim(),

            position: editingExperience?.position?.trim(),

            description: editingExperience?.description?.trim(),

            startDate: editingExperience?.startDate?.trim(),

            endDate: editingExperience?.currentlyWorking ? "" : editingExperience.endDate,
        };
        
        setForm((prev) => {
            const exists = prev.experience.some((item) => item._id == data._id);

            return {
                ...prev,

                experience: exists
                    ? prev.experience.map((item) => item._id === data._id ? data : item) : [...prev.experience, data],
            }
        })

        setEditingExperience(null);
    }

    const removeExperience = (id) => {
        setForm((prev) => ({
            ...prev,
            experience: prev.experience.filter((item) => item._id !== id)
        }));
    };

    const addProject = () => {
        setTechnology("");

        setEditingProject({
            _id: createId(),
            title: "",
            description: "",
            githubUrl: "",
            liveUrl: "",

            image: {
                url: "",
                public_id: "",
            },

            technologies: [],

            startDate: "",
            endDate: ""
        });
    }

    const addTechnology = () => {
        const value = technology.trim();

        if(!value || !editingProject) return;

        const exists = editingProject.technologies.some((item) => item.toLowerCase() === value.toLowerCase());

        if(exists) {
            setTechnology("");
            return;
        }

        setEditingProject((prev) => ({
            ...prev,

            technologies: [
                ...prev.technologies,
                value,
            ]
        }))
        setTechnology("");
    }

    const removeTechnology = (value) => {
        setEditingProject((prev) => ({
            ...prev,

            technologies: prev.technologies.filter((item) => item !== value)
        }));
    };

    const saveProject = () => {
        if(!editingProject?.title?.trim()) {
            return;
        }

        const data = {
            ...editingProject,

            title: editingProject.title.trim(),

            description: editingProject.description.trim(),

            githubUrl: editingProject.githubUrl.trim(),

            liveUrl: editingProject.liveUrl.trim(),
        }

        setForm((prev) => {
            const exists = prev.projects.some((item) => item._id === data._id);

            return {
                ...prev,

                projects: exists ? prev.projects.map((item) => item._id === data._id ? data : item) : [...prev.projects, data],
            }
        });

        setEditingProject(null);
        setTechnology("");
    }

    const removeProject = (id) => {
        setForm((prev) => ({
            ...prev,

            projects: prev.projects.filter((item) => item._id !== id)
        }))
    }

    const completion = Math.min(
        100,
        (form.headline.trim() ? 10 : 0) +
        (form.bio.trim() ? 10 : 0) +
        (form.location.city.trim() ? 10 : 0) +
        (form.socialLinks.github.trim() || form.socialLinks.linkedin.trim() || form.socialLinks.portfolio.trim() ? 10 : 0) +
        Math.min(form.skills.length * 5, 20) +
        (form.education.length > 0 ? 15 : 0) + 
        (form.experience.length > 0 ? 10 : 0) +
        (form.projects.length > 0 ? 15 : 0)
    );


    const sectionClass =  `rounded-2xl border border-slate-200 bg-white p-5 sm:p-6`

    const inputClass = `h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-50`

    const textareaClass = `w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-50`;

    const labelClass = `mb-1.5 block text-xs font-semibold text-slate-700`;

   

    useEffect(() => {
        if(initialData) {
            setForm(createForm(initialData));
        }
    }, [initialData]);

    useEffect(() => {
        if(!open) return;

        const handleKeyDown = (e) => {
            if(e.key == "Escape") {
                onClose?.()
            }
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        }
    }, [open, onClose])

    if(!open) return null;
  return (
    <div onMouseDown={(e) => {if(e.target === e.currentTarget) {onClose?.()}}} className='fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-[3px] sm:p-5'>
      <div onMouseDown={(e) => e.stopPropagation()} className='flex h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-[#F8F9FC] shadow-[0_30px_100px_rgba(15,23,42,0.25)]'>
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
                            <span className='text-[11px] font-bold text-violet-600'>{`${completion}%`}</span>
                        </div>
                        <div className='h-1.5 overflow-hidden rounded-full bg-slate-100'>
                            <div style={{width: `${completion}%`}} className='h-full rounded-full bg-violet-600 transition-all duration-300'/>
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
                    <span className='text-[11px] font-bold text-violet-600'>{`${completion}%`}</span>
                </div>

                <div className='h-1.5 overflow-hidden rounded-full bg-slate-100'>
                    <div className='h-full rounded-full bg-violet-600 transition-all duration-300' style={{width: `${completion}%`}}/>
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
                                <p className='mt-0.5 text-xs text-slate-500'>Introduce yourself professionally.</p>
                            </div>
                        </div>
                    </div>

                    <div className='space-y-5'>
                        <div>
                            <label className={labelClass}> Professional headline</label>
                            <input onChange={(e) => update("headline", e.target.value)} value={form.headline} type="text" placeholder="e.g. Full Stack Developer | React & Node.js" className={inputClass}/>
                            <p className='mt-1.5 text-[11px] text-slate-400'>This is the first thing recruiters will see.</p>
                        </div>

                        <div>
                            <label className={labelClass}>About</label>
                            <textarea onChange={(e) => update("bio", e.target.value)} value={form.bio} placeholder='Tell recruiters about your experience, strenghts, interests and career goals...' className={textareaClass}></textarea>
                        </div>

                        <div>
                            <div className='mb-2 flex items-center gap-2'>
                                <MapPin size={14} className='text-violet-600'/>
                                <span className='text-xs font-semibold text-slate-700'>Location</span>
                            </div>

                            <div className='grid gap-3 sm:grid-cols-3'>
                                <input onChange={(e) => updateLocation("city", e.target.value)} value={form.location.city} type="text" className={inputClass} placeholder='City'/>
                                <input onChange={(e) => updateLocation("state", e.target.value)} value={form.location.state} type="text" className={inputClass} placeholder='State'/>
                                <input onChange={(e) => updateLocation("country", e.target.value)} value={form.location.country} type="text" className={inputClass} placeholder='Country'/>
                            </div>

                            <div>
                                <div className='mb-2 flex items-center gap-2'>
                                    <ExternalLink size={14} className="text-violet-600"/>
                                    <span className='text-xs font-semibold text-slate-700'>Proffessional links</span>
                                </div>

                                <div className='grid gap-3 md:grid-cols-3'>
                                    <div className='relative'>
                                        <FaGithub size={14} className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'/>
                                        <input onChange={(e) => updateSocial("github", e.target.value)} value={form.socialLinks.github} type="text" placeholder='Github URL' className={`${inputClass} pl-9`}/>
                                    </div>

                                    <div className='relative'>
                                        <FaLinkedin size={14} className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'/>
                                        <input onChange={(e) => updateSocial("linkedin", e.target.value)} value={form.socialLinks.linkedin} type="text" placeholder='LinkedIn URL' className={`${inputClass} pl-9`}/>
                                    </div>

                                    <div className='relative'>
                                        <ExternalLink size={14} className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'/>
                                        <input onChange={(e) => updateSocial("portfolio", e.target.value)} value={form.socialLinks.portfolio} type="text" placeholder='Portfolio URL' className={`${inputClass} pl-9`}/>
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
                        <input onChange={(e) => setSkillName(e.target.value)} value={skillName} onKeyDown={(e) => {if(e.key === "Enter") {e.preventDefault();    addSkill()}}} type="text" placeholder="e.g. React.js" className={inputClass}/>
                        <select value={skillLevel} onChange={(e) => setSkillLevel(e.target.value)} className={`${inputClass} cursor-pointer`}>
                            <option value="beginner">
                                Beginner
                            </option>
                            <option value="intermediate">
                                Intermediate
                            </option>
                            <option value="expert">
                                Expert
                            </option>
                        </select>

                        <button type="button" onClick={addSkill} className='inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800'>
                            <Plus size={15}/>
                            Add
                        </button>
                    </div>

                    {form.skills.length > 0 ? (
                        <div className='mt-4 flex flex-wrap gap-2'>
                            {form.skills.map((skill) => (
                                <div key={skill._id} className='inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2'>
                                    <span className='text-xs font-semibold text-slate-700'>{skill.name}</span>
                                    <span className='text-[10px] text-slate-400'>{skill.level}</span>
                                    <button onClick={() => removeSkill(skill._id)} type="button" className='text-slate-400 transition hover:text-red-500 '>
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

                        <button onClick={() => addEducation()} type="button" className='inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700'>
                            <Plus size={14}/>
                            Add
                        </button>
                    </div>

                    {editingEducation && (
                        <div className='mt-5 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200'>
                            <div className='grid gap-3 sm:grid-cols-2'>
                                <div className='sm:col-span-2'>
                                    <label className={labelClass}>Institute</label>
                                    <input type="text" onChange={(e) => setEditingEducation(
                                    {
                                        ...editingEducation,
                                        institute: e.target.value
                                    }
                                    )} value={editingEducation.institute} placeholder='Collage / University' className={inputClass}/>
                                </div>

                                <div>
                                    <label className={labelClass}>Degree</label>
                                    <input onChange={(e) => setEditingEducation(
                                        {
                                            ...editingEducation,
                                        degree: e.target.value
                                        }
                                    )} value={editingEducation.degree} type="text" placeholder='B.Tech' className={inputClass}/>
                                </div>

                                <div>
                                    <label className={labelClass}>Field</label>
                                    <input onChange={(e) => setEditingEducation(
                                        {
                                        ...editingEducation,
                                        field: e.target.value
                                    }
                                    )} value={editingEducation.field} type="text" placeholder='Computer Science' className={inputClass}/>
                                </div>

                                <div>
                                    <label className={labelClass}>Start Year</label>
                                    <input onChange={(e) => setEditingEducation(
                                        {
                                        ...editingEducation,
                                        startYear: e.target.value
                                    }
                                    )} value={editingEducation.startYear} type="number" placeholder='2024' className={inputClass}/>
                                </div>

                                <div>
                                    <label className={labelClass}>End year</label>
                                    <input onChange={(e) => setEditingEducation(
                                        {
                                        ...editingEducation,
                                        endYear: e.target.value,
                                    }
                                    )} value={editingEducation.endYear} type="number" placeholder='2028' className={inputClass}/>
                                </div>

                                <div>
                                    <label className={labelClass}>Grade / CGPA</label>
                                    <input onChange={(e) => setEditingEducation(
                                        {
                                        ...editingEducation,
                                        grade: e.target.value
                                    }
                                    )} value={editingEducation.grade} type="text" placeholder='8.2 CGPA' className={inputClass}/>
                                </div>
                            </div>

                            <div className='mt-4 flex justify-end gap-2'>
                                <button onClick={() => setEditingEducation(null)} type="button" className='h-9 rounded-lg px-3 text-xs font-semibold text-slate-600 hover:bg-white' >
                                    Cancel
                                </button>
                                <button onClick={saveEducation} type="button" className='h-9 rounded-lg bg-violet-600 px-4 text-xs font-semibold text-white hover:bg-violet-700'>
                                    Save education
                                </button>
                            </div>
                        </div>
                    )}

                    <div className='mt-4 space-y-2'>
                        {form.education.length > 0 ? (
                            form.education.map((item) => (
                                <div key={item._id} className='flex items-start justify-between gap-4 rounded-xl border border-slate-200 p-4'>
                                    <div>
                                        <p className='text-sm font-semibold text-slate-900'>{item.degree} {item.field ? ` · ${item.field}` : ""}</p>
                                        <p className='mt-1 text-xs text-slate-500'>{item.institute}</p>
                                        <p className='mt-1 text-[11px] text-slate-400'>{item.startYear} {item.endYear ? `— ${item.endYear}` : ""} {item.grade ? ` · ${item.grade}` : ""}</p>
                                    </div>
                                    <button onClick={() => removeEducation(item._id)} type="button" className='shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500'>
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

                        <button type="button" onClick={() => addExperience()} className='inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700'>
                            <Plus size={14}/>
                            Add
                        </button>
                    </div>

                    {editingExperience && (
                        <div className='mt-5 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200'>
                            <div className='grid gap-3 sm:grid-cols-2'>
                                <div>
                                    <label className={labelClass}>Company</label>
                                    <input type="text" onChange={(e) => setEditingExperience({
                                        ...editingExperience,
                                        company: e.target.value
                                    })} value={editingExperience.company} placeholder='Company name' className={inputClass}/>
                                </div>
                                <div>
                                    <label className={labelClass}>Position</label>
                                    <input onChange={(e) => setEditingExperience({
                                        ...editingExperience,
                                        position: e.target.value
                                    })} value={editingExperience.position} type="text" placeholder='Software Developer' className={inputClass}/>
                                </div>
                                <div>
                                    <label className={labelClass}>Emplyment type</label>
                                    <select onChange={(e) => setEditingExperience({
                                        ...editingExperience,
                                        employmentType: e.target.value
                                    })} value={editingExperience.employmentType} className={`${inputClass} cursor-pointer`}>
                                        <option value="full-time">Full-time</option>
                                        <option value="part-time">Part-time</option>
                                        <option value="internship">Internship</option>
                                        <option value="contract">Contract</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Start date</label>
                                    <input onChange={(e) => setEditingExperience({
                                        ...editingExperience,
                                        startDate: e.target.value
                                    })} value={editingExperience.startDate} type="date" className={inputClass}/>
                                </div>

                                {!editingExperience.currentlyWorking && (
                                    <div>
                                        <label>End date</label>
                                        <input onChange={(e) => setEditingExperience({
                                            ...editingExperience,
                                            endDate: e.target.value
                                        })} value={editingExperience.endDate} type="date" className={inputClass}/>
                                    </div>
                                )}
                                
                                <label className='flex h-11 items-center  gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700'>
                                    <input onChange={(e) => setEditingExperience({
                                        ...editingExperience,
                                        currentlyWorking: e.target.checked
                                    })} checked={editingExperience.currentlyWorking} type="checkbox" className='h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500'/>
                                    Currently Working here
                                </label>
                                <div className='sm:col-span-2'>
                                    <label className={labelClass}>
                                        Description
                                    </label>
                                    <textarea onChange={(e) => setEditingExperience({
                                        ...editingExperience,
                                        description: e.target.value
                                    })} value={editingExperience.description} rows={4} placeholder='Describe your responsiblities, achivements and impace...' className={textareaClass}/>
                                </div>
                            </div>
                            <div className='mt-4 flex justify-end gap-2'>
                                <button onClick={() => setEditingExperience(null)} type="button" className='h-9 rounded-lg px-3 text-xs font-semibold text-slate-600 hover:bg-white'>
                                    Cancel
                                </button>
                                <button type="button" onClick={saveExperience} className='h-9 rounded-lg bg-violet-600 px-4 text-xs font-semibold text-white hover:bg-violet-700'>
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
                                            {item.employmentType}
                                            {" . "}
                                            {item.startDate}
                                            {" - "}
                                            {item.currentlyWorking ? "Present" : item.endDate || "Present"}
                                        </p>

                                        {item.description && (
                                            <p className='mt-2 max-w-2xl text-xs leading-5 text-slate-500'>
                                                {item.description}
                                            </p>
                                        )}
                                    </div>

                                    <button onClick={() => removeExperience(item._id)} type="button" className='shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500'>
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

                        <button onClick={() => addProject()} type="button" className='inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700'> 
                            <Plus size={14}/>
                            Add
                        </button>
                    </div>

                    {editingProject && (
                        <div className='mt-5 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200'>
                            <div className='grid gap-3 sm:grid-cols-2'>
                                <div className='sm:col-span-2'>
                                    <label className={labelClass}>Project title</label>
                                    <input onChange={(e) => setEditingProject({
                                        ...editingProject,
                                        title: e.target.value
                                    })} value={editingProject.title} type="text" placeholder='Peer.Hiring' className={inputClass}/>
                                </div>

                                <div className='sm:col-span-2'>
                                    <label className={labelClass}>Description</label>
                                    <textarea rows={4} onChange={(e) => setEditingProject({
                                        ...editingProject,
                                        description: e.target.value
                                    })} value={editingProject.description} placeholder='What dit you build? What problem does it solve?' className={textareaClass}/>
                                </div>

                                <div>
                                    <label className={labelClass}>Github URL</label>
                                    <input onChange={(e) => setEditingProject({
                                        ...editingProject,
                                        githubUrl: e.target.value
                                    })} value={editingProject.githubUrl} type="text" placeholder='https://github.com/...' className={inputClass}/>
                                </div>

                                <div>
                                    <label className={labelClass}>Live URL</label>
                                    <input onChange={(e) => setEditingProject({
                                        ...editingProject,
                                        liveUrl: e.target.value
                                    })} value={editingProject.liveUrl} type="text" className={inputClass} placeholder='https://...'/>
                                </div>

                                <div>
                                    <label className={labelClass}>Start date</label>
                                    <input onChange={(e) => setEditingProject({
                                        ...editingProject,
                                        startDate: e.target.value
                                    })} value={editingProject.startDate} type="date" className={inputClass}/>
                                </div>

                                <div>
                                    <label className={labelClass}>End date</label>
                                    <input onChange={(e) => setEditingProject({
                                        ...editingProject,
                                        endDate: e.target.value
                                    })} value={editingProject.endDate} type="date" className={inputClass}/>
                                </div>

                                <div>
                                    <label className={labelClass}>Technologies</label>
                                    <div className='flex gap-2'>
                                        <input onChange={(e) => setTechnology(e.target.value)} onKeyDown={(e) => {if(e.key === "Enter") {e.preventDefault(); addTechnology();}}} value={technology} type="text" placeholder='React, Node.js, MongoDb' className={`${inputClass} flex-1`}/>
                                        <button onClick={addTechnology} type="button" className=' flex h-11 w-11 shrink-0 rounded-xl bg-slate-900 text-white transition hover:bg-slate-800 items-center justify-center'>
                                            <Plus size={16}/>
                                        </button>
                                    </div>

                                    {editingProject
                                    .technologies
                                    .length >
                                    0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                    {editingProject.technologies.map((item) => (<span key={item} className="inline-flex items-center gap-1.5 rounded-lg bg-violet-50 px-2.5 py-1.5 text-xs font-medium text-violet-700 ">
                                        {item}
                                    <button onClick={() => removeTechnology(item)} type="button">
                                        <X size={12}/>
                                    </button>
                                    </span>
                                    ))}
                                    </div>)}
                                </div>
                            </div>
                            <div className='mt-4 flex justify-end gap-2'>
                                <button onClick={() => {setEditingProject(null); setTechnology("")}} type="button" className='h-9 rounded-lg px-3 text-xs font-semibold text-slate-600 hover:bg-white'>
                                    Cancel                                      
                                </button>
                                <button onClick={saveProject} type="button" className='h-9 rounded-lg bg-violet-600 px-4 text-xs font-semibold text-white hover:bg-violet-700'>
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
                                        {item.description && (
                                            <p className='mt-1 line-clamp-2 text-xs leading-5 text-slate-500'>{item.description}</p>
                                        )}

                                        {item.technologies.length > 0 && (
                                            <div className='mt-2 flex flex-wrap gap-1.5'>
                                                {item.technologies.map((item) => (
                                                    <span key={item} className='rounded-md bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600'>{item}</span>
                                                )
                                                )}
                                            </div>
                                        )}

                                        <div className='mt-2 flex flex-wrap gap-3 text-[11px] font-medium text-violet-600'>
                                            {item.githubUrl && (
                                                <span className='inline-flex items-center gap-1'>
                                                    <GitBranch size={12}/>
                                                    Github
                                                </span>
                                            )}

                                            {item.liveUrl && (
                                                <span className='inline-flex items-center gap-1'>
                                                    <ExternalLink size={12}/>
                                                    Live
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <button onClick={() => removeProject(item._id)} type="button" className='shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500'>
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
                
                <section className={sectionClass}> 
                        <div className='mb-5'>
                            <div className='flex items-center gap-2.5'>    
                                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600'>
                                    <BriefcaseBusiness size={18}/>
                                </div>
                                <div>
                                    <h2 className='text-sm font-bold text-slate-900'>Job preferences</h2>
                                    <p className='mt-0.5 text-xs text-slate-500'>Tell recruiters what kind of opportunity you are looking for.</p>
                                </div>
                            </div>
                        </div>

                        <div className='space-y-5'>
                            <label className='flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4'>
                                <div>
                                    <p className='text-sm font-semibold text-slate-800'>Open to opportunities</p>
                                    <p className='mt-1 text-xs text-slate-500'>Let recruiters know you are currently looking for work.</p>
                                </div>

                                <input checked={form.preferences.lookingForJob} onChange={(e) => updatePreferences("lookingForJob", e.target.checked)} type="checkbox" className='h-5 w-5 rounded border-slate-300 text-violet-600 focus:ring-violet-500'/>
                            </label>

                            <div className='grid gap-3 sm:grid-cols-3'>
                                <div>
                                    <label className={labelClass}>Job Type</label>
                                    <select onChange={(e) => updatePreferences("preferredJobType", e.target.value)} value={form.preferences.preferredJobType} className={`${inputClass} cursor-pointer`}>
                                        <option value="full-time">Full-time</option>
                                        <option value="part-time">Part-time</option>
                                        <option value="internship">Internship</option>
                                        <option value="contract">Contract</option>
                                        <option value="freelance">Freelance</option>
                                    </select>
                                </div>

                                <div>
                                    <label className={labelClass}>Work mode</label>
                                    <select value={form.preferences.workMode} onChange={(e) => updatePreferences("workMode", e.target.value)} className={`${inputClass} cursor-pointer`}>
                                        <option value="remote">Remote</option>
                                        <option value="hybrid">Hybrid</option>
                                        <option value="onsite">On-site</option>
                                    </select>
                                </div>

                                <div>
                                    <label className={labelClass}>Resume</label>
                                    <select value={form.resumeId} onChange={(e) => update("resumeId", e.target.value)} className={`${inputClass} cursor-pointer`}>
                                        <option value="">Select Resume</option>
                                        {resumes.map((resume) => (
                                            <option value={resume._id} key={resume._id}>{resume.name || resume.title || resume.originalName || "Resume"}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Expected salary (INR / year)</label>
                                <div className='grid gap-3 sm:grid-cols-2'>
                                    <input value={form.preferences.expectedSalary.min} onChange={(e) => updateSalary("min", e.target.value)} type="number" placeholder='Minimum' className={inputClass}/>
                                    <input value={form.preferences.expectedSalary.max} onChange={(e) => updateSalary("max", e.target.value)} type="number" placeholder='Maximum' className={inputClass}/>
                                </div>
                            </div>
                        </div>
                </section>
            </div>
        </form>

        <footer className='flex shrink-0 items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3 sm:px-6'>
            <div className='hidden items-center gap-2 text-xs text-slate-500 sm:flex'>
                <Check size={14} className='text-emerald-500'/>
                <span>Your profile is saved securely</span>
            </div>

            <div className='ml-auto flex items-center gap-2'>
                {onClose && (
                    <button type="button" onClick={onClose} className='h-10 rounded-xl px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-100'>
                        Cancel
                    </button>
                )}
                <button form='create-profile-form' disabled={loading} className='inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60' type="submit">
                    {loading ? "Saving..." : "Save profile"}
                </button>
            </div>
        </footer>
      </div>
    </div>
  )
}

export default CreateUProfile

function createId() {
    if (
        typeof crypto !== "undefined" &&
        crypto.randomUUID
    ) {
        return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`;
}