import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Building,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Download,
  Ellipsis,
  FileText,
  Filter,
  LayoutDashboard,
  Plus,
  Search,
  Sparkles,
  Users,
  Video,
  X,
  Zap,
} from "lucide-react";
import {
  useApplication,
  useAuth,
  useCompany,
  useHome,
  useInterview,
  useJob,
} from "../../hooks/Hook";

const violet = "#6D28D9";

const avatarStyles = {
  violet: "bg-violet-100 text-violet-700",
  blue: "bg-blue-100 text-blue-700",
  rose: "bg-rose-100 text-rose-700",
  emerald: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-700",
};

const stageStyles = {
  applied: {
    label: "New",
    color: "bg-blue-50 text-blue-700 ring-blue-600/10",
  },
  screening: {
    label: "Reviewing",
    color: "bg-amber-50 text-amber-700 ring-amber-600/10",
  },
  shortlisted: {
    label: "Shortlisted",
    color: "bg-violet-50 text-violet-700 ring-violet-600/10",
  },
  interview_scheduled: {
    label: "Interview",
    color: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
  },
  interview_completed: {
    label: "Interview",
    color: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
  },
  selected: {
    label: "Selected",
    color: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
  },
  rejected: {
    label: "Rejected",
    color: "bg-rose-50 text-rose-700 ring-rose-600/10",
  },
  withdrawn: {
    label: "Withdrawn",
    color: "bg-slate-100 text-slate-600 ring-slate-500/10",
  },
  closed: {
    label: "Closed",
    color: "bg-slate-100 text-slate-600 ring-slate-500/10",
  },
};

const colorPalette = ["violet", "blue", "rose", "emerald", "amber"];

const getObjectId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return String(value._id || value.id || "");
};

const getInitials = (name = "") => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "—";
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
};

const getColor = (value = "") => {
  let hash = 0;
  for (let i = 0; i < String(value).length; i += 1) {
    hash = String(value).charCodeAt(i) + ((hash << 5) - hash);
  }
  return colorPalette[Math.abs(hash) % colorPalette.length];
};

const getName = (value, fallback = "Candidate") => {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  return (
    value.name ||
    value.fullName ||
    value.title ||
    value.email ||
    fallback
  );
};

const getEmail = (value) => {
  if (!value) return "";
  if (typeof value === "string") return "";
  return value.email || "";
};

const getDate = (...values) => {
  for (const value of values) {
    if (!value) continue;
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date;
  }
  return null;
};

const formatDate = (date) => {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

const formatTime = (date) => {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(date);
};

const formatRelativeTime = (date) => {
  if (!date) return "—";

  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 0) return formatDate(date);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;

  return formatDate(date);
};

const formatDuration = (value) => {
  if (!value) return "—";
  if (typeof value === "string" && /min|hour|hr/i.test(value)) return value;

  const minutes = Number(value);
  if (!Number.isFinite(minutes) || minutes <= 0) return "—";

  if (minutes >= 60 && minutes % 60 === 0) {
    return `${minutes / 60} hr${minutes / 60 === 1 ? "" : "s"}`;
  }

  return `${minutes} min`;
};

const getApplicationStatus = (status) => {
  const key = String(status || "applied").toLowerCase();
  return stageStyles[key] || {
    label: key.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()),
    color: "bg-slate-100 text-slate-600 ring-slate-500/10",
  };
};

const getJobStatus = (job) => {
  const status = String(job?.status || "").toLowerCase();

  if (
    job?.isBlocked ||
    job?.isDeleted ||
    job?.isActive === false ||
    ["paused", "inactive", "closed", "blocked", "draft"].includes(status)
  ) {
    return "Paused";
  }

  if (["active", "published", "open"].includes(status) || job?.isActive === true) {
    return "Active";
  }

  return status
    ? status.charAt(0).toUpperCase() + status.slice(1)
    : "—";
};

const getJobTitle = (job) =>
  getName(job, "Untitled job");

const getApplicationCandidate = (application) =>
  application?.candidateId ||
  application?.candidate ||
  application?.userId ||
  application?.user ||
  application?.applicant ||
  null;

const getApplicationJob = (application) =>
  application?.jobId ||
  application?.job ||
  null;

