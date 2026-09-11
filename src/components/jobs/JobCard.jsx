import React from "react";
import {
  Bookmark,
  BriefcaseBusiness,
  Clock3,
  MapPin,
} from "lucide-react";

const JobCard = ({ job }) => {
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
            flex h-12 w-12 shrink-0
            items-center justify-center
            rounded-xl
            bg-[#F0EDFF]
            text-lg font-bold
            text-[#6D28D9]
          "
        >
          {job.logo}
        </div>

        {/* Job Information */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                className="
                  text-base font-semibold
                  text-slate-900
                  transition-colors
                  group-hover:text-[#6D28D9]
                "
              >
                {job.title}
              </h2>

              <p className="mt-1 text-sm font-medium text-slate-600">
                {job.company}
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
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <MapPin size={15} />
              {job.location}
            </span>

            <span className="flex items-center gap-1.5">
              <BriefcaseBusiness size={15} />
              {job.type}
            </span>

            <span>{job.mode}</span>

            <span>{job.experience}</span>
          </div>

          {/* Salary */}
          <div className="mt-4">
            <span className="text-sm font-semibold text-slate-900">
              {job.salary}
            </span>

            <span className="ml-1 text-xs text-slate-400">
              / year
            </span>
          </div>

          {/* Skills */}
          <div className="mt-4 flex flex-wrap gap-2">
            {job.skills.map((skill) => (
              <span
                key={skill}
                className="
                  rounded-lg
                  bg-slate-100
                  px-2.5 py-1
                  text-xs font-medium
                  text-slate-600
                "
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Bottom */}
          <div
            className="
              mt-5
              flex items-center justify-between
              border-t border-slate-100
              pt-4
            "
          >
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <Clock3 size={14} />
              Posted {job.posted}
            </span>

            <button
              type="button"
              className="
                rounded-xl
                bg-[#6D28D9]
                px-4 py-2
                text-sm font-semibold
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
};

export default JobCard;