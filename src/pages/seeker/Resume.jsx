import React, { useMemo, useState } from "react";
import {
    ArrowDownToLine,
    ArrowRight,
    BriefcaseBusiness,
    Check,
    ChevronDown,
    ChevronRight,
    Clock3,
    Copy,
    Download,
    Ellipsis,
    ExternalLink,
    FileText,
    Filter,
    MoreHorizontal,
    Pencil,
    Plus,
    Search,
    Send,
    Settings2,
    ShieldCheck,
    Star,
    Trash2,
    Upload,
    X,
    Zap,
} from "lucide-react";

const Resume = () => {
    const [activeResume, setActiveResume] = useState(null);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [showCreate, setShowCreate] = useState(false);
    const [showMenu, setShowMenu] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    const resumes = [
        {
            id: 1,
            title: "Software Engineer",
            subtitle: "General software engineering",
            file: "software-engineer.pdf",
            size: "2.4 MB",
            updated: "2 days ago",
            applications: 4,
            interviews: 2,
            views: 17,
            isDefault: true,
            readiness: 96,
            skills: ["C++", "React", "Node.js", "DSA"],
            target: "Software Engineer",
            status: "active",
            color: "violet",
        },
        {
            id: 2,
            title: "Backend Engineer",
            subtitle: "Backend & systems focused",
            file: "backend-engineer.pdf",
            size: "1.8 MB",
            updated: "8 days ago",
            applications: 2,
            interviews: 1,
            views: 8,
            isDefault: false,
            readiness: 91,
            skills: ["Node.js", "MongoDB", "REST API", "Redis"],
            target: "Backend Engineer",
            status: "active",
            color: "dark",
        },
        {
            id: 3,
            title: "Frontend Engineer",
            subtitle: "React & UI engineering",
            file: "frontend-engineer.pdf",
            size: "2.1 MB",
            updated: "14 days ago",
            applications: 1,
            interviews: 0,
            views: 5,
            isDefault: false,
            readiness: 87,
            skills: ["React", "JavaScript", "Tailwind", "UI"],
            target: "Frontend Engineer",
            status: "active",
            color: "light",
        },
    ];

    const applications = [
        {
            id: 1,
            company: "Microsoft",
            role: "Software Engineer",
            resume: "Software Engineer",
            status: "Interview",
            date: "Today",
            logo: "M",
        },
        {
            id: 2,
            company: "Amazon",
            role: "SDE I",
            resume: "Software Engineer",
            status: "Applied",
            date: "Yesterday",
            logo: "A",
        },
        {
            id: 3,
            company: "Razorpay",
            role: "Backend Engineer",
            resume: "Backend Engineer",
            status: "Review",
            date: "03 Oct",
            logo: "R",
        },
        {
            id: 4,
            company: "Google",
            role: "Frontend Engineer",
            resume: "Frontend Engineer",
            status: "Applied",
            date: "28 Sep",
            logo: "G",
        },
    ];

    
   const filteredResumes = useMemo(() => {
     let result = resumes;
   
     if (filter === "default") {
       result = result.filter((item) => item.isDefault);
     }
   
     if (filter === "most-used") {
       result = [...result].sort(
         (a, b) => b.applications - a.applications
       );
     }
   
     if (search.trim()) {
       const query = search.toLowerCase();
   
       result = result.filter(
         (item) =>
           item.title.toLowerCase().includes(query) ||
           item.subtitle.toLowerCase().includes(query) ||
           item.target.toLowerCase().includes(query)
       );
     }
     
     return result;
   }, [resumes, filter, search]);

    const selectedResume =
        resumes.find((item) => item.id === activeResume) || null;

    return (
        <div className="min-h-screen bg-[#F7F8FA] text-[#171717]">
            {/* =========================================================
                TOP NAV
            ========================================================= */}

            <header className="sticky top-0 z-40 border-b border-black/[0.07] bg-[#F7F8FA]/95 backdrop-blur-xl">
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
                            value="07"
                        />

                        <HeaderMetric
                            label="Interviews"
                            value="03"
                        />

                        <HeaderMetric
                            label="Resumes"
                            value="03"
                        />
                    </div>

                    <button
                        onClick={() => setShowCreate(true)}
                        className="flex h-9 items-center gap-2 rounded-[8px] bg-[#171717] px-3.5 text-[11px] font-medium text-white transition-all hover:bg-[#6D28D9]"
                    >
                        <Plus size={14} />
                        New Resume
                    </button>
                </div>
            </header>

            {/* =========================================================
                PAGE
            ========================================================= */}

            <main className="mx-auto max-w-[1500px] px-5 py-7 lg:px-10 lg:py-10">
                {/* =====================================================
                    INTRO
                ===================================================== */}

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
                                <br className="hidden sm:block" />
                                <span className="text-[#92969D]">
                                    {" "}
                                    for different opportunities.
                                </span>
                            </h1>
                        </div>

                        <p className="max-w-[340px] text-[12px] leading-5 text-[#858990]">
                            Choose the right version of your experience before
                            you apply. Your default resume will be selected
                            automatically when an application requires one.
                        </p>
                    </div>
                </section>

                {/* =====================================================
                    MAIN GRID
                ===================================================== */}

                <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
                    {/* =================================================
                        LEFT
                    ================================================= */}

                    <section className="min-w-0">
                        {/* Search / Filter */}
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
                                    label="Most used"
                                    onClick={() => setFilter("most-used")}
                                />
                            </div>

                            <div className="relative w-full sm:w-[220px]">
                                <Search
                                    size={14}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A2A5AA]"
                                />

                                <input
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    placeholder="Search resumes"
                                    className="h-9 w-full rounded-[8px] border border-black/[0.07] bg-white pl-9 pr-3 text-[11px] outline-none transition-all placeholder:text-[#A8ABB0] focus:border-[#6D28D9]/40 focus:ring-2 focus:ring-[#6D28D9]/5"
                                />
                            </div>
                        </div>

                        {/* Resume List */}
                        <div className="overflow-hidden rounded-[12px] border border-black/[0.07] bg-white">
                            {filteredResumes.map((resume, index) => (
                                <ResumeApplicationCard
                                    key={resume.id}
                                    resume={resume}
                                    index={index}
                                    active={
                                        activeResume === resume.id
                                    }
                                    onSelect={() =>
                                        setActiveResume(resume.id)
                                    }
                                    onMenu={() =>
                                        setShowMenu(
                                            showMenu === resume.id
                                                ? null
                                                : resume.id
                                        )
                                    }
                                    showMenu={showMenu === resume.id}
                                />
                            ))}

                            {/* Add row */}
                            <button
                                onClick={() => setShowCreate(true)}
                                className="group flex w-full items-center gap-3 border-t border-black/[0.06] px-5 py-4 text-left transition-colors hover:bg-[#FAFAFB]"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-[7px] border border-dashed border-black/[0.14] text-[#A0A3A8] transition-colors group-hover:border-[#6D28D9] group-hover:text-[#6D28D9]">
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

                        {/* =================================================
                            APPLICATIONS USING RESUMES
                        ================================================= */}

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

                                <button className="flex items-center gap-1 text-[10px] font-medium text-[#6D28D9]">
                                    View all
                                    <ArrowRight size={12} />
                                </button>
                            </div>

                            <div>
                                {applications.map((application) => (
                                    <ApplicationRow
                                        key={application.id}
                                        application={application}
                                    />
                                ))}
                            </div>
                        </section>
                    </section>

                    {/* =================================================
                        RIGHT COMMAND PANEL
                    ================================================= */}

                    <aside>
                        <div className="sticky top-[88px] space-y-5">
                            {/* Default resume */}
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

                                <div className="p-5">
                                    <div className="mb-5 flex items-start gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-white/[0.08]">
                                            <FileText
                                                size={17}
                                                className="text-[#C4B5FD]"
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="truncate text-[14px] font-semibold">
                                                Software Engineer
                                            </h3>

                                            <p className="mt-1 text-[10px] text-white/40">
                                                Updated 2 days ago
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mb-5">
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="text-[9px] uppercase tracking-[0.1em] text-white/40">
                                                Application readiness
                                            </span>

                                            <span className="text-[11px] font-semibold text-[#C4B5FD]">
                                                96%
                                            </span>
                                        </div>

                                        <div className="h-1 overflow-hidden rounded-full bg-white/[0.1]">
                                            <div
                                                className="h-full rounded-full bg-[#8B5CF6]"
                                                style={{ width: "96%" }}
                                            />
                                        </div>
                                    </div>

                                    <button className="flex h-10 w-full items-center justify-center gap-2 rounded-[7px] bg-white text-[10px] font-semibold text-[#171717] transition-colors hover:bg-[#EEE8FF]">
                                        <Send size={13} />
                                        Use for application
                                    </button>
                                </div>
                            </section>

                            {/* Readiness */}
                            <section className="rounded-[12px] border border-black/[0.07] bg-white p-5">
                                <div className="mb-5 flex items-center justify-between">
                                    <div>
                                        <p className="text-[12px] font-semibold">
                                            Resume health
                                        </p>

                                        <p className="mt-0.5 text-[9px] text-[#A0A3A8]">
                                            Overall application readiness
                                        </p>
                                    </div>

                                    <Zap
                                        size={15}
                                        className="text-[#6D28D9]"
                                    />
                                </div>

                                <div className="flex items-center gap-5">
                                    <ReadinessCircle value={96} />

                                    <div className="space-y-2">
                                        <HealthItem
                                            label="Profile information"
                                            complete
                                        />

                                        <HealthItem
                                            label="Experience"
                                            complete
                                        />

                                        <HealthItem
                                            label="Skills"
                                            complete
                                        />

                                        <HealthItem
                                            label="Resume file"
                                            complete
                                        />
                                    </div>
                                </div>

                                <button className="mt-5 flex w-full items-center justify-between border-t border-black/[0.06] pt-4 text-[10px] text-[#777B82] hover:text-[#6D28D9]">
                                    <span>Review resume details</span>
                                    <ChevronRight size={13} />
                                </button>
                            </section>

                            {/* Quick actions */}
                            <section className="rounded-[12px] border border-black/[0.07] bg-white">
                                <div className="border-b border-black/[0.06] px-5 py-4">
                                    <p className="text-[12px] font-semibold">
                                        Quick actions
                                    </p>
                                </div>

                                <div className="p-2">
                                    <QuickAction
                                        icon={Upload}
                                        title="Upload new version"
                                        description="Replace an existing document"
                                    />

                                    <QuickAction
                                        icon={Copy}
                                        title="Duplicate resume"
                                        description="Create a tailored version"
                                    />

                                    <QuickAction
                                        icon={Settings2}
                                        title="Resume preferences"
                                        description="Manage default behavior"
                                    />
                                </div>
                            </section>
                        </div>
                    </aside>
                </div>
            </main>

            {/* =========================================================
                DETAIL DRAWER
            ========================================================= */}

            {selectedResume && (
                <ResumeDrawer
                    resume={selectedResume}
                    onClose={() => setActiveResume(null)}
                    onPreview={() => setShowPreview(true)}
                />
            )}

            {/* =========================================================
                CREATE MODAL
            ========================================================= */}

            {showCreate && (
                <CreateResumeModal
                    onClose={() => setShowCreate(false)}
                />
            )}

            {/* =========================================================
                FULL PREVIEW
            ========================================================= */}

            {showPreview && selectedResume && (
                <FullPreview
                    resume={selectedResume}
                    onClose={() => setShowPreview(false)}
                />
            )}
        </div>
    );
};

