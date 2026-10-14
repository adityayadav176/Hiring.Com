import { AlertCircle, ArrowLeft, ArrowRight, BriefcaseBusiness, Building2, CalendarDays, Check, CheckCircle2, Circle, CircleDollarSign, Clock3, ExternalLink, FileText, LoaderCircle, MapPin, MessageSquareCheck, MessageSquareText, Send, ShieldCheck, Sparkle, Sparkles, Upload, X } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import {useApplication, useResume} from "../../hooks/Hook"

function ApplyJob({job, resumes, onClose, onSuccess}) {
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [previewResume, setPreviewResume] = useState(null);
  const [selectedResumeId, setSelectedResumeId] = useState("");

  const {handleApplyForAJob} = useApplication();

  const activeResumes = useMemo(() => Array.isArray(resumes) ? resumes.filter((resume) => resume && resume.isDeleted !== true): [], [resumes]);

  useEffect(() => {
    setSelectedResumeId((current) => {
      if(current && activeResumes.some((resume) => String(resume._id) === current)) {
        return current;
      }

      const preferred = activeResumes.find((resume) => resume.isDefault);
      return preferred ? String(preferred._id) : activeResumes[0] ? String(activeResumes[0]._id) : "";
    })
  },[activeResumes])

  useEffect(() => {
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if(e.key === "Escape") {
        if(previewResume) {
          setPreviewResume(null);
        } else if(!loading) {
          onClose?.()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    }
  }, [previewResume, loading, onClose])

  const selectedResume = activeResumes.find((resume) => String(resume._id) === selectedResumeId);
  const company = job?.companyId && typeof job?.companyId === "object" ? job.companyId : job?.company && typeof job?.company === "object" ? job?.company : [];
  const companyName = company?.name ? company.name : "Hiring company";
  const companyLogo = company?.logo || "";
  const jobTitle = job?.title || "Job Opportunity";

  console.log(selectedResume?.resume?.url);

  const location = (() => {
    const value = job?.location ?? null

    if(typeof value === "string") {
      return value.trim() || "Location Not Specified";
    }

    if(value && typeof value === "object") {
      const parts = [
        value.city,
        value.state,
        value.country
      ].filter((part) => typeof part === "string" && part.trim());

      return parts.length ? [...new Set(parts)].join(", ") : value.address || value.name || "Location Not Specified";
    } 

    return "Location Not Specified"
  })()

  const employmentType = job?.employmentType || "FULL_TIME"

  const salary = (() => {
    const value = job?.salary ?? "";

    if(typeof value === "string") return value;

    if(typeof value === "number") {
      return `₹${value.toLocaleString("en-IN")}`;
    }

    if(value && typeof value === "object") {
      const min = value?.min || null
      const max = value?.max || null

      if(min !== null && max !== null) {
        return `₹${Number(min).toLocaleString("en-IN")} – ₹${Number(max).toLocaleString("en-IN")}`;
      }

      if(min !== null) {
          return `From ₹${Number(min).toLocaleString("en-IN")}`;
      }

      if(max !== null) {
        return `Up to ₹${Number(max).toLocaleString("en-IN")}`
      }
    }
  })();

  const description =
  typeof job?.description === "string" && job.description.trim()
    ? job.description
    : "Review the job description to understand the role and its expectations.";

  const rawSkills = Array.isArray(job?.skills) ? job?.skills : [];

  const skills = rawSkills.map((skill) => typeof skill === "string" ? skill : "");

  const rawResponsibilities = Array.isArray(job?.responsibilities) ? job?.responsibilities : [];

  const responsibilities = rawResponsibilities.map((item) => typeof item === "string" ? item : "");

  const deadline = job?.applicationDeadline || null;

  const formattedDeadline = (() => {
  if (!deadline) return "Application Open";

  const date = new Date(deadline);

  if (Number.isNaN(date.getTime())) {
    return "Application Open";
  }

  return `Apply before ${date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;
})();

  const resumeUrl = (resume) => {
    return resume?.resume?.url || ""
  };

  const resumeSkills = (resume) => {
    return Array.isArray(resume?.skills) ? resume.skills.map((skill) => typeof skill === "string" ? skill : "") : []; 
  }

  const formatUpdatedDate = (date) => {
    if(!date) return "Saved Resume";

    const parsed = new Date(date);

    if(Number.isNaN(parsed.getTime())) {
      return "Saved Resume";
    }

    return `Update ${parsed.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    })}`;
  }

  const formatFileSize = (bytes) => {
      if(bytes == null || !Number.isFinite(Number(bytes))) {
        return "";
      }

      const size = Number(bytes);

    if (size >= 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }

    if (size >= 1024) {
      return `${Math.round(size / 1024)} KB`;
    }

    return `${size} bytes`;
  }

  const handleNext = () => {
    setError("");

    if(step == 1) {
      if(!activeResumes.length) {
        setError("Create or upload a resume before applying for this job.");
        return;
      }

      if(!selectedResume || !selectedResumeId) {
        setError("Please select a resume to continue.");
        return;
      }
    }

    setStep((current) => Math.min(current + 1, 3));
  }


const handleApply = async () => {
  setError("");

  if (!job?._id) {
    setError("Job information is missing. Please try again.");
    return;
  }

  if (!selectedResume || !selectedResumeId) {
    setError("Please select an available resume.");
    setStep(1);
    return;
  }

  try {
    setLoading(true);

    const application = await handleApplyForAJob({
      jobId: job._id,
      resumeId: selectedResumeId,
      MessageToRecruiter: message,
    });

    setSuccess(true);
    onSuccess?.(application);
  } catch (error) {
    setError(
      error?.message ||
        "Something went wrong. Please try again later."
    );
  } finally {
    setLoading(false);
  }
};


  const steps = [
    {id: 1, label: "Select Resume", icon: FileText},
    {id: 2, label: "Application Details", icon: MessageSquareText},
    {id: 3, label: "Review & Submit", icon: CheckCircle2},
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
              <strong className="text-slate-800">{jobTitle}</strong> at {" "}
              <strong className="text-slate-800">{companyName}</strong>{" "}
              has been submitted.
            </p>
                <div className='mt-6 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 text-left'>
                  <div className='flex items-center gap-3'>
                    <FileText size={22} className=' shrink-0 text-emerald-700'/>
                    <div className='min-w-0'>
                      <p className='text-sm truncate font-semibold text-slate-800'>{selectedResume?.title ||  "Selected Resume"}</p>
                      <p className='mt-1 text-xs text-slate-500'>Included with your application</p>
                    </div>
                  </div>
                </div>
                <button type="button" onClick={onClose} className='mt-6 rounded-lg bg-violet-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-800'>
                    Done
                </button>
            </section>
          ) : (
            <>
            <div className='mb-5'>
              <button type="button" onClick={onClose} className='mb-3 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-violet-700'>
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
                              {companyLogo ? (
                          <img src={companyLogo}  alt={`${companyName} logo`} className="h-full w-full object-cover" />
                        ) : (<Building2 size={22}/>)}
                          </div>
                          <div className='min-w-0'>
                              <h3 className='truncate text-sm font-bold text-slate-900'>{companyName}</h3>
                              <p className='mt-0.5 text-xs text-slate-500'>Job opportunity</p>
                          </div>
                      </div>
                      <h2 className='mt-5 text-lg font-bold leading-6 tracking-tight text-slate-900'>{jobTitle}</h2>
                      <div className='mt-4 flex flex-wrap gap-2'>
                          <span className='rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-slate-600'>{employmentType}</span>
                          {job?.workSpaceType && (<span className='rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-slate-600'>{job?.workSpaceType}</span>)}
                      </div>
                  </div>
                  <div className='p-4 sm:p-5'>
                      <div className='space-y-3.5'>
                          <div className='flex items-start gap-2.5'>
                              <MapPin size={16} className='mt-0.5 shrink-0 text-slate-400'/>
                              <div className='min-w-0'>
                                  <p className='text-[11px] text-slate-400'>Location</p>
                                  <p className='mt-0.5 break-words text-xs font-medium leading-5 text-slate-700'>{location}</p>
                              </div>
                          </div>
                          {salary && (
                            <div className='flex items-start gap-2.5'>
                              <CircleDollarSign size={16} className='mt-0.5 shrink-0 text-slate-400'/>
                              <div className='min-w-0'>
                                  <p className='text-[11px] text-slate-400'>Compensation</p>
                                  <p className='mt-0.5 break-words text-xs font-medium leading-5 text-slate-700'>{salary}</p>
                              </div>
                          </div>
                          )}
                          <div className='flex items-start gap-2.5'>
                              <CalendarDays size={16} className='mt-0.5 shrink-0 text-slate-400'/>
                              <div className='min-w-0'>
                                  <p className='text-[11px] text-slate-400'>Application deadline</p>
                                  <p className='mt-0.5 break-words text-xs font-medium leading-5 text-slate-700'>{formattedDeadline}</p>
                              </div>
                          </div>
                          <div className='my-5 h-px bg-slate-200'/>
                          <section>
                            <h3 className='text-xs font-bold text-slate-900'>About the role</h3>
                            <p className='mt-2 whitespace-pre-line text-xs leading-5 text-slate-600'>{description.length > 650 ? `${description.slice(0, 650)}...` : description}</p>
                          </section>
                          {responsibilities.length > 0 && (
                              <section className='mt-5'>
                            <h3 className='text-xs font-bold text-slate-900'>Key responsibilities</h3>
                            <ul className='mt-3 space-y-2.5'>
                              {responsibilities.slice(0, 6).map((item, index) => (
                                <li key={`${item}-${index}`} className='flex items-start gap-2 text-xs leading-5 text-slate-600'>
                                <CheckCircle2 className='mt-0.5 shrink-0 text-violet-600' size={14}/>
                                <span>{item}</span>
                              </li>
                              ))}
                            </ul>
                          </section>
                          )}
                          
                          {skills.length > 0 && (
                              <section>
                                 <h3 className='text-xs font-bold text-slate-900'>Required skills</h3>
                                 <div className='mt-2.5 flex flex-wrap gap-1.5'>
                                  {skills.slice(1, 12).map((skill, index) => (
                                    <span  key={`${skill}-${index}`} className='rounded-md border border-violet-100 bg-violet-50 px-2 py-1 text-[10px] font-medium text-violet-700' >{skill}</span>
                                  ))}
                                 </div>
                              </section>
                            )}
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
                              <h2 className='mt-1 text-base font-bold text-slate-900'>{steps[step - 1].label}</h2>
                            </div>
                            <span className='shrink-0 rounded-lg bg-slate-100 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600'> Step {step} of 3</span>
                        </div>
                        <div className='mt-4 grid grid-cols-3 gap-2'>
                            {steps.map((item) => {
                              const active = item.id === step;
                              const complete = item.id < step;

                              return (
                                <button type="button" key={item.id} onClick={() => {if(item.id < step) {setError(""); setStep(item.id)}}} disabled={item.id >= step} className='min-w-0 text-left disabled:cursor-default'>
                                    <div className={`h-1 rounded-full ${active || complete ? "bg-violet-600" : "bg-slate-100"}`}/>
                                    <p className={`mt-2 truncate text-[10px] font-semibold sm:text-[11px] ${active ? "text-violet-700" : complete ? "text-slate-700" : "text-slate-400"}`}>{item.label}</p>
                                </button>
                              );
                            })}
                        </div>
                    </div>

                    <div className='min-w-0 p-4 sm:p-5'>
                          {step === 1 && (
                            <>
                              <div className='flex items-start gap-3'>
                                <div className='flex h-9 w-9 items-center justify-center shrink-0 rounded-lg bg-violet-100 text-violet-700'>
                                  <FileText size={19}/>
                                </div>
                                <div className=''>
                                  <h3 className='text-sm font-bold text-slate-900'>Choose your resume</h3>
                                  <p className='mt-1 text-xs leading-1 text-slate-500'>Select the version that best matches this position.</p>
                                </div>
                              </div>
                              {activeResumes.length === 0 ? (
                                <div className='mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center'>
                                  <div className='flex items-center justify-center mx-auto h-12 w-12 rounded-xl bg-violet-100 text-violet-700'>
                                      <Upload size={22}/>
                                  </div>
                                  <h3 className='mt-3 text-sm font-bold text-slate-900'>No saved resumes yet</h3>
                                  <p className='mx-auto mt-2 max-w-sm text-slate-500 text-sm leading-5'>Create or upload a resume in your Peer.Hiring resume section, then return here to apply.</p>
                                </div>
                              ) : (
                                <div className='mt-5 space-y-3'>
                                    {activeResumes.map((resume) => {const selected = String(resume._id) === selectedResumeId;
                                      const items = resumeSkills(resume);
                                      const size = formatFileSize(resume.resume?.sizeBytes ??
                                resume.sizeBytes ??
                                resume.fileSize)

                                return (
                                  <button type="button" key={resume._id} onClick={() => {setSelectedResumeId(String(resume._id)); setError("")}} className={`group w-full rounded-xl border p-3.5 text-left transition ${selected ? "border-violet-500 bg-violet-50/60 ring-1 ring-violet-100" : "border-slate-200 hover:border-violet-300 hover:bg-slate-50/70"}`}>
                                      <div className='flex items-start gap-3'>
                                          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${selected ? "bg-violet-100 text-violet-700" : "bg-slate-100 text-slate-500"}`}>
                                              <FileText size={21}/>
                                          </div>
                                          <div className='min-w-0 flex-1'>
                                              <div className='flex flex-wrap items-center gap-2'>
                                                <p className='break-words text-xs font-bold text-slate-900 sm:text-sm'>{resume?.title || "My Resume"}</p>
                                                {resume.isDefault && (
                                                  <span className='rounded-full bg-violet-100 px-2 py-0.5 text-[9px] font-bold text-violet-700'>
                                                      DEFAULT
                                                  </span>
                                                )}
                                              </div>
                                              {resume.target && (
                                                <p className='mt-1 text-[11px] text-slate-500'>{resume?.target}</p>
                                              )}
                                              <p className='mt-2 break-words text-[11px] leading-5 text-slate-500'>
                                                {items.length ? items.slice(0, 5).join(" . ") : resume.subTitle || "Saved Resume"}
                                              </p>
                                              <div className='mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] text-slate-400'>
                                                <span className='flex items-center gap-1'>
                                                  <Clock3 size={12}/>
                                                  {formatUpdatedDate(resume.updatedAt)}
                                                </span>
                                                {size && <span>{size}</span>}

                                                {resume.version && (
                                        <span>v{resume.version}</span>
                                      )}
                                              </div>

                                              {resumeUrl(resume) && (
                                                <span role="button" tabIndex={0} onClick={(e) => {e.stopPropagation(); setPreviewResume(resume)}} onKeyDown={(e) => {if(e.key === "Enter" || e.key === " ") {e.stopPropagation(); e.preventDefault(); setPreviewResume(resume)}}} className='mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-violet-700 hover:text-violet-900'>
                                                    Preview resume
                                                    <ExternalLink size={12}/>
                                                </span>
                                              )}
                                          </div>
                                          <div className='shrink-0 pt-0.5'>
                                              {selected ? (
                                                <span className='flex h-5 w-5 items-center justify-center rounded-full bg-violet-700 text-white'>
                                                    <Check size={13}/>
                                                </span>
                                              ): (
                                                <Circle size={20} className='text-slate-300 transition group-hover:text-violet-400'/>
                                              )}
                                          </div>
                                      </div>
                                  </button> 
                                )
                                    })}
                                </div>
                              )}
                              <div className='mt-5 flex items-start gap-2.5 rounded-lg bg-slate-50 p-3.5'>
                                  <ShieldCheck className='mt-0.5 shrink-0 text-violet-700' size={16}/>
                                  <p className='text-[11px] leading-5 text-slate-500'>Your selected resume will be attached to your application and shared with the hiring company.</p>
                              </div>
                            </>
                          )}
                          {step === 2 && (
                            <>
                              <div className='flex items-start gap-3'>
                                <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700'>
                                    <MessageSquareText size={19}/>
                                </div>
                                <div>
                                  <h3 className='text-sm font-bold text-slate-900'>Introduce yourself</h3>
                                  <p className='mt-1 text-xs leading-5 text-slate-500'> A short, relevant note can help the recruiter understand your interest.</p>
                                </div>
                              </div>

                              <div className='mt-5 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5'>
                                  <div className='flex h-9 w-9 items-center justify-center rounded-lg shrink-0 bg-violet-100 text-violet-700'>
                                      <FileText size={19}/>
                                  </div>
                                  <div className='min-w-0 flex-1'>
                                      <p className='truncate text-xs font-bold text-slate-800'>{selectedResume?.title || "Selected resume"}</p>
                                      <p className="mt-1 text-[11px] text-slate-500">
                            Attached to this application
                          </p>
                                  </div>
                                  <button type="button" onClick={() => {setError(""); setStep(1)}} className='text-[11px] font-semibold text-violet-700'>
                                      Change
                                  </button>
                              </div>

                              <div className='mt-5'>
                                  <div className='flex items-center justify-between gap-3'>
                                      <label htmlFor="application-message" className='text-xs font-bold text-slate-800'>Message to recruiter</label>
                                      <span className="text-[10px] text-slate-400">Optional</span>
                                  </div>
                                  <textarea
                                  id="application-message"
                                  value={message}
                                  onChange={(e) => {setMessage(e.target.value.slice(0, 500)); setError("")}}
                                  placeholder={`Hi, I'm excited to apply for the ${jobTitle} position. My skills and projects align with this role, and I'd welcome the opportunity to contribute to your team.`}
                                  rows={7}
                                  maxLength={500}
                                  className="mt-2.5 w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-xs leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                                  />
                                  <div className='mt-2 flex items-center justify-between gap-3 text-[10px] text-slate-400'>
                                      <span>Keep it clear and professional.</span>
                                      <span>{message.length}/500</span>
                                  </div>
                              </div>
                              <div className='mt-5 rounded-lg border border-violet-100 bg-violet-50/70 p-3.5'>
                                <div className='flex items-start gap-2.5'>
                                    <Sparkles size={16} className='mt-0.5 shrink-0 text-violet-700'/>
                                </div>
                                <p className='text-xs font-semibold text-violet-900'>Tip for a stronger application</p>
                                <p className='mt-1 text-[11px] leading-5 text-violet-800/80'>Mention a relevant project, technical skill, or result that connects your experience to this role.</p>
                              </div>
                            </>
                          )}
                          {step === 3 && (
                            <>
                              <div className='flex items-start gap-3'>
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
                                      <CheckCircle2 size={19} />
                                </div>
                                <div>
                                  <h3 className='text-sm font-bold text-slate-900'>Review before submitting</h3>
                                  <p className='mt-1 text-xs leading-5 text-slate-500'>Check your application details one last time.</p>
                                </div>
                              </div>
                              <div className='mt-5 divide-y divide-slate-100 rounded-xl border border-slate-200'>
                                <div className='flex items-start gap-3 p-4'>
                                    <BriefcaseBusiness size={18} className='mt-0.5 shrink-0 text-violet-700'/>
                                    <div className='min-w-0 flex-1'>
                                      <p className='text-[10px] font-medium text-slate-400'>Position</p>
                                      <p className='mt-1 break-words text-xs font-bold text-slate-900'>{jobTitle}</p>
                                      <p className='mt-1 text-[11px] leading-5 text-slate-500'>{companyName} · {location}</p>
                                      <button type="button" onClick={() => {setError(""); setStep(1)}} className='mt-2 text-[11px] font-semibold text-violet-700'>
                                          Edit selection
                                      </button>
                                    </div>
                                </div>
                                <div className='flex items-start gap-3 p-4'>
                                    <FileText className='mt-0.5 shrink-0 text-violet-700' size={18}/>
                                    <div className='min-w-0 flex-1'>
                                      <p className='text-[10px] font-medium text-slate-400'>Resume</p>
                                      <p className='mt-1 break-words text-xs font-bold text-slate-900'>{selectedResume?.title || "No resume selected"}</p>
                                      <p className='mt-1 text-[11px] text-slate-500'>{selectedResume?.target || selectedResume?.subtitle || "Selected application resume"}</p>
                                      <button type="button" onClick={() => {setError(""); setStep(1)}} className='mt-2 text-[11px] font-semibold text-violet-700'>
                                          Change resume
                                      </button>
                                    </div>
                                </div>
                                <div className='flex items-start gap-3 p-4'>
                                    <MessageSquareText size={18} className='mt-0.5 shrink-0 text-violet-700'/>
                                    <div className='min-w-0 flex-1'>
                                      <p className='text-slate-400 font-medium text-[10px]'>Recruiter message</p>
                                      <p className='mt-1 whitespace-pre-wrap break-words text-xs leading-5 text-slate-600'>{message.trim() || "No additional message provided."}</p>
                                      <button type="button" onClick={() => {setError(""); setStep(1)}} className='mt-2 text-[11px] font-semibold text-violet-700'>Edit Message</button>
                                    </div>
                                </div>
                              </div>
                              <div className='mt-4 flex items-start gap-2.5 rounded-lg bg-slate-50 p-3.5'>
                                <ShieldCheck size={16} className='mt-0.5 shrink-0 text-violet-700'/>
                                <p className='text-[11px] leading-5 text-slate-500'>By submitting, you confirm that your application information is accurate and that you want to apply for this position.</p>
                              </div>
                            </>
                          )}

                          {error && (
                            <div role='alert' className='mt-4 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-700'>
                                <AlertCircle size={16} className='mt-0.5 shrink-0'/>
                                <span>{error}</span>
                            </div>
                          )}
                    </div>
                    <footer className=' sticky bottom-0 mt-auto border-t border-slate-100 bg-white px-4 py-3.5 sm:px-5'>
                        <div className='flex items-center justify-between gap-3'>
                            <button type="button" onClick={() => {if(step > 1) {setError(""); setStep((current) => current - 1)} else {onClose?.()}}} disabled={loading} className='inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50'>
                              {step > 1 && <ArrowLeft size={14}/>}
                              {step > 1 ? "Back" : "Cancle"} 
                            </button>
                            {step < 3 ? (
                              <button type="button" onClick={handleNext} disabled={step === 1  && !selectedResumeId} className='inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-violet-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-50 sm:px-5'>
                                  {step === 1 ? "Application details" : "Review details"}
                                  <ArrowRight size={15}/>
                              </button>
                            ): (
                              <button type="button" onClick={handleApply} disabled={loading || !selectedResumeId} className='inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-violet-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-50 sm:px-5'>
                                  {loading ? (
                                    <>
                                    <LoaderCircle size={15} className='animate-spin'/>
                                    Submitting
                                    </>
                                  ) : (
                                    <>
                                      <Send size={14}/>
                                      Submit Application
                                    </>
                                  )}
                              </button>
                            )}
                        </div>
                    </footer>
                </section>

                <aside className='min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm'>
                    <div className='flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-4'>
                          <div>
                            <h2 className='text-sm font-bold text-slate-900'>Resume preview</h2>
                            <p className='mt-1 text-[11px] text-slate-500'>Preview your selected document</p>
                          </div>
                          {selectedResume && resumeUrl(selectedResume) && (
                            <a href={resumeUrl(selectedResume)} target="_blank" rel="noreferrer" className='inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-violet-700 hover:text-violet-900'>
                              Open
                              <ExternalLink size={13}/>
                            </a>
                          )}
                    </div>
                    {selectedResume ? (
                      <>
                      <div className='flex items-start gap-3 border-b border-slate-100 p-4'>
                        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700'>
                          <FileText size={21}/>
                        </div>
                        <div className='min-w-0'>
                            <p className='break-words text-xs font-bold text-slate-900'>{selectedResume.title || "My Resume"}</p>
                            <p className='mt-1 text-[11px] leading-5 text-slate-500'>{selectedResume.target ||
                            selectedResume.subtitle ||
                            "Selected resume"}</p>
                            <p className='mt-2 text-[10px] text-slate-400'>{formatUpdatedDate(selectedResume.updatedAt)}
                          {selectedResume.version
                            ? ` · v${selectedResume.version}`
                            : ""}</p>
                        </div>
                      </div>
                      <div className='p-3 sm:p-4'>
                            {resumeUrl(selectedResume) ? (
                              <div className='overflow-hidden rounded-lg border border-slate-200 bg-slate-100'>
                                <iframe key={resumeUrl(selectedResume)}
                            title={`${selectedResume.title || "Resume"} preview`}
                            src={resumeUrl(selectedResume)}
                            className="h-[420px] w-full bg-white"/>
                              </div>
                            ) : (
                              <div className='flex min-h-[220px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 p-5 text-center'>
                                  <FileText size={28} className='text-slate-400'/>
                                  <p className='mt-3 text-xs font-semibold text-slate-700'>Preview unavailable</p>
                                  <p className='mt-1 text-[11px] leading-5 text-slate-500'>This resume does not have a preview URL available.</p>
                              </div>
                            )}
                           {resumeSkills(selectedResume).length > 0 && (
                        <div className="mt-4">
                          <h3 className="text-xs font-bold text-slate-800">
                            Resume skills
                          </h3>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {resumeSkills(selectedResume)
                              .slice(0, 10)
                              .map((skill, index) => (
                                <span
                                  key={`${skill}-${index}`}
                                  className="rounded-md bg-slate-100 px-2 py-1 text-[10px] text-slate-600"
                                >
                                  {skill}
                                </span>
                              ))}
                          </div>
                        </div>
                      )}
                       <div className="mt-4 rounded-lg border border-violet-100 bg-violet-50/70 p-3">
                          <div className="flex items-start gap-2.5">
                        <Sparkles size={15} className="mt-0.5 shrink-0 text-violet-700"/>
                  <p className="text-[11px] leading-5 text-violet-800">Your selected resume will be attached when you submit your application.</p>
                      </div>
                     </div>
                   </div>
                      </>
                    ): (
                      <>
                      <div className='flex min-h-[240px] flex-col items-center justify-center px-5 py-8 text-center'>
                          <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400'>
                            <FileText size={23}/>
                          </div>
                          <h3 className="mt-3 text-xs font-bold text-slate-800">
                              No resume selected
                          </h3>
                          <p className="mt-1.5 max-w-[220px] text-[11px] leading-5 text-slate-500">
                              Select a resume in the center panel to view it here.
                          </p>
                      </div>
                      </>
                    )}
                </aside>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 pb-2 text-[10px] text-slate-400">
                <ShieldCheck size={13} />
                <span>Review your details before submitting.</span>
                <span className="hidden sm:inline">·</span>
                <span>Peer.Hiring application workspace</span>
            </div>
            </>
          )}
        </main>
        {previewResume && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm sm:p-6">
                  <section
                    role="dialog"
                    aria-modal="true"
                    aria-label="Resume preview"
                    className="flex h-full max-h-[900px] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
                  >
                    <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
                      <div className="min-w-0">
                        <h2 className="truncate text-sm font-bold text-slate-900">
                          {previewResume.title || "Resume preview"}
                        </h2>
                        <p className="mt-0.5 text-xs text-slate-500">
                          Document preview
                        </p>
                      </div>
        
                      <button
                        type="button"
                        onClick={() => setPreviewResume(null)}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                        aria-label="Close preview"
                      >
                        <X size={19} />
                      </button>
                    </header>
        
                    {resumeUrl(previewResume) ? (
                      <iframe
                        title={`${previewResume.title || "Resume"} document`}
                        src={resumeUrl(previewResume)}
                        className="min-h-0 flex-1 bg-slate-100"
                      />
                    ) : (
                      <div className="flex flex-1 items-center justify-center text-sm text-slate-500">
                        Preview is not available for this resume.
                      </div>
                    )}
                  </section>
                </div>
              )}
      </div>
    </div>
  )
}

export default ApplyJob