const getInterviewCandidate = (interview) =>
  interview?.candidateId ||
  interview?.candidate ||
  interview?.userId ||
  interview?.applicant ||
  null;

const getInterviewJob = (interview) =>
  interview?.jobId ||
  interview?.job ||
  null;

const getInterviewDate = (interview) =>
  getDate(
    interview?.scheduledAt,
    interview?.interviewDate,
    interview?.dateTime,
    interview?.startTime,
    interview?.startAt,
    interview?.date
  );

const getJobLocation = (job) => {
  if (typeof job?.location === "string") return job.location;

  if (job?.location && typeof job.location === "object") {
    return [
      job.location.city,
      job.location.state,
      job.location.country,
      job.location.type,
    ]
      .filter(Boolean)
      .join(" · ");
  }

  return [job?.city, job?.workplace, job?.workMode]
    .filter(Boolean)
    .join(" · ") || "—";
};

const getJobDepartment = (job) =>
  job?.department ||
  job?.category ||
  job?.industry ||
  job?.jobCategory ||
  "—";

const getCompanyLogo = (company) =>
  company?.logo?.url ||
  company?.logo?.secure_url ||
  company?.logoUrl ||
  company?.companyLogo?.url ||
  "";

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  return "Good evening";
};

const getTotalFromPagination = (pagination, fallback) =>
  Number.isFinite(Number(pagination?.total))
    ? Number(pagination.total)
    : fallback;

const getStageLabel = (status) => getApplicationStatus(status).label;

const isApplicationDeleted = (application) =>
  Boolean(application?.isDeleted || application?.deletedAt);

const isInterviewUpcoming = (interview) => {
  const date = getInterviewDate(interview);
  const status = String(interview?.status || "").toLowerCase();

  return (
    date &&
    date.getTime() >= Date.now() &&
    !["cancelled", "canceled", "rejected", "completed", "closed"].includes(status)
  );
};

const isInterviewToday = (interview) => {
  const date = getInterviewDate(interview);
  if (!date) return false;

  const now = new Date();

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
};

const getChartData = (applications, interviews, period) => {
  const now = new Date();

  if (period === "30 days") {
    return Array.from({ length: 4 }, (_, index) => {
      const start = new Date(now);
      start.setDate(now.getDate() - (3 - index) * 7 - 6);
      start.setHours(0, 0, 0, 0);

      const end = new Date(start);
      end.setDate(start.getDate() + 7);

      return {
        day: `W${index + 1}`,
        applications: applications.filter((item) => {
          const date = getDate(item.createdAt, item.appliedAt);
          return date && date >= start && date < end;
        }).length,
        interviews: interviews.filter((item) => {
          const date = getInterviewDate(item);
          return date && date >= start && date < end;
        }).length,
      };
    });
  }

  if (period === "90 days") {
    return Array.from({ length: 3 }, (_, index) => {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - 2 + index, 1);
      const nextMonth = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth() + 1,
        1
      );

      return {
        day: monthDate.toLocaleDateString("en-IN", { month: "short" }),
        applications: applications.filter((item) => {
          const date = getDate(item.createdAt, item.appliedAt);
          return date && date >= monthDate && date < nextMonth;
        }).length,
        interviews: interviews.filter((item) => {
          const date = getInterviewDate(item);
          return date && date >= monthDate && date < nextMonth;
        }).length,
      };
    });
  }

  return Array.from({ length: 7 }, (_, index) => {
    const dayDate = new Date(now);
    dayDate.setDate(now.getDate() - (6 - index));
    dayDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(dayDate);
    nextDay.setDate(dayDate.getDate() + 1);

    return {
      day: dayDate.toLocaleDateString("en-IN", { weekday: "short" }),
      applications: applications.filter((item) => {
        const date = getDate(item.createdAt, item.appliedAt);
        return date && date >= dayDate && date < nextDay;
      }).length,
      interviews: interviews.filter((item) => {
        const date = getInterviewDate(item);
        return date && date >= dayDate && date < nextDay;
      }).length,
    };
  });
};

