
import React, { useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BriefcaseBusiness,
  Building,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  Ellipsis,
  ExternalLink,
  FileText,
  Filter,
  LayoutDashboard,
  MapPin,
  MessageSquare,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Users,
  Video,
  X,
  Zap,
} from "lucide-react";

const violet = "#6D28D9";

const initialJobs = [
  {
    id: "JOB-1042",
    title: "Senior Frontend Engineer",
    department: "Engineering",
    type: "Full-time",
    location: "Bengaluru · Hybrid",
    applicants: 84,
    shortlisted: 12,
    interviews: 6,
    status: "Active",
    color: "violet",
    posted: "4 days ago",
  },
  {
    id: "JOB-1041",
    title: "Product Designer",
    department: "Design",
    type: "Full-time",
    location: "Remote · India",
    applicants: 61,
    shortlisted: 9,
    interviews: 4,
    status: "Active",
    color: "blue",
    posted: "6 days ago",
  },
  {
    id: "JOB-1039",
    title: "Backend Engineer — Node.js",
    department: "Engineering",
    type: "Full-time",
    location: "Bengaluru · On-site",
    applicants: 57,
    shortlisted: 8,
    interviews: 3,
    status: "Active",
    color: "emerald",
    posted: "1 week ago",
  },
  {
    id: "JOB-1037",
    title: "Talent Acquisition Associate",
    department: "Human Resources",
    type: "Full-time",
    location: "Delhi · Hybrid",
    applicants: 46,
    shortlisted: 7,
    interviews: 2,
    status: "Paused",
    color: "amber",
    posted: "2 weeks ago",
  },
];

const initialCandidates = [
  {
    id: "APP-2841",
    name: "Priya Sharma",
    initials: "PS",
    role: "Senior Frontend Engineer",
    email: "priya.sharma@example.com",
    applied: "12 min ago",
    stage: "New",
    score: 94,
    color: "violet",
  },
  {
    id: "APP-2840",
    name: "Rahul Verma",
    initials: "RV",
    role: "Backend Engineer — Node.js",
    email: "rahul.verma@example.com",
    applied: "38 min ago",
    stage: "Shortlisted",
    score: 89,
    color: "blue",
  },
  {
    id: "APP-2839",
    name: "Ananya Gupta",
    initials: "AG",
    role: "Product Designer",
    email: "ananya.gupta@example.com",
    applied: "1 hour ago",
    stage: "Interview",
    score: 92,
    color: "rose",
  },
  {
    id: "APP-2838",
    name: "Arjun Mehta",
    initials: "AM",
    role: "Senior Frontend Engineer",
    email: "arjun.mehta@example.com",
    applied: "2 hours ago",
    stage: "Reviewing",
    score: 86,
    color: "emerald",
  },
  {
    id: "APP-2837",
    name: "Sneha Kapoor",
    initials: "SK",
    role: "Talent Acquisition Associate",
    email: "sneha.kapoor@example.com",
    applied: "3 hours ago",
    stage: "New",
    score: 88,
    color: "amber",
  },
];

const initialInterviews = [
  {
    id: 1,
    candidate: "Ananya Gupta",
    initials: "AG",
    role: "Product Designer",
    time: "10:30 AM",
    duration: "45 min",
    type: "Video interview",
    interviewer: "Alex Morgan",
    color: "rose",
  },
  {
    id: 2,
    candidate: "Rahul Verma",
    initials: "RV",
    role: "Backend Engineer — Node.js",
    time: "12:00 PM",
    duration: "60 min",
    type: "Technical round",
    interviewer: "David Wilson",
    color: "blue",
  },
  {
    id: 3,
    candidate: "Priya Sharma",
    initials: "PS",
    role: "Senior Frontend Engineer",
    time: "02:30 PM",
    duration: "45 min",
    type: "Hiring manager",
    interviewer: "Alex Morgan",
    color: "violet",
  },
];

const chartData = [
  { day: "Mon", applications: 34, interviews: 14 },
  { day: "Tue", applications: 48, interviews: 20 },
  { day: "Wed", applications: 39, interviews: 16 },
  { day: "Thu", applications: 62, interviews: 26 },
  { day: "Fri", applications: 52, interviews: 21 },
  { day: "Sat", applications: 30, interviews: 11 },
  { day: "Sun", applications: 43, interviews: 18 },
];

