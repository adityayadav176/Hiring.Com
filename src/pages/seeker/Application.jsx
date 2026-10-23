
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  ChevronDown,
  BriefcaseBusiness,
  Clock3,
  CheckCircle2,
  CalendarDays,
  XCircle,
  ArrowUpRight,
  SlidersHorizontal,
  RotateCcw,
  FileText,
  TrendingUp,
  LoaderCircle,
  AlertCircle,
  SearchX,
  X,
  Sparkles,
} from "lucide-react";

import ApplicationCard from "./ApplicationCard";
import { useApplication } from "../../hooks/Hook";

const TABS = [
  "All",
  "Active",
  "Interviews",
  "Offers",
  "Closed",
];

const ACTIVE_STATUSES = [
  "applied",
  "screening",
  "shortlisted",
  "interview_scheduled",
  "interview_completed",
];

const INTERVIEW_STATUSES = [
  "interview_scheduled",
  "interview_completed",
];

const OFFER_STATUSES = ["selected", "offer", "offered"];

const CLOSED_STATUSES = [
  "rejected",
  "withdrawn",
  "closed",
];

const SORT_OPTIONS = [
  { value: "newest", label: "Recently applied" },
  { value: "oldest", label: "Oldest first" },
  { value: "company", label: "Company name" },
  { value: "job", label: "Job title" },
];

const normalize = (value) =>
  String(value ?? "").trim().toLowerCase();

const getStatus = (application) =>
  normalize(application?.status);

const getCompanyName = (application) => {
  const company =
    application?.companyId ||
    application?.jobId?.companyId ||
    application?.company;

  if (typeof company === "string") {
    return application?.companyName || "Company";
  }

  return (
    company?.name ||
    company?.companyName ||
    application?.companyName ||
    "Company"
  );
};

const getJobTitle = (application) => {
  const job = application?.jobId || application?.job;

  if (typeof job === "string") {
    return application?.jobTitle || "Position";
  }

  return (
    job?.title ||
    job?.jobTitle ||
    job?.position ||
    application?.jobTitle ||
    "Position"
  );
};

const getLocation = (application) => {
  const job = application?.jobId || application?.job;
  const location = job?.location;

  if (typeof location === "string") return location;

  if (location && typeof location === "object") {
    return [
      location.city,
      location.state,
      location.country,
    ]
      .filter(Boolean)
      .join(", ");
  }

  return job?.city || job?.workLocation || "";
};

