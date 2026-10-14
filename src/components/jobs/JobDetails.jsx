import {
  Bookmark,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  DollarSign,
  MapPin,
  Send,
  Users,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useHome, useJob, useResume, useTitle } from "../../hooks/Hook";
import ApplyJob from "../applications/ApplyJob";
import ApplyForJob from "../applications/ApplyForJob";

function JobDetails({ job }) {
  const {
    setSelectedJobs,
    getTimeAgo,
    FormatEnumValue,
    FormatLocation,
    formatDeadline,
    formatApplicants,
    formatSalary,
  } = useJob();

  const [showApplyModal, setShowApplyModal] = useState(false);

  const { setTitle } = useTitle();
  const { setActivePage } = useHome();
  const { resumes, handleGetAllResumes } = useResume();

   useEffect(() => {
      handleGetAllResumes();
    }, [])

  const location = FormatLocation
    ? FormatLocation(job?.location)
    : [
        job?.location?.city,
        job?.location?.state,
        job?.location?.country,
      ]
        .filter(Boolean)
        .join(", ") || "Location not specified";

  const employmentType = FormatEnumValue
    ? FormatEnumValue(job?.employmentType)
    : job?.employmentType || "Not specified";

  const workspaceType = FormatEnumValue
    ? FormatEnumValue(job?.workSpaceType)
    : job?.workSpaceType || "Not specified";

  const experienceLevel = FormatEnumValue
    ? FormatEnumValue(job?.experienceLevel)
    : job?.experienceLevel || "Not specified";

  const salary =
    job?.salary?.min != null &&
    job?.salary?.max != null &&
    (job.salary.min > 0 || job.salary.max > 0)
      ? `₹${formatSalary ? formatSalary(job.salary.min) : job.salary.min.toLocaleString("en-IN")} - ₹${formatSalary ? formatSalary(job.salary.max) : job.salary.max.toLocaleString("en-IN")}`
      : "Salary Not Disclosed";

  const isNegotiable =
    job?.salary?.isNegotiable ?? job?.salary?.isNagotiable;

  const isOpen =
    job?.status === "OPEN" &&
    !job?.isDeleted &&
    !job?.isBlocked &&
    (job?.openings ?? 0) > 0 &&
    (!job?.applicationDeadline ||
      new Date(job.applicationDeadline).getTime() >= Date.now());

  const responsibilities = Array.isArray(job?.responsibilities)
    ? job.responsibilities
    : [];

  const requirements = Array.isArray(job?.requirements)
    ? job.requirements
    : [];

  const skills = Array.isArray(job?.skills) ? job.skills : [];

  const posted = getTimeAgo
    ? getTimeAgo(job?.createdAt)
    : "Not available";

  const deadline = formatDeadline
    ? formatDeadline(job?.applicationDeadline)
    : job?.applicationDeadline
      ? new Date(job.applicationDeadline).toLocaleDateString("en-IN")
      : "No deadline specified";

  const applicants =
    formatApplicants && job?.applicantsCount != null
      ? formatApplicants(job.applicantsCount)
      : job?.applicantsCount ?? 0;

  return (
    <>
    <div className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-[2px]">
      <aside className="fixed right-0 top-0 z-50 flex h-screen w-[650px] max-w-[92vw] flex-col overflow-hidden bg-white shadow-2xl">
        <div className="shrink-0 border-b border-slate-200 bg-white px-5 py-5 sm:px-7">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#F0EDFF] text-xl font-bold text-[#6D28D9]">
                {(job?.companyId?.name || "C").charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-500">
                  {job?.companyId?.name || "Company not specified"}
                </p>
                <h1 className="mt-1 break-words text-xl font-bold tracking-tight text-slate-900">
                  {job?.title || "Untitled position"}
                </h1>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                aria-label="Bookmark job"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-violet-200 hover:bg-violet-50 hover:text-[#6D28D9]"
              >
                <Bookmark size={18} />
              </button>

              <button
                type="button"
                aria-label="Close job details"
                onClick={() => setSelectedJobs(null)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-violet-200 hover:bg-violet-50 hover:text-[#6D28D9]"
              >
                <X size={19} />
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
              {employmentType}
            </span>

            <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
              {workspaceType}
            </span>

            <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
              {experienceLevel}
            </span>

            <span
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold ${
                isOpen
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              <CheckCircle2 size={13} />
              {isOpen ? "Accepting applications" : "Not accepting applications"}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-5 py-6 sm:px-7">
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">
                Job Overview
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin size={17} />
                    <span className="text-xs font-medium">Location</span>
                  </div>
                  <p className="mt-2 break-words text-sm font-semibold text-slate-800">
                    {location || "Location not specified"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <BriefcaseBusiness size={17} />
                    <span className="text-xs font-medium">Employment</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-800">
                    {employmentType}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <DollarSign size={17} />
                    <span className="text-xs font-medium">Salary</span>
                  </div>
                  <p className="mt-2 break-words text-sm font-semibold text-slate-800">
                    {salary}
                  </p>
                  {isNegotiable && (
                    <p className="mt-1 text-xs text-emerald-600">
                      Negotiable
                    </p>
                  )}
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Users size={17} />
                    <span className="text-xs font-medium">Experience</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-800">
                    {experienceLevel}
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-8">
              <h2 className="text-base font-bold text-slate-900">
                About this role
              </h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                {job?.description || "No job description provided."}
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-base font-bold text-slate-900">
                Responsibilities
              </h2>
              <ul className="mt-4 space-y-3">
                {responsibilities.length > 0 ? (
                  responsibilities.map((item, index) => (
                    <li
                      key={`${index}-${item}`}
                      className="flex gap-3 text-sm leading-6 text-slate-600"
                    >
                      <CheckCircle2
                        size={17}
                        className="mt-1 shrink-0 text-[#6D28D9]"
                      />
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-slate-500">
                    No responsibilities specified.
                  </li>
                )}
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-base font-bold text-slate-900">
                Requirements
              </h2>
              <ul className="mt-4 space-y-3">
                {requirements.length > 0 ? (
                  requirements.map((item, index) => (
                    <li
                      key={`${index}-${item}`}
                      className="flex gap-3 text-sm leading-6 text-slate-600"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6D28D9]" />
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-slate-500">
                    No requirements specified.
                  </li>
                )}
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-base font-bold text-slate-900">Skills</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {skills.length > 0 ? (
                  skills.map((item, index) => (
                    <span
                      key={`${index}-${item}`}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600"
                    >
                      {item}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">
                    No specific skills listed.
                  </p>
                )}
              </div>
            </section>

            <section className="mt-8">
              <h2 className="text-base font-bold text-slate-900">
                Additional Information
              </h2>

              <div className="mt-4">
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-3">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Building2 size={16} />
                    <span className="text-sm">Openings</span>
                  </div>
                  <span className="text-right text-sm font-semibold text-slate-800">
                    {job?.openings ?? 0}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-3">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Users size={16} />
                    <span className="text-sm">Applicants</span>
                  </div>
                  <span className="text-right text-sm font-semibold text-slate-800">
                    {applicants}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-3">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Clock3 size={16} />
                    <span className="text-sm">Posted</span>
                  </div>
                  <span className="text-right text-sm font-semibold text-slate-800">
                    {posted}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-3">
                  <div className="flex items-center gap-2 text-slate-500">
                    <CalendarDays size={16} />
                    <span className="text-sm">Application deadline</span>
                  </div>
                  <span className="text-right text-sm font-semibold text-slate-800">
                    {deadline}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-3">
                  <div className="flex items-center gap-2 text-slate-500">
                    <BriefcaseBusiness size={16} />
                    <span className="text-sm">Category</span>
                  </div>
                  <span className="text-right text-sm font-semibold text-slate-800">
                    {job?.category || "Not specified"}
                  </span>
                </div>
              </div>
            </section>

            <div className="h-8" />
          </div>
        </div>

        <div className="shrink-0 border-t border-slate-200 bg-white px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            
<button
onClick={() => {setShowApplyModal(true)}}
  type="button"
  disabled={!isOpen}
  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#6D28D9] px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-violet-200 transition-all hover:bg-[#5B21B6] hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
>
  <Send size={18} />
  {isOpen ? "Apply Now" : "Applications Closed"}
</button>


            <button
              type="button"
              aria-label="Bookmark job"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-violet-200 hover:bg-violet-50 hover:text-[#6D28D9]"
            >
              <Bookmark size={18} />
            </button>
          </div>
        </div>
        
      </aside>
               
{showApplyModal && (
  <ApplyJob
    job={job}
    onClose={() => setShowApplyModal(false)}
    onSuccess={() => {
      setShowApplyModal(false);
      console.log("Application submitted successfully");
    }}
    resumes={resumes}
  />
)}
    </div>
  </>
  );
}

export default JobDetails;