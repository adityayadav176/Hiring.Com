import { Bookmark, ChevronDown, MapPin, Search, SlidersHorizontal } from 'lucide-react'
import React from 'react'
import JobItem from './JobItem';

function JobLayout() {
 const jobs = [
  {
    _id: "job001",
    title: "Software Engineer",
    description:
      "Build scalable web applications and services used by millions of users.",
    companyId: {
      _id: "company001",
      name: "Microsoft",
      logo: "M",
    },
    recruiterId: "recruiter001",

    salary: {
      min: 1200000,
      max: 2000000,
      currency: "INR",
      isNegotiable: false,
    },

    location: {
      city: "Bangalore",
      state: "Karnataka",
      country: "India",
    },

    skills: ["react", "node.js", "javascript", "azure"],

    requirements: [
      "Strong knowledge of JavaScript",
      "Experience with React and Node.js",
      "Good problem-solving skills",
    ],

    responsibilities: [
      "Develop scalable web applications",
      "Write clean and maintainable code",
      "Collaborate with cross-functional teams",
    ],

    status: "OPEN",
    views: 1250,
    isBlocked: false,
    isDeleted: false,
    applicantsCount: 84,

    workSpaceType: "HYBRID",
    employmentType: "FULL_TIME",
    experienceLevel: "JUNIOR",

    category: "Software Development",

    applicationDeadline: "2026-10-15T23:59:59.000Z",

    openings: 3,

    createdAt: "2026-09-10T10:30:00.000Z",
    updatedAt: "2026-09-10T10:30:00.000Z",
  },

  {
    _id: "job002",
    title: "Frontend Developer",
    description:
      "Create modern and responsive user interfaces for our next-generation products.",
    companyId: {
      _id: "company002",
      name: "Google",
      logo: "G",
    },
    recruiterId: "recruiter002",

    salary: {
      min: 1000000,
      max: 1800000,
      currency: "INR",
      isNegotiable: true,
    },

    location: {
      city: "Hyderabad",
      state: "Telangana",
      country: "India",
    },

    skills: [],

    requirements: [
      "Strong knowledge of React",
      "Understanding of responsive design",
      "Knowledge of Git and GitHub",
    ],

    responsibilities: [
      "Build reusable React components",
      "Optimize frontend performance",
      "Work closely with UI/UX designers",
    ],

    status: "OPEN",
    views: 980,
    isBlocked: false,
    isDeleted: false,
    applicantsCount: 62,

    workSpaceType: "REMOTE",
    employmentType: "FULL_TIME",
    experienceLevel: "JUNIOR",

    category: "Frontend Development",

    applicationDeadline: "2026-10-20T23:59:59.000Z",

    openings: 2,

    createdAt: "2026-09-08T08:15:00.000Z",
    updatedAt: "2026-09-08T08:15:00.000Z",
  },

  {
    _id: "job003",
    title: "Backend Developer",
    description:
      "Design and develop reliable backend services and REST APIs.",
    companyId: {
      _id: "company003",
      name: "Amazon",
      logo: "A",
    },
    recruiterId: "recruiter003",

    salary: {
      min: 1400000,
      max: 2400000,
      currency: "INR",
      isNegotiable: false,
    },

    location: {
      city: "Pune",
      state: "Maharashtra",
      country: "India",
    },

    skills: ["node.js", "express", "mongodb", "aws"],

    requirements: [
      "Strong knowledge of Node.js",
      "Experience with REST APIs",
      "Understanding of MongoDB",
    ],

    responsibilities: [
      "Develop backend APIs",
      "Design database schemas",
      "Improve application performance and scalability",
    ],

    status: "OPEN",
    views: 1750,
    isBlocked: false,
    isDeleted: false,
    applicantsCount: 113,

    workSpaceType: "ONSITE",
    employmentType: "FULL_TIME",
    experienceLevel: "MID",

    category: "Backend Development",

    applicationDeadline: "2026-10-10T23:59:59.000Z",

    openings: 4,

    createdAt: "2026-09-06T12:00:00.000Z",
    updatedAt: "2026-09-06T12:00:00.000Z",
  },

  {
    _id: "job004",
    title: "Full Stack Developer",
    description:
      "Work across frontend and backend systems to build complete web applications.",
    companyId: {
      _id: "company004",
      name: "Flipkart",
      logo: "F",
    },
    recruiterId: "recruiter004",

    salary: {
      min: 900000,
      max: 1600000,
      currency: "INR",
      isNegotiable: true,
    },

    location: {
      city: "Bangalore",
      state: "Karnataka",
      country: "India",
    },

    skills: ["react", "node.js", "mongodb", "express"],

    requirements: [
      "Experience with MERN stack",
      "Good understanding of REST APIs",
      "Knowledge of Git",
    ],

    responsibilities: [
      "Develop frontend and backend features",
      "Build REST APIs",
      "Work with the product and engineering teams",
    ],

    status: "OPEN",
    views: 740,
    isBlocked: false,
    isDeleted: false,
    applicantsCount: 47,

    workSpaceType: "HYBRID",
    employmentType: "FULL_TIME",
    experienceLevel: "MID",

    category: "Full Stack Development",

    applicationDeadline: "2026-10-25T23:59:59.000Z",

    openings: 2,

    createdAt: "2026-09-05T09:45:00.000Z",
    updatedAt: "2026-09-05T09:45:00.000Z",
  },

  {
    _id: "job005",
    title: "React Developer Intern",
    description:
      "Join our frontend team and work on real-world React applications.",
    companyId: {
      _id: "company005",
      name: "Razorpay",
      logo: "R",
    },
    recruiterId: "recruiter005",

    salary: {
      min: 15000,
      max: 25000,
      currency: "INR",
      isNegotiable: false,
    },

    location: {
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
    },

    skills: ["react", "javascript", "html", "css"],

    requirements: [
      "Basic knowledge of React",
      "Understanding of JavaScript",
      "Good communication skills",
    ],

    responsibilities: [
      "Build React components",
      "Fix frontend bugs",
      "Assist senior developers",
    ],

    status: "OPEN",
    views: 520,
    isBlocked: false,
    isDeleted: false,
    applicantsCount: 91,

    workSpaceType: "REMOTE",
    employmentType: "INTERNSHIP",
    experienceLevel: "FRESHER",

    category: "Frontend Development",

    applicationDeadline: "2026-10-05T23:59:59.000Z",

    openings: 5,

    createdAt: "2026-09-03T11:20:00.000Z",
    updatedAt: "2026-09-03T11:20:00.000Z",
  },

  {
    _id: "job006",
    title: "DevOps Engineer",
    description:
      "Manage cloud infrastructure, deployment pipelines, and production systems.",
    companyId: {
      _id: "company006",
      name: "TCS",
      logo: "T",
    },
    recruiterId: "recruiter006",

    salary: {
      min: 1100000,
      max: 1900000,
      currency: "INR",
      isNegotiable: false,
    },

    location: {
      city: "Noida",
      state: "Uttar Pradesh",
      country: "India",
    },

    skills: ["docker", "kubernetes", "aws", "github actions"],

    requirements: [
      "Knowledge of Docker and Kubernetes",
      "Understanding of CI/CD",
      "Experience with cloud platforms",
    ],

    responsibilities: [
      "Maintain CI/CD pipelines",
      "Manage cloud infrastructure",
      "Monitor production systems",
    ],

    status: "OPEN",
    views: 630,
    isBlocked: false,
    isDeleted: false,
    applicantsCount: 38,

    workSpaceType: "HYBRID",
    employmentType: "FULL_TIME",
    experienceLevel: "MID",

    category: "DevOps",

    applicationDeadline: "2026-10-18T23:59:59.000Z",

    openings: 2,

    createdAt: "2026-09-02T07:30:00.000Z",
    updatedAt: "2026-09-02T07:30:00.000Z",
  },
];
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
  <aside className="w-[235px] h-fit shrink-0 rounded-2xl border border-slate-100 bg-white px-6 py-6 shadow-sm">

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
      {jobs.map((item) => <JobItem key={item._id} job={item}/>)}
    </div>

  </main>

</div>
    </div>
  )
}

export default JobLayout
