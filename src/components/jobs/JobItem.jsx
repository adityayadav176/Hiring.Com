import React, { useState } from "react";
import {
  Bookmark,
  BriefcaseBusiness,
  Clock3,
  MapPin,
  Flag,
  Eye,
  Users,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

import { useJob, useReport } from "../../hooks/Hook";
import ReportModal from "../modal/reportModal";

function JobItem({ job }) {
  const {
    setSelectedJobs,
    handleGetUserJobById,
    getTimeAgo,
    FormatEnumValue,
    FormatLocation,
    formatSalary,
  } = useJob();

  const { handleCreateReport } = useReport();

  const [reportOpen, setReportOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const company = job?.companyId || job?.company;

  const companyName =
    typeof company === "object"
      ? company?.name || company?.companyName || "Company"
      : job?.companyName || "Company";

  const companyLogo =
    typeof company?.logo === "string"
      ? company.logo
      : company?.logo?.url ||
        company?.logoUrl ||
        job?.companyLogo ||
        "";

  const views = Number(job?.views ?? 0);
  const applicants = Number(job?.applicantsCount ?? 0);

  const handleViewJob = async () => {
    if (!job?._id) return;

    await handleGetUserJobById({ JobId: job._id });
    setSelectedJobs(job);
  };

  return (
    <>
      <article className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-100/50">

        {/* Top accent */}
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-violet-600 via-purple-500 to-indigo-500 opacity-0 transition-opacity group-hover:opacity-100" />

        <div className="p-3.5 sm:p-4">

          {/* Top: Job type and stats */}
          <div className="mb-3 flex items-center justify-between gap-2">

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-md bg-violet-50 px-2 py-1 text-[11px] font-semibold text-violet-700">
                {FormatEnumValue(job?.employmentType)}
              </span>

              <span className="flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                <CheckCircle2 size={12} />
                Active
              </span>
            </div>

            <div className="flex shrink-0 items-center gap-2">

              <span
                title="Total job views"
                className="flex items-center gap-1 text-xs text-slate-500"
              >
                <Eye size={14} className="text-violet-500" />
                {views.toLocaleString("en-IN")}
              </span>

              <span
                title="Total applicants"
                className="flex items-center gap-1 text-xs text-slate-500"
              >
                <Users size={14} className="text-indigo-500" />
                {applicants.toLocaleString("en-IN")}
              </span>

            </div>
          </div>

          {/* Job Header */}
          <div className="flex items-start gap-3">

            {/* Company Logo */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white text-lg font-bold text-violet-700">
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

            {/* Job Title */}
            <div className="min-w-0 flex-1">

              <h2 className="line-clamp-2 text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-violet-700">
                {job?.title || "Untitled Position"}
              </h2>

              <p className="mt-0.5 truncate text-xs font-medium text-slate-500">
                {companyName}
              </p>

              <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
                <Clock3 size={12} />
                Posted {getTimeAgo(job?.createdAt)}
              </div>

            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-0.5">

              <button
                type="button"
                title={saved ? "Remove bookmark" : "Save job"}
                aria-label={saved ? "Remove bookmark" : "Save job"}
                onClick={() => setSaved((previous) => !previous)}
                className={`rounded-lg p-2 transition ${
                  saved
                    ? "bg-violet-100 text-violet-700"
                    : "text-slate-400 hover:bg-violet-50 hover:text-violet-700"
                }`}
              >
                <Bookmark
                  size={17}
                  fill={saved ? "currentColor" : "none"}
                />
              </button>

              <button
                type="button"
                title="Report job"
                aria-label="Report job"
                onClick={() => setReportOpen(true)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
              >
                <Flag size={16} />
              </button>

            </div>
          </div>

          {/* Job Details */}
          <div className="mt-3 flex flex-wrap gap-1.5">

            <span className="flex items-center gap-1 rounded-md border border-slate-100 bg-slate-50 px-2 py-1.5 text-[11px] font-medium text-slate-600">
              <MapPin size={12} className="text-violet-500" />
              {FormatLocation(job?.location)}
            </span>

            <span className="flex items-center gap-1 rounded-md border border-slate-100 bg-slate-50 px-2 py-1.5 text-[11px] font-medium text-slate-600">
              <BriefcaseBusiness size={12} className="text-violet-500" />
              {FormatEnumValue(job?.workSpaceType)}
            </span>

            <span className="rounded-md border border-slate-100 bg-slate-50 px-2 py-1.5 text-[11px] font-medium text-slate-600">
              {FormatEnumValue(job?.experienceLevel)}
            </span>

          </div>

          {/* Salary */}
          <div className="mt-3 rounded-lg border border-violet-100 bg-gradient-to-r from-violet-50/80 to-indigo-50/50 px-3 py-2">

            <p className="text-[10px] font-medium text-slate-500">
              Annual Salary
            </p>

            <p className="mt-0.5 text-base font-bold text-violet-700">
              {job?.salary?.min != null && job?.salary?.max != null
                ? `₹${formatSalary(job.salary.min)} - ₹${formatSalary(job.salary.max)}`
                : "Salary Not Disclosed"}
            </p>

          </div>

          {/* Skills */}
          <div className="mt-3">

            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Required Skills
            </p>

            <div className="flex flex-wrap gap-1.5">

              {job?.skills?.length > 0 ? (
                job.skills.slice(0, 4).map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-600 transition-colors hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">
                  No specific skills listed
                </span>
              )}

              {job?.skills?.length > 4 && (
                <span className="rounded-md bg-violet-50 px-2 py-1 text-[11px] font-semibold text-violet-600">
                  +{job.skills.length - 4} more
                </span>
              )}

            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">

            <div className="min-w-0">
              <p className="text-[10px] text-slate-400">
                Hiring opportunity
              </p>

              <p className="truncate text-xs font-semibold text-slate-700">
                {companyName}
              </p>
            </div>

            <button
              type="button"
              onClick={handleViewJob}
              className="flex shrink-0 items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-purple-700 px-3.5 py-2 text-xs font-semibold text-white shadow-sm shadow-violet-200 transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-violet-300"
            >
              View Job

              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </button>

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