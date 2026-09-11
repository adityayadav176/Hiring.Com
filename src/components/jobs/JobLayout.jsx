import { Bookmark, ChevronDown, MapPin, Search, SlidersHorizontal } from 'lucide-react'
import React from 'react'

function JobLayout() {
  return (
    <div className='bg-[#F4F4F8] px-6 py-6 min-h-full'>
        <div className='flex justify-between flex-row p-3'>
            <div className=''>
                <h1 className='text-2xl font-bold tracking-tight text-[#111827]'>Find your next opportunity</h1>
                <p className='mt-1.5 text-sm text-[#64748B]'>Discover jobs that match your skills, experience and career goals.</p>
            </div>
            <button
  className="
    flex h-10 cursor-pointer items-center justify-center gap-2
    rounded-xl
    border border-slate-200
    bg-white
    px-4
    text-sm font-medium text-slate-700
    shadow-sm
    transition-all
    hover:border-violet-200
    hover:bg-violet-50
    hover:text-violet-700
  "
>
  <Bookmark size={17} />
  Saved Jobs
</button>
        </div>
        <div className='flex bg-white w-full px-3 py-3 rounded-2xl shadow-sm gap-4 mt-3 mb-8 '>
            <div className="flex h-11 w-[500px] items-center gap-2 rounded-xl border border-slate-200 bg-[#F8F8FC] px-3 transition focus-within:border-violet-100 focus-within:ring-2 focus-within:ring-violet-100">
  <Search
                size={19}
                strokeWidth={1.8}
                className="shrink-0 text-slate-400"
              />

  <input
    type="text"
    className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
    placeholder="Search jobs, skills or companies..."
  />
</div>
            <div className="flex h-11 w-[500px]  items-center gap-2 rounded-xl border border-slate-200 bg-[#F8F8FC] px-3 transition focus-within:border-violet-100 focus-within:ring-2 focus-within:ring-violet-100">
  <MapPin
                size={19}
                strokeWidth={1.8}
                className="shrink-0 text-slate-400"
              />

  <input
    type="text"
    className="w-full bg-transparent  text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
    placeholder="Location"
  />
</div>
            <button
  className="
    flex h-11 w-[180px]
    cursor-pointer items-center justify-center gap-2
    rounded-xl
    bg-[#6D28D9]
    px-5
    text-sm font-semibold text-white
    shadow-sm shadow-violet-200
    transition-all
    hover:bg-[#5B21B6]
    hover:shadow-md hover:shadow-violet-200
    active:scale-[0.98]
  "
>
  <Search size={18} />
  Search Jobs
</button>
        </div>
       <div className="flex gap-6">

  {/* LEFT FILTER SIDEBAR */}
  <aside className="w-[235px] shrink-0 rounded-2xl border border-slate-100 bg-white px-6 py-6 shadow-sm">

    <div className="flex justify-between mb-5">
      <div className="flex items-center gap-2">
        <SlidersHorizontal
          size={17}
          className="text-violet-700"
        />
        <span className="text-sm font-medium">
          Filter
        </span>
      </div>

      <button className="text-sm font-medium hover:underline hover:shadow text-violet-700 cursor-pointer">
        Clear
      </button>
    </div>

    {/* JOB TYPE */}
   <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
  Job Type
</h3>

    <div>
      <label className="mb-3 flex cursor-pointer items-center gap-3 text-sm text-slate-600">
        <input
          type="checkbox"
          className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-[#6D28D9]"
        />
        Full-time
      </label>

      <label className="mb-3 flex cursor-pointer items-center gap-3 text-sm text-slate-600">
        <input
          type="checkbox"
          className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-[#6D28D9]"
        />
        Part-time
      </label>

      <label className="mb-3 flex cursor-pointer items-center gap-3 text-sm text-slate-600">
        <input
          type="checkbox"
          className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-[#6D28D9]"
        />
        Internship
      </label>

      <label className="mb-6 flex cursor-pointer items-center gap-3 text-sm text-slate-600">
        <input
          type="checkbox"
          className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-[#6D28D9]"
        />
        Contract
      </label>
    </div>

    {/* WORK MODE */}
    <h3 className="mb-3 mt-10 text-sm text-slate-500">
      Work Mode
    </h3>

    <div>
      <label className="mb-3 flex cursor-pointer items-center gap-3 text-sm text-slate-600">
        <input
          type="checkbox"
          className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-[#6D28D9]"
        />
        Remote
      </label>

      <label className="mb-3 flex cursor-pointer items-center gap-3 text-sm text-slate-600">
        <input
          type="checkbox"
          className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-[#6D28D9]"
        />
        Hybrid
      </label>

      <label className="mb-6 flex cursor-pointer items-center gap-3 text-sm text-slate-600">
        <input
          type="checkbox"
          className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-[#6D28D9]"
        />
        On-site
      </label>
    </div>

    {/* EXPERIENCE */}
    <h3 className="mb-3 mt-10 text-sm text-slate-500">
      Experience
    </h3>

    <div>
      <label className="mb-3 flex cursor-pointer items-center gap-3 text-sm text-slate-600">
        <input
          type="radio"
          name="experience"
          className="cursor-pointer accent-[#6D28D9]"
        />
        Entry Level
      </label>

      <label className="mb-3 flex cursor-pointer items-center gap-3 text-sm text-slate-600">
        <input
          type="radio"
          name="experience"
          className="cursor-pointer accent-[#6D28D9]"
        />
        1-3 Years
      </label>

      <label className="mb-3 flex cursor-pointer items-center gap-3 text-sm text-slate-600">
        <input
          type="radio"
          name="experience"
          className="cursor-pointer accent-[#6D28D9]"
        />
        3-5 Years
      </label>

      <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-600">
        <input
          type="radio"
          name="experience"
          className="cursor-pointer accent-[#6D28D9]"
        />
        5+ Years
      </label>
    </div>

  </aside>


  {/* RIGHT JOBS SECTION */}
  <main className="min-w-0 flex-1">

    {/* JOBS HEADER */}
    <div className="mb-4 flex items-center justify-between">

      <p className="text-sm text-slate-500">
        Showing{" "}
        <span className="font-semibold text-slate-800">
          1240
        </span>{" "}
        jobs
      </p>

      <button className="flex cursor-pointer items-center gap-2 text-sm text-slate-500 transition hover:text-slate-900">
        Sort by
        <span className="font-semibold text-slate-800">
          Relevance
        </span>
        <ChevronDown size={16} />
      </button>

    </div>


    {/* JOB ITEMS */}
    <div className="space-y-4">

      <div className="rounded-2xl bg-white p-6 shadow shadow-slate-200">
        Job Item 1
      </div>

      <div className="rounded-2xl bg-white p-6 shadow shadow-slate-200">
        Job Item 2
      </div>

      <div className="rounded-2xl bg-white p-6 shadow shadow-slate-200">
        Job Item 3
      </div>

    </div>

  </main>

</div>
    </div>
  )
}

export default JobLayout
