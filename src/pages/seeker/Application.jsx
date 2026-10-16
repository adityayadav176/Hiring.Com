import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  ChevronDown,
  BriefcaseBusiness,
} from "lucide-react";

import ApplicationCard from "./ApplicationCard";
import {useApplication} from "../../hooks/Hook"
const Applications = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  const {applications, handleGetMyApplications} = useApplication();
  console.log(applications);

  useEffect(() => {
    handleGetMyApplications();
  }, []);

  const tabs = [
    "All",
    "Active",
    "Interviews",
    "Offers",
    "Closed",
  ];

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const text = `
        ${application.companyId}
        ${application.jobId.jobTitle}
        ${application.jobId.location}
      `.toLowerCase();

      const matchesSearch = text.includes(
        search.toLowerCase()
      );

      let matchesTab = true;

      if (activeTab === "Active") {
        matchesTab = [
          "Pending",
          "Reviewing",
          "Shortlisted",
        ].includes(application.status);
      }

      if (activeTab === "Interviews") {
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
    });
  }, [search, activeTab]);

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

  return (
    <div className="min-h-full bg-[#f8f9fc] px-6 py-7">
      <div className="mx-auto max-w-[1160px]">


        <div className="flex items-end justify-between">

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-600">
              Career workspace
            </p>

            <h1 className="mt-2 text-[27px] font-semibold tracking-[-0.035em] text-slate-950">
              Your applications
            </h1>

            <p className="mt-1 text-[13px] text-slate-500">
              Follow your progress from application to interview.
            </p>
          </div>

          <div className="flex items-end gap-8">

            <div>
              <p className="text-right text-[23px] font-semibold text-slate-900">
                {applications.length}
              </p>

              <p className="text-[11px] text-slate-400">
                applications
              </p>
            </div>

            <div>
              <p className="text-right text-[23px] font-semibold text-violet-600">
                {
                  applications.filter(
                    (application) =>
                      [
                        "Pending",
                        "Reviewing",
                        "Shortlisted",
                      ].includes(application.status)
                  ).length
                }
              </p>

              <p className="text-[11px] text-slate-400">
                active
              </p>
            </div>

          </div>
        </div>


        
        <div className="mt-7 flex items-center justify-between">

          <div className="relative w-[360px]">

            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search applications..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-[12px] outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-2 focus:ring-violet-50"
            />

          </div>

          <button
            type="button"
            className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-[12px] font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Recently applied

            <ChevronDown size={14} />
          </button>

        </div>

        <div className="mt-6 flex items-center gap-7 border-b border-slate-200">

          {tabs.map((tab, index) => (
            <button
              key={index}
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

        <div className="mt-5 space-y-3">

          {filteredApplications.length > 0 ? (
            filteredApplications.map(
              (application) => (
                <ApplicationCard
                  key={application._id}
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
    </div>
  );
};

export default Applications;