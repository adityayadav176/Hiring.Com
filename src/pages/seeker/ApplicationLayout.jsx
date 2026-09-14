import { BriefcaseBusiness, ChevronDown, Search } from 'lucide-react'
import React, { useMemo, useState } from 'react'

function ApplicationLayout() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

     const applications = [
    {
      id: 1,
      company: "Google",
      jobTitle: "Frontend Engineer",
      location: "Mountain View, CA",
      type: "Full-time",
      status: "Interview",
      appliedAt: "Sep 04",
      resume: "Aditya_Resume.pdf",
      steps: [
        {
          label: "Applied",
          date: "Sep 04",
          completed: true,
        },
        {
          label: "Review",
          date: "Sep 06",
          completed: true,
        },
        {
          label: "Shortlisted",
          date: "Sep 09",
          completed: true,
        },
        {
          label: "Interview",
          date: "Sep 14",
          completed: true,
        },
      ],
    },

    {
      id: 2,
      company: "Microsoft",
      jobTitle: "Software Engineer",
      location: "Bangalore, India",
      type: "Full-time",
      status: "Reviewing",
      appliedAt: "Sep 10",
      resume: "Aditya_Resume.pdf",
      steps: [
        {
          label: "Applied",
          date: "Sep 10",
          completed: true,
        },
        {
          label: "Review",
          date: "Sep 12",
          completed: true,
        },
        {
          label: "Shortlisted",
          date: "",
          completed: false,
        },
        {
          label: "Interview",
          date: "",
          completed: false,
        },
      ],
    },

    {
      id: 3,
      company: "Amazon",
      jobTitle: "SDE I",
      location: "Hyderabad, India",
      type: "Full-time",
      status: "Pending",
      appliedAt: "Sep 12",
      resume: "Aditya_Resume.pdf",
      steps: [
        {
          label: "Applied",
          date: "Sep 12",
          completed: true,
        },
        {
          label: "Review",
          date: "",
          completed: false,
        },
        {
          label: "Shortlisted",
          date: "",
          completed: false,
        },
        {
          label: "Interview",
          date: "",
          completed: false,
        },
      ],
    },

    {
      id: 4,
      company: "Meta",
      jobTitle: "React Developer",
      location: "Remote",
      type: "Full-time",
      status: "Rejected",
      appliedAt: "Sep 05",
      resume: "Aditya_Resume.pdf",
      steps: [
        {
          label: "Applied",
          date: "Sep 05",
          completed: true,
        },
        {
          label: "Review",
          date: "Sep 06",
          completed: true,
        },
        {
          label: "Shortlisted",
          date: "",
          completed: false,
        },
        {
          label: "Closed",
          date: "Sep 09",
          completed: true,
        },
      ],
    },
  ];

   const getStatusStyle = (status) => {
    switch (status) {
      case "Interview":
        return "text-violet-600 bg-violet-50";

      case "Reviewing":
        return "text-blue-600 bg-blue-50";

      case "Rejected":
        return "text-slate-500 bg-slate-100";

      case "Offer":
        return "text-emerald-600 bg-emerald-50";

      default:
        return "text-amber-600 bg-amber-50";
    }
  };

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const text = `${application.company} ${application.jobTitle} ${application.location}`.toUpperCase();

      const matchesSearch = text.includes(text.toLowerCase())

      let matchesTab = true;

      if(activeTab == "Active") {
        return matchesTab = ["Pending",
          "Reviewing",
          "Shortlisted"].include(application.status)
      }

      if(activeTab === "Interviews") {
        matchesTab =
          application.status === "Interview";
      }

      if (activeTab === "Offers") {
        matchesTab =
          application.status === "Offer";
      }

      if (activeTab === "Closed") {
        matchesTab =
          application.status === "Rejected";
      }

      return matchesSearch && matchesTab;
    })
  }, [search, active])

  const tabs = ["All", "Active", "Interviews", "Offers", "Closed"];
  return (
    <div className='min-h-full bg-[#f8f9fc] py-7 px-6'>
      <div className='mx-auto max-w-[1160px]'>
        <div className='flex items-end justify-between'>
            <div className=''>
                <p className='text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-600'>Career workspace</p>
                <h1 className='mt-2 text-[27px] font-semibold tracking-[-0.035em] text-slate-950'>Your applications</h1>
                <p className='font-[13px] mt-1 text-slate-500'>Follow your progress from application to interview.</p>
            </div>
            <div className='flex items-end gap-2'>
                <div>
                    <p className='text-right text-[23px] font-semibold text-slate-950'>4</p>
                    <p className='text-[11px] text-slate-400'>applications</p>
                </div>
                <div>
                    <p className='text-right text-[23px] font-semibold text-violet-600'>2</p>
                    <p className='text-[11px] text-slate-400'>active</p>
                </div>
            </div>
        </div>
        <div className='flex mt-7 items-center justify-between'>
            <div className='relative w-[360px]'>
                <Search size={15} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'/>
                <input type="text" value={search} onClick={(e) => setSearch(e.target.value)} className='h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-[12px] outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-2 focus:ring-violet-50'/>
            </div>
            <button className='flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-[12px] font-medium text-slate-600 transition hover:bg-slate-50'>
                Recently applied
                <ChevronDown size={14}/>
            </button>
        </div>
      </div>
     <div className="mt-6 flex items-center gap-7 border-b border-slate-200">

          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() =>
                setActiveTab(tab)
              }
              className={`relative pb-3 text-[12px] font-medium transition ${
                activeTab === tab
                  ? "text-violet-600"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab}

              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-violet-600" />
              )}
            </button>
          ))}

        </div>

        <div className='mt-5 space-y-3'>
           {filteredApplications.length > 0 ? (
            filteredApplications.map(
              (application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  statusStyle={getStatusStyle}
                />
              )
            )
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center">

              <BriefcaseBusiness
                size={24}
                className="mx-auto text-slate-300"
              />

              <p className="mt-3 text-sm font-medium text-slate-700">
                No applications found
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Try another search or category.
              </p>

            </div>
          )}
        </div>
    </div>
  )
}

export default ApplicationLayout
