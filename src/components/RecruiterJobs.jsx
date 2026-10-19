
import React, { useMemo, useState } from "react";
import {
  Search,
  Plus,
  BriefcaseBusiness,
  Users,
  Eye,
  TrendingUp,
  MapPin,
  Clock3,
  CalendarDays,
  MoreHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Building2,
  CircleCheck,
  CirclePause,
  FileText,
  Sparkles,
  X,
  Copy,
  ExternalLink,
  Pencil,
  Archive,
  CircleDollarSign,
  Filter,
} from "lucide-react";

const INITIAL_JOBS = [
  {
    id: "PH-1024",
    title: "Frontend Developer",
    department: "Engineering",
    type: "Full-time",
    location: "Bengaluru, India",
    mode: "Hybrid",
    salary: "8–14 LPA",
    status: "Active",
    applicants: 128,
    views: 1840,
    shortlisted: 18,
    hired: 2,
    posted: "2 days ago",
    deadline: "Nov 15, 2026",
    color: "violet",
    initials: "FD",
  },
  {
    id: "PH-1025",
    title: "Backend Developer",
    department: "Engineering",
    type: "Full-time",
    location: "Remote, India",
    mode: "Remote",
    salary: "10–18 LPA",
    status: "Active",
    applicants: 96,
    views: 1320,
    shortlisted: 12,
    hired: 1,
    posted: "4 days ago",
    deadline: "Nov 20, 2026",
    color: "blue",
    initials: "BE",
  },
  {
    id: "PH-1026",
    title: "UI/UX Designer",
    department: "Design",
    type: "Full-time",
    location: "Delhi, India",
    mode: "Hybrid",
    salary: "6–10 LPA",
    status: "Active",
    applicants: 74,
    views: 960,
    shortlisted: 9,
    hired: 0,
    posted: "6 days ago",
    deadline: "Nov 25, 2026",
    color: "pink",
    initials: "UX",
  },
  {
    id: "PH-1027",
    title: "Data Analyst Intern",
    department: "Analytics",
    type: "Internship",
    location: "Agra, India",
    mode: "On-site",
    salary: "15–25k/month",
    status: "Paused",
    applicants: 53,
    views: 710,
    shortlisted: 6,
    hired: 0,
    posted: "1 week ago",
    deadline: "Nov 10, 2026",
    color: "amber",
    initials: "DA",
  },
  {
    id: "PH-1028",
    title: "Product Manager",
    department: "Product",
    type: "Full-time",
    location: "Mumbai, India",
    mode: "Hybrid",
    salary: "16–24 LPA",
    status: "Closed",
    applicants: 142,
    views: 2150,
    shortlisted: 15,
    hired: 1,
    posted: "3 weeks ago",
    deadline: "Oct 12, 2026",
    color: "emerald",
    initials: "PM",
  },
  {
    id: "PH-1029",
    title: "Junior React Developer",
    department: "Engineering",
    type: "Full-time",
    location: "Remote, India",
    mode: "Remote",
    salary: "4–7 LPA",
    status: "Draft",
    applicants: 0,
    views: 0,
    shortlisted: 0,
    hired: 0,
    posted: "Not published",
    deadline: "Not set",
    color: "slate",
    initials: "JR",
  },
];

const FILTERS = ["All jobs", "Active", "Paused", "Closed", "Draft"];

const STATUS_STYLES = {
  Active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Paused: "bg-amber-50 text-amber-700 ring-amber-200",
  Closed: "bg-slate-100 text-slate-600 ring-slate-200",
  Draft: "bg-violet-50 text-violet-700 ring-violet-200",
};

const ACCENTS = {
  violet: "bg-violet-100 text-violet-700",
  blue: "bg-blue-100 text-blue-700",
  pink: "bg-pink-100 text-pink-700",
  amber: "bg-amber-100 text-amber-700",
  emerald: "bg-emerald-100 text-emerald-700",
  slate: "bg-slate-100 text-slate-600",
};

function MetricCard({ icon: Icon, label, value, note, accent }) {
  return (
    <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/50">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>
        <div className={`rounded-xl p-3 ${accent}`}>
          <Icon size={21} />
        </div>
      </div>
      <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
        <TrendingUp size={14} className="text-emerald-600" />
        {note}
      </p>
    </div>
  );
}

