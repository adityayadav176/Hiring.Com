import React from "react";
import {
  Bookmark,
  BriefcaseBusiness,
  Clock3,
  MapPin,
} from "lucide-react";
import { useJob } from "../../hooks/Hook";

function JobItem({job}) {
  const getTimeAgo = (date) => {
  const now = new Date();
  const created = new Date(date);

  const seconds = Math.floor((now - created) / 1000);

  if (seconds < 60) {
    return "just now";
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 30) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  const months = Math.floor(days / 30);

  if (months < 12) {
    return `${months} month${months > 1 ? "s" : ""} ago`;
  }

  const years = Math.floor(months / 12);

  return `${years} year${years > 1 ? "s" : ""} ago`;
};

const FormatEnumValue = (value) => {
  if(!value) {
    return;
  }
  return value
  .toLowerCase()
  .split("_")
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ");
}

const FormatLocation = (location) => {
  if(!location) return "Location Not Specified";

  const {city, state, country} = location;

  return [city, state, country].filter(Boolean).join(", ") || "Location Not Specified"
}

const {setSelectedJobs, selectedJobs} = useJob();
  return (
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
        <div
          className="
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-[#F0EDFF]
            text-lg
            font-bold
            text-[#6D28D9]
          "
        >
        {job?.companyId?.logo ? 
            <img src={job?.companyId.logo} alt={job?.companyId?.name || "Company"} className="h-full w-full rounded-xl object-cover" />
        : job?.companyId?.name?.charAt(0).toUpperCase() || "A"}
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
            <button
              type="button"
              aria-label="Save job"
              className="
                shrink-0
                rounded-xl
                p-2
                text-slate-400
                transition-all
                hover:bg-[#F0EDFF]
                hover:text-[#6D28D9]
              "
            >
              <Bookmark size={19} strokeWidth={1.8} />
            </button>
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
          <div className="mt-4">
            <span className="text-sm font-semibold text-slate-900">
              {job?.salary?.min !== undefined && job?.salary?.max !== undefined ? `₹${job.salary.min.toLocaleString()} - ₹${job.salary.max.toLocaleString()}` : "Salary Not Specified"}
            </span>

            <span className="ml-1 text-xs text-slate-400">
              / year
            </span>
          </div>

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
            onClick={() => setSelectedJobs(job)}
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
  );
}

export default JobItem;