function Avatar({ initials, color = "violet", size = "md", src }) {
  const sizes = {
    sm: "h-8 w-8 text-[11px]",
    md: "h-10 w-10 text-xs",
    lg: "h-12 w-12 text-sm",
  };

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-xl font-bold ${sizes[size]} ${avatarStyles[color] || avatarStyles.violet}`}
    >
      {src ? (
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        initials || "—"
      )}
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
  const key = String(status || "").toLowerCase();
  const predefined = {
    active: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
    paused: "bg-slate-100 text-slate-600 ring-slate-500/10",
    new: "bg-blue-50 text-blue-700 ring-blue-600/10",
    reviewing: "bg-amber-50 text-amber-700 ring-amber-600/10",
    shortlisted: "bg-violet-50 text-violet-700 ring-violet-600/10",
    interview: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
    selected: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
    rejected: "bg-rose-50 text-rose-700 ring-rose-600/10",
    withdrawn: "bg-slate-100 text-slate-600 ring-slate-500/10",
    closed: "bg-slate-100 text-slate-600 ring-slate-500/10",
  };

  const style =
    predefined[key] ||
    getApplicationStatus(key).color ||
    "bg-slate-100 text-slate-600 ring-slate-500/10";

  return (
    <span
      className={`inline-flex whitespace-nowrap items-center rounded-md px-2 py-1 text-[10px] font-bold ring-1 ring-inset ${style}`}
    >
      {status || "—"}
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
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${color}`}
        >
          <Icon size={17} strokeWidth={1.8} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-[27px] font-bold leading-none tracking-[-1px] text-slate-950 sm:text-[30px]">
          {value ?? "—"}
        </span>

        {change && (
          <span
            className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${
              negative ? "text-rose-600" : "text-emerald-600"
            }`}
          >
            {negative ? (
              <ArrowDownRight size={13} />
            ) : (
              <ArrowUpRight size={13} />
            )}
            {change}
          </span>
        )}
      </div>

      <p className="mt-3 text-[11px] leading-5 text-slate-500">{detail}</p>
    </div>
  );
}

function ChartPanel({ applications, interviews }) {
  const [period, setPeriod] = useState("7 days");

  const data = useMemo(
    () => getChartData(applications, interviews, period),
    [applications, interviews, period]
  );

  const max = Math.max(1, ...data.map((item) => item.applications)) * 1.15;

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
            onChange={(event) => setPeriod(event.target.value)}
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
              {[0, 1, 2, 3, 4].map((number) => (
                <div
                  key={number}
                  className="border-t border-dashed border-slate-100"
                />
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
                      style={{
                        height: `${(item.applications / max) * 100}%`,
                      }}
                    />
                    <div
                      title={`${item.interviews} interviews`}
                      className="w-[30%] max-w-7 rounded-t-[4px] bg-violet-200 transition-all duration-300 group-hover:bg-violet-300 sm:w-7"
                      style={{
                        height: `${(item.interviews / max) * 100}%`,
                      }}
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
          Live records
        </span>
      </div>
    </section>
  );
}

function PipelinePanel({ applications }) {
  const stages = useMemo(() => {
    const definitions = [
      { name: "Applied", statuses: ["applied"], color: "bg-violet-600" },
      { name: "Screening", statuses: ["screening"], color: "bg-indigo-500" },
      { name: "Shortlisted", statuses: ["shortlisted"], color: "bg-blue-500" },
      {
        name: "Interview",
        statuses: ["interview_scheduled", "interview_completed"],
        color: "bg-cyan-500",
      },
      { name: "Offer", statuses: ["selected"], color: "bg-emerald-500" },
    ];

    return definitions.map((definition) => ({
      ...definition,
      count: applications.filter((application) =>
        definition.statuses.includes(
          String(application?.status || "applied").toLowerCase()
        )
      ).length,
    }));
  }, [applications]);

  const maxCount = Math.max(1, ...stages.map((stage) => stage.count));

  return (
    <section className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.025)] sm:p-6">
      <SectionTitle
        title="Hiring funnel"
        description="Candidate progression across all open roles."
        action={
          <button
            type="button"
            className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
            aria-label="Hiring funnel options"
          >
            <Ellipsis size={17} />
          </button>
        }
      />

      <div className="mt-6 space-y-[18px]">
        {stages.map((stage) => (
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
                  {applications.length
                    ? `${Math.round((stage.count / applications.length) * 100)}%`
                    : "—"}
                </span>
              </div>
            </div>

            <div className="h-[7px] overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${stage.color} transition-all duration-500`}
                style={{
                  width: `${(stage.count / maxCount) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-violet-100 bg-violet-50/70 p-3.5">
        <div className="flex items-start gap-2.5">
          <Sparkles size={16} className="mt-0.5 shrink-0 text-violet-700" />
          <div>
            <p className="text-xs font-bold text-violet-900">Funnel insight</p>
            <p className="mt-1 text-[11px] leading-5 text-violet-800">
              {applications.length
                ? `${stages.find((stage) => stage.name === "Applied")?.count || 0} applications are currently in the applied stage.`
                : "Your hiring funnel will appear here when applications are available."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ApplicationsPanel({
  candidates,
  onViewAll,
  loading,
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All stages");
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const filtered = useMemo(() => {
    return candidates.filter((candidate) => {
      const matchesQuery = `${candidate.name} ${candidate.role} ${candidate.id}`
        .toLowerCase()
        .includes(query.toLowerCase());

      const matchesStage =
        filter === "All stages" || candidate.stage === filter;

      return matchesQuery && matchesStage;
    });
  }, [candidates, query, filter]);

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
              onChange={(event) => setQuery(event.target.value)}
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
              onChange={(event) => setFilter(event.target.value)}
              className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-9 pr-8 text-xs font-medium text-slate-700 outline-none focus:border-violet-500 sm:w-40"
            >
              <option>All stages</option>
              <option>New</option>
              <option>Reviewing</option>
              <option>Shortlisted</option>
              <option>Interview</option>
              <option>Selected</option>
              <option>Rejected</option>
              <option>Withdrawn</option>
              <option>Closed</option>
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
                      src={candidate.avatar}
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
                        style={{
                          width: candidate.score
                            ? `${candidate.score}%`
                            : "0%",
                        }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-700">
                      {candidate.score ? `${candidate.score}%` : "—"}
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

            {!loading && filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-12 text-center text-sm text-slate-500"
                >
                  No applications available.
                </td>
              </tr>
            )}

            {loading && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-12 text-center text-sm text-slate-500"
                >
                  Loading applications...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-5 py-3.5">
        <p className="text-[11px] text-slate-500">
          Showing {filtered.length} candidate
          {filtered.length === 1 ? "" : "s"}
        </p>
        <span className="text-[10px] text-slate-400">
          Live application data
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
                  src={selectedCandidate.avatar}
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
                <p className="text-xs text-slate-500">
                  Application match score
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {selectedCandidate.score
                    ? `${selectedCandidate.score}%`
                    : "—"}
                </p>
                <div className="mt-3 h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-violet-600"
                    style={{
                      width: selectedCandidate.score
                        ? `${selectedCandidate.score}%`
                        : "0%",
                    }}
                  />
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-[11px] font-medium text-slate-500">
                    Application ID
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {selectedCandidate.id}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-medium text-slate-500">
                    Email
                  </p>
                  <p className="mt-1 break-all text-sm font-medium text-slate-800">
                    {selectedCandidate.email || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-medium text-slate-500">
                    Current stage
                  </p>
                  <div className="mt-2">
                    <StatusBadge status={selectedCandidate.stage} />
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-medium text-slate-500">
                    Applied
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {selectedCandidate.applied}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}

function InterviewsPanel({ interviews, loading, onViewAll }) {
  const [selected, setSelected] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? interviews : interviews.slice(0, 3);

  return (
    <section className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.025)] sm:p-6">
      <SectionTitle
        title="Upcoming interviews"
        description="Your scheduled candidate conversations."
        action={
          <button
            onClick={() => {
              if (interviews.length > 3) {
                setShowAll((value) => !value);
              } else {
                onViewAll();
              }
            }}
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
              <Avatar
                initials={interview.initials}
                color={interview.color}
                src={interview.avatar}
              />

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

        {!loading && interviews.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-200 px-4 py-10 text-center text-xs text-slate-500">
            No upcoming interviews.
          </div>
        )}

        {loading && (
          <div className="rounded-xl border border-dashed border-slate-200 px-4 py-10 text-center text-xs text-slate-500">
            Loading interviews...
          </div>
        )}
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
              <Avatar
                initials={selected.initials}
                color={selected.color}
                size="lg"
                src={selected.avatar}
              />
              <div>
                <p className="font-bold text-slate-900">
                  {selected.candidate}
                </p>
                <p className="mt-1 text-xs text-slate-500">{selected.role}</p>
              </div>
            </div>

            <div className="mt-5 space-y-3 rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-700">
                <span className="font-semibold">Date:</span>{" "}
                {selected.date || "—"}
              </p>
              <p className="text-sm text-slate-700">
                <span className="font-semibold">Time:</span> {selected.time}
              </p>
              <p className="text-sm text-slate-700">
                <span className="font-semibold">Duration:</span>{" "}
                {selected.duration}
              </p>
              <p className="text-sm text-slate-700">
                <span className="font-semibold">Interview:</span>{" "}
                {selected.type}
              </p>
              <p className="text-sm text-slate-700">
                <span className="font-semibold">Interviewer:</span>{" "}
                {selected.interviewer || "—"}
              </p>
              <p className="text-sm text-slate-700">
                <span className="font-semibold">Status:</span>{" "}
                {selected.status || "—"}
              </p>
              {selected.roomId && (
                <p className="break-all text-sm text-slate-700">
                  <span className="font-semibold">Room ID:</span>{" "}
                  {selected.roomId}
                </p>
              )}
              {selected.meetingLink && (
                <a
                  href={selected.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-violet-700 hover:text-violet-900"
                >
                  Open meeting link
                  <ArrowRight size={14} />
                </a>
              )}
            </div>

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

function JobsPanel({ jobs, applications, interviews, loading, onViewAll }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All jobs");

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      const matchesQuery = `${job.title} ${job.id} ${job.department}`
        .toLowerCase()
        .includes(query.toLowerCase());

      const matchesStatus =
        filter === "All jobs" || job.status === filter;

      return matchesQuery && matchesStatus;
    });
  }, [jobs, query, filter]);

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
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search job openings..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs outline-none placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
            />
          </div>

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
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
              {[
                "Job opening",
                "Applicants",
                "Shortlisted",
                "Interviews",
                "Status",
              ].map((heading) => (
                <th
                  key={heading}
                  className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500"
                >
                  {heading}
                </th>
              ))}
              <th className="px-4 py-3" />
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filtered.map((job) => {
              const relatedApplications = applications.filter(
                (application) =>
                  getObjectId(getApplicationJob(application)) === job.id
              );

              const relatedInterviews = interviews.filter(
                (interview) =>
                  getObjectId(getInterviewJob(interview)) === job.id
              );

              const shortlisted = relatedApplications.filter((application) =>
                ["shortlisted", "interview_scheduled", "interview_completed", "selected"].includes(
                  String(application.status || "").toLowerCase()
                )
              ).length;

              return (
                <tr
                  key={job.id}
                  className="transition hover:bg-slate-50/70"
                >
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
                          {job.id.slice(-6)} · {job.department}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-xs font-bold tabular-nums text-slate-800">
                    {job.applicants ?? relatedApplications.length}
                  </td>

                  <td className="px-5 py-4 text-xs font-medium tabular-nums text-slate-700">
                    {shortlisted}
                  </td>

                  <td className="px-5 py-4 text-xs font-medium tabular-nums text-slate-700">
                    {relatedInterviews.length}
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={job.status} />
                  </td>

                  <td className="px-4 py-4">
                    <button
                      onClick={onViewAll}
                      title="Manage job"
                      className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                    >
                      <Ellipsis size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}

            {!loading && filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-10 text-center text-sm text-slate-500"
                >
                  No job openings available.
                </td>
              </tr>
            )}

            {loading && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-10 text-center text-sm text-slate-500"
                >
                  Loading job openings...
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
        <p className="text-[10px] text-slate-400">Live job data</p>
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

            <ChevronRight
              size={14}
              className="shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-violet-700"
            />
          </button>
        ))}
      </div>
    </section>
  );
}

function RecruiterWelcome({
  recruiter,
  company,
  todayInterviews,
  pendingApplications,
  onReviewApplications,
}) {
  const recruiterName =
    recruiter?.name ||
    recruiter?.fullName ||
    recruiter?.user?.name ||
    "Recruiter";

  const companyName = company?.name || company?.companyName || "";
  const logo = getCompanyLogo(company);

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

          <div className="flex items-center gap-3">
            {logo && (
              <img
                src={logo}
                alt=""
                className="h-10 w-10 rounded-lg border border-white/20 bg-white object-contain p-1"
              />
            )}
            <div>
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                {getGreeting()}, {recruiterName}
              </h2>
              {companyName && (
                <p className="mt-1 text-xs text-violet-100/80">
                  {companyName}
                </p>
              )}
            </div>
          </div>

          <p className="mt-2 max-w-lg text-xs leading-6 text-violet-100/80 sm:text-sm">
            Your recruitment workspace at a glance. Review applications and
            keep your hiring process moving.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={onReviewApplications}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-bold text-violet-900 transition hover:bg-violet-50"
            >
              Review applications
              <ArrowRight size={14} />
            </button>

            <span className="inline-flex items-center gap-1.5 text-[11px] text-violet-100/80">
              <CalendarDays size={14} />
              {formatDate(new Date())}
            </span>
          </div>
        </div>

        <div className="grid min-w-[190px] grid-cols-2 gap-2 sm:w-52 sm:shrink-0">
          <div className="rounded-lg border border-white/10 bg-white/[0.07] p-3.5">
            <p className="text-[10px] font-medium text-violet-100/70">
              Interviews today
            </p>
            <p className="mt-2 text-2xl font-bold">
              {String(todayInterviews).padStart(2, "0")}
            </p>
            <p className="mt-1 text-[10px] text-violet-100/70">
              Scheduled
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.07] p-3.5">
            <p className="text-[10px] font-medium text-violet-100/70">
              To review
            </p>
            <p className="mt-2 text-2xl font-bold">
              {pendingApplications}
            </p>
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
  const {
    recruiter,
    user,
    authLoading,
  } = useAuth();

  const {
    recruiterJobs,
    recruiterJobPagination,
    handleGetRecruiterJobs,
  } = useJob();

  const {
    applications,
    myApplicationPagination,
    handleGetRecruiterApplications,
  } = useApplication();

  const {
    recruiterInterviews,
    handleGetRecruiterInterviews,
  } = useInterview();

  const {
    company,
    handleGetMyCompany,
  } = useCompany();

  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

const { setRecruiterActivePage } = useHome();

const navigateTo = (key) => {
  const pages = {
    dashboard: "recruiter/dashboard",
    jobs: "recruiter/jobs",
    applications: "recruiter/application",
    interviews: "recruiter/interviews",
    company: "recruiter/company",
    settings: "recruiter/settings",
    profile: "recruiter/profile",
  };

  const page = pages[key];

  if (page) {
    setRecruiterActivePage(page);
  }
};

  const notify = useCallback((message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  }, []);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setLoadError("");

    const results = await Promise.allSettled([
      handleGetRecruiterJobs({ query: "?page=1&limit=100" }),
      handleGetRecruiterApplications({
        page: 1,
        limit: 100,
      }),
      handleGetRecruiterInterviews({
        page: 1,
        limit: 100,
      }),
      handleGetMyCompany(),
    ]);

    const failed = results.some((result) => result.status === "rejected");

    if (failed) {
      setLoadError("Some dashboard data could not be loaded.");
    }

    setLoading(false);
  }, [
    handleGetRecruiterJobs,
    handleGetRecruiterApplications,
    handleGetRecruiterInterviews,
    handleGetMyCompany,
  ]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const jobs = useMemo(() => {
    const source = Array.isArray(recruiterJobs) ? recruiterJobs : [];

    return source.map((job) => {
      const id = getObjectId(job);
      const jobApplications = (Array.isArray(applications) ? applications : [])
        .filter(
          (application) =>
            getObjectId(getApplicationJob(application)) === id &&
            !isApplicationDeleted(application)
        );

      return {
        id,
        title: getJobTitle(job),
        department: getJobDepartment(job),
        type:
          job?.employmentType ||
          job?.jobType ||
          job?.type ||
          "—",
        location: getJobLocation(job),
        applicants:
          Number.isFinite(Number(job?.applicantCount))
            ? Number(job.applicantCount)
            : jobApplications.length,
        status: getJobStatus(job),
        posted: formatRelativeTime(
          getDate(job?.createdAt, job?.postedAt, job?.publishedAt)
        ),
        raw: job,
      };
    });
  }, [recruiterJobs, applications]);

  const candidates = useMemo(() => {
    const source = Array.isArray(applications) ? applications : [];

    return source
      .filter((application) => !isApplicationDeleted(application))
      .map((application) => {
        const candidate = getApplicationCandidate(application);
        const job = getApplicationJob(application);
        const name = getName(candidate, "Candidate");
        const createdAt = getDate(
          application?.createdAt,
          application?.appliedAt,
          application?.updatedAt
        );

        const rawScore =
          application?.matchScore ??
          application?.score ??
          application?.compatibilityScore;

        const score =
          rawScore !== undefined &&
          rawScore !== null &&
          Number.isFinite(Number(rawScore))
            ? Math.max(0, Math.min(100, Number(rawScore)))
            : null;

        return {
          id: getObjectId(application),
          name,
          initials: getInitials(name),
          role: getJobTitle(job),
          email: getEmail(candidate),
          avatar:
            candidate?.avatar?.url ||
            candidate?.avatarUrl ||
            candidate?.profileImage ||
            "",
          applied: formatRelativeTime(createdAt),
          stage: getStageLabel(application?.status),
          rawStatus: application?.status || "applied",
          score,
          color: getColor(name),
          raw: application,
        };
      })
      .sort((a, b) => {
        const dateA = getDate(a.raw?.createdAt, a.raw?.appliedAt);
        const dateB = getDate(b.raw?.createdAt, b.raw?.appliedAt);

        return (dateB?.getTime() || 0) - (dateA?.getTime() || 0);
      });
  }, [applications]);

  const interviews = useMemo(() => {
    const source = Array.isArray(recruiterInterviews)
      ? recruiterInterviews
      : [];

    return source
      .filter(isInterviewUpcoming)
      .map((interview) => {
        const candidate = getInterviewCandidate(interview);
        const job = getInterviewJob(interview);
        const scheduledAt = getInterviewDate(interview);
        const name = getName(candidate, "Candidate");

        const interviewer =
          interview?.interviewerId ||
          interview?.interviewer ||
          interview?.recruiterId ||
          interview?.createdBy;

        return {
          id: getObjectId(interview),
          candidate: name,
          initials: getInitials(name),
          avatar:
            candidate?.avatar?.url ||
            candidate?.avatarUrl ||
            candidate?.profileImage ||
            "",
          role: getJobTitle(job),
          time: formatTime(scheduledAt),
          date: formatDate(scheduledAt),
          duration: formatDuration(
            interview?.durationMinutes ??
              interview?.duration ??
              interview?.durationInMinutes
          ),
          type:
            interview?.type ||
            interview?.mode ||
            interview?.interviewType ||
            "Interview",
          interviewer: getName(interviewer, "—"),
          status: interview?.status || "—",
          roomId: interview?.roomId || "",
          meetingLink:
            interview?.meetingLink ||
            interview?.meetingUrl ||
            interview?.joinUrl ||
            "",
          scheduledAt,
          color: getColor(name),
          raw: interview,
        };
      })
      .sort(
        (a, b) =>
          (a.scheduledAt?.getTime() || 0) -
          (b.scheduledAt?.getTime() || 0)
      );
  }, [recruiterInterviews]);

  const activeJobs = useMemo(
    () => jobs.filter((job) => job.status === "Active").length,
    [jobs]
  );

  const pendingApplications = useMemo(
    () =>
      candidates.filter((candidate) =>
        ["applied", "screening"].includes(
          String(candidate.rawStatus).toLowerCase()
        )
      ).length,
    [candidates]
  );

  const todayInterviews = useMemo(
    () =>
      (Array.isArray(recruiterInterviews) ? recruiterInterviews : []).filter(
        isInterviewToday
      ).length,
    [recruiterInterviews]
  );

  const totalApplications = getTotalFromPagination(
    myApplicationPagination,
    candidates.length
  );

  const allJobsCount = getTotalFromPagination(
    recruiterJobPagination,
    jobs.length
  );

  const visibleApplications = candidates.slice(0, 5);

  const downloadReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      company: company?.name || company?.companyName || "",
      summary: {
        totalApplications,
        activeJobs,
        allJobsCount,
        upcomingInterviews: interviews.length,
        interviewsToday: todayInterviews,
      },
      jobs: jobs.map(({ raw, ...job }) => job),
      applications: visibleApplications.map(({ raw, ...application }) => application),
      interviews: interviews.map(({ raw, ...interview }) => interview),
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `peer-hiring-report-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;

    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    notify("Report exported successfully.");
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-slate-900">
      <main className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
        {notice && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-800">
            <CheckCircle2 size={15} />
            {notice}
            <button
              onClick={() => setNotice("")}
              className="ml-auto"
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {loadError && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-800">
            <span>{loadError}</span>
            <button
              onClick={fetchDashboardData}
              className="ml-auto font-bold underline"
            >
              Retry
            </button>
          </div>
        )}

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
              onClick={downloadReport}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <Download size={15} />
              <span className="hidden sm:inline">Export report</span>
              <span className="sm:hidden">Export</span>
            </button>

            <button
            type="button"
              onClick={() => navigateTo("jobs")}
              className="inline-flex items-center gap-2 rounded-lg bg-violet-700 px-3.5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-violet-800"
            >
              <Plus size={15} />
              Post a job
            </button>
          </div>
        </div>

        <RecruiterWelcome
          recruiter={recruiter || user}
          company={company}
          todayInterviews={todayInterviews}
          pendingApplications={pendingApplications}
          onReviewApplications={() => navigateTo("applications")}
        />

        <section className="mt-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-sm font-bold tracking-tight text-slate-900">
              Hiring overview
            </h2>
            <span className="text-[10px] font-medium text-slate-400">
              Live records
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Total applications"
              value={loading && authLoading ? "—" : totalApplications}
              detail="Applications received"
              icon={Users}
              color="bg-violet-50 text-violet-700"
            />

            <MetricCard
              label="Active job openings"
              value={activeJobs}
              detail={`${allJobsCount} total job opening${allJobsCount === 1 ? "" : "s"}`}
              icon={BriefcaseBusiness}
              color="bg-blue-50 text-blue-700"
            />

            <MetricCard
              label="Interviews scheduled"
              value={interviews.length}
              detail="Upcoming scheduled interviews"
              icon={CalendarDays}
              color="bg-emerald-50 text-emerald-700"
            />

            <MetricCard
              label="Time to hire"
              value="—"
              detail="No hiring-duration data available"
              icon={Zap}
              color="bg-amber-50 text-amber-700"
            />
          </div>
        </section>

        <section className="mt-5 grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)]">
          <ChartPanel
            applications={candidates.map((candidate) => candidate.raw)}
            interviews={Array.isArray(recruiterInterviews) ? recruiterInterviews : []}
          />

          <PipelinePanel applications={candidates.map((candidate) => candidate.raw)} />
        </section>

        <section className="mt-5">
          <ApplicationsPanel
            candidates={visibleApplications}
            loading={loading}
            onViewAll={() => navigateTo("applications")}
          />
        </section>

        <section className="mt-5 grid grid-cols-1 items-start gap-5 2xl:grid-cols-[minmax(0,1.5fr)_minmax(360px,0.9fr)]">
          <JobsPanel
            jobs={jobs}
            applications={Array.isArray(applications) ? applications : []}
            interviews={Array.isArray(recruiterInterviews) ? recruiterInterviews : []}
            loading={loading}
            onViewAll={() => navigateTo("jobs")}
          />

          <InterviewsPanel
            interviews={interviews}
            loading={loading}
            onViewAll={() => navigateTo("interviews")}
          />
        </section>

        <section className="mt-5">
          <QuickActions
            onAction={(key) => {
              navigateTo(key);
            }}
          />
        </section>

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
          <div>
            <p className="text-xs font-bold text-slate-700">Peer.Hiring</p>
            <p className="mt-1 text-[10px] text-slate-400">
              A smarter way to build your team.
            </p>
          </div>

          <div className="flex items-center gap-4 text-[10px] text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  loading ? "bg-amber-500" : "bg-emerald-500"
                }`}
              />
              {loading ? "Loading workspace" : "Workspace ready"}
            </span>
            <span>Recruiter dashboard</span>
          </div>
        </footer>
      </main>
    </div>
  );
}