const getApplicationDate = (application) => {
  const date =
    application?.createdAt ||
    application?.appliedAt ||
    application?.updatedAt;

  if (!date) return null;

  const parsed = new Date(date);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatDate = (date) => {
  if (!date) return "Date unavailable";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const isActive = (application) =>
  ACTIVE_STATUSES.includes(getStatus(application));

const isInterview = (application) =>
  INTERVIEW_STATUSES.includes(getStatus(application));

const isOffer = (application) =>
  OFFER_STATUSES.includes(getStatus(application));

const isClosed = (application) =>
  CLOSED_STATUSES.includes(getStatus(application));

function getStatusStyle(status) {
  const styles = {
    applied: "border-blue-100 bg-blue-50 text-blue-700",
    screening: "border-sky-100 bg-sky-50 text-sky-700",
    shortlisted: "border-violet-100 bg-violet-50 text-violet-700",
    interview_scheduled:
      "border-purple-100 bg-purple-50 text-purple-700",
    interview_completed:
      "border-indigo-100 bg-indigo-50 text-indigo-700",
    selected:
      "border-emerald-100 bg-emerald-50 text-emerald-700",
    offer:
      "border-emerald-100 bg-emerald-50 text-emerald-700",
    offered:
      "border-emerald-100 bg-emerald-50 text-emerald-700",
    rejected: "border-rose-100 bg-rose-50 text-rose-700",
    withdrawn: "border-slate-200 bg-slate-100 text-slate-600",
    closed: "border-slate-200 bg-slate-100 text-slate-600",
  };

  return (
    styles[normalize(status)] ||
    "border-amber-100 bg-amber-50 text-amber-700"
  );
}

function getStatusLabel(status) {
  const labels = {
    applied: "Applied",
    screening: "In review",
    shortlisted: "Shortlisted",
    interview_scheduled: "Interview scheduled",
    interview_completed: "Interview completed",
    selected: "Selected",
    offer: "Offer received",
    offered: "Offer received",
    rejected: "Rejected",
    withdrawn: "Withdrawn",
    closed: "Closed",
  };

  const key = normalize(status);

  return (
    labels[key] ||
    (status
      ? String(status)
          .replaceAll("_", " ")
          .replace(/\b\w/g, (char) => char.toUpperCase())
      : "Pending")
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  description,
  tone,
}) {
  return (
    <article className="group min-w-0 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">
            {label}
          </p>

          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            {value}
          </p>
        </div>

        <div className={`rounded-xl p-3 ${tone}`}>
          <Icon size={20} />
        </div>
      </div>

      <p className="mt-3 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </article>
  );
}

function Applications() {
  const {
    applications = [],
    handleGetMyApplications,
  } = useApplication();

  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let mounted = true;

    const loadApplications = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await handleGetMyApplications();

        if (!mounted) return;

        if (response?.success === false) {
          throw new Error(
            response.message || "Unable to load applications."
          );
        }
      } catch (err) {
        if (!mounted) return;

        console.error("Failed to load applications:", err);
        setError(
          err?.message || "Something went wrong. Please try again."
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadApplications();

    return () => {
      mounted = false;
    };
  }, [handleGetMyApplications, refreshKey]);

  const safeApplications = useMemo(
    () => (Array.isArray(applications) ? applications : []),
    [applications]
  );

  const counts = useMemo(() => {
    return {
      All: safeApplications.length,
      Active: safeApplications.filter(isActive).length,
      Interviews: safeApplications.filter(isInterview).length,
      Offers: safeApplications.filter(isOffer).length,
      Closed: safeApplications.filter(isClosed).length,
    };
  }, [safeApplications]);

  const filteredApplications = useMemo(() => {
    const query = normalize(search);

    const filtered = safeApplications.filter((application) => {
      const company = getCompanyName(application);
      const jobTitle = getJobTitle(application);
      const location = getLocation(application);
      const status = getStatusLabel(application?.status);

      const searchableText = [
        company,
        jobTitle,
        location,
        status,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(query);

      let matchesTab = true;

      if (activeTab === "Active") {
        matchesTab = isActive(application);
      } else if (activeTab === "Interviews") {
        matchesTab = isInterview(application);
      } else if (activeTab === "Offers") {
        matchesTab = isOffer(application);
      } else if (activeTab === "Closed") {
        matchesTab = isClosed(application);
      }

      return matchesSearch && matchesTab;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "company") {
        return getCompanyName(a).localeCompare(getCompanyName(b));
      }

      if (sortBy === "job") {
        return getJobTitle(a).localeCompare(getJobTitle(b));
      }

      const dateA = getApplicationDate(a)?.getTime() || 0;
      const dateB = getApplicationDate(b)?.getTime() || 0;

      return sortBy === "oldest"
        ? dateA - dateB
        : dateB - dateA;
    });
  }, [safeApplications, search, activeTab, sortBy]);

  const interviewCount = counts.Interviews;
  const offerCount = counts.Offers;
  const activeCount = counts.Active;
  const closedCount = counts.Closed;

  const handleRefresh = useCallback(() => {
    setRefreshKey((key) => key + 1);
  }, []);

  const clearSearch = useCallback(() => {
    setSearch("");
    setActiveTab("All");
  }, []);

  return (
    <div className="min-h-full w-full bg-[#F7F8FC] px-4 py-5 text-slate-900 sm:px-6 sm:py-7 lg:px-8">
      <div className="mx-auto w-full max-w-[1440px] space-y-7">

        {/* Header */}
        <header className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-violet-700">
              <span className="h-2 w-2 rounded-full bg-violet-600" />
              Peer.Hiring / Career workspace
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              My applications
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Keep track of every opportunity, monitor your progress,
              and stay ready for your next career move.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm">
              <BriefcaseBusiness
                size={17}
                className="text-violet-600"
              />
              {counts.All} applications
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 text-sm font-semibold text-white shadow-sm shadow-violet-200 transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RotateCcw
                size={15}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </header>

        {/* Intro banner */}
        <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-[#211044] via-[#48218E] to-[#6D28D9] p-6 text-white shadow-lg shadow-violet-200/40 sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-20 -z-10 h-64 w-64 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-24 right-1/3 -z-10 h-52 w-52 rounded-full bg-fuchsia-400/20 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-violet-100">
                <Sparkles size={14} />
                Your career, in progress
              </div>

              <h2 className="mt-4 text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
                Every application is
                <br className="hidden sm:block" />
                a step toward your next opportunity.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-violet-100/85">
                Stay organized, follow your application journey, and
                keep moving toward the role you want.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:min-w-[390px]">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-3 sm:p-4">
                <FileText size={19} className="text-violet-200" />
                <p className="mt-4 text-2xl font-bold">
                  {counts.All}
                </p>
                <p className="mt-1 text-[11px] leading-4 text-violet-100 sm:text-xs">
                  Submitted
                </p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 p-3 sm:p-4">
                <CalendarDays size={19} className="text-violet-200" />
                <p className="mt-4 text-2xl font-bold">
                  {interviewCount}
                </p>
                <p className="mt-1 text-[11px] leading-4 text-violet-100 sm:text-xs">
                  Interviews
                </p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 p-3 sm:p-4">
                <CheckCircle2 size={19} className="text-emerald-200" />
                <p className="mt-4 text-2xl font-bold">
                  {offerCount}
                </p>
                <p className="mt-1 text-[11px] leading-4 text-violet-100 sm:text-xs">
                  Offers
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Metrics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={BriefcaseBusiness}
            label="Total applications"
            value={counts.All}
            description="All opportunities you've applied to"
            tone="bg-violet-50 text-violet-700"
          />

          <MetricCard
            icon={Clock3}
            label="In progress"
            value={activeCount}
            description="Applications still moving through the process"
            tone="bg-blue-50 text-blue-700"
          />

          <MetricCard
            icon={CalendarDays}
            label="Interviews"
            value={interviewCount}
            description="Applications in the interview stages"
            tone="bg-indigo-50 text-indigo-700"
          />

          <MetricCard
            icon={CheckCircle2}
            label="Offers"
            value={offerCount}
            description="Applications marked as selected or offered"
            tone="bg-emerald-50 text-emerald-700"
          />
        </section>

        {/* Application workspace */}
        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          {/* Section heading */}
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-950">
                Application tracker
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Search and review your application history.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500">
              <TrendingUp size={15} className="text-violet-600" />
              Stay on top of your progress
            </div>
          </div>

          {/* Search and sorting */}
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by job, company, location..."
                aria-label="Search applications"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-50"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <label className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-500 focus-within:border-violet-300">
              <SlidersHorizontal size={16} />

              <span className="shrink-0 text-xs font-medium">
                Sort by
              </span>

              <ChevronDown
                size={14}
                className="order-last text-slate-400"
              />

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                aria-label="Sort applications"
                className="min-w-0 flex-1 cursor-pointer appearance-none bg-transparent text-xs font-semibold text-slate-700 outline-none sm:min-w-[150px]"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Status tabs */}
          <div className="overflow-x-auto border-b border-slate-100 px-4 sm:px-6">
            <div className="flex min-w-max items-center gap-6 sm:gap-8">
              {TABS.map((tab) => {
                const selected = activeTab === tab;

                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    aria-pressed={selected}
                    className={`relative inline-flex min-h-14 items-center gap-2 whitespace-nowrap text-sm font-semibold transition ${
                      selected
                        ? "text-violet-700"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {tab}

                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                        selected
                          ? "bg-violet-100 text-violet-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {counts[tab]}
                    </span>

                    {selected && (
                      <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-violet-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* List heading */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 px-5 py-3.5 sm:px-6">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-800">
                {activeTab === "All"
                  ? "All applications"
                  : `${activeTab} applications`}
              </h3>

              <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                {filteredApplications.length} results
              </span>
            </div>

            {(search || activeTab !== "All") && (
              <button
                type="button"
                onClick={clearSearch}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-700 hover:text-violet-900"
              >
                <RotateCcw size={13} />
                Clear search and filters
              </button>
            )}
          </div>

          {/* Application list */}
          <div className="min-w-0 space-y-3 p-4 sm:p-5 sm:space-y-4">
            {loading ? (
              <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-slate-100 bg-slate-50/50 px-5 text-center">
                <LoaderCircle
                  size={28}
                  className="animate-spin text-violet-600"
                />
                <p className="mt-4 text-sm font-semibold text-slate-800">
                  Loading your applications
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Getting your latest application activity...
                </p>
              </div>
            ) : error ? (
              <div
                role="alert"
                className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-12 text-center"
              >
                <AlertCircle
                  size={28}
                  className="mx-auto text-rose-600"
                />

                <h3 className="mt-4 text-base font-bold text-slate-900">
                  Couldn't load applications
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={handleRefresh}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-800"
                >
                  <RotateCcw size={15} />
                  Try again
                </button>
              </div>
            ) : filteredApplications.length > 0 ? (
              filteredApplications.map((application, index) => (
                <div
                  key={
                    application?._id ||
                    application?.id ||
                    `${getCompanyName(application)}-${getJobTitle(application)}-${index}`
                  }
                  className="min-w-0"
                >
                  <ApplicationCard
                    application={application}
                    statusStyle={getStatusStyle}
                  />
                </div>
              ))
            ) : (
              <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/40 px-5 py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-100 bg-violet-50 text-violet-600">
                  {search ? (
                    <SearchX size={24} />
                  ) : (
                    <BriefcaseBusiness size={24} />
                  )}
                </div>

                <h3 className="mt-4 text-base font-bold text-slate-900">
                  {search
                    ? "No matching applications"
                    : activeTab === "All"
                      ? "Your application journey starts here"
                      : `No ${activeTab.toLowerCase()} applications yet`}
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  {search
                    ? "Try a different keyword or clear your search to see more results."
                    : activeTab === "All"
                      ? "Applications you submit will appear here so you can track your progress in one place."
                      : "When an application reaches this stage, it will appear here."}
                </p>

                {(search || activeTab !== "All") && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800"
                  >
                    <RotateCcw size={15} />
                    View all applications
                    <ArrowUpRight size={14} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {!loading && !error && safeApplications.length > 0 && (
            <div className="flex flex-col justify-between gap-2 border-t border-slate-100 bg-slate-50/50 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:px-6">
              <p>
                Showing{" "}
                <span className="font-semibold text-slate-700">
                  {filteredApplications.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-700">
                  {safeApplications.length}
                </span>{" "}
                applications
              </p>

              <p className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-600" />
                Your application activity is up to date
              </p>
            </div>
          )}
        </section>

        {/* Summary */}
        {!loading && !error && safeApplications.length > 0 && (
          <section className="flex flex-col gap-3 rounded-2xl border border-violet-100 bg-violet-50/60 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-white p-2.5 text-violet-700 shadow-sm">
                <TrendingUp size={19} />
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Keep your momentum going
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Check your application statuses regularly and prepare
                  for upcoming interviews.
                </p>
              </div>
            </div>

            <p className="shrink-0 text-xs font-semibold text-violet-700">
              {activeCount} active · {closedCount} closed
            </p>
          </section>
        )}
      </div>
    </div>
  );
}

export default Applications;