const stages = [
  { name: "Applied", count: 248, color: "bg-violet-600", width: "100%" },
  { name: "Screening", count: 112, color: "bg-indigo-500", width: "45.2%" },
  { name: "Shortlisted", count: 64, color: "bg-blue-500", width: "25.8%" },
  { name: "Interview", count: 36, color: "bg-cyan-500", width: "14.5%" },
  { name: "Offer", count: 12, color: "bg-emerald-500", width: "4.8%" },
];

const avatarStyles = {
  violet: "bg-violet-100 text-violet-700",
  blue: "bg-blue-100 text-blue-700",
  rose: "bg-rose-100 text-rose-700",
  emerald: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-700",
};

function Avatar({ initials, color = "violet", size = "md" }) {
  const sizes = {
    sm: "h-8 w-8 text-[11px]",
    md: "h-10 w-10 text-xs",
    lg: "h-12 w-12 text-sm",
  };

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-xl font-bold ${sizes[size]} ${avatarStyles[color] || avatarStyles.violet}`}
    >
      {initials}
    </div>
  );
}

function SectionTitle({ title, description, action }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-[15px] font-bold tracking-tight text-slate-900">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    New: "bg-blue-50 text-blue-700 ring-blue-600/10",
    Shortlisted: "bg-violet-50 text-violet-700 ring-violet-600/10",
    Interview: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
    Reviewing: "bg-amber-50 text-amber-700 ring-amber-600/10",
    Active: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
    Paused: "bg-slate-100 text-slate-600 ring-slate-500/10",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap items-center rounded-md px-2 py-1 text-[10px] font-bold ring-1 ring-inset ${styles[status] || "bg-slate-100 text-slate-600 ring-slate-500/10"}`}
    >
      {status}
    </span>
  );
}

function MetricCard({
  label,
  value,
  change,
  detail,
  icon: Icon,
  color,
  negative = false,
}) {
  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.025)] transition hover:border-slate-300 hover:shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium leading-5 text-slate-500 sm:text-[13px]">
          {label}
        </p>
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${color}`}>
          <Icon size={17} strokeWidth={1.8} />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-[27px] font-bold leading-none tracking-[-1px] text-slate-950 sm:text-[30px]">
          {value}
        </span>
        <span
          className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${negative ? "text-rose-600" : "text-emerald-600"}`}
        >
          {negative ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />}
          {change}
        </span>
      </div>
      <p className="mt-3 text-[11px] leading-5 text-slate-500">{detail}</p>
    </div>
  );
}

