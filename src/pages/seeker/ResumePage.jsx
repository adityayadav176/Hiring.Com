import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDownToLine,
  ArrowRight,
  Trash2,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  Copy,
  Download,
  ExternalLink,
  FileText,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Send,
  Settings2,
  Star,
  Upload,
  X,
  Zap,
  LoaderCircle,
  Sparkles,
  AlignLeft,
  Code2,
} from "lucide-react";

  const formatFileSize = (bytes) => {
  const size = Number(bytes);

  if (!Number.isFinite(size) || size < 0) return "—";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;

  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
};

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};


  const handleOpenDocument = (resume) => {
    const url = resume?.resume?.url;

    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleDownloadResume = (resume) => {
    const url = resume?.resume?.url;

    if (url) {
      const link = document.createElement("a");
      link.href = url;
      link.download =
        resume?.resume?.originalName || "resume.pdf";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };
import { createPortal } from 'react-dom';
import { useApplication, useInterview, useResume } from "../../hooks/Hook";

const HeaderMetric = ({label, value}) => {
    return (
        <div className='text-right'>
            <p className='text-[9px] uppercase tracking-[0.08em] text-[#A2A5AA]'>{label}</p>
            <p className='mt-0.5 text-[13px] font-semibold'>{value}</p>
        </div>
    )
}

const FilterButton = ({active, label, onClick}) => {
    return (
        <button onClick={onClick} className={`h-8 rounded-[7px] px-3 text-[10px] font-medium transition-all ${active ? "bg-[#171717] text-white" : "text-[#858990] hover:bg-white hover:text-[#171717]"}`}> 
            {label}
        </button>
    )
}

const MiniStat = ({label, value, violet}) => {
    return (
        <div>
            <p className='text-[8px] tracking-[0.08em] uppercase text-[#A2A5AA]'>{label}</p>
            <p className={`mt-1 font-semibold text-[12px] ${violet ? "text-[#6D28D9]" : "text-[#555960]"}`}>{value}</p>
        </div>
    )
}

const MenuAction = ({
    icon: Icon,
    label,
    danger,
    onClick,
    disabled,
}) => {
    return (
        <button onClick={onClick} disabled={disabled}
            className={`flex h-8 w-full items-center gap-2.5 rounded-[5px] px-3 text-left text-[10px] ${
                danger
                    ? "text-[#B23A3A] hover:bg-[#FFF2F2]"
                    : "text-[#60646A] hover:bg-[#F5F6F7] hover:text-[#171717]"
            }`}
        >
            <Icon size={13} />
            {label}
        </button>
    );
};


const EditResumeDetailsModal = ({
    resume,
    onClose,
    onUpdated,
}) => {
    const { handleUpdateResumeDetails } = useResume();

    const [title, setTitle] = useState("");
    const [target, setTarget] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [skills, setSkills] = useState([]);
    const [skillInput, setSkillInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!resume) return;

        setTitle(resume.title || "");
        setTarget(resume.target || "");
        setSubtitle(resume.subtitle || "");
        setSkills(
            Array.isArray(resume.skills) ? resume.skills : []
        );
        setSkillInput("");
        setError("");
    }, [resume]);

    // Close modal with Escape key.
    useEffect(() => {
        if (!resume) return;

        const handleEscape = (event) => {
            if (event.key === "Escape" && !loading) {
                onClose?.();
            }
        };

        window.addEventListener("keydown", handleEscape);

        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, [resume, loading, onClose]);

    const addSkill = () => {
        const value = skillInput.trim();

        if (!value) return;

        const alreadyExists = skills.some(
            (skill) =>
                skill.toLowerCase() === value.toLowerCase()
        );

        if (alreadyExists) {
            setSkillInput("");
            return;
        }

        if (skills.length >= 50) {
            setError("You can add up to 50 skills.");
            return;
        }

        setSkills((prev) => [...prev, value]);
        setSkillInput("");
        setError("");
    };

    const removeSkill = (skillToRemove) => {
        setSkills((prev) =>
            prev.filter((skill) => skill !== skillToRemove)
        );
        setError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (!resume?._id) {
            setError(
                "Resume ID is missing. Please close and reopen the modal."
            );
            return;
        }

        if (!title.trim()) {
            setError("Please enter a resume title.");
            return;
        }

        try {
            setLoading(true);

            const updatedResume =
                await handleUpdateResumeDetails({
                    resumeId: resume._id,
                    title: title.trim(),
                    target: target.trim(),
                    subtitle: subtitle.trim(),
                    skills,
                });

            // Update the parent only after a successful API response.
            onUpdated?.(updatedResume);
            onClose?.();
        } catch (err) {
            setError(
                err?.message ||
                    "Unable to update resume details. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    if (!resume || typeof document === "undefined") {
        return null;
    }

    const inputClass =
        "w-full rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:opacity-60";

    const labelClass =
        "mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700";

    return createPortal(
        <div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-950/50 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
                if (
                    event.target === event.currentTarget &&
                    !loading
                ) {
                    onClose?.();
                }
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-resume-title"
                className="flex max-h-[88vh] w-full max-w-[720px] flex-col overflow-hidden rounded-[24px] border border-white/70 bg-white shadow-[0_28px_100px_-25px_rgba(15,23,42,0.4)]"
                onMouseDown={(event) => event.stopPropagation()}
            >
                {/* Header */}
                <header className="flex shrink-0 items-start justify-between border-b border-gray-100 px-6 py-5 sm:px-8 sm:py-6">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-violet-600">
                            <Sparkles size={14} />
                            Resume workspace
                        </div>

                        <h2
                            id="edit-resume-title"
                            className="text-2xl font-semibold tracking-tight text-gray-950"
                        >
                            Edit resume details
                        </h2>

                        <p className="mt-1.5 text-sm leading-5 text-gray-500">
                            Update your resume title, target role,
                            description, and skills.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        aria-label="Close modal"
                        className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-800 disabled:opacity-50"
                    >
                        <X size={21} />
                    </button>
                </header>

                {/* Scrollable form */}
                <form
                    id="edit-resume-form"
                    onSubmit={handleSubmit}
                    className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
                >
                    <div className="space-y-6 px-6 py-6 sm:px-8">
                        {/* Resume title */}
                        <div>
                            <label
                                htmlFor="edit-resume-name"
                                className={labelClass}
                            >
                                <FileText
                                    size={15}
                                    className="text-violet-600"
                                />
                                Resume title
                                <span className="text-red-500">*</span>
                            </label>

                            <input
                                id="edit-resume-name"
                                type="text"
                                value={title}
                                onChange={(event) =>
                                    setTitle(
                                        event.target.value.slice(0, 120)
                                    )
                                }
                                maxLength={120}
                                placeholder="e.g. Software Engineer — Main Resume"
                                className={inputClass}
                                autoComplete="off"
                                required
                                disabled={loading}
                            />

                            <div className="mt-1.5 text-right text-xs text-gray-400">
                                {title.length}/120
                            </div>
                        </div>

                        {/* Target role */}
                        <div>
                            <label
                                htmlFor="edit-resume-target"
                                className={labelClass}
                            >
                                <BriefcaseBusiness
                                    size={15}
                                    className="text-violet-600"
                                />
                                Target role
                            </label>

                            <input
                                id="edit-resume-target"
                                type="text"
                                value={target}
                                onChange={(event) =>
                                    setTarget(
                                        event.target.value.slice(0, 120)
                                    )
                                }
                                maxLength={120}
                                placeholder="e.g. Frontend Developer, Backend Engineer"
                                className={inputClass}
                                disabled={loading}
                            />
                        </div>

                        {/* Subtitle */}
                        <div>
                            <label
                                htmlFor="edit-resume-subtitle"
                                className={labelClass}
                            >
                                <AlignLeft
                                    size={15}
                                    className="text-violet-600"
                                />
                                Short description
                            </label>

                            <textarea
                                id="edit-resume-subtitle"
                                value={subtitle}
                                onChange={(event) =>
                                    setSubtitle(
                                        event.target.value.slice(0, 180)
                                    )
                                }
                                maxLength={180}
                                rows={3}
                                placeholder="Briefly describe what this resume highlights..."
                                className={`${inputClass} resize-y`}
                                disabled={loading}
                            />

                            <div className="mt-1.5 text-right text-xs text-gray-400">
                                {subtitle.length}/180
                            </div>
                        </div>

                        {/* Skills */}
                        <div>
                            <label
                                htmlFor="edit-resume-skill-input"
                                className={labelClass}
                            >
                                <Code2
                                    size={15}
                                    className="text-violet-600"
                                />
                                Skills
                                <span className="font-normal text-gray-400">
                                    ({skills.length}/50)
                                </span>
                            </label>

                            <div className="flex gap-2">
                                <input
                                    id="edit-resume-skill-input"
                                    type="text"
                                    value={skillInput}
                                    onChange={(event) =>
                                        setSkillInput(event.target.value)
                                    }
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            event.preventDefault();
                                            addSkill();
                                        }
                                    }}
                                    placeholder="e.g. React.js"
                                    className={`${inputClass} min-w-0 flex-1`}
                                    disabled={
                                        loading || skills.length >= 50
                                    }
                                />

                                <button
                                    type="button"
                                    onClick={addSkill}
                                    disabled={
                                        loading ||
                                        !skillInput.trim() ||
                                        skills.length >= 50
                                    }
                                    className="flex shrink-0 items-center gap-1.5 rounded-xl border border-gray-200 px-4 text-sm font-semibold text-gray-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <Plus size={16} />
                                    Add
                                </button>
                            </div>

                            <p className="mt-2 text-xs text-gray-400">
                                Press Enter or click Add to include a skill.
                            </p>

                            {skills.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {skills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="inline-flex items-center gap-2 rounded-lg border border-violet-100 bg-violet-50 px-3 py-2 text-sm font-medium text-violet-800"
                                        >
                                            <span>{skill}</span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeSkill(skill)
                                                }
                                                disabled={loading}
                                                aria-label={`Remove ${skill}`}
                                                className="rounded p-0.5 text-violet-400 transition hover:bg-violet-100 hover:text-red-600 disabled:opacity-40"
                                            >
                                                <X size={14} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}

                            {skills.length === 0 && (
                                <p className="mt-3 rounded-lg border border-dashed border-gray-200 px-4 py-3 text-xs text-gray-400">
                                    No skills added yet. Add skills relevant
                                    to this resume, or leave this empty.
                                </p>
                            )}
                        </div>

                        {/* Existing PDF information */}
                        <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm">
                                <FileText size={19} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-gray-800">
                                    PDF file remains unchanged
                                </p>

                                <p className="mt-1 break-words text-xs leading-5 text-gray-500">
                                    {resume.resume?.originalName ||
                                        "Your existing resume document"}
                                </p>
                            </div>

                            <Check
                                size={17}
                                className="mt-1 shrink-0 text-emerald-600"
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <div
                                role="alert"
                                className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
                            >
                                {error}
                            </div>
                        )}
                    </div>
                </form>

                {/* Footer */}
                <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-gray-100 bg-white px-6 py-4 sm:px-8 sm:py-5">
                    <p className="hidden text-xs text-gray-400 sm:block">
                        Only the details you edit will be saved.
                    </p>

                    <div className="ml-auto flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="rounded-xl px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            form="edit-resume-form"
                            disabled={loading || !title.trim()}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-violet-600/20 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <LoaderCircle
                                        size={16}
                                        className="animate-spin"
                                    />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Check size={16} />
                                    Save changes
                                </>
                            )}
                        </button>
                    </div>
                </footer>
            </section>
        </div>,
        document.body
    );
};

