
import React, { useMemo, useState } from "react";
import {
  Video,
  CalendarDays,
  Clock3,
  Users,
  Plus,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  MapPin,
  Phone,
  CheckCircle2,
  CircleDashed,
  XCircle,
  Play,
  ExternalLink,
  Copy,
  Pencil,
  X,
  Sparkles,
  ArrowUpRight,
  BriefcaseBusiness,
  MonitorPlay,
  CalendarClock,
  UserRound,
  Link2,
  SlidersHorizontal,
  LayoutGrid,
  List,
  FileText,
  Check,
  AlertCircle,
} from "lucide-react";

const INITIAL_INTERVIEWS = [
  {
    id: "INT-2041",
    candidate: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    initials: "AS",
    jobTitle: "Frontend Developer",
    jobId: "PH-1024",
    type: "Online",
    status: "Accepted",
    date: "2026-10-20",
    time: "10:30",
    duration: 45,
    timezone: "Asia/Kolkata",
    interviewer: "Recruiting Team",
    roomId: "peer-aarav-2041",
    notes: "Discuss React, component architecture, and project experience.",
    color: "violet",
  },
  {
    id: "INT-2042",
    candidate: "Priya Verma",
    email: "priya.verma@example.com",
    initials: "PV",
    jobTitle: "Backend Developer",
    jobId: "PH-1025",
    type: "Online",
    status: "Scheduled",
    date: "2026-10-20",
    time: "12:00",
    duration: 60,
    timezone: "Asia/Kolkata",
    interviewer: "Engineering Team",
    roomId: "peer-priya-2042",
    notes: "Review Node.js, API design, and database fundamentals.",
    color: "blue",
  },
  {
    id: "INT-2043",
    candidate: "Rohan Singh",
    email: "rohan.singh@example.com",
    initials: "RS",
    jobTitle: "UI/UX Designer",
    jobId: "PH-1026",
    type: "Offline",
    status: "Scheduled",
    date: "2026-10-21",
    time: "11:00",
    duration: 45,
    timezone: "Asia/Kolkata",
    interviewer: "Design Team",
    roomId: "",
    notes: "Portfolio review and design problem-solving.",
    color: "pink",
  },
  {
    id: "INT-2044",
    candidate: "Sneha Gupta",
    email: "sneha.gupta@example.com",
    initials: "SG",
    jobTitle: "Frontend Developer",
    jobId: "PH-1024",
    type: "Phone",
    status: "Completed",
    date: "2026-10-17",
    time: "15:00",
    duration: 30,
    timezone: "Asia/Kolkata",
    interviewer: "Recruiting Team",
    roomId: "",
    notes: "Initial screening and availability discussion.",
    color: "amber",
  },
  {
    id: "INT-2045",
    candidate: "Kabir Mehta",
    email: "kabir.mehta@example.com",
    initials: "KM",
    jobTitle: "Backend Developer",
    jobId: "PH-1025",
    type: "Online",
    status: "Cancelled",
    date: "2026-10-18",
    time: "14:30",
    duration: 45,
    timezone: "Asia/Kolkata",
    interviewer: "Engineering Team",
    roomId: "peer-kabir-2045",
    notes: "Cancelled and awaiting rescheduling.",
    color: "emerald",
  },
];

const FILTERS = [
  "All interviews",
  "Scheduled",
  "Accepted",
  "Completed",
  "Cancelled",
];

const STATUS_STYLES = {
  Scheduled: "bg-blue-50 text-blue-700 ring-blue-200",
  Accepted: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Completed: "bg-violet-50 text-violet-700 ring-violet-200",
  Cancelled: "bg-rose-50 text-rose-700 ring-rose-200",
  Rejected: "bg-rose-50 text-rose-700 ring-rose-200",
  Rescheduled: "bg-amber-50 text-amber-700 ring-amber-200",
};

const ACCENTS = {
  violet: "bg-violet-100 text-violet-700",
  blue: "bg-blue-100 text-blue-700",
  pink: "bg-pink-100 text-pink-700",
  amber: "bg-amber-100 text-amber-700",
  emerald: "bg-emerald-100 text-emerald-700",
};

