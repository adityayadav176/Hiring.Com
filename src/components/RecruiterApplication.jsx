
import React, { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Download,
  Users,
  UserCheck,
  Clock3,
  BriefcaseBusiness,
  CheckCircle2,
  XCircle,
  Eye,
  MessageSquareText,
  MapPin,
  Mail,
  Phone,
  ExternalLink,
  ArrowUpDown,
  X,
  Check,
  Sparkles,
  MoreHorizontal,
  FileText,
  CircleHelp,
  RotateCcw,
  Plus,
  LayoutGrid,
  List,
  Send,
  ShieldCheck,
  TrendingUp,
  Bookmark,
  CircleDot,
} from "lucide-react";

const INITIAL_APPLICATIONS = [
  {
    _id: "app-101",
    candidate: {
      name: "Aarav Sharma",
      email: "aarav.sharma@example.com",
      phone: "+91 98765 43210",
      location: "Bengaluru, India",
      avatar: "AS",
      color: "bg-violet-100 text-violet-700",
      experience: "3 years",
      currentRole: "Frontend Developer",
      skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
      education: "B.Tech, Computer Science",
      university: "Manipal Institute of Technology",
      portfolio: "https://github.com/",
    },
    job: "Senior Frontend Developer",
    department: "Engineering",
    resume: "Aarav_Sharma_Resume.pdf",
    appliedAt: "2026-10-18T10:30:00",
    status: "screening",
    score: 92,
    recruiterNotes: "Strong React experience. Review system design knowledge.",
    messageToRecruiter:
      "I enjoy building accessible, high-performance interfaces and would love to contribute to your product.",
  },
  {
    _id: "app-102",
    candidate: {
      name: "Priya Verma",
      email: "priya.verma@example.com",
      phone: "+91 98123 45678",
      location: "Delhi, India",
      avatar: "PV",
      color: "bg-pink-100 text-pink-700",
      experience: "5 years",
      currentRole: "Full Stack Engineer",
      skills: ["Node.js", "React", "MongoDB", "AWS"],
      education: "MCA",
      university: "Delhi University",
      portfolio: "https://github.com/",
    },
    job: "Full Stack Developer",
    department: "Engineering",
    resume: "Priya_Verma_CV.pdf",
    appliedAt: "2026-10-17T14:15:00",
    status: "shortlisted",
    score: 96,
    recruiterNotes: "Excellent full-stack profile. Prioritize interview scheduling.",
    messageToRecruiter:
      "My recent projects include scalable APIs and React dashboards used by real customers.",
  },
  {
    _id: "app-103",
    candidate: {
      name: "Rohan Gupta",
      email: "rohan.gupta@example.com",
      phone: "+91 98989 12345",
      location: "Pune, India",
      avatar: "RG",
      color: "bg-blue-100 text-blue-700",
      experience: "2 years",
      currentRole: "Backend Developer",
      skills: ["Node.js", "Express", "PostgreSQL", "Redis"],
      education: "B.Tech, IT",
      university: "Pune Institute of Computer Technology",
      portfolio: "https://github.com/",
    },
    job: "Backend Engineer",
    department: "Engineering",
    resume: "Rohan_Gupta_Resume.pdf",
    appliedAt: "2026-10-17T09:20:00",
    status: "applied",
    score: 84,
    recruiterNotes: "",
    messageToRecruiter:
      "I focus on reliable backend services, API design, and database performance.",
  },
  {
    _id: "app-104",
    candidate: {
      name: "Sneha Patel",
      email: "sneha.patel@example.com",
      phone: "+91 97654 32109",
      location: "Mumbai, India",
      avatar: "SP",
      color: "bg-amber-100 text-amber-700",
      experience: "4 years",
      currentRole: "Product Designer",
      skills: ["Figma", "Prototyping", "Design Systems", "UX Research"],
      education: "B.Des, Communication Design",
      university: "NID Ahmedabad",
      portfolio: "https://www.behance.net/",
    },
    job: "UI/UX Designer",
    department: "Design",
    resume: "Sneha_Patel_Portfolio.pdf",
    appliedAt: "2026-10-16T16:45:00",
    status: "interview_scheduled",
    score: 89,
    recruiterNotes: "Portfolio looks strong. Discuss design systems and collaboration.",
    messageToRecruiter:
      "I combine user research and design systems to create clear, useful product experiences.",
  },
  {
    _id: "app-105",
    candidate: {
      name: "Kabir Singh",
      email: "kabir.singh@example.com",
      phone: "+91 99887 66554",
      location: "Hyderabad, India",
      avatar: "KS",
      color: "bg-emerald-100 text-emerald-700",
      experience: "1 year",
      currentRole: "Junior Software Engineer",
      skills: ["JavaScript", "React", "Git", "REST APIs"],
      education: "BCA",
      university: "Osmania University",
      portfolio: "https://github.com/",
    },
    job: "Frontend Developer",
    department: "Engineering",
    resume: "Kabir_Singh_Resume.pdf",
    appliedAt: "2026-10-16T11:10:00",
    status: "applied",
    score: 76,
    recruiterNotes: "",
    messageToRecruiter:
      "I am eager to grow as an engineer and contribute to a collaborative team.",
  },
  {
    _id: "app-106",
    candidate: {
      name: "Ananya Mehta",
      email: "ananya.mehta@example.com",
      phone: "+91 98712 34567",
      location: "Jaipur, India",
      avatar: "AM",
      color: "bg-fuchsia-100 text-fuchsia-700",
      experience: "6 years",
      currentRole: "Engineering Lead",
      skills: ["System Design", "TypeScript", "AWS", "Team Leadership"],
      education: "M.Tech, Computer Science",
      university: "BITS Pilani",
      portfolio: "https://github.com/",
    },
    job: "Senior Frontend Developer",
    department: "Engineering",
    resume: "Ananya_Mehta_CV.pdf",
    appliedAt: "2026-10-15T13:25:00",
    status: "selected",
    score: 98,
    recruiterNotes: "Great leadership experience and strong technical depth.",
    messageToRecruiter:
      "I enjoy mentoring engineers while building maintainable, high-quality software.",
  },
  {
    _id: "app-107",
    candidate: {
      name: "Ishaan Kapoor",
      email: "ishaan.kapoor@example.com",
      phone: "+91 98901 23456",
      location: "Noida, India",
      avatar: "IK",
      color: "bg-cyan-100 text-cyan-700",
      experience: "2 years",
      currentRole: "Software Developer",
      skills: ["Python", "Django", "SQL", "Docker"],
      education: "B.Tech, Computer Science",
      university: "Amity University",
      portfolio: "https://github.com/",
    },
    job: "Backend Engineer",
    department: "Engineering",
    resume: "Ishaan_Kapoor_Resume.pdf",
    appliedAt: "2026-10-14T10:00:00",
    status: "rejected",
    score: 68,
    recruiterNotes: "Experience did not align with current role requirements.",
    messageToRecruiter:
      "I have built backend applications and enjoy solving practical engineering problems.",
  },
  {
    _id: "app-108",
    candidate: {
      name: "Meera Joshi",
      email: "meera.joshi@example.com",
      phone: "+91 98222 45678",
      location: "Chennai, India",
      avatar: "MJ",
      color: "bg-rose-100 text-rose-700",
      experience: "3 years",
      currentRole: "UI Engineer",
      skills: ["React", "CSS", "Accessibility", "Storybook"],
      education: "B.Tech, Information Technology",
      university: "Anna University",
      portfolio: "https://github.com/",
    },
    job: "Frontend Developer",
    department: "Engineering",
    resume: "Meera_Joshi_Resume.pdf",
    appliedAt: "2026-10-13T15:30:00",
    status: "interview_completed",
    score: 87,
    recruiterNotes: "Interview completed. Team feedback pending.",
    messageToRecruiter:
      "I care about frontend quality, accessibility, and reusable UI components.",
  },
];