/* =====================================================================
   HEADER METRIC
===================================================================== */

const HeaderMetric = ({ label, value }) => {
    return (
        <div className="text-right">
            <p className="text-[9px] uppercase tracking-[0.08em] text-[#A2A5AA]">
                {label}
            </p>

            <p className="mt-0.5 text-[13px] font-semibold">{value}</p>
        </div>
    );
};

/* =====================================================================
   FILTER BUTTON
===================================================================== */

const FilterButton = ({ active, label, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`h-8 rounded-[7px] px-3 text-[10px] font-medium transition-all ${
                active
                    ? "bg-[#171717] text-white"
                    : "text-[#858990] hover:bg-white hover:text-[#171717]"
            }`}
        >
            {label}
        </button>
    );
};

/* =====================================================================
   RESUME CARD
===================================================================== */

const ResumeApplicationCard = ({
    resume,
    index,
    active,
    onSelect,
    onMenu,
    showMenu,
}) => {
    return (
        <div
            className={`group relative border-b border-black/[0.06] px-5 py-5 transition-all last:border-b-0 ${
                active ? "bg-[#FBFAFF]" : "hover:bg-[#FAFAFB]"
            }`}
        >
            <div className="flex gap-4">
                {/* Number */}
                <div className="hidden w-5 shrink-0 pt-1 text-[9px] font-medium text-[#B0B3B8] sm:block">
                    {String(index + 1).padStart(2, "0")}
                </div>

                {/* Icon */}
                <button
                    onClick={onSelect}
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[9px] transition-all ${
                        active
                            ? "bg-[#EEE8FF] text-[#6D28D9]"
                            : "bg-[#F1F2F4] text-[#777B82] group-hover:bg-[#EEE8FF] group-hover:text-[#6D28D9]"
                    }`}
                >
                    <FileText size={18} strokeWidth={1.8} />
                </button>

                {/* Main */}
                <button
                    onClick={onSelect}
                    className="min-w-0 flex-1 text-left"
                >
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-[13px] font-semibold tracking-[-0.02em]">
                            {resume.title}
                        </h3>

                        {resume.isDefault && (
                            <span className="flex items-center gap-1 rounded-full bg-[#EEE8FF] px-2 py-0.5 text-[8px] font-medium text-[#6D28D9]">
                                <Star
                                    size={8}
                                    fill="currentColor"
                                />
                                Default
                            </span>
                        )}
                    </div>

                    <p className="mt-1 text-[10px] text-[#8C9096]">
                        {resume.subtitle}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        {resume.skills.map((skill) => (
                            <span
                                key={skill}
                                className="rounded-[4px] bg-[#F1F2F4] px-2 py-1 text-[8px] text-[#777B82]"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </button>

                {/* Stats */}
                <div className="hidden shrink-0 items-center gap-8 lg:flex">
                    <MiniStat
                        label="Applications"
                        value={resume.applications}
                    />

                    <MiniStat
                        label="Interviews"
                        value={resume.interviews}
                    />

                    <MiniStat
                        label="Ready"
                        value={`${resume.readiness}%`}
                        violet
                    />
                </div>

                {/* Menu */}
                <div className="relative shrink-0">
                    <button
                        onClick={onMenu}
                        className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[#A3A6AB] transition-colors hover:bg-[#F1F2F4] hover:text-[#171717]"
                    >
                        <MoreHorizontal size={16} />
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 top-9 z-20 w-44 rounded-[8px] border border-black/[0.08] bg-white p-1 shadow-[0_15px_40px_rgba(0,0,0,0.1)]">
                            <MenuAction icon={Pencil} label="Rename" />
                            <MenuAction
                                icon={ExternalLink}
                                label="Open document"
                            />
                            <MenuAction
                                icon={Download}
                                label="Download"
                            />
                            {!resume.isDefault && (
                                <MenuAction
                                    icon={Star}
                                    label="Set as default"
                                />
                            )}

                            <div className="my-1 border-t border-black/[0.06]" />

                            <MenuAction
                                icon={Trash2}
                                label="Move to recycle bin"
                                danger
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile stats */}
            <div className="mt-4 flex gap-5 pl-[59px] lg:hidden">
                <MiniStat
                    label="Applications"
                    value={resume.applications}
                />

                <MiniStat
                    label="Interviews"
                    value={resume.interviews}
                />

                <MiniStat
                    label="Ready"
                    value={`${resume.readiness}%`}
                    violet
                />
            </div>

            {/* Active indicator */}
            {active && (
                <div className="absolute bottom-0 left-0 top-0 w-[2px] bg-[#6D28D9]" />
            )}
        </div>
    );
};

/* =====================================================================
   MINI STAT
===================================================================== */

const MiniStat = ({ label, value, violet }) => {
    return (
        <div>
            <p className="text-[8px] uppercase tracking-[0.08em] text-[#A2A5AA]">
                {label}
            </p>

            <p
                className={`mt-1 text-[12px] font-semibold ${
                    violet ? "text-[#6D28D9]" : "text-[#555960]"
                }`}
            >
                {value}
            </p>
        </div>
    );
};

/* =====================================================================
   APPLICATION ROW
===================================================================== */

const ApplicationRow = ({ application }) => {
    const statusStyles = {
        Interview: "bg-[#EEE8FF] text-[#6D28D9]",
        Applied: "bg-[#F1F2F4] text-[#696D73]",
        Review: "bg-[#FFF4DB] text-[#9A6A14]",
    };

    return (
        <div className="flex items-center gap-3 border-b border-black/[0.05] px-5 py-4 last:border-b-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[7px] bg-[#171717] text-[11px] font-semibold text-white">
                {application.logo}
            </div>

            <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-semibold">
                    {application.company}
                </p>

                <p className="mt-0.5 truncate text-[9px] text-[#9699A0]">
                    {application.role}
                </p>
            </div>

            <div className="hidden min-w-[130px] sm:block">
                <p className="text-[9px] text-[#A0A3A8]">
                    Using
                </p>

                <p className="mt-0.5 text-[9px] font-medium text-[#64676D]">
                    {application.resume}
                </p>
            </div>

            <span
                className={`rounded-full px-2.5 py-1 text-[8px] font-medium ${
                    statusStyles[application.status]
                }`}
            >
                {application.status}
            </span>

            <span className="hidden w-[55px] text-right text-[9px] text-[#A0A3A8] md:block">
                {application.date}
            </span>

            <ChevronRight
                size={13}
                className="text-[#C1C3C6]"
            />
        </div>
    );
};

/* =====================================================================
   READINESS CIRCLE
===================================================================== */

const ReadinessCircle = ({ value }) => {
    const radius = 25;
    const circumference = 2 * Math.PI * radius;
    const progress = circumference - (value / 100) * circumference;

    return (
        <div className="relative h-[66px] w-[66px] shrink-0">
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
    );
};

/* =====================================================================
   HEALTH ITEM
===================================================================== */

const HealthItem = ({ label, complete }) => {
    return (
        <div className="flex items-center gap-2">
            <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                    complete
                        ? "bg-[#E9E4FF] text-[#6D28D9]"
                        : "bg-[#F1F2F4] text-[#999]"
                }`}
            >
                <Check size={9} strokeWidth={2.5} />
            </div>

            <span className="text-[9px] text-[#777B82]">
                {label}
            </span>
        </div>
    );
};

