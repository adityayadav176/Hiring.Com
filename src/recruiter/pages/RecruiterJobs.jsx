import React, { useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Eye,
  MapPin,
  MoreVertical,
  Plus,
  Search,
  SlidersHorizontal,
  Users,
  Pause,
  Play,
  Pencil,
  Copy,
  Trash2,
  XCircle,
} from "lucide-react";

const RecruiterJobs = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [workMode, setWorkMode] = useState("ALL");
  const [sort, setSort] = useState("NEWEST");
  const [openMenu, setOpenMenu] = useState(null);
  const [page, setPage] = useState(1);

  const jobs = [
    {
      id: 1,
      title: "Frontend Developer",
      department: "Engineering",
      status: "OPEN",
      location: "Agra, Uttar Pradesh",
      workMode: "FULL TIME",
      experience: "2–4 Years",
      salary: "₹8L – ₹12L",
      applicants: 24,
      views: 342,
      deadline: "30 Sep 2026",
      posted: "2 days ago",
    },
    {
      id: 2,
      title: "React Developer",
      department: "Product Engineering",
      status: "DRAFT",
      location: "Remote",
      workMode: "FULL TIME",
      experience: "1–3 Years",
      salary: "₹6L – ₹10L",
      applicants: 31,
      views: 418,
      deadline: "12 Oct 2026",
      posted: "4 days ago",
    },
    {
      id: 3,
      title: "UI/UX Designer",
      department: "Design",
      status: "PAUSED",
      location: "Noida, Uttar Pradesh",
      workMode: "FULL TIME",
      experience: "2–4 Years",
      salary: "₹7L – ₹11L",
      applicants: 12,
      views: 190,
      deadline: "25 Sep 2026",
      posted: "6 days ago",
    },
    {
      id: 4,
      title: "Node.js Developer",
      department: "Engineering",
      status: "CLOSED",
      location: "Delhi, India",
      workMode: "FULL TIME",
      experience: "2–5 Years",
      salary: "₹8L – ₹14L",
      applicants: 42,
      views: 521,
      deadline: "18 Sep 2026",
      posted: "12 days ago",
    },
    {
      id: 5,
      title: "Backend Engineer",
      department: "Engineering",
      status: "OPEN",
      location: "Bangalore, India",
      workMode: "HYBRID",
      experience: "2–5 Years",
      salary: "₹10L – ₹16L",
      applicants: 18,
      views: 289,
      deadline: "05 Oct 2026",
      posted: "1 day ago",
    },
  ];

  const stats = useMemo(() => {
    return {
      total: jobs.length,
      open: jobs.filter((job) => job.status === "OPEN").length,
      draft: jobs.filter((job) => job.status === "DRAFT").length,
      paused: jobs.filter((job) => job.status === "PAUSED").length,
      closed: jobs.filter((job) => job.status === "CLOSED").length,
    };
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    if (search.trim()) {
      const value = search.toLowerCase();

      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(value) ||
          job.department.toLowerCase().includes(value) ||
          job.location.toLowerCase().includes(value)
      );
    }

    if (status !== "ALL") {
      result = result.filter((job) => job.status === status);
    }

    if (workMode !== "ALL") {
      result = result.filter((job) => job.workMode === workMode);
    }

    if (sort === "OLDEST") {
      result.reverse();
    }

    if (sort === "APPLICANTS") {
      result.sort((a, b) => b.applicants - a.applicants);
    }

    if (sort === "VIEWS") {
      result.sort((a, b) => b.views - a.views);
    }

    return result;
  }, [jobs, search, status, workMode, sort]);

  const getStatusStyle = (jobStatus) => {
    switch (jobStatus) {
      case "OPEN":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";

      case "DRAFT":
        return "bg-slate-50 text-slate-600 border-slate-200";

      case "PAUSED":
        return "bg-amber-50 text-amber-600 border-amber-100";

      case "CLOSED":
        return "bg-red-50 text-red-500 border-red-100";

      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const formatStatus = (value) => {
    return value.charAt(0) + value.slice(1).toLowerCase();
  };

  const statusTabs = [
    {
      label: "All",
      value: "ALL",
      count: stats.total,
    },
    {
      label: "Open",
      value: "OPEN",
      count: stats.open,
    },
    {
      label: "Drafts",
      value: "DRAFT",
      count: stats.draft,
    },
    {
      label: "Paused",
      value: "PAUSED",
      count: stats.paused,
    },
    {
      label: "Closed",
      value: "CLOSED",
      count: stats.closed,
    },
  ];

  return (
    <div
      className="min-h-full bg-[#F7F8FC] px-6 py-6 lg:px-8 lg:py-7"
      onClick={() => setOpenMenu(null)}
    >
      {/* =========================================================
          HEADER
      ========================================================= */}
      <div className="mb-6 flex items-start justify-between gap-5">
        <div>
          <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-[#111827]">
            Jobs
          </h1>

          <p className="mt-1 text-[14px] text-[#64748B]">
            Manage and monitor your hiring positions.
          </p>
        </div>

        <button
          type="button"
          className="flex h-11 shrink-0 items-center gap-2 rounded-xl bg-[#6D28D9] px-5 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#5B21B6] active:scale-[0.98]"
        >
          <Plus size={18} strokeWidth={2.4} />
          Create Job
        </button>
      </div>

      {/* =========================================================
          STATS
      ========================================================= */}
      <div className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-5">
        <StatCard
          icon={<BriefcaseBusiness size={18} />}
          label="Total Jobs"
          value={stats.total}
        />

        <StatCard
          icon={<BriefcaseBusiness size={18} />}
          label="Open"
          value={stats.open}
        />

        <StatCard
          icon={<CalendarDays size={18} />}
          label="Drafts"
          value={stats.draft}
        />

        <StatCard
          icon={<Pause size={18} />}
          label="Paused"
          value={stats.paused}
        />

        <StatCard
          icon={<XCircle size={18} />}
          label="Closed"
          value={stats.closed}
        />
      </div>

      {/* =========================================================
          SEARCH + FILTER BAR
      ========================================================= */}
      <div className="mb-6 rounded-2xl border border-[#E5E7EB] bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
        <div className="flex flex-col gap-3 xl:flex-row">
          {/* Search */}
          <div className="relative min-w-0 flex-1">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search jobs, departments, locations..."
              className="h-11 w-full rounded-xl border border-[#E5E7EB] bg-[#FAFBFC] pl-11 pr-4 text-[14px] text-[#111827] outline-none placeholder:text-[#94A3B8] transition focus:border-[#C4B5FD] focus:bg-white focus:ring-3 focus:ring-[#EDE9FE]"
            />
          </div>

          {/* Status */}
          <SelectBox
            value={
              status === "ALL"
                ? "All Status"
                : formatStatus(status)
            }
            options={[
              { label: "All Status", value: "ALL" },
              { label: "Open", value: "OPEN" },
              { label: "Draft", value: "DRAFT" },
              { label: "Paused", value: "PAUSED" },
              { label: "Closed", value: "CLOSED" },
            ]}
            onChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
          />

          {/* Work Mode */}
          <SelectBox
            value={
              workMode === "ALL"
                ? "All Work Modes"
                : workMode
            }
            options={[
              { label: "All Work Modes", value: "ALL" },
              { label: "Full Time", value: "FULL TIME" },
              { label: "Part Time", value: "PART TIME" },
              { label: "Remote", value: "REMOTE" },
              { label: "Hybrid", value: "HYBRID" },
            ]}
            onChange={(value) => {
              setWorkMode(value);
              setPage(1);
            }}
          />

          {/* Sort */}
          <SelectBox
            value={
              sort === "NEWEST"
                ? "Newest First"
                : sort === "OLDEST"
                ? "Oldest First"
                : sort === "APPLICANTS"
                ? "Most Applicants"
                : "Most Views"
            }
            options={[
              { label: "Newest First", value: "NEWEST" },
              { label: "Oldest First", value: "OLDEST" },
              { label: "Most Applicants", value: "APPLICANTS" },
              { label: "Most Views", value: "VIEWS" },
            ]}
            onChange={setSort}
          />
        </div>
      </div>

      {/* =========================================================
          STATUS TABS
      ========================================================= */}
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="min-w-0 overflow-x-auto">
          <div className="flex w-max items-center gap-1 rounded-xl border border-[#E5E7EB] bg-white p-1">
            {statusTabs.map((tab) => {
              const active = status === tab.value;

              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => {
                    setStatus(tab.value);
                    setPage(1);
                  }}
                  className={`flex h-9 items-center gap-2 rounded-lg px-3.5 text-[13px] font-medium transition ${
                    active
                      ? "bg-[#F1EDFF] text-[#6D28D9]"
                      : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#334155]"
                  }`}
                >
                  {tab.label}

                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${
                      active
                        ? "bg-white text-[#6D28D9]"
                        : "bg-[#F1F5F9] text-[#64748B]"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          className="hidden h-10 shrink-0 items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 text-[13px] font-medium text-[#475569] transition hover:bg-[#F8FAFC] sm:flex"
        >
          <SlidersHorizontal size={16} />
          Filters
        </button>
      </div>

      {/* =========================================================
          JOB LIST HEADER
      ========================================================= */}
      <div className="mb-3 flex items-end justify-between">
        <div>
          <h2 className="text-[17px] font-semibold text-[#111827]">
            Your Job Postings
          </h2>

          <p className="mt-0.5 text-[13px] text-[#94A3B8]">
            {filteredJobs.length}{" "}
            {filteredJobs.length === 1 ? "job" : "jobs"} found
          </p>
        </div>
      </div>

      {/* =========================================================
          JOB LIST
      ========================================================= */}
      <div className="space-y-3">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isMenuOpen={openMenu === job.id}
              onMenu={() =>
                setOpenMenu(
                  openMenu === job.id ? null : job.id
                )
              }
              statusStyle={getStatusStyle(job.status)}
            />
          ))
        ) : (
          <div className="rounded-2xl border border-[#E5E7EB] bg-white px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F1EDFF] text-[#6D28D9]">
              <BriefcaseBusiness size={22} />
            </div>

            <h3 className="text-[16px] font-semibold text-[#111827]">
              No jobs found
            </h3>

            <p className="mt-1 text-[13px] text-[#94A3B8]">
              Try changing your search or filter.
            </p>
          </div>
        )}
      </div>

      {/* =========================================================
          PAGINATION
      ========================================================= */}
      <div className="mt-6 flex items-center justify-between pb-8">
        <p className="text-[13px] text-[#64748B]">
          Showing{" "}
          <span className="font-medium text-[#334155]">
            {filteredJobs.length === 0 ? 0 : 1}
          </span>{" "}
          to{" "}
          <span className="font-medium text-[#334155]">
            {filteredJobs.length}
          </span>{" "}
          of{" "}
          <span className="font-medium text-[#334155]">
            {filteredJobs.length}
          </span>{" "}
          jobs
        </p>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E5E7EB] bg-white text-[#94A3B8] transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft size={17} />
          </button>

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6D28D9] text-[13px] font-semibold text-white shadow-sm"
          >
            {page}
          </button>

          <button
            type="button"
            onClick={() => setPage((prev) => prev + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E5E7EB] bg-white text-[#64748B] transition hover:bg-[#F8FAFC]"
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* =============================================================
   STAT CARD
============================================================= */

const StatCard = ({ icon, label, value }) => {
  return (
    <div className="flex h-[102px] items-center gap-4 rounded-2xl border border-[#E5E7EB] bg-white px-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1EDFF] text-[#6D28D9]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[13px] font-medium text-[#64748B]">
          {label}
        </p>

        <p className="mt-1 text-[23px] font-semibold leading-none tracking-[-0.02em] text-[#111827]">
          {value}
        </p>
      </div>
    </div>
  );
};

/* =============================================================
   SELECT BOX
============================================================= */

const SelectBox = ({ value, options, onChange }) => {
  return (
    <div className="relative shrink-0">
      <select
        value={options.find((item) => item.label === value)?.value ?? value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 min-w-[170px] appearance-none rounded-xl border border-[#E5E7EB] bg-[#FAFBFC] px-4 pr-10 text-[14px] font-medium text-[#475569] outline-none transition focus:border-[#C4B5FD] focus:bg-white focus:ring-3 focus:ring-[#EDE9FE]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]"
      />
    </div>
  );
};

/* =============================================================
   JOB CARD
============================================================= */

const JobCard = ({
  job,
  isMenuOpen,
  onMenu,
  statusStyle,
}) => {
  return (
    <div className="group relative rounded-2xl border border-[#E5E7EB] bg-white px-5 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:border-[#DDD6FE] hover:shadow-[0_4px_14px_rgba(15,23,42,0.05)]">
      <div className="flex gap-4">
        {/* Job Icon */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F1EDFF] text-[#6D28D9]">
          <BriefcaseBusiness size={21} strokeWidth={2} />
        </div>

        {/* Main Content */}
        <div className="min-w-0 flex-1">
          {/* Top */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="truncate text-[16px] font-semibold text-[#111827]">
                  {job.title}
                </h3>

                <span
                  className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.04em] ${statusStyle}`}
                >
                  {job.status}
                </span>
              </div>

              <p className="mt-1 text-[13px] text-[#64748B]">
                {job.department}
              </p>
            </div>

            {/* Menu */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onMenu();
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#94A3B8] transition hover:bg-[#F8FAFC] hover:text-[#475569]"
              >
                <MoreVertical size={18} />
              </button>

              {isMenuOpen && (
                <JobMenu job={job} />
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-[#64748B]">
            <MetaItem
              icon={<MapPin size={15} />}
              text={job.location}
            />

            <MetaItem
              icon={<BriefcaseBusiness size={15} />}
              text={job.workMode}
            />

            <MetaItem
              icon={<Users size={15} />}
              text={job.experience}
            />

            <span className="font-semibold text-[#334155]">
              {job.salary}
            </span>
          </div>

          {/* Bottom */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#F1F5F9] pt-3">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <MetaItem
                icon={<Users size={15} />}
                text={
                  <>
                    <span className="font-semibold text-[#334155]">
                      {job.applicants}
                    </span>{" "}
                    applicants
                  </>
                }
              />

              <MetaItem
                icon={<Eye size={15} />}
                text={
                  <>
                    <span className="font-semibold text-[#334155]">
                      {job.views}
                    </span>{" "}
                    views
                  </>
                }
              />

              <span className="text-[12px] text-[#94A3B8]">
                Posted {job.posted}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[12px] text-[#64748B]">
              <CalendarDays size={15} />

              <span>Deadline:</span>

              <span className="font-semibold text-[#334155]">
                {job.deadline}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =============================================================
   META ITEM
============================================================= */

const MetaItem = ({ icon, text }) => {
  return (
    <div className="flex items-center gap-1.5 whitespace-nowrap">
      <span className="text-[#94A3B8]">{icon}</span>
      <span>{text}</span>
    </div>
  );
};

/* =============================================================
   JOB MENU
============================================================= */

const JobMenu = ({ job }) => {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute right-0 top-9 z-30 w-48 overflow-hidden rounded-xl border border-[#E5E7EB] bg-white p-1.5 shadow-[0_12px_35px_rgba(15,23,42,0.12)]"
    >
      <MenuItem
        icon={<Eye size={15} />}
        label="View Job"
      />

      <MenuItem
        icon={<Pencil size={15} />}
        label="Edit Job"
      />

      <MenuItem
        icon={<Copy size={15} />}
        label="Duplicate"
      />

      <div className="my-1 border-t border-[#F1F5F9]" />

      {job.status === "OPEN" && (
        <MenuItem
          icon={<Pause size={15} />}
          label="Pause Job"
        />
      )}

      {job.status === "PAUSED" && (
        <MenuItem
          icon={<Play size={15} />}
          label="Resume Job"
        />
      )}

      {job.status === "DRAFT" && (
        <MenuItem
          icon={<Play size={15} />}
          label="Publish Job"
        />
      )}

      {job.status === "OPEN" && (
        <MenuItem
          icon={<XCircle size={15} />}
          label="Close Job"
        />
      )}

      <div className="my-1 border-t border-[#F1F5F9]" />

      <MenuItem
        icon={<Trash2 size={15} />}
        label="Delete"
        danger
      />
    </div>
  );
};

/* =============================================================
   MENU ITEM
============================================================= */

const MenuItem = ({ icon, label, danger = false }) => {
  return (
    <button
      type="button"
      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] font-medium transition ${
        danger
          ? "text-red-500 hover:bg-red-50"
          : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#111827]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
};

export default RecruiterJobs;