import React from "react";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  ChevronDown,
  Bookmark,
} from "lucide-react";

import JobCard from './JobCard';

const jobs = [
  {
    id: 1,
    title: "Software Engineer",
    company: "Microsoft",
    location: "Bangalore, India",
    type: "Full-time",
    mode: "Hybrid",
    experience: "1–3 years",
    salary: "₹12L – ₹20L",
    posted: "2 days ago",
    logo: "M",
    skills: ["React", "Node.js", "Azure"],
  },

  {
    id: 2,
    title: "Frontend Engineer",
    company: "Google",
    location: "Bangalore, India",
    type: "Full-time",
    mode: "On-site",
    experience: "0–2 years",
    salary: "₹10L – ₹18L",
    posted: "3 days ago",
    logo: "G",
    skills: ["React", "TypeScript", "JavaScript"],
  },

  {
    id: 3,
    title: "Software Development Engineer I",
    company: "Amazon",
    location: "Hyderabad, India",
    type: "Full-time",
    mode: "Hybrid",
    experience: "0–2 years",
    salary: "₹8L – ₹16L",
    posted: "5 days ago",
    logo: "A",
    skills: ["Java", "AWS", "DSA"],
  },

  {
    id: 4,
    title: "Full Stack Developer",
    company: "Razorpay",
    location: "Bangalore, India",
    type: "Full-time",
    mode: "Hybrid",
    experience: "1–3 years",
    salary: "₹10L – ₹18L",
    posted: "1 week ago",
    logo: "R",
    skills: ["React", "Node.js", "MongoDB"],
  },
];

const Jobs = () => {
  return (
    <div className="min-h-full bg-[#F4F4F8] px-6 py-6 lg:px-8">
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="mb-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
              Find your next opportunity
            </h1>

            <p className="mt-1.5 text-sm text-[#64748B]">
              Discover jobs that match your skills, experience and career goals.
            </p>
          </div>

          {/* Saved Jobs */}
          <button
            type="button"
            className="
              flex w-fit items-center gap-2
              rounded-xl
              border border-slate-200
              bg-white
              px-4 py-2.5
              text-sm font-medium
              text-slate-700
              shadow-sm
              transition-all
              hover:border-purple-200
              hover:bg-[#F0EDFF]
              hover:text-[#6D28D9]
            "
          >
            <Bookmark size={17} />
            Saved Jobs
          </button>
        </div>
      </div>

      {/* =====================================================
          SEARCH BOX
      ====================================================== */}

      <div
        className="
          mb-7
          rounded-2xl
          border border-slate-200
          bg-white
          p-3
          shadow-sm
        "
      >
        <div className="flex flex-col gap-3 lg:flex-row">
          {/* Search Input */}
          <div
            className="
              flex flex-1
              items-center gap-3
              rounded-xl
              bg-[#F7F7FA]
              px-4 py-3
              transition-all
              focus-within:ring-2
              focus-within:ring-purple-100
            "
          >
            <Search
              size={19}
              strokeWidth={1.8}
              className="shrink-0 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search jobs, skills or companies..."
              className="
                w-full
                bg-transparent
                text-sm
                text-slate-800
                outline-none
                placeholder:text-slate-400
              "
            />
          </div>

          {/* Location Input */}
          <div
            className="
              flex flex-1
              items-center gap-3
              rounded-xl
              bg-[#F7F7FA]
              px-4 py-3
              transition-all
              focus-within:ring-2
              focus-within:ring-purple-100
            "
          >
            <MapPin
              size={19}
              strokeWidth={1.8}
              className="shrink-0 text-slate-400"
            />

            <input
              type="text"
              placeholder="Location"
              className="
                w-full
                bg-transparent
                text-sm
                text-slate-800
                outline-none
                placeholder:text-slate-400
              "
            />
          </div>

          {/* Search Button */}
          <button
            type="button"
            className="
              flex items-center
              justify-center gap-2
              rounded-xl
              bg-[#6D28D9]
              px-7 py-3
              text-sm font-semibold
              text-white
              transition-all
              hover:bg-[#5B21B6]
              hover:shadow-md
              hover:shadow-purple-200
              active:scale-[0.98]
            "
          >
            <Search size={17} />
            Search Jobs
          </button>
        </div>
      </div>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[240px_minmax(0,1fr)]">
        {/* =================================================
            FILTER SIDEBAR
        ================================================== */}

        <aside className="hidden h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:block">
          {/* Filter Header */}
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal
                size={17}
                className="text-[#6D28D9]"
              />

              <h2 className="text-sm font-semibold text-slate-900">
                Filters
              </h2>
            </div>

            <button
              type="button"
              className="
                text-xs font-medium
                text-[#6D28D9]
                transition
                hover:text-[#5B21B6]
              "
            >
              Clear
            </button>
          </div>

          {/* ---------------------------------------------
              JOB TYPE
          ---------------------------------------------- */}

          <div className="border-b border-slate-100 pb-5">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Job Type
            </h3>

            {[
              "Full-time",
              "Part-time",
              "Internship",
              "Contract",
            ].map((item) => (
              <label
                key={item}
                className="
                  mb-3
                  flex cursor-pointer
                  items-center gap-3
                  text-sm text-slate-600
                "
              >
                <input
                  type="checkbox"
                  className="
                    h-4 w-4
                    rounded
                    border-slate-300
                    accent-[#6D28D9]
                  "
                />

                {item}
              </label>
            ))}
          </div>

          {/* ---------------------------------------------
              WORK MODE
          ---------------------------------------------- */}

          <div className="border-b border-slate-100 py-5">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Work Mode
            </h3>

            {["Remote", "Hybrid", "On-site"].map((item) => (
              <label
                key={item}
                className="
                  mb-3
                  flex cursor-pointer
                  items-center gap-3
                  text-sm text-slate-600
                "
              >
                <input
                  type="checkbox"
                  className="
                    h-4 w-4
                    rounded
                    border-slate-300
                    accent-[#6D28D9]
                  "
                />

                {item}
              </label>
            ))}
          </div>

          {/* ---------------------------------------------
              EXPERIENCE
          ---------------------------------------------- */}

          <div className="pt-5">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Experience
            </h3>

            {[
              "Entry level",
              "1–3 years",
              "3–5 years",
              "5+ years",
            ].map((item) => (
              <label
                key={item}
                className="
                  mb-3
                  flex cursor-pointer
                  items-center gap-3
                  text-sm text-slate-600
                "
              >
                <input
                  type="radio"
                  name="experience"
                  className="
                    h-4 w-4
                    border-slate-300
                    accent-[#6D28D9]
                  "
                />

                {item}
              </label>
            ))}
          </div>
        </aside>

        {/* =================================================
            JOB RESULTS
        ================================================== */}

        <main className="min-w-0">
          {/* Results Header */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-800">
                1,240
              </span>{" "}
              jobs
            </p>

            {/* Sort */}
            <button
              type="button"
              className="
                flex items-center gap-2
                text-sm
                text-slate-500
                transition
                hover:text-slate-900
              "
            >
              Sort by

              <span className="font-semibold text-slate-800">
                Relevance
              </span>

              <ChevronDown size={16} />
            </button>
          </div>

          {/* Job Cards */}
          <div className="space-y-4">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Jobs;