function JobCard({ job, view, onAction, onApplicants, onView }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const accent = ACCENTS[job.color] || ACCENTS.violet;
  const progress = Math.min(
    100,
    job.applicants ? Math.round((job.shortlisted / job.applicants) * 100) : 0
  );

  return (
    <article
      className={`group relative rounded-2xl border border-slate-200/80 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-xl hover:shadow-slate-200/60 ${
        view === "list" ? "p-5" : "p-5 sm:p-6"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3.5">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${accent}`}
          >
            {job.initials}
          </div>
          <div className="min-w-0">
            <button
              onClick={() => onView(job)}
              className="text-left text-base font-bold leading-6 text-slate-900 transition hover:text-violet-700"
            >
              {job.title}
            </button>
            <p className="mt-1 text-xs font-medium text-slate-400">
              {job.id} <span className="mx-1.5">·</span> {job.department}
            </p>
            <div className="mt-2.5">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${
                  STATUS_STYLES[job.status]
                }`}
              >
                <span
                  className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                    job.status === "Active"
                      ? "bg-emerald-500"
                      : job.status === "Paused"
                      ? "bg-amber-500"
                      : job.status === "Draft"
                      ? "bg-violet-500"
                      : "bg-slate-400"
                  }`}
                />
                {job.status}
              </span>
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((value) => !value)}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-800"
            aria-label={`Actions for ${job.title}`}
          >
            <MoreHorizontal size={21} />
          </button>

          {menuOpen && (
            <>
              <button
                aria-label="Close menu"
                className="fixed inset-0 z-10 cursor-default"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-10 z-20 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onView(job);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-violet-50"
                >
                  <Eye size={15} /> View details
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onAction("edit", job);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-violet-50"
                >
                  <Pencil size={15} /> Edit job
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onAction("duplicate", job);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-violet-50"
                >
                  <Copy size={15} /> Duplicate
                </button>
                {job.status !== "Closed" && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onAction(
                        job.status === "Paused" ? "activate" : "pause",
                        job
                      );
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-violet-50"
                  >
                    {job.status === "Paused" ? (
                      <CircleCheck size={15} />
                    ) : (
                      <CirclePause size={15} />
                    )}
                    {job.status === "Paused" ? "Activate job" : "Pause job"}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <MapPin size={14} /> {job.location}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <BriefcaseBusiness size={14} /> {job.type}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CircleDollarSign size={14} /> {job.salary}
        </span>
      </div>

      <div className="my-5 border-t border-slate-100" />

      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-slate-50/90 p-3">
          <p className="text-[11px] font-medium text-slate-500">Applicants</p>
          <p className="mt-1.5 text-xl font-bold text-slate-900">
            {job.applicants}
          </p>
        </div>
        <div className="rounded-xl bg-slate-50/90 p-3">
          <p className="text-[11px] font-medium text-slate-500">Shortlisted</p>
          <p className="mt-1.5 text-xl font-bold text-slate-900">
            {job.shortlisted}
          </p>
        </div>
        <div className="rounded-xl bg-slate-50/90 p-3">
          <p className="text-[11px] font-medium text-slate-500">Job views</p>
          <p className="mt-1.5 text-xl font-bold text-slate-900">
            {job.views >= 1000
              ? `${(job.views / 1000).toFixed(1)}k`
              : job.views}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-medium text-slate-500">
            Shortlisting progress
          </span>
          <span className="font-bold text-slate-700">{progress}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <div className="min-w-0 text-xs text-slate-500">
          <p className="flex items-center gap-1.5">
            <Clock3 size={13} /> Posted {job.posted}
          </p>
          <p className="mt-1.5 flex items-center gap-1.5 truncate">
            <CalendarDays size={13} /> Deadline: {job.deadline}
          </p>
        </div>
        <button
          onClick={() => onApplicants(job)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-violet-50 px-3 py-2.5 text-xs font-bold text-violet-700 transition hover:bg-violet-100"
        >
          Applicants <ArrowUpRight size={14} />
        </button>
      </div>
    </article>
  );
}

export default function RecruiterJobs() {
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All jobs");
  const [sortBy, setSortBy] = useState("recent");
  const [view, setView] = useState("grid");
  const [selectedJob, setSelectedJob] = useState(null);
  const [notice, setNotice] = useState("");

  const metrics = useMemo(() => {
    const active = jobs.filter((job) => job.status === "Active");
    return {
      total: jobs.length,
      active: active.length,
      applicants: jobs.reduce((sum, job) => sum + job.applicants, 0),
      views: jobs.reduce((sum, job) => sum + job.views, 0),
    };
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    let result = jobs.filter((job) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        [job.title, job.department, job.location, job.id]
          .some((value) => value.toLowerCase().includes(query));

      const matchesStatus =
        activeFilter === "All jobs" || job.status === activeFilter;

      return matchesSearch && matchesStatus;
    });

    result = [...result].sort((a, b) => {
      if (sortBy === "applicants") return b.applicants - a.applicants;
      if (sortBy === "views") return b.views - a.views;
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return b.id.localeCompare(a.id);
    });

    return result;
  }, [jobs, search, activeFilter, sortBy]);

  function handleJobAction(action, job) {
    if (action === "pause" || action === "activate") {
      const status = action === "pause" ? "Paused" : "Active";
      setJobs((current) =>
        current.map((item) =>
          item.id === job.id ? { ...item, status } : item
        )
      );
      setNotice(`${job.title} ${action === "pause" ? "paused" : "activated"}.`);
      return;
    }

    if (action === "duplicate") {
      const duplicate = {
        ...job,
        id: `PH-${1030 + jobs.length}`,
        title: `${job.title} (Copy)`,
        status: "Draft",
        applicants: 0,
        views: 0,
        shortlisted: 0,
        hired: 0,
        posted: "Not published",
        deadline: "Not set",
      };
      setJobs((current) => [duplicate, ...current]);
      setNotice("Draft copy created.");
      return;
    }

    if (action === "edit") {
      setSelectedJob(job);
      setNotice("Connect this action to your job-edit page.");
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F8FC] px-4 py-5 text-slate-900 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1500px] space-y-7">
        {/* Page header */}
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-violet-700">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-600" />
              Recruiter workspace
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Your jobs<span className="text-violet-600">.</span>
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Manage your openings, discover great candidates, and keep every
              hiring process moving forward.
            </p>
          </div>

          <button
            onClick={() => setNotice("Connect this button to your Create Job page.")}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-violet-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-800 hover:shadow-xl"
          >
            <Plus size={19} strokeWidth={2.5} />
            Post a new job
          </button>
        </header>

        {/* Hiring banner */}
        <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-[#27105B] via-[#5425A9] to-[#7C3AED] p-6 text-white shadow-xl shadow-violet-200/50 sm:p-8 lg:p-9">
          <div className="pointer-events-none absolute -right-12 -top-28 -z-10 h-72 w-72 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-2 -top-16 -z-10 h-56 w-56 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-24 right-1/4 -z-10 h-48 w-48 rounded-full bg-fuchsia-400/20 blur-3xl" />

          <div className="relative grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-violet-100 backdrop-blur">
                <Sparkles size={14} />
                Your hiring command center
              </div>
              <h2 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
                Great people make
                <br className="hidden sm:block" /> great companies.
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-6 text-violet-100/90">
                Track job performance, manage incoming applications, and find
                your next great teammate—all in one place.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveFilter("Active")}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-violet-800 transition hover:bg-violet-50"
                >
                  View active jobs <ArrowUpRight size={16} />
                </button>
                <div className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white">
                  <CircleCheck size={16} />
                  {metrics.active} jobs currently active
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-[290px]">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <BriefcaseBusiness size={20} className="text-violet-200" />
                <p className="mt-4 text-3xl font-bold">{metrics.total}</p>
                <p className="mt-1 text-xs font-medium text-violet-100">
                  Total job posts
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <Users size={20} className="text-violet-200" />
                <p className="mt-4 text-3xl font-bold">
                  {metrics.applicants.toLocaleString("en-IN")}
                </p>
                <p className="mt-1 text-xs font-medium text-violet-100">
                  Total applicants
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Metrics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={BriefcaseBusiness}
            label="Total job posts"
            value={metrics.total}
            note="Across all job statuses"
            accent="bg-violet-50 text-violet-700"
          />
          <MetricCard
            icon={CircleCheck}
            label="Active openings"
            value={metrics.active}
            note="Currently accepting applications"
            accent="bg-emerald-50 text-emerald-700"
          />
          <MetricCard
            icon={Users}
            label="Applications received"
            value={metrics.applicants.toLocaleString("en-IN")}
            note="Across your job listings"
            accent="bg-blue-50 text-blue-700"
          />
          <MetricCard
            icon={Eye}
            label="Total job views"
            value={
              metrics.views >= 1000
                ? `${(metrics.views / 1000).toFixed(1)}k`
                : metrics.views
            }
            note="Combined listing views"
            accent="bg-amber-50 text-amber-700"
          />
        </section>

        {/* Jobs section */}
        <section className="space-y-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Manage openings
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Review listings and stay on top of your hiring pipeline.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <Building2 size={15} />
              {filteredJobs.length} of {jobs.length} jobs shown
            </div>
          </div>

          {/* Search and controls */}
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
                  placeholder="Search job title, department, location or ID..."
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-200"
                    aria-label="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <label className="relative flex h-12 min-w-[155px] flex-1 items-center sm:flex-none">
                  <SlidersHorizontal
                    size={15}
                    className="pointer-events-none absolute left-3 text-slate-500"
                  />
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                    className="h-full w-full appearance-none rounded-xl border border-slate-200 bg-white pl-9 pr-9 text-sm font-medium text-slate-700 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                  >
                    <option value="recent">Most recent</option>
                    <option value="applicants">Most applicants</option>
                    <option value="views">Most viewed</option>
                    <option value="title">Job title A–Z</option>
                  </select>
                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 text-slate-400"
                  />
                </label>

                <div className="flex h-12 items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
                  <button
                    onClick={() => setView("grid")}
                    aria-label="Grid view"
                    className={`rounded-lg p-2.5 transition ${
                      view === "grid"
                        ? "bg-white text-violet-700 shadow-sm"
                        : "text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button
                    onClick={() => setView("list")}
                    aria-label="List view"
                    className={`rounded-lg p-2.5 transition ${
                      view === "list"
                        ? "bg-white text-violet-700 shadow-sm"
                        : "text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {FILTERS.map((filter) => {
                const count =
                  filter === "All jobs"
                    ? jobs.length
                    : jobs.filter((job) => job.status === filter).length;

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
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[10px] ${
                        activeFilter === filter
                          ? "bg-white/15 text-white"
                          : "bg-white text-slate-500"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results */}
          {filteredJobs.length > 0 ? (
            <div
              className={
                view === "grid"
                  ? "grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3"
                  : "flex flex-col gap-3"
              }
            >
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  view={view}
                  onAction={handleJobAction}
                  onApplicants={(item) =>
                    setNotice(`Connect applicants for ${item.title} to your application page.`)
                  }
                  onView={setSelectedJob}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                <Filter size={24} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">
                No matching jobs
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Try a different search term or change your status filter to
                find the job you are looking for.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setActiveFilter("All jobs");
                }}
                className="mt-5 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-violet-800"
              >
                Clear filters
              </button>
            </div>
          )}

          <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-4 sm:flex-row sm:px-5">
            <p className="text-xs text-slate-500">
              Showing <span className="font-bold text-slate-800">{filteredJobs.length}</span>{" "}
              matching job listings
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled
                className="flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-400 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={15} /> Previous
              </button>
              <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-violet-700 px-3 text-xs font-bold text-white">
                1
              </span>
              <button
                disabled
                className="flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-400 disabled:cursor-not-allowed"
              >
                Next <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </section>

        {/* Job detail preview */}
        {selectedJob && (
          <div
            className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-[2px]"
            onClick={() => setSelectedJob(null)}
          >
            <aside
              className="h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-2xl sm:p-8"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-violet-700">
                  Job overview
                </span>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
                  aria-label="Close details"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-8 flex items-start gap-4">
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-bold ${
                    ACCENTS[selectedJob.color]
                  }`}
                >
                  {selectedJob.initials}
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-950">
                    {selectedJob.title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {selectedJob.id} · {selectedJob.department}
                  </p>
                  <span
                    className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                      STATUS_STYLES[selectedJob.status]
                    }`}
                  >
                    {selectedJob.status}
                  </span>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3">
                {[
                  ["Location", selectedJob.location, MapPin],
                  ["Work mode", selectedJob.mode, Building2],
                  ["Employment", selectedJob.type, BriefcaseBusiness],
                  ["Salary range", selectedJob.salary, CircleDollarSign],
                ].map(([label, value, Icon]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <Icon size={17} className="text-violet-600" />
                    <p className="mt-3 text-xs text-slate-500">{label}</p>
                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="font-bold text-slate-900">Hiring performance</h3>
                <div className="mt-3 space-y-3">
                  {[
                    ["Applicants", selectedJob.applicants],
                    ["Shortlisted", selectedJob.shortlisted],
                    ["Hired", selectedJob.hired],
                    ["Job views", selectedJob.views],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
                    >
                      <span className="text-sm text-slate-600">{label}</span>
                      <span className="font-bold text-slate-900">
                        {Number(value).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 rounded-2xl bg-violet-50 p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-violet-800">
                  <CalendarDays size={17} /> Hiring timeline
                </div>
                <p className="mt-3 text-sm text-violet-900/80">
                  Posted: {selectedJob.posted}
                </p>
                <p className="mt-2 text-sm text-violet-900/80">
                  Application deadline: {selectedJob.deadline}
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedJob(null);
                  setNotice(`Connect ${selectedJob.title} to your applicant management page.`);
                }}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-700 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-violet-800"
              >
                <Users size={17} /> View applicants <ArrowUpRight size={16} />
              </button>
            </aside>
          </div>
        )}

        {/* Lightweight feedback */}
        {notice && (
          <div className="fixed bottom-5 right-5 z-[60] flex max-w-sm items-start gap-3 rounded-2xl border border-violet-100 bg-white p-4 shadow-2xl shadow-violet-200/50">
            <div className="rounded-lg bg-violet-100 p-2 text-violet-700">
              <FileText size={17} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900">Peer.Hiring</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">{notice}</p>
            </div>
            <button
              onClick={() => setNotice("")}
              className="rounded-md p-1 text-slate-400 hover:bg-slate-100"
              aria-label="Dismiss notification"
            >
              <X size={15} />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
