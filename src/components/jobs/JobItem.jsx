import React, { useState } from "react";
import {
  Bookmark,
  BriefcaseBusiness,
  Clock3,
  MapPin,
  Flag
} from "lucide-react";
import { useJob, useReport } from "../../hooks/Hook";
import ReportModal from "../modal/reportModal";

function JobItem({job}) {

const {
  setSelectedJobs,
  handleGetUserJobById,
  getTimeAgo,
  FormatEnumValue,
  FormatLocation,
  formatSalary,
} = useJob();

const getCompanyLogo = (job) => {
  const company = job?.companyId || job?.company;
  const logo = company?.logo;

  if (typeof logo === "string") return logo;
  return logo?.url || company?.logoUrl || job?.companyLogo || "";
};

const getCompanyName = (job) => {
  const company = job?.companyId || job?.company;

  if (company && typeof company === "object") {
    return company.name || company.companyName || "Company";
  }

  return job?.companyName || "Company";
};

const companyName = getCompanyName(job);
const companyLogo = getCompanyLogo(job);

const {handleCreateReport} = useReport(); 

const [reportOpen, setReportOpen] = useState(false);

const handleViewJob = async () => {
  if (!job?._id) return;

  await handleGetUserJobById({ JobId: job._id });
  setSelectedJobs(job);
};

  return (
    <>
    <article
      className="
        group
        rounded-2xl
        border border-slate-200
        bg-white
        p-5
        shadow-sm
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:border-purple-200
        hover:shadow-md
      "
    >
      {/* Top Section */}
      <div className="flex gap-4">
        {/* Company Logo */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center
                overflow-hidden rounded-xl border border-slate-200
                bg-white text-lg font-bold text-violet-700">
  {companyLogo ? (
    <img
      src={companyLogo}
      alt={`${companyName} logo`}
      className="h-full w-full object-contain p-1"
      onError={(event) => {
        event.currentTarget.style.display = "none";
      }}
    />
  ) : (
    companyName.charAt(0).toUpperCase()
  )}
</div>

        {/* Job Information */}
        <div className="min-w-0 flex-1">
          {/* Job Title + Bookmark */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2
  className="
    truncate
    text-base
    font-semibold
    text-slate-900
    transition-colors
    group-hover:text-[#6D28D9]
  "
>
  {job?.title}
</h2>

<p className="mt-1 text-sm font-medium text-slate-600">
  {job?.companyId?.name || "Microsoft"}
</p>
            </div>

            {/* Bookmark */}
            <div className="flex shrink-0 items-center gap-1">
  {/* Save Job */}
  <button
    type="button"
    aria-label="Save job"
    title="Save job"
    className="rounded-lg p-2 text-slate-400 transition hover:bg-[#F0EDFF] hover:text-[#6D28D9]"
  >
    <Bookmark size={18} strokeWidth={1.8} />
  </button>

  {/* Report Job */}
<button
  type="button"
  aria-label="Report job"
  title="Report this job"
  onClick={() => setReportOpen(true)}
  className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-200"
>
  <Flag size={17} strokeWidth={1.8} />
</button>
</div>
            
          </div>

          {/* Job Meta */}
          <div
            className="
              mt-4
              flex
              flex-wrap
              gap-x-5
              gap-y-2
              text-sm
              text-slate-500
            "
          >
            {/* Location */}
            <span className="flex items-center gap-1.5">
              <MapPin size={15} />
              {FormatLocation(job?.location)}
            </span>

            {/* Job Type */}
            <span className="flex items-center gap-1.5">
              <BriefcaseBusiness size={15} />
              {FormatEnumValue(job.employmentType)}
            </span>

            {/* Work Mode */}
            <span>{FormatEnumValue(job.workSpaceType)}</span>

            {/* Experience */}
            <span>{FormatEnumValue(job.experienceLevel)}</span>
          </div>

          {/* Salary */}
          {job?.salary?.min && job?.salary?.max ? (
  <div className="mt-4">
    <span className="text-sm font-semibold text-slate-900">
      ₹{formatSalary(job.salary.min)} - ₹{formatSalary(job.salary.max)}
    </span>

    <span className="ml-1 text-xs text-slate-400">
      / year
    </span>
  </div>
) : (
  <div className="mt-4">
    <span className="text-sm font-semibold text-slate-900">
      Salary Not Disclosed
    </span>
  </div>
)}

          {/* Skills */}
          <div className="mt-4 flex flex-wrap gap-2">
            {job.skills.length > 0 ? job.skills.map((item, index) => <span key={index} className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{item}</span>) : <span className="text-slate-500 font-medium text-sm"> No Skills Required</span>}
          </div>

          {/* Bottom Section */}
          <div
            className="
              mt-5
              flex
              items-center
              justify-between
              gap-4
              border-t
              border-slate-200
              pt-4
            "
          >
            {/* Posted Time */}
            <span
              className="
                flex
                items-center
                gap-1.5
                text-xs
                text-slate-400
              "
            >
              <Clock3 size={14} />
              {`Posted ${getTimeAgo(job.createdAt)}`}
            </span>

            {/* View Job */}
            <button
            onClick={handleViewJob}
              type="button"
              className="
                shrink-0
                rounded-xl
                bg-[#6D28D9]
                px-4
                py-2
                text-sm
                font-semibold
                text-white
                transition-all
                hover:bg-[#5B21B6]
                hover:shadow-md
                hover:shadow-purple-200
              "
            >
              View Job
            </button>
          </div>
        </div>
      </div>
    </article>
<ReportModal
  isOpen={reportOpen}
  onClose={() => setReportOpen(false)}
  job={job}
  onSubmit={handleCreateReport}
/>
</>
  );
}

export default JobItem;