const ResumeApplicationCard = ({resume, index, active, onSelect, onMenu, showMenu}) => {
    const {handleSetIsDefault, handleDeleteResume, handleDownloadResume, handleUpdateResumeDetails} = useResume();
    const [renameModal, setRenameModal] = useState(false);
    return (
        <div className={`group relative border-b border-black/[0.06] px-5 py-5 transition-all last:border-b-0 ${active ? "bg-[#FBFAFF]" : "hover:bg-[#FAFAFB]"}`}>
            <div className='flex gap-4'>    
                <div className='hidden w-5 shrink-0 pt-1 text-[9px] font-medium text-[#B0B3B8] sm:block'>
                    {String(index + 1).padStart(2, "0")}
                </div>

                <button className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[9px] transition-all ${active ? "bg-[#EEE8FF] text-[#6D28D9]" : "bg-[#F1F2F4] text-[#777B82] group-hover:bg-[#EEE8FF] group-hover:text-[#6D28D9]"}`} onClick={onSelect}>
                    <FileText size={18} strokeWidth={1.8}/>
                </button>
                <button className='min-w-0 flex-1 text-left' onClick={onSelect}>
                    <div className='flex flex-wrap items-center gap-2'>
                        <h3 className='text-[13px] font-semibold tracking-[-0.02em]'>{resume.title}</h3>
                        {resume.isDefault && (
                            <span className='flex items-center gap-1 rounded-full text-[#6D28D9] bg-[#EEE8FF] px-2 py-0.5 text-[8px] font-medium'>
                                <Star size={8} fill='currentColor'/>
                                Default
                            </span>
                        )}
                    </div>
                    <p className='mt-1 text-[10px] text-[#8C9096]'>{resume.subtitle}</p>
                    <div className='mt-3 flex flex-wrap items-center gap-2'>
                        {(Array.isArray(resume?.skills) ? resume.skills : []).map((skill) => (
                            <span className='rounded-[4px] px-2 py-1 text-[8px] bg-[#F1F2F4] text-[#777B82]' key={skill}>
                                {skill}
                            </span>
                        ))}
                    </div>
                </button>
                <div className='hidden shrink-0 gap-8 items-center lg:flex'>
                    <MiniStat label="Applications" value={resume.applications || 0}/>
                    <MiniStat label="Interviews" value={resume.Interview || 0}/>
                    <MiniStat label="Ready" value={`${resume?.readiness || 0}%`}/>
                </div>
                <div className='relative shrink-0'>
                    <button onClick={onMenu} className='flex h-8 w-8 items-center justify-center rounded-[6px] text-[#A3A6AB] transition-colors hover:bg-[#F1F2F4] hover:text-[#171717]'>
                        <MoreHorizontal size={16}/>
                    </button>
                    {showMenu && (
                        <div className='absolute right-0 top-9 z-20 w-44 rounded-[8px] border border-black/[0.08] bg-white p-1 shadow-[0_15px_40px_rgba(0,0,0,0.1)]' >
                            <MenuAction icon={Pencil} onClick={() => setRenameModal(true)} label="Rename"/>
                                {renameModal && <EditResumeDetailsModal resume={resume} onClose={() => setRenameModal(false)}/>}
                            <MenuAction icon={ExternalLink} onClick={() => alert("Open")} label="Open document"/>
                            <MenuAction onClick={() => handleDownloadResume(resume._id)} icon={Download} label="Download"/>
                            {!resume.isDefault && (
                                <MenuAction onClick={() => handleSetIsDefault(resume._id)} icon={Star} label="Set as default"/>
                            )}
                            <div className="my-1 border-t border-black/[0.06]" />
                            <MenuAction onClick={() => handleDeleteResume(resume._id)} icon={Trash2} label="Move to recycle bin" danger/>
                        </div>
                    )}
                </div>
            </div>
            <div className='mt-4 flex gap-9 pl-[59px] lg:hidden'>
                <MiniStat label="Applications" value={resume?.application || 0}/>
                <MiniStat label="Interviews" value={resume?.interviews || 0}/>
                <MiniStat label="Ready" value={`${resume?.ready || 0}%`}/>
            </div>
            {active && (
                <div className='absolute bottom-0 left-0 top-0 w-[2px] bg-[#6D28D9]'/>
            )}
        </div>
    )
};


const ApplicationRow = ({ application }) => {
  const statusStyles = {
    applied: "bg-[#F1F2F4] text-[#696D73]",
    screening: "bg-[#FFF4DB] text-[#9A6A14]",
    shortlisted: "bg-[#E8F7EF] text-[#217A4B]",
    interview_scheduled: "bg-[#EEE8FF] text-[#6D28D9]",
    interview_completed: "bg-[#E8F7EF] text-[#217A4B]",
    selected: "bg-[#E8F7EF] text-[#217A4B]",
    rejected: "bg-[#FFF0F0] text-[#B23A3A]",
    withdrawn: "bg-[#F1F2F4] text-[#696D73]",
  };

  const companyName =
    typeof application?.companyId === "object"
      ? application.companyId?.name
      : "";

  const resumeTitle =
    typeof application?.resumeId === "object"
      ? application.resumeId?.title
      : "";

  const status = application?.status || "applied";

  const formattedDate = application?.createdAt
    ? new Date(application.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      })
    : "—";

  return (
    <div className="flex items-center gap-3 border-b border-black/[0.05] px-5 py-5 last:border-b-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[7px] bg-[#171717] text-[11px] font-semibold text-white">
        {companyName
          ? companyName.charAt(0).toUpperCase()
          : "A"}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-semibold">
          {companyName || "Company"}
        </p>

        <p className="mt-0.5 truncate text-[9px] text-[#9699A0]">
          {application?.jobId?.title || "Job application"}
        </p>
      </div>

      <div className="hidden min-w-[130px] sm:block">
        <p className="text-[9px] text-[#A0A3A8]">Using</p>
        <p className="mt-0.5 truncate text-[9px] font-medium text-[#64676D]">
          {resumeTitle || "Resume not available"}
        </p>
      </div>

      <span
        className={`rounded-full px-2.5 py-1 text-[8px] font-medium ${
          statusStyles[status] ||
          "bg-[#F1F2F4] text-[#696D73]"
        }`}
      >
        {status.replaceAll("_", " ")}
      </span>

      <span className="hidden w-[55px] shrink-0 text-right text-[9px] text-[#A0A3A8] md:block">
        {formattedDate}
      </span>

      <ChevronRight size={13} className="text-[#C1C3C6]" />
    </div>
  );
};


const ReadinessCircle = ({value}) => {
    const radius = 25;
    const circumference = 2 * Math.PI * radius;
    const progress = circumference - (value / 100) * circumference;

    return (
        <div className='relative h-[66px] w-[66px] shrink-0'>
            <svg
                width="66"
                height="66"
                viewBox="0 0 66 66"
                className="-rotate-90"
            >
                <circle
                    cx="33"
                    cy="33"
                    r={radius}
                    fill="none"
                    stroke="#EEEFF1"
                    strokeWidth="5"
                />

                <circle
                    cx="33"
                    cy="33"
                    r={radius}
                    fill="none"
                    stroke="#6D28D9"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={progress}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[13px] font-semibold">
                    {value}
                </span>
            </div>
        </div>
    )
}

const HealthItem = ({label, complete}) => {
    return (
        <div className='flex items-center gap-2'>
            <div className={`flex h-4 w-4 items-center justify-center rounded-full ${complete ? "bg-[#E9E4FF] text-[#6D28D9]" : "bg-[#F1F2F4] text-[#999]"}`}>
                <Check size={9} strokeWidth={2.5}/>
            </div>
            <span className='text-[9px] text-[#777B82]'>{label}</span>
        </div>
    )
}

const QuickAction = ({icon: Icon, title, description}) => {
    return (
        <button className='group flex w-full items-center gap-3 rounded-[8px] px-3 py-3 text-left transition-colors hover:bg-[#F7F8FA]'>
            <div className='flex h-8 w-8 items-center justify-center rounded-[7px] transition-colors bg-[#F1F2F4] text-[#777B82] group-hover:bg-[#EEE8FF] group-hover:text-[#6D28D9]'>
                <Icon size={14}/>
            </div>
            <div className='min-w-0 flex-1'>
                <p className='text-[10px] font-medium text-[#555960] group-hover:text-[#171717]'>{title}</p>
                <p className='mt-0.5 truncate text-[8px] text-[#A0A3A8]'>{description}</p>
            </div>
            <ChevronRight size={13} className='text-[#C4C6C9] transition-transform group-hover:translate-x-0.5'/>
        </button>
    );
};

const MiniResumePaper = () => {
    return (
        <div className='h-full bg-white p-[8%]'>
            <div className='border-b border-black pb-[5%]'>
                <div className='h-3 w-[45%] bg-[#171717]'/>
                <div className='mt-2 h-1.5 w-[25%] bg-[#A3A6AB]'/>

                <div className='flex mt-3 justify-between'>
                    <div className='h-1 w-[30%] bg-[#D1D3D6]'/>
                    <div className='h-1 w-[20%] bg-[#D1D3D6]'/>
                </div>
            </div>
            {[1, 2, 3, 4].map((section) => (
                <div className='mt-[8%]' key={section}>
                    <div className='h-1.5 w-[22%] bg-[#171717]'/>
                    <div className='mt-3 space-y-1.5'>
                        <div className='h-1 w-[90%] bg-[#D1D3D6]'/>
                        <div className='h-1 w-[80%] bg-[#D1D3D6]'/>
                        <div className='h-1 w-[72%] bg-[#D1D3D6]'/>
                    </div>
                </div>
            ))}
        </div>
    )
}

const DetailRow = ({label, value, last}) => {
    return (
        <div className={`flex items-center justify-between px-5 py-4 ${!last ? "border-black/[0.05] border-b" : ""}`}>
            <span className='text-[9px] text-[#A0A3A8]'>{label}</span>
            <span className='max-w-[65%] truncate text-right text-[10px] font-medium text-[#555960]'>{value}</span>
        </div>
    )
}

const ResumeDrawer = ({resume, onClose, onPreview}) => {
    return (
        <div className='fixed inset-0 z-[100] flex justify-end'>
            <div onClick={onClose} className='absolute inset-0 bg-black/20 backdrop-blur-[2px]'/>
            <aside className='relative z-10 flex w-full max-w-[650px] flex-col bg-[#F7F8FA] shadow-[-20px_0_60px_rgba(0,0,0,0.12)]'>
                <div className='flex h-[70px] shrink-0 items-center justify-between border-b border-black/[0.07] bg-white px-6'>
                    <div className='flex items-center gap-3'>
                        <div className='flex h-9 w-9 justify-center items-center rounded-[8px] bg-[#EEE8FF] text-[#6D28D9]'>
                            <FileText size={16}/>
                        </div>
                        <div>
                            <p className='text-[12px] font-semibold'>{resume.title}</p>
                            <p>Resume details</p>
                        </div>
                    </div>
                    <button className='flex h-8 w-8 text-[#858990] justify-center items-center rounded-[6px] hover:bg-[#F1F2F4] hover:text-[#171717]' onClick={onClose}>
                        <X size={17}/>
                    </button>
                </div>
                <div className='flex-1 overflow-y-auto p-6'>
                    <div className='mb-5 overflow-hidden rounded-[10px] border border-black/[0.07] p-6 bg-[#E9EAEC]'>
                        <div className='mx-auto aspect-[1/1.414] max-w-[300px] bg-white shadow-[0_15px_40px_rgba(0,0,0,0.1)]'>
                            <MiniResumePaper/>
                        </div>
                        <button onClick={onPreview} className='mx-auto mt-4 flex items-center gap-2 text-[10px] font-medium text-[#6D28D9]'>
                            <ExternalLink size={12}/>
                            Open full preview
                        </button>
                    </div>
                    <div className='rounded-[10px] border border-black/[0.07] bg-white'>
                        <DetailRow label="Resume" value={resume?.title}/>
                        <DetailRow label="Target role" value={resume?.target}/>
                        <DetailRow label="File" value={resume?.resume?.originalName || "No file name"}/>
                        <DetailRow label="Size" value={formatFileSize(resume?.resume?.sizeBytes)}/>
                        <DetailRow label="Last Updated" value={formatDate(resume?.updatedAt)}/>
                        <DetailRow label="Applications" value={resume?.applications || 0}/>
                        <DetailRow label="Interview" value={resume?.interviews || 0}/>
                        <DetailRow label="Profile Views" value={resume?.views} last/>
                    </div>

                    <div className='mt-5 rounded-[10px] border border-black/[0.07] bg-white p-5'>
                        <p className='mb-4 text-[10px] font-semibold uppercase tracking-[0.1] text-[#8D9197]'>Target skills</p>
                        <div className='flex flex-wrap gap-2'>
                            {(Array.isArray(resume?.skills) ? resume.skills : []).map((skill) => (
                                <span key={skill} className='rounded-[5px] bg-[#F1F2F4] px-2.5 py-1.5 text-[9px] text-[#666A70]'>{skill}</span>
                            ))}
                        </div>
                    </div>
                    <div className='mt-5 rounded-[10px] border border-[#DDD5FF] bg-[#F7F5FF] p-5'>
                        <div className='flex items-start gap-3'>
                            <div className='flex h-8 w-8 items-center justify-center shrink-0 rounded-[7px] bg-[#E9E3FF] text-[#6D28D9]'>
                                <BriefcaseBusiness size={14}/>
                            </div>
                            <div>
                                <p className='text-[10px] font-semibold text-[#51417C]'>Application insight</p>
                                <p className='mt-1 text-[9px] leading-4 text-[#81769C]'>This resume has been used for{" "} <strong>{resume.applications}{" "}applications</strong>{" "}and is currently your{" "}{resume.isDefault ? "Default"  : "role-specific"}{" "}application document.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='grid shrink-0 grid-cols-2 gap-2 border-t border-black/[0.07] bg-white p-4'>
                    <button onClick={handleDownloadResume} className='flex h-10 items-center justify-center gap-2 rounded-[7px] border border-black/[0.08] text-[10px] font-medium text-[#64676D] hover:bg-[#F7F8FA]'>
                        <ArrowDownToLine size={13}/>
                        Download
                    </button>
                    <button className='flex h-10 items-center justify-center gap-2 rounded-[7px] bg-[#171717] text-[10px] font-medium text-white hover:bg-[#6D28D9]'>
                        <Send size={13}/>
                        Use for application
                    </button>
                </div>
            </aside>
        </div>
    )
}

const FullPreview = ({resume, onClose}) => {
    return (
        <div className='fixed inset-0 z-[300] flex flex-col bg-[#191A1D]'>
            <header className='flex h-[64px] shrink-0 items-center justify-between border-b border-black/[0.08] px-5 text-white lg:px-8'>
                <div className='flex items-center gap-3'>
                    <FileText size={16}/>
                    <div>
                        <p className='text-[11px] font-medium'>{resume.title}</p>
                        <p className='text-[8px] text-white/40'>{resume.file}</p>
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <button className='hidden h-8 items-center gap-2 border border-white/[0.1] px-3 text-[9px] text-white/60 hover:bg-white/[0.05] hover:text-white sm:flex'>
                        <Download size={13}/>
                        Download
                    </button>
                    <button onClick={onClose} className='flex h-8 w-8 items-center justify-center rounded-[6px] text-white/50 hover:bg-white/[0.07] hover:text-white'>
                        <X size={16}/>
                    </button>
                </div>
            </header>
            <div className='flex flex-1 justify-center overflow-auto bg-[#292B2F] p-5 lg:p-12'>
                <div className='h-fit w-full max-w-[850px] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.35)]'>
                    <MiniResumePaper/>
                </div>
            </div>
        </div>
    )
}


const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_TITLE_LENGTH = 120;
const MAX_SUBTITLE_LENGTH = 180;
const MAX_TARGET_LENGTH = 100;
const MAX_SKILLS = 50;

const CreateResumeModal = ({ onClose, onCreated }) => {
    const { handleUploadResume } = useResume();

    const fileInputRef = useRef(null);
    const skillInputRef = useRef(null);

    const [title, setTitle] = useState("");
    const [target, setTarget] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [skills, setSkills] = useState([]);
    const [skillInput, setSkillInput] = useState("");
    const [file, setFile] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const validateFile = (selectedFile) => {
        if (!selectedFile) {
            setError("Please select your resume PDF.");
            return false;
        }

        const isPdf =
            selectedFile.type === "application/pdf" ||
            selectedFile.name.toLowerCase().endsWith(".pdf");

        if (!isPdf) {
            setError("Only PDF files are allowed.");
            return false;
        }

        if (selectedFile.size > MAX_FILE_SIZE) {
            setError("Your PDF must be 10 MB or smaller.");
            return false;
        }

        setError("");
        return true;
    };

    const handleFileSelect = (selectedFile) => {
        if (!selectedFile) return;

        if (validateFile(selectedFile)) {
            setFile(selectedFile);
        } else {
            setFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleAddSkill = (event) => {
        event?.preventDefault();

        const newSkill = skillInput.trim();

        if (!newSkill) return;

        if (skills.some((skill) => skill.toLowerCase() === newSkill.toLowerCase())) {
            setError("This skill has already been added.");
            return;
        }

        if (skills.length >= MAX_SKILLS) {
            setError("You can add a maximum of 50 skills.");
            return;
        }

        setSkills((previous) => [...previous, newSkill]);
        setSkillInput("");
        setError("");
        skillInputRef.current?.focus();
    };

    const handleRemoveSkill = (skillToRemove) => {
        setSkills((previous) =>
            previous.filter((skill) => skill !== skillToRemove)
        );
        setError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (submitting) return;

        const cleanTitle = title.trim();
        const cleanTarget = target.trim();
        const cleanSubtitle = subtitle.trim();

        if (!cleanTitle) {
            setError("Resume title is required.");
            return;
        }

        if (cleanTitle.length > MAX_TITLE_LENGTH) {
            setError("Resume title cannot exceed 120 characters.");
            return;
        }

        if (cleanSubtitle.length > MAX_SUBTITLE_LENGTH) {
            setError("Subtitle cannot exceed 180 characters.");
            return;
        }

        if (cleanTarget.length > MAX_TARGET_LENGTH) {
            setError("Target cannot exceed 100 characters.");
            return;
        }

        if (!file || !validateFile(file)) {
            return;
        }

        const formData = new FormData();

        formData.append("title", cleanTitle);
        formData.append("subtitle", cleanSubtitle);
        formData.append("target", cleanTarget);
        formData.append("skills", JSON.stringify(skills));
        formData.append("resume", file);

        try {
            setSubmitting(true);
            setError("");

            const result = await handleUploadResume(formData);

            if (!result?.success) {
                setError(result?.message || "Failed to upload your resume.");
                return;
            }

            // Notify the parent so it can refresh or update the UI.
            onCreated?.(result.data);

            onClose?.();
        } catch (err) {
            setError(err?.message || "Something went wrong while uploading.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-6 backdrop-blur-sm sm:items-center"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !submitting) {
                    onClose?.();
                }
            }}
        >
            <form
                onSubmit={handleSubmit}
                className="my-auto w-full max-w-[560px] overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.2)]"
            >
                {/* Header */}
                <div className="flex items-start justify-between border-b border-black/[0.06] px-5 py-5 sm:px-6">
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8B72D8]">
                            Resume workspace
                        </p>
                        <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-[#171717]">
                            Create a resume
                        </h2>
                        <p className="mt-1 text-xs leading-5 text-[#777B82]">
                            Add a resume version for your job applications.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={submitting}
                        aria-label="Close modal"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#777B82] transition hover:bg-[#F1F2F4] disabled:opacity-50"
                    >
                        <X size={17} />
                    </button>
                </div>

                {/* Form fields */}
                <div className="max-h-[70vh] space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
                    <div>
                        <label
                            htmlFor="resume-title"
                            className="mb-2 block text-xs font-medium text-[#42454B]"
                        >
                            Resume title <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="resume-title"
                            type="text"
                            placeholder="e.g. Software Engineer — Main Resume"
                            value={title}
                            maxLength={MAX_TITLE_LENGTH}
                            onChange={(event) => setTitle(event.target.value)}
                            required
                            disabled={submitting}
                            className="h-11 w-full rounded-lg border border-black/[0.10] bg-[#FAFAFB] px-3.5 text-sm outline-none transition placeholder:text-[#A0A3A8] focus:border-[#8B72D8] focus:bg-white focus:ring-2 focus:ring-[#8B72D8]/10 disabled:opacity-60"
                        />
                        <p className="mt-1 text-right text-[10px] text-[#9A9DA3]">
                            {title.length}/{MAX_TITLE_LENGTH}
                        </p>
                    </div>

                    <div>
                        <label
                            htmlFor="resume-target"
                            className="mb-2 block text-xs font-medium text-[#42454B]"
                        >
                            Target role
                        </label>
                        <input
                            id="resume-target"
                            type="text"
                            placeholder="e.g. Frontend Developer, Backend Engineer"
                            value={target}
                            maxLength={MAX_TARGET_LENGTH}
                            onChange={(event) => setTarget(event.target.value)}
                            disabled={submitting}
                            className="h-11 w-full rounded-lg border border-black/[0.10] bg-[#FAFAFB] px-3.5 text-sm outline-none transition placeholder:text-[#A0A3A8] focus:border-[#8B72D8] focus:bg-white focus:ring-2 focus:ring-[#8B72D8]/10 disabled:opacity-60"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="resume-subtitle"
                            className="mb-2 block text-xs font-medium text-[#42454B]"
                        >
                            Short description
                        </label>
                        <textarea
                            id="resume-subtitle"
                            placeholder="e.g. Resume highlighting React, Node.js, and backend development."
                            value={subtitle}
                            maxLength={MAX_SUBTITLE_LENGTH}
                            rows={2}
                            onChange={(event) => setSubtitle(event.target.value)}
                            disabled={submitting}
                            className="w-full resize-none rounded-lg border border-black/[0.10] bg-[#FAFAFB] px-3.5 py-3 text-sm outline-none transition placeholder:text-[#A0A3A8] focus:border-[#8B72D8] focus:bg-white focus:ring-2 focus:ring-[#8B72D8]/10 disabled:opacity-60"
                        />
                        <p className="mt-1 text-right text-[10px] text-[#9A9DA3]">
                            {subtitle.length}/{MAX_SUBTITLE_LENGTH}
                        </p>
                    </div>

                    {/* Skills */}
                    <div>
                        <label
                            htmlFor="resume-skills"
                            className="mb-2 block text-xs font-medium text-[#42454B]"
                        >
                            Skills
                            <span className="ml-1 font-normal text-[#92959B]">
                                ({skills.length}/{MAX_SKILLS})
                            </span>
                        </label>

                        <div className="flex gap-2">
                            <input
                                ref={skillInputRef}
                                id="resume-skills"
                                type="text"
                                placeholder="e.g. React.js"
                                value={skillInput}
                                maxLength={60}
                                onChange={(event) => setSkillInput(event.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        handleAddSkill(event);
                                    }
                                }}
                                disabled={submitting || skills.length >= MAX_SKILLS}
                                className="h-10 min-w-0 flex-1 rounded-lg border border-black/[0.10] bg-[#FAFAFB] px-3 text-sm outline-none transition placeholder:text-[#A0A3A8] focus:border-[#8B72D8] focus:bg-white"
                            />
                            <button
                                type="button"
                                onClick={handleAddSkill}
                                disabled={
                                    submitting ||
                                    !skillInput.trim() ||
                                    skills.length >= MAX_SKILLS
                                }
                                className="flex h-10 items-center gap-1.5 rounded-lg border border-black/[0.10] px-3 text-xs font-medium text-[#42454B] transition hover:border-[#8B72D8] hover:text-[#6D28D9] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <Plus size={14} />
                                Add
                            </button>
                        </div>

                        {skills.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="inline-flex items-center gap-1.5 rounded-md border border-[#E5DDFB] bg-[#F6F2FF] py-1.5 pl-2.5 pr-1.5 text-xs font-medium text-[#6241AD]"
                                    >
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSkill(skill)}
                                            disabled={submitting}
                                            aria-label={`Remove ${skill}`}
                                            className="rounded p-0.5 hover:bg-[#E8DFFF]"
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}

                        <p className="mt-2 text-[11px] text-[#92959B]">
                            Add relevant skills individually. You can also leave this empty.
                        </p>
                    </div>

                    {/* PDF upload */}
                    <div>
                        <label className="mb-2 block text-xs font-medium text-[#42454B]">
                            Resume PDF <span className="text-red-500">*</span>
                        </label>

                        <div
                            role="button"
                            tabIndex={submitting ? -1 : 0}
                            onClick={() => !submitting && fileInputRef.current?.click()}
                            onKeyDown={(event) => {
                                if (
                                    !submitting &&
                                    (event.key === "Enter" || event.key === " ")
                                ) {
                                    event.preventDefault();
                                    fileInputRef.current?.click();
                                }
                            }}
                            onDragOver={(event) => {
                                event.preventDefault();
                                if (!submitting) setDragging(true);
                            }}
                            onDragLeave={(event) => {
                                event.preventDefault();
                                setDragging(false);
                            }}
                            onDrop={(event) => {
                                event.preventDefault();
                                setDragging(false);

                                if (!submitting) {
                                    handleFileSelect(event.dataTransfer.files?.[0]);
                                }
                            }}
                            className={`flex min-h-[145px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-4 py-5 text-center transition ${
                                dragging
                                    ? "border-[#6D28D9] bg-[#F5F1FF]"
                                    : file
                                    ? "border-[#B7A5EB] bg-[#FAF8FF]"
                                    : "border-black/[0.13] bg-[#FAFAFB] hover:border-[#8B72D9] hover:bg-[#FCFAFF]"
                            } ${submitting ? "cursor-not-allowed opacity-60" : ""}`}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,application/pdf"
                                disabled={submitting}
                                className="hidden"
                                onChange={(event) => {
                                    handleFileSelect(event.target.files?.[0]);
                                }}
                            />

                            {file ? (
                                <>
                                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#E9E3FF] text-[#6D28D9]">
                                        <Check size={19} />
                                    </div>
                                    <p className="max-w-full truncate text-sm font-medium text-[#242424]">
                                        {file.name}
                                    </p>
                                    <p className="mt-1 text-xs text-[#777B82]">
                                        {(file.size / (1024 * 1024)).toFixed(2)} MB · PDF selected
                                    </p>
                                    <span className="mt-2 text-xs font-medium text-[#6D28D9]">
                                        Click to replace file
                                    </span>
                                </>
                            ) : (
                                <>
                                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0EDF8] text-[#6D28D9]">
                                        <Upload size={18} />
                                    </div>
                                    <p className="text-sm font-medium text-[#292929]">
                                        Drop your resume PDF here
                                    </p>
                                    <p className="mt-1 text-xs text-[#8D9197]">
                                        or click to browse · Maximum 10 MB
                                    </p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div
                            role="alert"
                            className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-xs leading-5 text-red-700"
                        >
                            <X size={15} className="mt-0.5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex flex-col-reverse gap-2 border-t border-black/[0.06] bg-[#FAFAFB] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <p className="text-[10px] text-[#92959B]">
                        <FileText size={12} className="mr-1 inline-block" />
                        PDF files only
                    </p>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={submitting}
                            className="h-10 rounded-lg px-4 text-xs font-medium text-[#777B82] transition hover:bg-[#F0F0F2] disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={submitting || !title.trim() || !file}
                            className="flex h-10 min-w-[145px] items-center justify-center gap-2 rounded-lg bg-[#171717] px-5 text-xs font-semibold text-white transition hover:bg-[#6D28D9] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {submitting ? (
                                <>
                                    <LoaderCircle size={15} className="animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload size={14} />
                                    Create resume
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};


function ResumePage() {
  const [activeResume, setActiveResume] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [showMenu, setShowMenu] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const {
    resumes: resumeData,
    handleGetAllResumes,
  } = useResume();
  const {
    applications: applicationData,
    handleGetMyApplications,
  } = useApplication();

  const {
    Interviews: interviewData,
    handleGetMyInterviews,
  } = useInterview();

  const resumes = Array.isArray(resumeData) ? resumeData : [];
  const applications = Array.isArray(applicationData)
    ? applicationData
    : [];
  const interviews = Array.isArray(interviewData)
    ? interviewData
    : [];

  useEffect(() => {
    let mounted = true;

    const loadPage = () => {
        setLoading(true);
        try {
                handleGetAllResumes(),
    handleGetMyApplications(),
    handleGetMyInterviews()
        } finally {
            if(mounted) {
                setLoading(false);
            }
        }
    }

    loadPage();

    return () => {
        mounted = false;
    }
  }, [])

  const selectedResume =
    resumes.find((item) => item?._id === activeResume) || null;

  const filteredResumes = useMemo(() => {
    let result = [...resumes];

    if (filter === "default") {
      result = result.filter(
        (item) => item?.isDefault && !item?.isDeleted
      );
    }

    if (filter === "most-used") {
      result.sort(
        (a, b) =>
          (Number(b?.applications) || 0) -
          (Number(a?.applications) || 0)
      );
    }

    const query = search.trim().toLowerCase();

    if (query) {
      result = result.filter((item) =>
        [
          item?.title,
          item?.subtitle,
          item?.target,
          ...(Array.isArray(item?.skills) ? item.skills : []),
        ].some((value) =>
          String(value || "").toLowerCase().includes(query)
        )
      );
    }

    return result.filter((item) => !item?.isDeleted);
  }, [resumes, filter, search]);

  const defaultResume = resumes.find(
    (resume) => resume?.isDefault && !resume?.isDeleted
  );

  const handleOpenResume = (resume) => {
    setActiveResume(resume?._id || null);
  };
  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#171717]">
      <header className="sticky top-0 z-50 border-b border-black/[0.07] bg-[#F7F8FA]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-[1500px] items-center justify-between px-5 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#6D28D9] text-white shadow-[0_5px_20px_rgba(109,40,217,0.18)]">
              <FileText size={17} strokeWidth={2} />
            </div>

            <div>
              <p className="text-[14px] font-semibold tracking-[-0.025em]">
                Resumes
              </p>
              <p className="hidden text-[10px] text-[#9A9DA3] sm:block">
                Application workspace
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-7 md:flex">
            <HeaderMetric
              label="Applications"
              value={applications.length}
            />
            <HeaderMetric
              label="Interviews"
              value={interviews.length}
            />
            <HeaderMetric
              label="Resumes"
              value={resumes.filter((r) => !r?.isDeleted).length}
            />
          </div>

          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="flex h-9 items-center gap-2 rounded-[8px] bg-[#171717] px-3.5 text-[11px] font-medium text-white transition-all hover:bg-[#6D28D9]"
          >
            <Plus size={14} />
            New Resume
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-5 py-7 lg:px-10 lg:py-10">
        <section className="mb-8">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#6D28D9]" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#777B82]">
                  Application ready
                </span>
              </div>

              <h1 className="text-[34px] font-semibold tracking-[-0.05em] sm:text-[42px]">
                Your resumes are ready
                <br className="hidden sm:block" />{" "}
                <span className="text-[#92969D]">
                  for different opportunities.
                </span>
              </h1>
            </div>

            <p className="max-w-[340px] text-[12px] leading-5 text-[#858990]">
              Choose the right version of your experience before you
              apply. Your default resume can be selected when you
              submit an application.
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section>
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-1">
                <FilterButton
                  active={filter === "all"}
                  label="All"
                  onClick={() => setFilter("all")}
                />
                <FilterButton
                  active={filter === "default"}
                  label="Default"
                  onClick={() => setFilter("default")}
                />
                <FilterButton
                  active={filter === "most-used"}
                  label="Most Used"
                  onClick={() => setFilter("most-used")}
                />
              </div>

              <div className="relative w-full sm:w-[220px]">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A2A5AA]"
                />
                <input
                  type="text"
                  placeholder="Search resumes"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="h-9 w-full rounded-[8px] border border-black/[0.07] bg-white pl-9 pr-3 text-[11px] outline-none transition-all placeholder:text-[#A8ABB0] focus:border-[#6D28D9]/40 focus:ring-2 focus:ring-[#6D28D9]/5"
                />
              </div>
            </div>

            <div className="overflow-visible rounded-[12px] border border-black/[0.07] bg-white">
              {loading ? (
                <div className="px-5 py-12 text-center text-[11px] text-[#858990]">
                  Loading your workspace...
                </div>
              ) : filteredResumes.length === 0 ? (
                <div className="px-5 py-12 text-center">
                  <FileText
                    size={25}
                    className="mx-auto mb-3 text-[#A0A3A8]"
                  />
                  <p className="text-[12px] font-semibold">
                    {search || filter !== "all"
                      ? "No matching resumes"
                      : "No resumes yet"}
                  </p>
                  <p className="mt-1 text-[10px] text-[#858990]">
                    Upload a PDF to start building your resume library.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowCreate(true)}
                    className="mt-4 inline-flex h-9 items-center gap-2 rounded-[7px] bg-[#171717] px-4 text-[10px] font-medium text-white hover:bg-[#6D28D9]"
                  >
                    <Plus size={13} />
                    Add a resume
                  </button>
                </div>
              ) : (
                filteredResumes.map((resume, index) => (
                  <ResumeApplicationCard
                    key={resume._id}
                    resume={resume}
                    index={index}
                    active={activeResume === resume._id}
                    onSelect={() => handleOpenResume(resume)}
                    onMenu={() =>
                      setShowMenu((current) =>
                        current === resume._id ? null : resume._id
                      )
                    }
                    showMenu={showMenu === resume._id}
                  />
                ))
              )}

              <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="group flex w-full items-center gap-3 border-t border-black/[0.06] px-5 py-4 text-left transition-colors hover:bg-[#FAFAFB]"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-[7px] border border-dashed border-black/[0.14] text-[#A0A3A8] group-hover:border-[#6D28D9] group-hover:text-[#6D28D9]">
                  <Plus size={15} />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-[#70747A] group-hover:text-[#6D28D9]">
                    Add another resume
                  </p>
                  <p className="mt-0.5 text-[9px] text-[#A2A5AA]">
                    Create a role-specific version
                  </p>
                </div>
              </button>
            </div>

            <section className="mt-5 overflow-hidden rounded-[12px] border border-black/[0.07] bg-white">
              <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-4">
                <div>
                  <p className="text-[12px] font-semibold tracking-[-0.02em]">
                    Recent applications
                  </p>
                  <p className="mt-0.5 text-[9px] text-[#A0A3A8]">
                    See where your resumes are being used
                  </p>
                </div>
              </div>

              {applications.length > 0 ? (
                applications.slice(0, 5).map((application) => (
                  <ApplicationRow
                    key={application._id}
                    application={application}
                  />
                ))
              ) : (
                <p className="px-5 py-8 text-center text-[10px] text-[#858990]">
                  No applications to display yet.
                </p>
              )}
            </section>
          </section>

          <aside>
            <div className="sticky top-[88px] space-y-5">
              <section className="overflow-hidden rounded-[12px] border border-black/[0.07] bg-[#171717] text-white">
                <div className="border-b border-white/[0.08] px-5 py-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-white/45">
                      Default resume
                    </p>
                    <Star
                      size={14}
                      className="text-[#A78BFA]"
                      fill="currentColor"
                    />
                  </div>
                </div>

                {defaultResume ? (
                  <div className="p-5">
                    <div className="mb-5 flex items-start gap-2">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-white/[0.08]">
                        <FileText
                          size={17}
                          className="text-[#C4B5FD]"
                        />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-[14px] font-semibold">
                          {defaultResume.title}
                        </h3>
                        <p className="mt-1 text-[10px] text-white/40">
                          Updated {formatDate(defaultResume.updatedAt)}
                        </p>
                      </div>
                    </div>

                    <p className="mb-4 text-[10px] text-white/50">
                      {defaultResume.subtitle || defaultResume.target || "Default application document"}
                    </p>

                    <button
                      type="button"
                      onClick={() => handleOpenResume(defaultResume)}
                      className="flex h-10 w-full items-center justify-center gap-2 rounded-[7px] bg-white text-[10px] font-semibold text-[#171717] transition-colors hover:bg-[#EEE8FF]"
                    >
                      <FileText size={13} />
                      View resume details
                    </button>
                  </div>
                ) : (
                  <div className="p-5">
                    <p className="text-[11px] font-medium">
                      No default resume selected
                    </p>
                    <p className="mt-2 text-[10px] leading-4 text-white/50">
                      Choose a default resume to make application preparation easier.
                    </p>
                  </div>
                )}
              </section>

              <section className="rounded-[12px] border border-black/[0.07] bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[12px] font-semibold">
                      Resume overview
                    </p>
                    <p className="mt-0.5 text-[9px] text-[#A0A3A8]">
                      Your workspace at a glance
                    </p>
                  </div>
                  <Zap size={15} className="text-[#6D28D9]" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <MiniStat
                    label="Total resumes"
                    value={resumes.filter((r) => !r?.isDeleted).length}
                  />
                  <MiniStat
                    label="Applications"
                    value={applications.length}
                  />
                  <MiniStat
                    label="Interviews"
                    value={interviews.length}
                  />
                  <MiniStat
                    label="Profile views"
                    value={resumes.reduce(
                      (total, resume) =>
                        total + (Number(resume?.views) || 0),
                      0
                    )}
                    violet
                  />
                </div>
              </section>

              <section className="rounded-[12px] border border-black/[0.07] bg-white">
                <div className="border-b border-black/[0.06] px-5 py-4">
                  <p className="text-[12px] font-semibold">
                    Quick actions
                  </p>
                </div>

                <div className="p-2">
                  <QuickAction
                    icon={Upload}
                    title="Upload new resume"
                    description="Add another PDF to your library"
                  />
                  <QuickAction
                    icon={Copy}
                    title="Duplicate resume"
                    description="Prepare a role-specific version"
                  />
                  <QuickAction
                    icon={Settings2}
                    title="Resume preferences"
                    description="Manage your resume settings"
                  />
                </div>
              </section>
            </div>
          </aside>
        </div>
      </main>

      {selectedResume && (
        <ResumeDrawer
          resume={selectedResume}
          onClose={() => {
            setActiveResume(null);
            setShowPreview(false);
          }}
          onPreview={() => setShowPreview(true)}
        />
      )}

      {showCreate && (
        <CreateResumeModal
          onClose={() => setShowCreate(false)}
          onCreated={async () => {
            setShowCreate(false);
            await handleGetAllResumes?.();
          }}
        />
      )}

      {showPreview && selectedResume && (
        <FullPreview
          resume={selectedResume}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}

export default ResumePage