const STATUS_OPTIONS = [
  { value: "applied", label: "New application" },
  { value: "screening", label: "In screening" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "interview_scheduled", label: "Interview scheduled" },
  { value: "interview_completed", label: "Interview completed" },
  { value: "selected", label: "Selected" },
  { value: "rejected", label: "Rejected" },
];

const STATUS_META = {
  applied: {
    label: "New application",
    className: "bg-sky-50 text-sky-700 ring-sky-200",
    dot: "bg-sky-500",
  },
  screening: {
    label: "In screening",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
    dot: "bg-amber-500",
  },
  shortlisted: {
    label: "Shortlisted",
    className: "bg-violet-50 text-violet-700 ring-violet-200",
    dot: "bg-violet-500",
  },
  interview_scheduled: {
    label: "Interview scheduled",
    className: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    dot: "bg-indigo-500",
  },
  interview_completed: {
    label: "Interview completed",
    className: "bg-cyan-50 text-cyan-700 ring-cyan-200",
    dot: "bg-cyan-500",
  },
  selected: {
    label: "Selected",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500",
  },
  rejected: {
    label: "Rejected",
    className: "bg-rose-50 text-rose-700 ring-rose-200",
    dot: "bg-rose-500",
  },
  withdrawn: {
    label: "Withdrawn",
    className: "bg-slate-100 text-slate-600 ring-slate-200",
    dot: "bg-slate-400",
  },
  closed: {
    label: "Closed",
    className: "bg-slate-100 text-slate-600 ring-slate-200",
    dot: "bg-slate-400",
  },
};

