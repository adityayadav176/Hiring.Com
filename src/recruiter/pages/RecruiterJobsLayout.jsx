
import React, { useState } from "react";
import {
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  Pause,
  Plus,
  Search,
  SlidersHorizontalIcon,
  XCircle,
} from "lucide-react";

function RecruiterJobsLayout() {
    
  const statusTabs = [
    {
      label: "All",
      value: "ALL",
      count: 1,
    },
    {
      label: "Open",
      value: "OPEN",
      count: 4,
    },
    {
      label: "Drafts",
      value: "DRAFT",
      count: 5,
    },
    {
      label: "Paused",
      value: "PAUSED",
      count: 6,
    },
    {
      label: "Closed",
      value: "CLOSED",
      count: 8,
    },
  ];
    const [status, setStatus] = useState("ALL");
  return (
    <div className="min-h-full bg-[#F7F8FC] px-6 py-6 lg:px-8 lg:py-7">
      
      {/* ==================== HEADER ==================== */}
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

      {/* ==================== STATS ==================== */}
      <div className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-5">
        
        <StatCard
          icon={<BriefcaseBusiness size={18} />}
          label="Total Jobs"
          value={5}
        />

        <StatCard
          icon={<BriefcaseBusiness size={18} />}
          label="Open"
          value={2}
        />

        <StatCard
          icon={<CalendarDays size={18} />}
          label="Drafts"
          value={1}
        />

        <StatCard
          icon={<Pause size={18} />}
          label="Paused"
          value={1}
        />

        <StatCard
          icon={<XCircle size={18} />}
          label="Closed"
          value={1}
        />

      </div>

      {/* ==================== SEARCH & FILTER ==================== */}
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
              placeholder="Search jobs, departments, locations..."
              className="h-11 w-full rounded-xl border border-[#E5E7EB] bg-[#FAFBFC] pl-11 pr-4 text-[14px] text-[#111827] placeholder:text-[#94A3B8] outline-none transition focus:border-[#C4B5FD] focus:bg-white focus:ring-3 focus:ring-[#EDE9FE]"
            />
          </div>

          {/* Status Filter */}
          <SelectBox
            value="All Status"
            options={[
              {
                label: "All Status",
                value: "ALL",
              },
              {
                label: "Open",
                value: "OPEN",
              },
              {
                label: "Draft",
                value: "DRAFT",
              },
              {
                label: "Paused",
                value: "PAUSED",
              },
              {
                label: "Closed",
                value: "CLOSED",
              },
            ]}
          />
          <SelectBox
            value="All Work Modes"
            options={[
                {
                    label: "All Work Modes",
                    value: "ALL"
                },
              {
                label: "Full Time",
                value: "FULL_TIME",
              },
              {
                label: "Part Time",
                value: "PART_TIME",
              },
              {
                label: "Remote",
                value: "REMOTE",
              },
              {
                label: "Hybrid",
                value: "HYBRID",
              },
              {
                label: "Closed",
                value: "CLOSED",
              },
            ]}
          />
          <SelectBox
            value="Newest First"
            options={[
              {
                label: "Newest First",
                value: "New",
              },
              {
                label: "Oldest",
                value: "OLDEST",
              },
              {
                label: "Most Applicants",
                value: "MOST_APPLICANTS",
              },
              {
                label: "Most Views",
                value: "MOST VIEWS",
              },
            ]}
          />
        </div>
      </div>

      <div className="mb-5 flex items-center justify-between gap-4">
            <div className="min-w-0 overflow-x-auto">
                <div className="flex w-max items-center gap-1 rounded-xl border border-[#E5E7EB] bg-white p-1">
                    {statusTabs.map((tab) => {
                        const active = status === tab.value;

                        return (
                            <button onClick={() => setStatus(tab.value)} key={tab.value} type="button" className={`flex h-9 items-center gap-2 rounded-lg px-3.5 text-[13px] font-medium transition ${active ? "bg-[#F1EDFF] text-[#6D28D9]" : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#334155]"}`}>
                                    {tab.value}
                                    <span className={`rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${active ? "bg-white text-[#6D28D9]" : "bg-[#F1F5F9] text-[#64748B]"}`}>
                                        {tab.count}
                                    </span>
                            </button>
                        )
                    })}
                </div>
            </div>
            <button className="hidden h-10 shrink-0 items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 text-[13px] font-medium text-[#475569] transition hover:bg-[#F8FAFC] sm:flex" type="button">
                <SlidersHorizontalIcon size={16}/>
                Filters
            </button>
      </div>

      <div className="mb-3 flex item-end justify-between">
        <div>
            <h2 className="text-[17px] font-semibold text-[#111827]">Your Job Postings</h2>
            <p className="mt-0.5 text-[13px] text-[#94A3B8]">5 jobs found</p>
        </div>
      </div>

      <div className="space-y-3">
            
      </div>

      {/* ==================== JOBS LIST ==================== */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
        
        <div className="flex min-h-[180px] items-center justify-center px-6">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F1EDFF] text-[#6D28D9]">
              <BriefcaseBusiness size={22} />
            </div>

            <h3 className="text-[15px] font-semibold text-[#111827]">
              Your jobs will appear here
            </h3>

            <p className="mt-1 text-[13px] text-[#64748B]">
              Create a job posting to start managing your hiring positions.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}


/* =========================================================
   STAT CARD
========================================================= */

const StatCard = ({ icon, label, value }) => {
  return (
    <div className="flex h-[102px] items-center gap-4 rounded-2xl border border-[#E5E7EB] bg-white px-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      
      {/* Icon */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1EDFF] text-[#6D28D9]">
        {icon}
      </div>

      {/* Content */}
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

const JobCard = ({job, isMenuOpen, onMenu, statusStyle}) => {
  return (
    <div className="group relative rounded-2xl border border-[#E5E7EB] bg-white px-5 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:border-[#DDD6FE] hover:shadow-[0_4px_14px_rgba(15,23,42,0.05)]">
      <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F1EDFF] text-[#6D28D9]">
            <BriefcaseBusiness size={21} strokeWidth={2}/>
          </div>
          <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5"> 
                          <h3 className="truncate text-[16px] font-semibold text-[#111827]">{job.title}</h3>
                          <span className="rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.04em]">{job.status}</span>
                      </div>
                      <p className="mt-1 text-[13px] text-[#64748B]">{job.department}</p>
                  </div>
                  
              </div>
          </div>
      </div>
    </div>
  )
}



/* =========================================================
   SELECT BOX
========================================================= */

const SelectBox = ({ value, options, onChange }) => {
  return (
    <div className="relative w-full shrink-0 xl:w-auto">
      
      <select
        onChange={(e) => onChange?.(e.target.value)}
        value={
          options.find((item) => item.label === value)?.value ?? value
        }
        className="h-11 w-full min-w-[170px] appearance-none rounded-xl border border-[#E5E7EB] bg-[#FAFBFC] px-4 pr-10 text-[14px] font-medium text-[#475569] outline-none transition focus:border-[#C4B5FD] focus:bg-white focus:ring-3 focus:ring-[#EDE9FE]"
      >
        {options.map((option) => (
          <option
            value={option.value}
            key={option.value}
          >
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


export default RecruiterJobsLayout;