const EMPTY_FORM = {
  candidate: "",
  email: "",
  jobTitle: "",
  type: "Online",
  date: "",
  time: "10:00",
  duration: "45",
  timezone: "Asia/Kolkata",
  interviewer: "",
  roomId: "",
  notes: "",
};

function formatDate(date) {
  if (!date) return "Date not set";
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(time) {
  if (!time) return "Time not set";
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function MetricCard({ icon: Icon, label, value, caption, tone }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/40">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            {value}
          </p>
        </div>
        <div className={`rounded-xl p-3 ${tone}`}>
          <Icon size={21} />
        </div>
      </div>
      <p className="mt-4 text-xs text-slate-500">{caption}</p>
    </div>
  );
}

function InterviewCard({
  interview,
  onDetails,
  onJoin,
  onEdit,
  onStatus,
  onCopy,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const canJoin =
    interview.type === "Online" &&
    ["Scheduled", "Accepted"].includes(interview.status);

  return (
    <article className="group rounded-2xl border border-slate-200/80 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-xl hover:shadow-slate-200/60 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3.5">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${
              ACCENTS[interview.color] || ACCENTS.violet
            }`}
          >
            {interview.initials}
          </div>
          <div className="min-w-0">
            <button
              onClick={() => onDetails(interview)}
              className="truncate text-left text-base font-bold text-slate-900 transition hover:text-violet-700"
            >
              {interview.candidate}
            </button>
            <p className="mt-1 truncate text-xs text-slate-500">
              {interview.jobTitle}
            </p>
            <p className="mt-1 text-[11px] font-medium text-slate-400">
              {interview.id}
            </p>
          </div>
        </div>

        <div className="relative shrink-0">
          <button
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="Interview actions"
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800"
          >
            <MoreHorizontal size={20} />
          </button>

          {menuOpen && (
            <>
              <button
                className="fixed inset-0 z-10 cursor-default"
                aria-label="Close actions"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-10 z-20 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDetails(interview);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-violet-50"
                >
                  <FileText size={15} /> View details
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(interview);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-violet-50"
                >
                  <Pencil size={15} /> Reschedule / edit
                </button>
                {interview.roomId && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onCopy(interview.roomId);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-violet-50"
                  >
                    <Copy size={15} /> Copy room ID
                  </button>
                )}
                {["Scheduled", "Accepted"].includes(interview.status) && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onStatus(interview, "Cancelled");
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-rose-600 hover:bg-rose-50"
                  >
                    <XCircle size={15} /> Cancel interview
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${
            STATUS_STYLES[interview.status] || STATUS_STYLES.Scheduled
          }`}
        >
          {interview.status}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
          {interview.type === "Online" ? (
            <Video size={12} />
          ) : interview.type === "Phone" ? (
            <Phone size={12} />
          ) : (
            <MapPin size={12} />
          )}
          {interview.type}
        </span>
      </div>

      <div className="mt-5 space-y-3 rounded-xl bg-slate-50/80 p-4">
        <div className="flex items-center gap-3 text-sm">
          <div className="rounded-lg bg-white p-2 text-violet-600 shadow-sm">
            <CalendarDays size={16} />
          </div>
          <div>
            <p className="font-semibold text-slate-800">
              {formatDate(interview.date)}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              {formatTime(interview.time)} · {interview.duration} minutes
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="rounded-lg bg-white p-2 text-violet-600 shadow-sm">
            <UserRound size={16} />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-500">Interviewer</p>
            <p className="mt-0.5 truncate font-semibold text-slate-800">
              {interview.interviewer || "Not assigned"}
            </p>
          </div>
        </div>
        {interview.type === "Online" && (
          <div className="flex items-center gap-3 text-sm">
            <div className="rounded-lg bg-white p-2 text-violet-600 shadow-sm">
              <Link2 size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500">Meeting room</p>
              <p className="mt-0.5 truncate font-mono text-xs font-semibold text-slate-700">
                {interview.roomId || "Room not configured"}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 flex gap-2">
        <button
          onClick={() => onDetails(interview)}
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
        >
          View details
        </button>
        {canJoin ? (
          <button
            onClick={() => onJoin(interview)}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-violet-700 px-3 py-2.5 text-xs font-bold text-white shadow-md shadow-violet-200 transition hover:bg-violet-800"
          >
            <Video size={15} /> Join interview
          </button>
        ) : (
          <button
            onClick={() => onEdit(interview)}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-violet-50 px-3 py-2.5 text-xs font-bold text-violet-700 transition hover:bg-violet-100"
          >
            <CalendarClock size={15} /> Manage
          </button>
        )}
      </div>
    </article>
  );
}

function Modal({ title, subtitle, onClose, children, wide = false }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className={`my-auto w-full overflow-hidden rounded-3xl bg-white shadow-2xl ${
          wide ? "max-w-3xl" : "max-w-xl"
        }`}
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-5 sm:px-7">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-950">
              {title}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100"
            aria-label="Close modal"
          >
            <X size={19} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100";

export default function RecruiterInterviews({
  onCreateInterview,
  onJoinInterview,
  onUpdateInterview,
}) {
  const [interviews, setInterviews] = useState(INITIAL_INTERVIEWS);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All interviews");
  const [typeFilter, setTypeFilter] = useState("All types");
  const [view, setView] = useState("grid");
  const [sortBy, setSortBy] = useState("date");
  const [modal, setModal] = useState("");
  const [selected, setSelected] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [notice, setNotice] = useState("");
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);

  const metrics = useMemo(() => {
    const upcoming = interviews.filter(
      (item) =>
        ["Scheduled", "Accepted"].includes(item.status) &&
        item.date >= new Date().toLocaleDateString("en-CA")
    );

    return {
      total: interviews.length,
      upcoming: upcoming.length,
      completed: interviews.filter((item) => item.status === "Completed").length,
      online: interviews.filter(
        (item) =>
          item.type === "Online" &&
          ["Scheduled", "Accepted"].includes(item.status)
      ).length,
    };
  }, [interviews]);

  const filtered = useMemo(() => {
    let result = interviews.filter((item) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        [
          item.candidate,
          item.email,
          item.jobTitle,
          item.id,
          item.interviewer,
          item.roomId,
        ].some((value) => (value || "").toLowerCase().includes(query));

      const matchesStatus =
        activeFilter === "All interviews" || item.status === activeFilter;

      const matchesType = typeFilter === "All types" || item.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });

    result = [...result].sort((a, b) => {
      if (sortBy === "candidate") return a.candidate.localeCompare(b.candidate);
      if (sortBy === "recent") return b.id.localeCompare(a.id);
      return `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`);
    });

    return result;
  }, [interviews, search, activeFilter, typeFilter, sortBy]);

  function updateForm(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setModal("create");
  }

  function openEdit(interview) {
    setEditingId(interview.id);
    setForm({
      candidate: interview.candidate,
      email: interview.email,
      jobTitle: interview.jobTitle,
      type: interview.type,
      date: interview.date,
      time: interview.time,
      duration: String(interview.duration),
      timezone: interview.timezone || "Asia/Kolkata",
      interviewer: interview.interviewer || "",
      roomId: interview.roomId || "",
      notes: interview.notes || "",
    });
    setFormError("");
    setModal("create");
  }

  async function submitInterview(event) {
    event.preventDefault();
    setFormError("");

    if (!form.candidate.trim() || !form.jobTitle.trim() || !form.date || !form.time) {
      setFormError("Please complete the candidate, job role, date, and time.");
      return;
    }

    if (form.type === "Online" && !form.roomId.trim()) {
      setFormError("Add a meeting room ID for an online interview.");
      return;
    }

    const previous = interviews.find((item) => item.id === editingId);
    const interview = {
      ...previous,
      ...form,
      id: editingId || `INT-${Date.now().toString().slice(-6)}`,
      initials: getInitials(form.candidate),
      duration: Number(form.duration),
      status: previous?.status || "Scheduled",
      color: previous?.color || "violet",
      timezone: form.timezone || "Asia/Kolkata",
    };

    try {
      if (editingId && onUpdateInterview) {
        await onUpdateInterview(interview);
      } else if (!editingId && onCreateInterview) {
        await onCreateInterview(interview);
      }

      setInterviews((current) =>
        editingId
          ? current.map((item) => (item.id === editingId ? interview : item))
          : [interview, ...current]
      );
      setModal("");
      setNotice(editingId ? "Interview updated." : "Interview scheduled.");
    } catch {
      setFormError("The interview could not be saved. Please try again.");
    }
  }

  async function changeStatus(interview, status) {
    try {
      if (onUpdateInterview) {
        await onUpdateInterview({ ...interview, status });
      }
      setInterviews((current) =>
        current.map((item) =>
          item.id === interview.id ? { ...item, status } : item
        )
      );
      setSelected((current) =>
        current?.id === interview.id ? { ...current, status } : current
      );
      setNotice(`Interview marked ${status.toLowerCase()}.`);
    } catch {
      setNotice("Could not update interview status. Please try again.");
    }
  }

  async function joinInterview(interview) {
    if (!interview.roomId) {
      setNotice("This interview has no room ID configured yet.");
      return;
    }

    if (onJoinInterview) {
      try {
        await onJoinInterview(interview);
      } catch {
        setNotice("Could not open the interview room.");
      }
      return;
    }

    setSelected(interview);
    setModal("join");
  }

  function copyRoom(roomId) {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(roomId)
        .then(() => setNotice("Room ID copied to clipboard."))
        .catch(() => setNotice(`Room ID: ${roomId}`));
    } else {
      setNotice(`Room ID: ${roomId}`);
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F8FC] px-4 py-5 text-slate-900 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1500px] space-y-7">
        {/* Header */}
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-violet-700">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-600" />
              Recruiter workspace
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Interviews<span className="text-violet-600">.</span>
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Schedule conversations, meet great candidates, and keep your
              hiring process moving forward.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-violet-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-800"
          >
            <Plus size={19} /> Schedule interview
          </button>
        </header>

        {/* Hero */}
        <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-[#24104F] via-[#5125A5] to-[#7C3AED] p-6 text-white shadow-xl shadow-violet-200/50 sm:p-8 lg:p-9">
          <div className="pointer-events-none absolute -right-12 -top-24 -z-10 h-72 w-72 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute right-10 top-5 -z-10 h-48 w-48 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-24 right-1/3 -z-10 h-48 w-48 rounded-full bg-fuchsia-400/20 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-violet-100">
                <Sparkles size={14} /> Your interview command center
              </div>
              <h2 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
                Every great hire
                <br className="hidden sm:block" /> starts with a conversation.
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-6 text-violet-100/90">
                Organize your interview schedule, coordinate with candidates,
                and create a smoother hiring experience from first call to final round.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={openCreate}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-violet-800 transition hover:bg-violet-50"
                >
                  <Plus size={17} /> Create interview
                </button>
                <button
                  onClick={() => {
                    setActiveFilter("Scheduled");
                    setTypeFilter("Online");
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  <Video size={17} /> Online interviews
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-[290px]">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <CalendarDays size={20} className="text-violet-200" />
                <p className="mt-4 text-3xl font-bold">{metrics.upcoming}</p>
                <p className="mt-1 text-xs font-medium text-violet-100">
                  Upcoming interviews
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <Video size={20} className="text-violet-200" />
                <p className="mt-4 text-3xl font-bold">{metrics.online}</p>
                <p className="mt-1 text-xs font-medium text-violet-100">
                  Online meetings
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Metrics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={CalendarDays}
            label="Total interviews"
            value={metrics.total}
            caption="All interview records"
            tone="bg-violet-50 text-violet-700"
          />
          <MetricCard
            icon={CalendarClock}
            label="Upcoming"
            value={metrics.upcoming}
            caption="Scheduled or accepted"
            tone="bg-blue-50 text-blue-700"
          />
          <MetricCard
            icon={CheckCircle2}
            label="Completed"
            value={metrics.completed}
            caption="Interviews already finished"
            tone="bg-emerald-50 text-emerald-700"
          />
          <MetricCard
            icon={MonitorPlay}
            label="Online meetings"
            value={metrics.online}
            caption="Ready for room integration"
            tone="bg-amber-50 text-amber-700"
          />
        </section>

        {/* Interviews */}
        <section className="space-y-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Interview schedule
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Manage candidate meetings and keep every round organized.
              </p>
            </div>
            <span className="text-xs font-medium text-slate-500">
              Showing {filtered.length} of {interviews.length} interviews
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm sm:p-4">
            <div className="flex flex-col gap-3 xl:flex-row">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search candidate, job role, interviewer or room ID..."
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <label className="relative flex h-12 min-w-[145px] flex-1 items-center sm:flex-none">
                  <SlidersHorizontal size={15} className="pointer-events-none absolute left-3 text-slate-500" />
                  <select
                    value={typeFilter}
                    onChange={(event) => setTypeFilter(event.target.value)}
                    className="h-full w-full appearance-none rounded-xl border border-slate-200 bg-white pl-9 pr-8 text-sm font-medium text-slate-700 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                  >
                    <option>All types</option>
                    <option>Online</option>
                    <option>Offline</option>
                    <option>Phone</option>
                  </select>
                  <ChevronDown size={15} className="pointer-events-none absolute right-3 text-slate-400" />
                </label>
                <label className="relative flex h-12 min-w-[145px] flex-1 items-center sm:flex-none">
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                    className="h-full w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-8 text-sm font-medium text-slate-700 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                  >
                    <option value="date">Date & time</option>
                    <option value="recent">Recently created</option>
                    <option value="candidate">Candidate A–Z</option>
                  </select>
                  <ChevronDown size={15} className="pointer-events-none absolute right-3 text-slate-400" />
                </label>
                <div className="flex h-12 items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
                  <button
                    onClick={() => setView("grid")}
                    aria-label="Grid view"
                    className={`rounded-lg p-2.5 ${view === "grid" ? "bg-white text-violet-700 shadow-sm" : "text-slate-400 hover:text-slate-700"}`}
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button
                    onClick={() => setView("list")}
                    aria-label="List view"
                    className={`rounded-lg p-2.5 ${view === "list" ? "bg-white text-violet-700 shadow-sm" : "text-slate-400 hover:text-slate-700"}`}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {FILTERS.map((filter) => {
                const count =
                  filter === "All interviews"
                    ? interviews.length
                    : interviews.filter((item) => item.status === filter).length;

                return (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold transition ${
                      activeFilter === filter
                        ? "bg-violet-700 text-white shadow-md shadow-violet-200"
                        : "bg-slate-100 text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                    }`}
                  >
                    {filter}
                    <span className={`rounded-md px-1.5 py-0.5 text-[10px] ${
                      activeFilter === filter ? "bg-white/15 text-white" : "bg-white text-slate-500"
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {filtered.length > 0 ? (
            <div className={view === "grid"
              ? "grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3"
              : "flex flex-col gap-3"
            }>
              {filtered.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  interview={interview}
                  onDetails={(item) => {
                    setSelected(item);
                    setModal("details");
                  }}
                  onJoin={joinInterview}
                  onEdit={openEdit}
                  onStatus={changeStatus}
                  onCopy={copyRoom}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                <CalendarDays size={24} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">
                No interviews found
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Try another filter or schedule a new interview to get started.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setActiveFilter("All interviews");
                  setTypeFilter("All types");
                }}
                className="mt-5 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-violet-800"
              >
                Clear filters
              </button>
            </div>
          )}

          <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-4 sm:flex-row sm:px-5">
            <p className="text-xs text-slate-500">
              Showing <span className="font-bold text-slate-800">{filtered.length}</span> interview records
            </p>
            <div className="flex items-center gap-2">
              <button disabled className="flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-400">
                <ChevronLeft size={15} /> Previous
              </button>
              <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-violet-700 px-3 text-xs font-bold text-white">1</span>
              <button disabled className="flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-400">
                Next <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </section>

        {/* Create / edit modal */}
        {modal === "create" && (
          <Modal
            title={editingId ? "Update interview" : "Schedule an interview"}
            subtitle="Set up the details for a great candidate conversation."
            onClose={() => setModal("")}
            wide
          >
            <form onSubmit={submitInterview} className="max-h-[75vh] space-y-6 overflow-y-auto px-5 py-6 sm:px-7">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Candidate details</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Candidate name *
                    <input value={form.candidate} onChange={(e) => updateForm("candidate", e.target.value)} placeholder="e.g. Aarav Sharma" className={fieldClass} required />
                  </label>
                  <label className="text-sm font-semibold text-slate-700">
                    Candidate email
                    <input type="email" value={form.email} onChange={(e) => updateForm("email", e.target.value)} placeholder="candidate@example.com" className={fieldClass} />
                  </label>
                  <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
                    Job role *
                    <input value={form.jobTitle} onChange={(e) => updateForm("jobTitle", e.target.value)} placeholder="e.g. Frontend Developer" className={fieldClass} required />
                  </label>
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Schedule and format</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Interview type
                    <select value={form.type} onChange={(e) => updateForm("type", e.target.value)} className={fieldClass}>
                      <option>Online</option>
                      <option>Offline</option>
                      <option>Phone</option>
                    </select>
                  </label>
                  <label className="text-sm font-semibold text-slate-700">
                    Duration
                    <select value={form.duration} onChange={(e) => updateForm("duration", e.target.value)} className={fieldClass}>
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">60 minutes</option>
                      <option value="90">90 minutes</option>
                    </select>
                  </label>
                  <label className="text-sm font-semibold text-slate-700">
                    Interview date *
                    <input type="date" value={form.date} onChange={(e) => updateForm("date", e.target.value)} min={new Date().toLocaleDateString("en-CA")} className={fieldClass} required />
                  </label>
                  <label className="text-sm font-semibold text-slate-700">
                    Start time *
                    <input type="time" value={form.time} onChange={(e) => updateForm("time", e.target.value)} className={fieldClass} required />
                  </label>
                  <label className="text-sm font-semibold text-slate-700">
                    Time zone
                    <select value={form.timezone} onChange={(e) => updateForm("timezone", e.target.value)} className={fieldClass}>
                      <option value="Asia/Kolkata">India Standard Time (IST)</option>
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="Europe/London">London</option>
                    </select>
                  </label>
                  <label className="text-sm font-semibold text-slate-700">
                    Interviewer
                    <input value={form.interviewer} onChange={(e) => updateForm("interviewer", e.target.value)} placeholder="Recruiter or team name" className={fieldClass} />
                  </label>
                  {form.type === "Online" && (
                    <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
                      Meeting room ID *
                      <input value={form.roomId} onChange={(e) => updateForm("roomId", e.target.value)} placeholder="e.g. peer-candidate-2046" className={fieldClass} required />
                      <span className="mt-1.5 block text-xs font-normal text-slate-400">
                        Use a room ID supported by your video-room backend.
                      </span>
                    </label>
                  )}
                </div>
              </div>

              <label className="block text-sm font-semibold text-slate-700">
                Interview notes
                <textarea value={form.notes} onChange={(e) => updateForm("notes", e.target.value)} rows={3} placeholder="Topics, interview instructions, or preparation notes..." className={fieldClass + " resize-y"} />
              </label>

              {formError && (
                <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                  <AlertCircle size={17} className="mt-0.5 shrink-0" /> {formError}
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setModal("")} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 hover:bg-violet-800">
                  <Check size={17} /> {editingId ? "Save changes" : "Schedule interview"}
                </button>
              </div>
            </form>
          </Modal>
        )}

        {/* Interview details */}
        {modal === "details" && selected && (
          <Modal
            title="Interview details"
            subtitle="Review the candidate and meeting information."
            onClose={() => setModal("")}
          >
            <div className="space-y-5 px-5 py-6 sm:px-7">
              <div className="flex items-center gap-4">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold ${ACCENTS[selected.color] || ACCENTS.violet}`}>
                  {selected.initials}
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-slate-900">{selected.candidate}</h3>
                  <p className="mt-1 break-all text-sm text-slate-500">{selected.email || "No email provided"}</p>
                  <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[selected.status] || STATUS_STYLES.Scheduled}`}>
                    {selected.status}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Position</p>
                <p className="mt-2 font-bold text-slate-900">{selected.jobTitle}</p>
                <p className="mt-1 text-xs text-slate-500">{selected.jobId} · {selected.id}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Date", formatDate(selected.date), CalendarDays],
                  ["Time", `${formatTime(selected.time)} (${selected.timezone || "Asia/Kolkata"})`, Clock3],
                  ["Duration", `${selected.duration} minutes`, CalendarClock],
                  ["Format", selected.type, selected.type === "Online" ? Video : selected.type === "Phone" ? Phone : MapPin],
                ].map(([label, value, Icon]) => (
                  <div key={label} className="rounded-xl bg-slate-50 p-4">
                    <Icon size={17} className="text-violet-600" />
                    <p className="mt-3 text-xs text-slate-500">{label}</p>
                    <p className="mt-1 break-words text-sm font-bold text-slate-800">{value}</p>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Interviewer</p>
                <p className="mt-2 text-sm font-semibold text-slate-800">{selected.interviewer || "Not assigned"}</p>
              </div>

              {selected.roomId && (
                <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-700">
                    <Video size={15} /> Meeting room
                  </div>
                  <p className="mt-2 break-all font-mono text-sm text-violet-950">{selected.roomId}</p>
                  <button onClick={() => copyRoom(selected.roomId)} className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-violet-700 hover:text-violet-900">
                    <Copy size={14} /> Copy room ID
                  </button>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Notes</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{selected.notes || "No notes added."}</p>
              </div>

              <div className="flex flex-col gap-2 border-t border-slate-100 pt-5 sm:flex-row">
                <button onClick={() => openEdit(selected)} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">
                  <Pencil size={16} /> Edit interview
                </button>
                {["Scheduled", "Accepted"].includes(selected.status) && (
                  <button onClick={() => changeStatus(selected, "Cancelled")} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-200 px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50">
                    <XCircle size={16} /> Cancel
                  </button>
                )}
              </div>
            </div>
          </Modal>
        )}

        {/* Video room pre-join */}
        {modal === "join" && selected && (
          <Modal
            title="Ready to join?"
            subtitle="Review your interview before opening the meeting room."
            onClose={() => setModal("")}
          >
            <div className="px-5 py-6 sm:px-7">
              <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#27105B] via-[#5125A5] to-[#7C3AED] p-6 text-white">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
                  <Video size={26} />
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-violet-200">Online interview</p>
                <h3 className="mt-2 text-2xl font-bold">{selected.candidate}</h3>
                <p className="mt-1 text-sm text-violet-100">{selected.jobTitle}</p>
                <div className="mt-5 flex flex-wrap gap-3 text-xs text-violet-100">
                  <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} /> {formatDate(selected.date)}</span>
                  <span className="inline-flex items-center gap-1.5"><Clock3 size={14} /> {formatTime(selected.time)}</span>
                </div>
              </div>
              <div className="mt-4 rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-semibold text-slate-500">ROOM ID</p>
                <p className="mt-2 break-all font-mono text-sm font-bold text-slate-900">{selected.roomId}</p>
              </div>
              <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-800">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                This preview does not start a video call by itself. Connect your video-room route or WebRTC provider to enable live audio and video.
              </div>
              <div className="mt-5 flex gap-3">
                <button onClick={() => setModal("")} className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">Go back</button>
                <button onClick={() => {
                  setModal("");
                  setNotice(`Connect room ${selected.roomId} to your video-call route.`);
                }} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 py-3 text-sm font-bold text-white hover:bg-violet-800">
                  <Play size={16} /> Open room
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Toast */}
        {notice && (
          <div className="fixed bottom-5 right-5 z-[70] flex max-w-sm items-start gap-3 rounded-2xl border border-violet-100 bg-white p-4 shadow-2xl shadow-violet-200/50">
            <div className="rounded-lg bg-violet-100 p-2 text-violet-700">
              <CheckCircle2 size={17} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900">Peer.Hiring</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">{notice}</p>
            </div>
            <button onClick={() => setNotice("")} className="rounded-md p-1 text-slate-400 hover:bg-slate-100" aria-label="Dismiss notification">
              <X size={15} />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
