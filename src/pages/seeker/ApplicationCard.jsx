import React, { useState } from "react";
import {
  ChevronRight,
  MapPin,
  FileText,
  Check,
  Circle,
} from "lucide-react";
import ApplicationDetails from "./ApplicationDetails";

const ApplicationCard = ({
  application,
  statusStyle,
}) => {
  const [detailModal, setDetailModal] = useState(false);
  const cardData = {
    companyName: application?.companyId?.name,
    jobTitle: application?.jobId?.title,
    company: application?.companyId,
    companyLogo: application?.companyId?.logo,
    location: application?.jobId?.location,
    employmentType: application?.jobId?.employmentType,
    status: application?.status,
    appliedDate: application?.createdAt,
    resumeFile: application?.resumeId?.resume.originalName,
    reviewDate: application?.reviewedAt,
    interviewDate: application?.interviewId?.scheduledAt,
    closedDate: application?.closedAt,
    shortlistedDate: application?.shortlistedAt,
    scheduledDate: application?.interviewId?.scheduledAt
  }
  console.log("Id", application._id);
  const FormateEmploymentType = (type) => {
      if(!type) return null;
      
      switch (type) {
        case "FULL_TIME":
          type = "Full Time"
          break;
        case "PART_TIME":
          type = "Part Time"
          break;  
        case "INTERNSHIP":
          type = "Internship"
          break;  
        case "CONTRACT":
          type = "Contract"
          break;  
        case "FREELANCE":
          type = "Freelance"
          break;
        default:
          type = "Full Time"
          break;
      }

      return type;
  }

  const FormateDate = (date) => {
    if (!date) return "Not available";

    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    }).format(new Date(date));
  }

  const FormateStatus = (status) => {
      if(!status) return null;

      switch (status) {
        case "applied":
          status = "Applied"
          break;
        case "screening":
          status = "Reviewing"
          break;
        case "shortlisted":
          status = "Shortlisting"
          break;
        case "interview_scheduled":
          status = "Interview"
          break;
        case "interview_completed":
          status = "Interview Completed"
          break;
        case "selected":
          status = "Hired"
          break;
        case "rejected":
          status = "Rejected"
          break;
        case "withdrawn":
          status = "Withdrawn"
          break;
        case "closed":
          status = "Closed"
          break;
        default:
          status = "Applied"
          break;
      }

      return status;
  }

  const stages = [
    { key: "applied", label: "Application submitted", date: cardData.appliedDate },
    { key: "screening", label: "Under review", date: cardData.reviewDate },
    { key: "shortlisted", label: "Shortlisted", date: cardData.shortlistedDate },
    { key: "interview_scheduled", label: "Interview", date: cardData.scheduledDate},
    { key: "closed", label: "Application decision", date: cardData.closedDate },
  ]

  const completedStages = new Set(["applied"]);

  if(cardData.reviewDate !== null) completedStages.add("screening");
  if(cardData.shortlistedDate !== null) completedStages.add("shortlisted");

  if(["interview_scheduled"].includes(cardData.status)) completedStages.add("interview_scheduled");

  if(cardData.closedDate || ["selected", "rejected", "withdrawn", "closed"].includes(cardData.status)) completedStages.add("closed")

  const locationText = Array.isArray(cardData.location) ? cardData.location.map((item) => typeof item === "string" ? item : [item?.city, item?.state, item?.country].filter(Boolean).join(", ")).filter(Boolean).join(" · ") : (
    typeof cardData.location === "string" ? cardData.location : [cardData.location?.city, cardData.location?.state, cardData.location?.country].filter(Boolean).join(", ")
  );
  return (
    <>
    <div className="rounded-xl border border-slate-200 bg-white px-5 py-5 transition duration-200 hover:border-slate-300 hover:shadow-[0_6px_25px_rgba(15,23,42,0.04)]">

      <div className="flex items-start justify-between">

        {/* Company + Job */}
        <div className="flex gap-3.5">

          {/* Company Logo */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-[13px] font-semibold text-slate-700">
            {cardData.companyName
              ?.charAt(0)
              ?.toUpperCase()}
          </div>

          <div className="min-w-0">

            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              {cardData.companyName}
            </p>

            <h2 className="mt-0.5 text-[15px] font-semibold tracking-[-0.015em] text-slate-900">
              {cardData.jobTitle}
            </h2>

            <div className="mt-1.5 flex items-center gap-3 text-[11px] text-slate-400">

              <span className="flex items-center gap-1">
                <MapPin size={12} />
                {locationText || "Agra, Up, India"}
              </span>

              <span>•</span>

              <span>
                {FormateEmploymentType(cardData.employmentType) || "Full Time"}
              </span>

            </div>

          </div>

        </div>


        {/* Status */}
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${statusStyle(cardData.status)}`}
        >
          {FormateStatus(cardData.status)}
        </span>

      </div>

      <div className="mt-7 px-2">

        <div className="relative flex items-start justify-between">

          {/* Connecting Line */}
          <div className="absolute left-[7px] right-[7px] top-[7px] h-px bg-slate-200" />

          {stages.map((stage) => (
            <div key={stage} className="relative z-10 flex w-[25%] flex-col">
              <div>
                {completedStages.forEach((item) => console.log(item)) ? (
                  <div className="flex h-[15px] w-[15px] items-center justify-center rounded-full bg-violet-600 ring-4 ring-white">
                    <Check size={9} strokeWidth={3} className="text-white"/>
                  </div>
                ) : (<Circle size={15} strokeWidth={1.5} className="fill-white text-slate-300"/>)}
              </div>
              <p className={`mt-2 text-[10px] font-medium ${completedStages ? "text-slate-700" : "text-slate-400"}`}>{stage.label}</p>
              {stage.date && (
                <p className="mt-0.5 text-[9px] text-slate-400">{FormateDate(stage.date)}</p>
              )}
            </div>
          ))}
        </div>

      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">

        <div className="flex items-center gap-5 text-[10px] text-slate-400">

          <span className="flex items-center gap-1.5">
            <FileText size={12} />
            {cardData.resumeFile}
          </span>

          <span>
            Applied {FormateDate(cardData.appliedDate)}
          </span>

        </div>


        <button
        onClick={() => setDetailModal(true)}
          type="button"
          className="flex items-center gap-1 text-[11px] font-medium text-violet-600 transition hover:text-violet-700"
        >
          View application

          <ChevronRight size={13} />
        </button>
      </div>
    </div>
    {detailModal && <ApplicationDetails application={application} onClose={() => setDetailModal(false)}/>}
    </>
  );
};



export default ApplicationCard;