const JOB_OPTIONS = [
  "All jobs",
  ...new Set(INITIAL_APPLICATIONS.map((item) => item.job)),
];

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const formatRelativeDate = (value) => {
  const date = new Date(value);
  const now = new Date();
  const diff = Math.max(
    0,
    Math.floor((now.getTime() - date.getTime()) / 86400000)
  );

  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return `${diff} days ago`;
};

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.applied;

  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${meta.className}`}
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

function MetricCard({ title, value, description, icon: Icon, tone }) {
  const tones = {
    violet: "bg-violet-50 text-violet-700",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    emerald: "bg-emerald-50 text-emerald-700",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            {value}
          </p>
        </div>
        <div className={`rounded-xl p-3 ${tones[tone]}`}>
          <Icon size={21} />
        </div>
      </div>
      <p className="mt-4 text-xs text-slate-500">{description}</p>
    </div>
  );
}

function CandidateAvatar({ candidate, size = "normal" }) {
  const sizes =
    size === "large"
      ? "h-14 w-14 rounded-2xl text-lg"
      : "h-10 w-10 rounded-xl text-sm";

  return (
    <div
      className={`${sizes} ${candidate.color} flex shrink-0 items-center justify-center font-bold ring-1 ring-black/5`}
    >
      {candidate.avatar}
    </div>
  );
}

function DetailField({ icon: Icon, children }) {
  return (
    <div className="flex min-w-0 items-center gap-2 text-sm text-slate-600">
      <Icon size={16} className="shrink-0 text-slate-400" />
      <span className="truncate">{children}</span>
    </div>
  );
}

function ApplicationDrawer({
  application,
  onClose,
  onStatusChange,
  onNotesSave,
  onToast,
}) {
  const [notes, setNotes] = useState(application.recruiterNotes || "");
  const [savingNotes, setSavingNotes] = useState(false);

  React.useEffect(() => {
    setNotes(application.recruiterNotes || "");
  }, [application._id, application.recruiterNotes]);

  const changeStatus = (status) => {
    onStatusChange(application._id, status);
    onToast(`Status updated to ${STATUS_META[status]?.label || status}`);
  };

  const saveNotes = async () => {
    setSavingNotes(true);
    await Promise.resolve();
    onNotesSave(application._id, notes);
    setSavingNotes(false);
    onToast("Recruiter notes saved");
  };

  const canShortlist = ![
    "selected",
    "rejected",
    "withdrawn",
    "closed",
  ].includes(application.status);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close application details"
        className="absolute inset-0 cursor-default bg-slate-950/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <aside className="relative flex h-full w-full max-w-xl flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-200">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-700">
              Application details
            </p>
            <p className="mt-1 text-sm text-slate-500">
              ID: {application._id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-violet-50 via-white to-white p-5">
            <div className="flex items-start gap-4">
              <CandidateAvatar candidate={application.candidate} size="large" />
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-bold text-slate-950">
                  {application.candidate.name}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {application.candidate.currentRole}
                </p>
                <div className="mt-3">
                  <StatusBadge status={application.status} />
                </div>
              </div>
              <div className="rounded-xl border border-violet-100 bg-white px-3 py-2 text-center">
                <p className="text-2xl font-bold text-violet-700">
                  {application.score}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Match
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 border-t border-violet-100 pt-4">
              <DetailField icon={Mail}>
                {application.candidate.email}
              </DetailField>
              <DetailField icon={Phone}>
                {application.candidate.phone}
              </DetailField>
              <DetailField icon={MapPin}>
                {application.candidate.location}
              </DetailField>
              <DetailField icon={BriefcaseBusiness}>
                {application.candidate.experience} experience
              </DetailField>
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-slate-950">Application status</h3>
              <span className="text-xs text-slate-400">Editable</span>
            </div>

            <label className="mb-2 block text-xs font-medium text-slate-500">
              Update candidate stage
            </label>
            <select
              value={application.status}
              onChange={(event) => changeStatus(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className="mt-3 flex flex-wrap gap-2">
              {canShortlist && (
                <button
                  onClick={() => changeStatus("shortlisted")}
                  className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800"
                >
                  <UserCheck size={16} />
                  Shortlist
                </button>
              )}
              {!["selected", "rejected"].includes(application.status) && (
                <button
                  onClick={() => changeStatus("rejected")}
                  className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
                >
                  <XCircle size={16} />
                  Reject
                </button>
              )}
            </div>
          </section>

          <section>
            <h3 className="mb-3 font-semibold text-slate-950">
              Position applied for
            </h3>
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="font-semibold text-slate-900">{application.job}</p>
              <p className="mt-1 text-sm text-slate-500">
                {application.department} · Applied {formatDate(application.appliedAt)}
              </p>
            </div>
          </section>

          <section>
            <h3 className="mb-3 font-semibold text-slate-950">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {application.candidate.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-3 font-semibold text-slate-950">
              Education
            </h3>
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="font-medium text-slate-900">
                {application.candidate.education}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {application.candidate.university}
              </p>
            </div>
          </section>

          <section>
            <h3 className="mb-3 font-semibold text-slate-950">
              Candidate message
            </h3>
            <div className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              {application.messageToRecruiter || "No message provided."}
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="font-semibold text-slate-950">
                Private recruiter notes
              </h3>
              <ShieldCheck size={17} className="text-violet-600" />
            </div>
            <p className="mb-3 text-xs text-slate-500">
              Visible to your recruiting team only.
            </p>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              maxLength={5000}
              rows={4}
              placeholder="Add interview feedback, observations, or follow-up reminders..."
              className="w-full resize-y rounded-xl border border-slate-200 p-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            />
            <div className="mt-2 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                {notes.length}/5000 characters
              </span>
              <button
                onClick={saveNotes}
                disabled={savingNotes || notes.length > 5000}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Check size={16} />
                {savingNotes ? "Saving..." : "Save notes"}
              </button>
            </div>
          </section>

          <section>
            <h3 className="mb-3 font-semibold text-slate-950">
              Resume
            </h3>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
              <div className="rounded-xl bg-rose-50 p-3 text-rose-600">
                <FileText size={22} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {application.resume}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Resume attached to application
                </p>
              </div>
              <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-500">
                PDF
              </span>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              Demo mode: the filename is mock data, not a downloadable resume.
            </p>
          </section>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4">
          <span className="text-xs text-slate-500">
            Last applied {formatRelativeDate(application.appliedAt)}
          </span>
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Close details
          </button>
        </div>
      </aside>
    </div>
  );
}

export default function RecruiterApplication() {
  const [items, setItems] = useState(INITIAL_APPLICATIONS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobFilter, setJobFilter] = useState("All jobs");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [view, setView] = useState("table");
  const [selectedId, setSelectedId] = useState(null);
  const [toast, setToast] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const selectedApplication = items.find(
    (item) => item._id === selectedId
  );

  const stats = useMemo(() => {
    const active = items.filter(
      (item) => !["rejected", "withdrawn", "closed"].includes(item.status)
    );

    return {
      total: items.length,
      review: items.filter((item) =>
        ["applied", "screening"].includes(item.status)
      ).length,
      shortlisted: items.filter((item) => item.status === "shortlisted").length,
      interviews: items.filter((item) =>
        ["interview_scheduled", "interview_completed"].includes(item.status)
      ).length,
      selected: items.filter((item) => item.status === "selected").length,
      active: active.length,
    };
  }, [items]);

  const filteredApplications = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    let result = items.filter((item) => {
      const matchesSearch =
        !normalizedSearch ||
        [
          item.candidate.name,
          item.candidate.email,
          item.candidate.currentRole,
          item.job,
          item._id,
          ...item.candidate.skills,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      const matchesJob =
        jobFilter === "All jobs" || item.job === jobFilter;

      return matchesSearch && matchesStatus && matchesJob;
    });

    result = [...result].sort((a, b) => {
      if (sortBy === "oldest") {
        return new Date(a.appliedAt) - new Date(b.appliedAt);
      }
      if (sortBy === "name") {
        return a.candidate.name.localeCompare(b.candidate.name);
      }
      if (sortBy === "score") {
        return b.score - a.score;
      }
      return new Date(b.appliedAt) - new Date(a.appliedAt);
    });

    return result;
  }, [items, search, statusFilter, jobFilter, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredApplications.length / pageSize)
  );

  const safePage = Math.min(page, totalPages);

  const visibleApplications = filteredApplications.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const updateStatus = (applicationId, status) => {
    setItems((prev) =>
      prev.map((item) =>
        item._id === applicationId ? { ...item, status } : item
      )
    );
  };

  const saveNotes = (applicationId, recruiterNotes) => {
    setItems((prev) =>
      prev.map((item) =>
        item._id === applicationId
          ? { ...item, recruiterNotes }
          : item
      )
    );
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setJobFilter("All jobs");
    setSortBy("newest");
    setPage(1);
  };

  const exportCsv = () => {
    const headers = [
      "Application ID",
      "Candidate",
      "Email",
      "Position",
      "Status",
      "Match Score",
      "Experience",
      "Applied Date",
      "Recruiter Notes",
    ];

    const rows = filteredApplications.map((item) => [
      item._id,
      item.candidate.name,
      item.candidate.email,
      item.job,
      STATUS_META[item.status]?.label || item.status,
      item.score,
      item.candidate.experience,
      formatDate(item.appliedAt),
      item.recruiterNotes,
    ]);

    const escapeCsv = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "peer-hiring-applications.csv";
    link.click();
    URL.revokeObjectURL(url);

    setShowExportMenu(false);
    notify("CSV exported successfully");
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-slate-900">
      <main className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">
              <Sparkles size={15} />
              Talent workspace
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Applications
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Review candidates, manage hiring stages, and keep your recruitment
              pipeline moving.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setShowExportMenu((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <Download size={16} />
                Export
                <ChevronDown size={15} />
              </button>
              {showExportMenu && (
                <div className="absolute right-0 top-12 z-20 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                  <button
                    onClick={exportCsv}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-violet-50 hover:text-violet-700"
                  >
                    <FileText size={16} />
                    Export filtered CSV
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                resetFilters();
                notify("Filters reset");
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-800"
            >
              <RotateCcw size={16} />
              Reset view
            </button>
          </div>
        </header>

        {/* Demo notice */}
        <div className="flex items-start gap-3 rounded-2xl border border-violet-100 bg-violet-50/70 px-4 py-3.5">
          <div className="rounded-lg bg-white p-2 text-violet-700 shadow-sm">
            <CircleHelp size={17} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-violet-950">
              Frontend demo mode
            </p>
            <p className="mt-1 text-xs leading-5 text-violet-800/80">
              Candidate data is fictional. Status changes, notes, and filters
              work locally in this page; they are not saved to your database.
            </p>
          </div>
          <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-violet-700 ring-1 ring-violet-200">
            Mock data
          </span>
        </div>

        {/* Metric cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Total applications"
            value={stats.total}
            description={`${stats.active} active candidates in the pipeline`}
            icon={Users}
            tone="violet"
          />
          <MetricCard
            title="Needs review"
            value={stats.review}
            description="New applications and screening"
            icon={Clock3}
            tone="amber"
          />
          <MetricCard
            title="Shortlisted"
            value={stats.shortlisted}
            description="Candidates ready for the next step"
            icon={UserCheck}
            tone="blue"
          />
          <MetricCard
            title="Interviews"
            value={stats.interviews}
            description={`${stats.selected} candidate(s) selected`}
            icon={CalendarDays}
            tone="emerald"
          />
        </section>

        {/* Pipeline */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-bold text-slate-950">Hiring pipeline</h2>
              <p className="mt-1 text-sm text-slate-500">
                A live overview of the current demo dataset.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {[
                { label: "New", value: "applied" },
                { label: "Screening", value: "screening" },
                { label: "Shortlisted", value: "shortlisted" },
                { label: "Interview", value: "interview_scheduled" },
                { label: "Selected", value: "selected" },
              ].map((stage) => {
                const count = items.filter(
                  (item) => item.status === stage.value
                ).length;

                return (
                  <button
                    key={stage.value}
                    onClick={() => {
                      setStatusFilter(stage.value);
                      setPage(1);
                    }}
                    className={`rounded-xl border px-3 py-2 text-left transition ${
                      statusFilter === stage.value
                        ? "border-violet-300 bg-violet-50"
                        : "border-slate-200 bg-white hover:border-violet-200 hover:bg-violet-50/50"
                    }`}
                  >
                    <span className="block text-[11px] font-medium text-slate-500">
                      {stage.label}
                    </span>
                    <span className="mt-0.5 block text-base font-bold text-slate-900">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search and filters */}
          <div className="space-y-3 border-b border-slate-100 p-4 sm:p-5">
            <div className="flex flex-col gap-3 xl:flex-row">
              <div className="relative min-w-0 flex-1">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search candidates, skills, emails, or positions..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />
                {search && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setPage(1);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                    aria-label="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="relative min-w-[170px] flex-1 sm:flex-none">
                  <BriefcaseBusiness
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <select
                    value={jobFilter}
                    onChange={(event) => {
                      setJobFilter(event.target.value);
                      setPage(1);
                    }}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-9 text-sm font-medium text-slate-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                  >
                    {JOB_OPTIONS.map((job) => (
                      <option key={job} value={job}>
                        {job}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>

                <button
                  onClick={() => setShowFilters((prev) => !prev)}
                  className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    showFilters || statusFilter !== "all"
                      ? "border-violet-200 bg-violet-50 text-violet-700"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <SlidersHorizontal size={16} />
                  Filters
                  <ChevronDown
                    size={14}
                    className={showFilters ? "rotate-180 transition" : "transition"}
                  />
                </button>

                <div className="flex rounded-xl border border-slate-200 bg-white p-1">
                  <button
                    onClick={() => setView("table")}
                    title="Table view"
                    className={`rounded-lg p-2 transition ${
                      view === "table"
                        ? "bg-violet-100 text-violet-700"
                        : "text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    <List size={18} />
                  </button>
                  <button
                    onClick={() => setView("grid")}
                    title="Grid view"
                    className={`rounded-lg p-2 transition ${
                      view === "grid"
                        ? "bg-violet-100 text-violet-700"
                        : "text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    <LayoutGrid size={18} />
                  </button>
                </div>
              </div>
            </div>

            {showFilters && (
              <div className="grid gap-3 rounded-xl border border-violet-100 bg-violet-50/40 p-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Application status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(event) => {
                      setStatusFilter(event.target.value);
                      setPage(1);
                    }}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-500"
                  >
                    <option value="all">All statuses</option>
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                    <option value="withdrawn">Withdrawn</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Sort candidates
                  </label>
                  <select
                    value={sortBy}
                    onChange={(event) => {
                      setSortBy(event.target.value);
                      setPage(1);
                    }}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-500"
                  >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="name">Candidate name (A–Z)</option>
                    <option value="score">Highest match score</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-100"
                  >
                    <RotateCcw size={15} />
                    Clear all filters
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <p>
                Showing{" "}
                <span className="font-semibold text-slate-800">
                  {filteredApplications.length === 0
                    ? 0
                    : (safePage - 1) * pageSize + 1}
                  {"–"}
                  {Math.min(safePage * pageSize, filteredApplications.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-800">
                  {filteredApplications.length}
                </span>{" "}
                applications
              </p>
              {(search || statusFilter !== "all" || jobFilter !== "All jobs") && (
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 font-semibold text-violet-700 hover:text-violet-900"
                >
                  Clear active filters <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Table view */}
          {view === "table" && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="px-5 py-4">
                      <span className="inline-flex items-center gap-2">
                        Candidate <ArrowUpDown size={12} />
                      </span>
                    </th>
                    <th className="px-5 py-4">Applied for</th>
                    <th className="px-5 py-4">Match score</th>
                    <th className="px-5 py-4">Applied date</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {visibleApplications.map((item) => (
                    <tr
                      key={item._id}
                      className="group transition hover:bg-violet-50/30"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <CandidateAvatar candidate={item.candidate} />
                          <div className="min-w-0">
                            <button
                              onClick={() => setSelectedId(item._id)}
                              className="block max-w-[210px] truncate text-sm font-semibold text-slate-900 hover:text-violet-700"
                            >
                              {item.candidate.name}
                            </button>
                            <p className="mt-1 max-w-[210px] truncate text-xs text-slate-500">
                              {item.candidate.email}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              {item.candidate.experience} experience
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="max-w-[210px] truncate text-sm font-medium text-slate-800">
                          {item.job}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {item.department}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-violet-600"
                              style={{ width: `${item.score}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-slate-800">
                            {item.score}%
                          </span>
                        </div>
                        <p className="mt-1 text-[10px] text-slate-400">
                          Demo match score
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-slate-700">
                          {formatDate(item.appliedAt)}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {formatRelativeDate(item.appliedAt)}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={item.status}
                          onChange={(event) => {
                            updateStatus(item._id, event.target.value);
                            notify("Application status updated");
                          }}
                          aria-label={`Update status for ${item.candidate.name}`}
                          className="max-w-[190px] cursor-pointer rounded-full border-0 bg-transparent py-1 pr-7 text-xs font-semibold outline-none ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-violet-500"
                        >
                          {STATUS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedId(item._id)}
                            title="View application"
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-violet-100 hover:text-violet-700"
                          >
                            <Eye size={17} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedId(item._id);
                            }}
                            title="Recruiter notes and actions"
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-violet-100 hover:text-violet-700"
                          >
                            <MessageSquareText size={17} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedId(item._id);
                            }}
                            title="More details"
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                          >
                            <MoreHorizontal size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Grid view */}
          {view === "grid" && (
            <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
              {visibleApplications.map((item) => (
                <article
                  key={item._id}
                  className="rounded-2xl border border-slate-200 p-5 transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <CandidateAvatar candidate={item.candidate} size="large" />
                    <StatusBadge status={item.status} />
                  </div>

                  <h3 className="mt-4 font-bold text-slate-950">
                    {item.candidate.name}
                  </h3>
                  <p className="mt-1 truncate text-sm text-slate-500">
                    {item.candidate.currentRole}
                  </p>

                  <div className="mt-4 rounded-xl bg-slate-50 p-3">
                    <p className="text-xs font-medium text-slate-500">
                      Applied for
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {item.job}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Match score</span>
                    <span className="text-sm font-bold text-violet-700">
                      {item.score}%
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-violet-600"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {item.candidate.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600"
                      >
                        {skill}
                      </span>
                    ))}
                    {item.candidate.skills.length > 3 && (
                      <span className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] text-slate-500">
                        +{item.candidate.skills.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
                    <button
                      onClick={() => setSelectedId(item._id)}
                      className="flex-1 rounded-xl bg-violet-700 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800"
                    >
                      View application
                    </button>
                    <select
                      value={item.status}
                      onChange={(event) => {
                        updateStatus(item._id, event.target.value);
                        notify("Application status updated");
                      }}
                      aria-label={`Update status for ${item.candidate.name}`}
                      className="max-w-[130px] rounded-xl border border-slate-200 bg-white px-2 text-xs font-medium outline-none focus:border-violet-500"
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Empty state */}
          {visibleApplications.length === 0 && (
            <div className="flex flex-col items-center px-5 py-16 text-center">
              <div className="rounded-2xl bg-violet-50 p-4 text-violet-700">
                <Search size={27} />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">
                No applications found
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Try changing your search, job selection, or status filters to
                find candidates.
              </p>
              <button
                onClick={resetFilters}
                className="mt-5 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Pagination */}
          <footer className="flex flex-col justify-between gap-4 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <p className="text-xs text-slate-500">Rows per page</p>
              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-violet-500"
              >
                <option value={5}>5</option>
                <option value={6}>6</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              <span className="hidden text-xs text-slate-400 sm:inline">
                {filteredApplications.length} total results
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <p className="text-xs font-medium text-slate-500">
                Page {safePage} of {totalPages}
              </p>
              <div className="flex items-center gap-1">
                <button
                  disabled={safePage <= 1}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  aria-label="Previous page"
                  className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={17} />
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1)
                  .filter(
                    (number) =>
                      number === 1 ||
                      number === totalPages ||
                      Math.abs(number - safePage) <= 1
                  )
                  .map((number, index, array) => (
                    <React.Fragment key={number}>
                      {index > 0 && number - array[index - 1] > 1 && (
                        <span className="px-1 text-slate-400">…</span>
                      )}
                      <button
                        onClick={() => setPage(number)}
                        className={`min-w-9 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                          number === safePage
                            ? "bg-violet-700 text-white"
                            : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                        }`}
                      >
                        {number}
                      </button>
                    </React.Fragment>
                  ))}
                <button
                  disabled={safePage >= totalPages}
                  onClick={() =>
                    setPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  aria-label="Next page"
                  className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </footer>
        </section>

        {/* Footer note */}
        <div className="flex flex-col justify-between gap-2 pb-2 text-xs text-slate-400 sm:flex-row sm:items-center">
          <p>Peer.Hiring · Recruiter workspace</p>
          <p className="inline-flex items-center gap-1.5">
            <CircleDot size={12} className="text-emerald-500" />
            Local demo interactions enabled
          </p>
        </div>
      </main>

      {/* Application detail drawer */}
      {selectedApplication && (
        <ApplicationDrawer
          key={selectedApplication._id}
          application={selectedApplication}
          onClose={() => setSelectedId(null)}
          onStatusChange={updateStatus}
          onNotesSave={saveNotes}
          onToast={notify}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-[70] flex max-w-[calc(100vw-2.5rem)] items-center gap-3 rounded-xl bg-slate-950 px-4 py-3 text-sm font-medium text-white shadow-2xl"
        >
          <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
          {toast}
          <button
            onClick={() => setToast("")}
            className="ml-1 rounded-md p-1 text-slate-400 hover:bg-white/10 hover:text-white"
            aria-label="Dismiss notification"
          >
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}