/* =====================================================================
   QUICK ACTION
===================================================================== */

const QuickAction = ({
    icon: Icon,
    title,
    description,
}) => {
    return (
        <button className="group flex w-full items-center gap-3 rounded-[8px] px-3 py-3 text-left transition-colors hover:bg-[#F7F8FA]">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[7px] bg-[#F1F2F4] text-[#777B82] transition-colors group-hover:bg-[#EEE8FF] group-hover:text-[#6D28D9]">
                <Icon size={14} />
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-[10px] font-medium text-[#555960] group-hover:text-[#171717]">
                    {title}
                </p>

                <p className="mt-0.5 truncate text-[8px] text-[#A0A3A8]">
                    {description}
                </p>
            </div>

            <ChevronRight
                size={13}
                className="text-[#C4C6C9] transition-transform group-hover:translate-x-0.5"
            />
        </button>
    );
};

/* =====================================================================
   MENU ACTION
===================================================================== */

const MenuAction = ({
    icon: Icon,
    label,
    danger,
}) => {
    return (
        <button
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

/* =====================================================================
   RESUME DRAWER
===================================================================== */

const ResumeDrawer = ({
    resume,
    onClose,
    onPreview,
}) => {
    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
                onClick={onClose}
            />

            <aside className="relative z-10 flex h-full w-full max-w-[650px] flex-col bg-[#F7F8FA] shadow-[-20px_0_60px_rgba(0,0,0,0.12)]">
                {/* Header */}
                <div className="flex h-[70px] shrink-0 items-center justify-between border-b border-black/[0.07] bg-white px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#EEE8FF] text-[#6D28D9]">
                            <FileText size={16} />
                        </div>

                        <div>
                            <p className="text-[12px] font-semibold">
                                {resume.title}
                            </p>

                            <p className="mt-0.5 text-[9px] text-[#A0A3A8]">
                                Resume details
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[#858990] hover:bg-[#F1F2F4] hover:text-[#171717]"
                    >
                        <X size={17} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Resume preview */}
                    <div className="mb-5 overflow-hidden rounded-[10px] border border-black/[0.07] bg-[#E9EAEC] p-6">
                        <div className="mx-auto aspect-[1/1.414] max-w-[300px] bg-white shadow-[0_15px_40px_rgba(0,0,0,0.1)]">
                            <MiniResumePaper />
                        </div>

                        <button
                            onClick={onPreview}
                            className="mx-auto mt-4 flex items-center gap-2 text-[10px] font-medium text-[#6D28D9]"
                        >
                            <ExternalLink size={12} />
                            
                        </button>
                    </div>

                    {/* Info */}
                    <div className="rounded-[10px] border border-black/[0.07] bg-white">
                        <DetailRow
                            label="Resume"
                            value={resume.title}
                        />

                        <DetailRow
                            label="Target role"
                            value={resume.target}
                        />

                        <DetailRow
                            label="File"
                            value={resume.file}
                        />

                        <DetailRow
                            label="Size"
                            value={resume.size}
                        />

                        <DetailRow
                            label="Last updated"
                            value={resume.updated}
                        />

                        <DetailRow
                            label="Applications"
                            value={resume.applications}
                        />

                        <DetailRow
                            label="Interviews"
                            value={resume.interviews}
                        />

                        <DetailRow
                            label="Profile views"
                            value={resume.views}
                            last
                        />
                    </div>

                    {/* Skills */}
                    <div className="mt-5 rounded-[10px] border border-black/[0.07] bg-white p-5">
                        <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8D9197]">
                            Target skills
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {resume.skills.map((skill) => (
                                <span
                                    key={skill}
                                    className="rounded-[5px] bg-[#F1F2F4] px-2.5 py-1.5 text-[9px] text-[#666A70]"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Application insight */}
                    <div className="mt-5 rounded-[10px] border border-[#DDD5FF] bg-[#F7F5FF] p-5">
                        <div className="flex items-start gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[7px] bg-[#E9E3FF] text-[#6D28D9]">
                                <BriefcaseBusiness size={14} />
                            </div>

                            <div>
                                <p className="text-[10px] font-semibold text-[#51417C]">
                                    Application insight
                                </p>

                                <p className="mt-1 text-[9px] leading-4 text-[#81769C]">
                                    This resume has been used for{" "}
                                    <strong>
                                        {resume.applications} applications
                                    </strong>{" "}
                                    and is currently your{" "}
                                    {resume.isDefault
                                        ? "default"
                                        : "role-specific"}{" "}
                                    application document.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="grid shrink-0 grid-cols-2 gap-2 border-t border-black/[0.07] bg-white p-4">
                    <button className="flex h-10 items-center justify-center gap-2 rounded-[7px] border border-black/[0.08] text-[10px] font-medium text-[#64676D] hover:bg-[#F7F8FA]">
                        <ArrowDownToLine size={13} />
                        Download
                    </button>

                    <button className="flex h-10 items-center justify-center gap-2 rounded-[7px] bg-[#171717] text-[10px] font-medium text-white hover:bg-[#6D28D9]">
                        <Send size={13} />
                        Use for application
                    </button>
                </div>
            </aside>
        </div>
    );
};

/* =====================================================================
   DETAIL ROW
===================================================================== */

const DetailRow = ({
    label,
    value,
    last,
}) => {
    return (
        <div
            className={`flex items-center justify-between px-5 py-4 ${
                !last ? "border-b border-black/[0.05]" : ""
            }`}
        >
            <span className="text-[9px] text-[#A0A3A8]">
                {label}
            </span>

            <span className="max-w-[65%] truncate text-right text-[10px] font-medium text-[#555960]">
                {value}
            </span>
        </div>
    );
};

/* =====================================================================
   CREATE MODAL
===================================================================== */

const CreateResumeModal = ({ onClose }) => {
    const [title, setTitle] = useState("");
    const [file, setFile] = useState(null);
    const [dragging, setDragging] = useState(false);

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 p-5 backdrop-blur-sm">
            <div className="w-full max-w-[520px] overflow-hidden rounded-[12px] border border-black/[0.08] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.18)]">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-black/[0.06] px-6 py-5">
                    <div>
                        <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#A0A3A8]">
                            Resume workspace
                        </p>

                        <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.035em]">
                            Create a resume
                        </h2>

                        <p className="mt-1 text-[10px] text-[#9A9DA3]">
                            Add a version you can use for applications.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[#8D9197] hover:bg-[#F1F2F4]"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="space-y-5 px-6 py-6">
                    <div>
                        <label className="mb-2 block text-[10px] font-medium text-[#60646A]">
                            Resume title
                        </label>

                        <input
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                            placeholder="Software Engineer"
                            className="h-10 w-full rounded-[7px] border border-black/[0.09] bg-[#FAFAFB] px-3 text-[11px] outline-none transition-all placeholder:text-[#B0B3B8] focus:border-[#6D28D9]/40 focus:bg-white focus:ring-2 focus:ring-[#6D28D9]/5"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-[10px] font-medium text-[#60646A]">
                            Resume PDF
                        </label>

                        <label
                            onDragOver={(e) => {
                                e.preventDefault();
                                setDragging(true);
                            }}
                            onDragLeave={() => setDragging(false)}
                            onDrop={(e) => {
                                e.preventDefault();
                                setDragging(false);

                                const dropped =
                                    e.dataTransfer.files?.[0];

                                if (
                                    dropped &&
                                    dropped.type ===
                                        "application/pdf"
                                ) {
                                    setFile(dropped);
                                }
                            }}
                            className={`flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-[9px] border border-dashed transition-all ${
                                dragging
                                    ? "border-[#6D28D9] bg-[#F5F1FF]"
                                    : "border-black/[0.12] bg-[#FAFAFB] hover:border-[#6D28D9]/50 hover:bg-[#FCFBFF]"
                            }`}
                        >
                            <input
                                type="file"
                                accept="application/pdf"
                                className="hidden"
                                onChange={(e) =>
                                    setFile(
                                        e.target.files?.[0] ||
                                            null
                                    )
                                }
                            />

                            {file ? (
                                <>
                                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#E9E3FF] text-[#6D28D9]">
                                        <Check size={16} />
                                    </div>

                                    <p className="max-w-[320px] truncate text-[11px] font-medium">
                                        {file.name}
                                    </p>

                                    <p className="mt-1 text-[9px] text-[#9A9DA3]">
                                        PDF selected
                                    </p>
                                </>
                            ) : (
                                <>
                                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#F1F2F4] text-[#777B82]">
                                        <Upload size={15} />
                                    </div>

                                    <p className="text-[11px] font-medium">
                                        Drop your PDF here
                                    </p>

                                    <p className="mt-1 text-[9px] text-[#A0A3A8]">
                                        or click to browse
                                    </p>
                                </>
                            )}
                        </label>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 border-t border-black/[0.06] bg-[#FAFAFB] px-6 py-4">
                    <button
                        onClick={onClose}
                        className="h-9 rounded-[7px] px-4 text-[10px] font-medium text-[#777B82] hover:bg-[#F1F2F4]"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={!title.trim() || !file}
                        className="h-9 rounded-[7px] bg-[#171717] px-5 text-[10px] font-medium text-white transition-colors hover:bg-[#6D28D9] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                        Create resume
                    </button>
                </div>
            </div>
        </div>
    );
};

/* =====================================================================
   MINI RESUME PAPER
===================================================================== */

const MiniResumePaper = () => {
    return (
        <div className="h-full bg-white p-[8%]">
            <div className="border-b border-black pb-[5%]">
                <div className="h-3 w-[45%] bg-[#171717]" />
                <div className="mt-2 h-1.5 w-[25%] bg-[#A3A6AB]" />

                <div className="mt-3 flex justify-between">
                    <div className="h-1 w-[30%] bg-[#D1D3D6]" />
                    <div className="h-1 w-[20%] bg-[#D1D3D6]" />
                </div>
            </div>

            {[1, 2, 3, 4].map((section) => (
                <div key={section} className="mt-[8%]">
                    <div className="h-1.5 w-[22%] bg-[#171717]" />

                    <div className="mt-3 space-y-1.5">
                        <div className="h-1 w-[90%] bg-[#D8DADD]" />
                        <div className="h-1 w-[80%] bg-[#D8DADD]" />
                        <div className="h-1 w-[72%] bg-[#D8DADD]" />
                    </div>
                </div>
            ))}
        </div>
    );
};

/* =====================================================================
   FULL PREVIEW
===================================================================== */

const FullPreview = ({
    resume,
    onClose,
}) => {
    return (
        <div className="fixed inset-0 z-[300] flex flex-col bg-[#191A1D]">
            <header className="flex h-[64px] shrink-0 items-center justify-between border-b border-white/[0.08] px-5 text-white lg:px-8">
                <div className="flex items-center gap-3">
                    <FileText size={16} />

                    <div>
                        <p className="text-[11px] font-medium">
                            {resume.title}
                        </p>

                        <p className="text-[8px] text-white/40">
                            {resume.file}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="hidden h-8 items-center gap-2 border border-white/[0.1] px-3 text-[9px] text-white/60 hover:bg-white/[0.05] hover:text-white sm:flex">
                        <Download size={13} />
                        Download
                    </button>

                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-[6px] text-white/50 hover:bg-white/[0.07] hover:text-white"
                    >
                        <X size={16} />
                    </button>
                </div>
            </header>

            <div className="flex flex-1 justify-center overflow-auto bg-[#292B2F] p-5 lg:p-12">
                <div className="h-fit w-full max-w-[850px] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
                    <MiniResumePaper />
                </div>
            </div>
        </div>
    );
};

export default Resume;