function ChartPanel() {
  const [period, setPeriod] = useState("7 days");

  const data = useMemo(() => {
    if (period === "30 days") {
      return [
        { day: "W1", applications: 180, interviews: 65 },
        { day: "W2", applications: 225, interviews: 82 },
        { day: "W3", applications: 195, interviews: 75 },
        { day: "W4", applications: 248, interviews: 94 },
      ];
    }
    if (period === "90 days") {
      return [
        { day: "Aug", applications: 510, interviews: 188 },
        { day: "Sep", applications: 625, interviews: 235 },
        { day: "Oct", applications: 720, interviews: 284 },
      ];
    }
    return chartData;
  }, [period]);

  const max = Math.max(...data.map((d) => d.applications)) * 1.15;

  return (
    <section className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.025)] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-bold text-slate-900">
            Hiring activity
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Application volume and interview activity over time.
          </p>
        </div>
        <label className="relative">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs font-semibold text-slate-700 outline-none hover:border-slate-300 focus:border-violet-500"
          >
            <option>7 days</option>
            <option>30 days</option>
            <option>90 days</option>
          </select>
          <ChevronDown
            size={13}
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-[11px] font-medium text-slate-600">
          <span className="h-2.5 w-2.5 rounded-sm bg-violet-600" />
          Applications
        </div>
        <div className="flex items-center gap-2 text-[11px] font-medium text-slate-600">
          <span className="h-2.5 w-2.5 rounded-sm bg-violet-200" />
          Interviews
        </div>
      </div>

      <div className="mt-5 grid grid-cols-[24px_1fr] gap-2">
        <div className="flex flex-col justify-between pb-7 pt-0 text-right text-[10px] text-slate-400">
          <span>{Math.round(max)}</span>
          <span>{Math.round(max * 0.75)}</span>
          <span>{Math.round(max * 0.5)}</span>
          <span>{Math.round(max * 0.25)}</span>
          <span>0</span>
        </div>

        <div>
          <div className="relative h-[194px]">
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-7">
              {[0, 1, 2, 3, 4].map((n) => (
                <div key={n} className="border-t border-dashed border-slate-100" />
              ))}
            </div>

            <div className="relative flex h-full items-end justify-around gap-2 sm:gap-4">
              {data.map((item) => (
                <div
                  key={item.day}
                  className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                >
                  <div className="relative flex h-[165px] w-full items-end justify-center gap-[3px] sm:gap-1.5">
                    <div
                      title={`${item.applications} applications`}
                      className="w-[30%] max-w-7 rounded-t-[4px] bg-violet-600 transition-all duration-300 group-hover:bg-violet-700 sm:w-7"
                      style={{ height: `${(item.applications / max) * 100}%` }}
                    />
                    <div
                      title={`${item.interviews} interviews`}
                      className="w-[30%] max-w-7 rounded-t-[4px] bg-violet-200 transition-all duration-300 group-hover:bg-violet-300 sm:w-7"
                      style={{ height: `${(item.interviews / max) * 100}%` }}
                    />
                  </div>
                  <span className="mt-2 h-5 text-[10px] font-medium text-slate-500">
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-4">
        <p className="text-[11px] text-slate-500">
          Activity across your hiring pipeline
        </p>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
          <Activity size={13} />
          Tracking enabled
        </span>
      </div>
    </section>
  );
}

function PipelinePanel() {
  return (
    <section className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.025)] sm:p-6">
      <SectionTitle
        title="Hiring funnel"
        description="Candidate progression across all open roles."
        action={
          <button className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50">
            <Ellipsis size={17} />
          </button>
        }
      />

      <div className="mt-6 space-y-[18px]">
        {stages.map((stage, index) => (
          <div key={stage.name}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className={`h-2 w-2 rounded-full ${stage.color}`} />
                <span className="text-xs font-semibold text-slate-700">
                  {stage.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tabular-nums text-slate-900">
                  {stage.count}
                </span>
                <span className="w-8 text-right text-[10px] text-slate-400">
                  {index === 0 ? "100%" : `${((stage.count / stages[0].count) * 100).toFixed(0)}%`}
                </span>
              </div>
            </div>
            <div className="h-[7px] overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${stage.color} transition-all duration-500`}
                style={{ width: stage.width }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-violet-100 bg-violet-50/70 p-3.5">
        <div className="flex items-start gap-2.5">
          <Sparkles size={16} className="mt-0.5 shrink-0 text-violet-700" />
          <div>
            <p className="text-xs font-bold text-violet-900">
              Funnel insight
            </p>
            <p className="mt-1 text-[11px] leading-5 text-violet-800">
              Review candidates awaiting screening to help keep your hiring
              pipeline moving.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ApplicationsPanel({ candidates, setCandidates, onViewAll }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All stages");
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const filtered = candidates.filter((candidate) => {
    const matchesQuery =
      `${candidate.name} ${candidate.role} ${candidate.id}`
        .toLowerCase()
        .includes(query.toLowerCase());
    const matchesStage = filter === "All stages" || candidate.stage === filter;
    return matchesQuery && matchesStage;
  });

  const updateStage = (candidateId, stage) => {
    setCandidates((current) =>
      current.map((candidate) =>
        candidate.id === candidateId ? { ...candidate, stage } : candidate
      )
    );
    setSelectedCandidate(null);
  };

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.025)]">
      <div className="p-5 sm:p-6">
        <SectionTitle
          title="Recent applications"
          description="Review incoming candidates and their current stage."
          action={
            <button
              onClick={onViewAll}
              className="inline-flex items-center gap-1 text-xs font-bold text-violet-700 hover:text-violet-900"
            >
              View all
              <ArrowRight size={14} />
            </button>
          }
        />

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search candidates or roles..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
            />
          </div>
          <div className="relative">
            <Filter
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-9 pr-8 text-xs font-medium text-slate-700 outline-none focus:border-violet-500 sm:w-40"
            >
              <option>All stages</option>
              <option>New</option>
              <option>Reviewing</option>
              <option>Shortlisted</option>
              <option>Interview</option>
            </select>
            <ChevronDown
              size={13}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-left">
          <thead>
            <tr className="border-y border-slate-100 bg-slate-50/80">
              {["Candidate", "Applied for", "Applied", "Stage", "Match"].map(
                (heading) => (
                  <th
                    key={heading}
                    className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500"
                  >
                    {heading}
                  </th>
                )
              )}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((candidate) => (
              <tr
                key={candidate.id}
                className="transition hover:bg-slate-50/70"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar
                      initials={candidate.initials}
                      color={candidate.color}
                    />
                    <div>
                      <p className="whitespace-nowrap text-xs font-bold text-slate-800">
                        {candidate.name}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-400">
                        {candidate.id}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="max-w-[175px] px-5 py-4">
                  <p className="truncate text-xs font-medium text-slate-700">
                    {candidate.role}
                  </p>
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-[11px] text-slate-500">
                  {candidate.applied}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={candidate.stage} />
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-12 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${candidate.score}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-700">
                      {candidate.score}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <button
                    onClick={() => setSelectedCandidate(candidate)}
                    aria-label={`Review ${candidate.name}`}
                    className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                  >
                    <ArrowUpRight size={15} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-12 text-center text-sm text-slate-500"
                >
                  No candidates match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-5 py-3.5">
        <p className="text-[11px] text-slate-500">
          Showing {filtered.length} candidate{filtered.length === 1 ? "" : "s"}
        </p>
        <span className="text-[10px] text-slate-400">
          Demo candidate data
        </span>
      </div>

      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/30 backdrop-blur-[2px]">
          <button
            aria-label="Close candidate details"
            onClick={() => setSelectedCandidate(null)}
            className="absolute inset-0 cursor-default"
          />
          <aside className="relative flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h3 className="text-sm font-bold text-slate-900">
                Candidate overview
              </h3>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={17} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4">
                <Avatar
                  initials={selectedCandidate.initials}
                  color={selectedCandidate.color}
                  size="lg"
                />
                <div>
                  <h4 className="text-lg font-bold text-slate-900">
                    {selectedCandidate.name}
                  </h4>
                  <p className="mt-1 text-xs text-slate-500">
                    {selectedCandidate.role}
                  </p>
                </div>
              </div>
              <div className="mt-6 rounded-xl border border-slate-200 p-4">
                <p className="text-xs text-slate-500">Application match score</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {selectedCandidate.score}%
                </p>
                <div className="mt-3 h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-violet-600"
                    style={{ width: `${selectedCandidate.score}%` }}
                  />
                </div>
              </div>
              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-[11px] font-medium text-slate-500">Application ID</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {selectedCandidate.id}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-500">Email</p>
                  <p className="mt-1 break-all text-sm font-medium text-slate-800">
                    {selectedCandidate.email}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-500">Current stage</p>
                  <div className="mt-2">
                    <StatusBadge status={selectedCandidate.stage} />
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-500">Applied</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {selectedCandidate.applied}
                  </p>
                </div>
              </div>
              <div className="mt-7 border-t border-slate-100 pt-5">
                <p className="text-sm font-bold text-slate-900">Update stage</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Change this candidate’s stage in the local demo.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["New", "Reviewing", "Shortlisted", "Interview"].map((stage) => (
                    <button
                      key={stage}
                      onClick={() => updateStage(selectedCandidate.id, stage)}
                      className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                        selectedCandidate.stage === stage
                          ? "border-violet-200 bg-violet-50 text-violet-800"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {stage}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}

function InterviewsPanel() {
  const [interviews, setInterviews] = useState(initialInterviews);
  const [selected, setSelected] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? interviews : interviews.slice(0, 3);

  return (
    <section className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.025)] sm:p-6">
      <SectionTitle
        title="Upcoming interviews"
        description="Today's scheduled candidate conversations."
        action={
          <button
            onClick={() => setShowAll((value) => !value)}
            className="text-xs font-bold text-violet-700 hover:text-violet-900"
          >
            {showAll ? "Show less" : "View calendar"}
          </button>
        }
      />

      <div className="mt-5 space-y-3">
        {visible.map((interview) => (
          <div
            key={interview.id}
            className="rounded-xl border border-slate-200 p-3.5 transition hover:border-slate-300 sm:p-4"
          >
            <div className="flex items-start gap-3">
              <Avatar initials={interview.initials} color={interview.color} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-slate-900">
                  {interview.candidate}
                </p>
                <p className="mt-1 truncate text-[11px] text-slate-500">
                  {interview.role}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs font-bold text-slate-900">
                  {interview.time}
                </p>
                <p className="mt-1 text-[10px] text-slate-500">
                  {interview.duration}
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
                <Video size={13} />
                {interview.type}
              </span>
              <button
                onClick={() => setSelected(interview)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-violet-700 hover:text-violet-900"
              >
                Details
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-start gap-2.5 rounded-lg bg-slate-50 p-3">
        <Clock3 size={15} className="mt-0.5 shrink-0 text-slate-500" />
        <p className="text-[11px] leading-5 text-slate-600">
          Keep interview notes and feedback updated after each conversation.
        </p>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Interview details
              </h3>
              <button
                onClick={() => setSelected(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={17} />
              </button>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <Avatar initials={selected.initials} color={selected.color} size="lg" />
              <div>
                <p className="font-bold text-slate-900">{selected.candidate}</p>
                <p className="mt-1 text-xs text-slate-500">{selected.role}</p>
              </div>
            </div>
            <div className="mt-5 space-y-3 rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-700">
                <span className="font-semibold">Time:</span> {selected.time}
              </p>
              <p className="text-sm text-slate-700">
                <span className="font-semibold">Duration:</span> {selected.duration}
              </p>
              <p className="text-sm text-slate-700">
                <span className="font-semibold">Interview:</span> {selected.type}
              </p>
              <p className="text-sm text-slate-700">
                <span className="font-semibold">Interviewer:</span> {selected.interviewer}
              </p>
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-500">
              Demo interview information. Connect this panel to your interview
              records to display real schedules and meeting links.
            </p>
            <button
              onClick={() => setSelected(null)}
              className="mt-5 w-full rounded-lg bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-800"
            >
              Close details
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function JobsPanel({ jobs, setJobs, onViewAll }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All jobs");

  const filtered = jobs.filter((job) => {
    const matchesQuery = `${job.title} ${job.id} ${job.department}`
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesStatus = filter === "All jobs" || job.status === filter;
    return matchesQuery && matchesStatus;
  });

  const toggleJob = (jobId) => {
    setJobs((current) =>
      current.map((job) =>
        job.id === jobId
          ? { ...job, status: job.status === "Active" ? "Paused" : "Active" }
          : job
      )
    );
  };

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.025)]">
      <div className="p-5 sm:p-6">
        <SectionTitle
          title="Your job openings"
          description="Track performance across your published positions."
          action={
            <button
              onClick={onViewAll}
              className="inline-flex items-center gap-1 text-xs font-bold text-violet-700 hover:text-violet-900"
            >
              Manage jobs
              <ArrowRight size={14} />
            </button>
          }
        />

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search job openings..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs outline-none placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 outline-none focus:border-violet-500"
          >
            <option>All jobs</option>
            <option>Active</option>
            <option>Paused</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-y border-slate-100 bg-slate-50/80">
              {["Job opening", "Applicants", "Shortlisted", "Interviews", "Status"].map(
                (heading) => (
                  <th
                    key={heading}
                    className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500"
                  >
                    {heading}
                  </th>
                )
              )}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((job) => (
              <tr key={job.id} className="transition hover:bg-slate-50/70">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600">
                      <BriefcaseBusiness size={16} />
                    </div>
                    <div>
                      <p className="max-w-[230px] truncate text-xs font-bold text-slate-800">
                        {job.title}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-500">
                        {job.id} · {job.department}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-xs font-bold tabular-nums text-slate-800">
                  {job.applicants}
                </td>
                <td className="px-5 py-4 text-xs font-medium tabular-nums text-slate-700">
                  {job.shortlisted}
                </td>
                <td className="px-5 py-4 text-xs font-medium tabular-nums text-slate-700">
                  {job.interviews}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={job.status} />
                </td>
                <td className="px-4 py-4">
                  <button
                    onClick={() => toggleJob(job.id)}
                    title={job.status === "Active" ? "Pause job (demo)" : "Activate job (demo)"}
                    className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                  >
                    <Ellipsis size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm text-slate-500">
                  No job openings match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3.5">
        <p className="text-[11px] text-slate-500">
          {filtered.length} job opening{filtered.length === 1 ? "" : "s"}
        </p>
        <p className="text-[10px] text-slate-400">Demo job data</p>
      </div>
    </section>
  );
}

function QuickActions({ onAction }) {
  const actions = [
    {
      title: "Post a new job",
      description: "Create a job opening",
      icon: Plus,
      key: "jobs",
    },
    {
      title: "Review applications",
      description: "Evaluate candidates",
      icon: FileText,
      key: "applications",
    },
    {
      title: "Schedule interview",
      description: "Coordinate next steps",
      icon: CalendarDays,
      key: "interviews",
    },
    {
      title: "Company profile",
      description: "Manage organization details",
      icon: Building,
      key: "company",
    },
  ];

  return (
    <section className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.025)] sm:p-6">
      <SectionTitle
        title="Quick actions"
        description="Get to your most-used recruiting tools."
      />
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {actions.map(({ title, description, icon: Icon, key }) => (
          <button
            key={key}
            onClick={() => onAction(key)}
            className="group flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition hover:border-violet-200 hover:bg-violet-50/40"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition group-hover:bg-violet-100 group-hover:text-violet-700">
              <Icon size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-slate-800">
                {title}
              </p>
              <p className="mt-1 truncate text-[10px] text-slate-500">
                {description}
              </p>
            </div>
            <ChevronRight size={14} className="shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-violet-700" />
          </button>
        ))}
      </div>
    </section>
  );
}

function RecruiterWelcome() {
  return (
    <section className="relative overflow-hidden rounded-xl border border-violet-900 bg-[#211044] p-5 text-white shadow-sm sm:p-7">
      <div className="pointer-events-none absolute -right-10 -top-20 h-56 w-56 rounded-full border border-white/10" />
      <div className="pointer-events-none absolute -right-2 -top-12 h-44 w-44 rounded-full border border-white/10" />
      <div className="pointer-events-none absolute -bottom-24 right-28 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div className="max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/10 px-2.5 py-1.5 text-[10px] font-semibold tracking-wide text-violet-100">
            <Sparkles size={13} />
            RECRUITER WORKSPACE
          </div>
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
            Good morning, Alex
          </h2>
          <p className="mt-2 max-w-lg text-xs leading-6 text-violet-100/80 sm:text-sm">
            Your hiring pipeline is moving. You have 3 interviews scheduled
            today and candidates waiting for review. Let’s make your next great
            hire.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("peer-dashboard-action", { detail: "applications" }))}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-bold text-violet-900 transition hover:bg-violet-50"
            >
              Review applications
              <ArrowRight size={14} />
            </button>
            <span className="inline-flex items-center gap-1.5 text-[11px] text-violet-100/80">
              <CalendarDays size={14} />
              Monday, October 20
            </span>
          </div>
        </div>

        <div className="grid min-w-[190px] grid-cols-2 gap-2 sm:w-52 sm:shrink-0">
          <div className="rounded-lg border border-white/10 bg-white/[0.07] p-3.5">
            <p className="text-[10px] font-medium text-violet-100/70">
              Interviews today
            </p>
            <p className="mt-2 text-2xl font-bold">03</p>
            <p className="mt-1 text-[10px] text-violet-100/70">
              Scheduled
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.07] p-3.5">
            <p className="text-[10px] font-medium text-violet-100/70">
              To review
            </p>
            <p className="mt-2 text-2xl font-bold">18</p>
            <p className="mt-1 text-[10px] text-violet-100/70">
              Applications
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState(initialJobs);
  const [candidates, setCandidates] = useState(initialCandidates);
  const [notice, setNotice] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");

  const notify = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  };

  const navigateTo = (key) => {
    const paths = {
      jobs: "/recruiter/jobs",
      applications: "/recruiter/applications",
      interviews: "/recruiter/interviews",
      company: "/recruiter/companies",
    };
    if (paths[key]) {
      window.location.href = paths[key];
    }
  };

  const filteredSearch = globalSearch.trim().toLowerCase();

  const searchedCandidates = useMemo(
    () =>
      filteredSearch
        ? candidates.filter((candidate) =>
            `${candidate.name} ${candidate.role} ${candidate.id}`
              .toLowerCase()
              .includes(filteredSearch)
          )
        : candidates,
    [candidates, filteredSearch]
  );

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-slate-900">

      {/* Main dashboard */}
      <main className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
        {notice && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-800">
            <CheckCircle2 size={15} />
            {notice}
            <button onClick={() => setNotice("")} className="ml-auto">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Heading */}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[11px] font-medium text-slate-500">
              <LayoutDashboard size={13} />
              <span>Workspace</span>
              <ChevronRight size={12} />
              <span className="text-slate-800">Dashboard</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-[30px]">
              Dashboard
            </h1>
            <p className="mt-1.5 text-xs leading-5 text-slate-500 sm:text-sm">
              Here’s what’s happening across your recruitment pipeline.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => notify("Connect your export handler to download live reports.")}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <Download size={15} />
              <span className="hidden sm:inline">Export report</span>
              <span className="sm:hidden">Export</span>
            </button>
            <button
              onClick={() => navigateTo("jobs")}
              className="inline-flex items-center gap-2 rounded-lg bg-violet-700 px-3.5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-violet-800"
            >
              <Plus size={15} />
              Post a job
            </button>
          </div>
        </div>

        <RecruiterWelcome />

        {/* Metrics */}
        <section className="mt-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-sm font-bold tracking-tight text-slate-900">
              Hiring overview
            </h2>
            <span className="text-[10px] font-medium text-slate-400">
              Sample reporting period · Last 30 days
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Total applications"
              value="248"
              change="+18.6%"
              detail="Compared with the previous 30 days"
              icon={Users}
              color="bg-violet-50 text-violet-700"
            />
            <MetricCard
              label="Active job openings"
              value={String(jobs.filter((job) => job.status === "Active").length + 8)}
              change="+2"
              detail="Open positions across your team"
              icon={BriefcaseBusiness}
              color="bg-blue-50 text-blue-700"
            />
            <MetricCard
              label="Interviews scheduled"
              value="36"
              change="+12.4%"
              detail="Interview activity this month"
              icon={CalendarDays}
              color="bg-emerald-50 text-emerald-700"
            />
            <MetricCard
              label="Time to hire"
              value="18.4d"
              change="8.2%"
              negative={false}
              detail="Average time from application to hire"
              icon={Zap}
              color="bg-amber-50 text-amber-700"
            />
          </div>
        </section>

        {/* Analytics */}
        <section className="mt-5 grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)]">
          <ChartPanel />
          <PipelinePanel />
        </section>

        {/* Application table */}
        <section className="mt-5">
          <ApplicationsPanel
            candidates={searchedCandidates}
            setCandidates={setCandidates}
            onViewAll={() => navigateTo("applications")}
          />
        </section>

        {/* Jobs and interviews */}
        <section className="mt-5 grid grid-cols-1 items-start gap-5 2xl:grid-cols-[minmax(0,1.5fr)_minmax(360px,0.9fr)]">
          <JobsPanel
            jobs={jobs}
            setJobs={setJobs}
            onViewAll={() => navigateTo("jobs")}
          />
          <InterviewsPanel />
        </section>

        {/* Quick actions */}
        <section className="mt-5">
          <QuickActions
            onAction={(key) => {
              if (key === "company") {
                navigateTo("company");
                return;
              }
              navigateTo(key);
            }}
          />
        </section>

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
          <div>
            <p className="text-xs font-bold text-slate-700">
              Peer.Hiring
            </p>
            <p className="mt-1 text-[10px] text-slate-400">
              A smarter way to build your team.
            </p>
          </div>
          <div className="flex items-center gap-4 text-[10px] text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Workspace ready
            </span>
            <span>Recruiter dashboard</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
