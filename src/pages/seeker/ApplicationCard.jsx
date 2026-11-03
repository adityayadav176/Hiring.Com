import React, { useMemo, useState } from "react";
import {
  ChevronRight,
  MapPin,
  FileText,
  Check,
  Circle,
} from "lucide-react";
import ApplicationDetails from "./ApplicationDetails";

const STATUS_CONFIG = {
  applied: {
    label: "Applied",
    className: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  },
  screening: {
    label: "Reviewing",
    className: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  },
  shortlisted: {
    label: "Shortlisted",
    className: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
  },
  interview_scheduled: {
    label: "Interview",
    className: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
  },
  interview_completed: {
    label: "Interview Completed",
    className: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
  },
  selected: {
    label: "Hired",
    className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 ring-1 ring-red-200",
  },
  withdrawn: {
    label: "Withdrawn",
    className: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
  },
  closed: {
    label: "Closed",
    className: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
  },
};

const EMPLOYMENT_TYPES = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  INTERNSHIP: "Internship",
  CONTRACT: "Contract",
  FREELANCE: "Freelance",
};

const TERMINAL_STATUSES = [
  "selected",
  "rejected",
  "withdrawn",
  "closed",
];

const STAGES = [
  { key: "applied", label: "Application submitted" },
  { key: "screening", label: "Under review" },
  { key: "shortlisted", label: "Shortlisted" },
  { key: "interview_scheduled", label: "Interview" },
  { key: "closed", label: "Final decision" },
];

const formatDate = (date) => {
  if (!date) return null;

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return null;

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
};

const formatLocation = (location) => {
  if (!location) return "";

  if (typeof location === "string") return location;

  if (Array.isArray(location)) {
    return location
      .map((item) => {
        if (typeof item === "string") return item;

        return [item?.city, item?.state, item?.country]
          .filter(Boolean)
          .join(", ");
      })
      .filter(Boolean)
      .join(" · ");
  }

  if (typeof location !== "object") return "";

  return [location.city, location.state, location.country]
    .filter(Boolean)
    .join(", ");
};

const getStatusConfig = (status) =>
  STATUS_CONFIG[status] || {
    label: status || "Applied",
    className: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
  };

const getTimeline = (application) => {
  const status = application?.status || "applied";
  const isTerminal = TERMINAL_STATUSES.includes(status);

  const stages = STAGES.map((stage) => ({
    ...stage,
    date: null,
    completed: false,
    current: false,
  }));

  stages[0].date = application?.createdAt;
  stages[0].completed = true;

  stages[1].date = application?.reviewAt;
  stages[1].completed = Boolean(application?.reviewAt);

  stages[2].date = application?.shortlistedAt;
  stages[2].completed = Boolean(application?.shortlistedAt);

  stages[3].date = application?.interviewId?.scheduledAt;
  stages[3].completed =
    Boolean(application?.interviewId?.scheduledAt) ||
    status === "interview_completed" ||
    status === "selected";

  if (isTerminal) {
    stages[4].date =
      application?.closedAt || application?.updatedAt || null;
    stages[4].completed = true;
  }

  if (status === "applied") {
    stages[0].current = true;
  } else if (status === "screening") {
    stages[1].current = true;
  } else if (status === "shortlisted") {
    stages[2].current = true;
  } else if (
    status === "interview_scheduled" ||
    status === "interview_completed"
  ) {
    stages[3].current = true;
  } else if (isTerminal) {
    stages[4].current = true;
  }

  return stages;
};

const getProgressWidth = (timeline) => {
  let lastCompletedIndex = 0;

  for (let i = 1; i < timeline.length; i += 1) {
    if (!timeline[i].completed) break;
    lastCompletedIndex = i;
  }

  const completedIntervals = lastCompletedIndex;
  const totalIntervals = timeline.length - 1;

  return `${(completedIntervals / totalIntervals) * 80}%`;
};

const ApplicationCard = ({ application, statusStyle }) => {
  const [detailModal, setDetailModal] = useState(false);

  const cardData = useMemo(() => {
    const job = application?.jobId || {};
    const company = application?.companyId || {};
    const resume = application?.resumeId || {};

    return {
      companyName: company.name || "Company",
      jobTitle: job.title || "Job title unavailable",
      companyLogo: company.logo,
      location: job.location,
      employmentType: job.employmentType,
      status: application?.status || "applied",
      appliedDate: application?.createdAt,
      resumeFile:
        resume?.resume?.originalName ||
        resume?.originalName ||
        resume?.title ||
        "Resume unavailable",
    };
  }, [application]);

  const timeline = useMemo(
    () => getTimeline(application),
    [application]
  );

  const progressWidth = useMemo(
    () => getProgressWidth(timeline),
    [timeline]
  );

  const statusConfig = getStatusConfig(cardData.status);
  const locationText = formatLocation(cardData.location);

  const isNegative = ["rejected", "withdrawn"].includes(
    cardData.status
  );

  return (
    <>
      <article className="w-full min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-3.5 transition duration-200 hover:border-slate-300 hover:shadow-[0_6px_25px_rgba(15,23,42,0.04)] sm:p-5">
        {/* Company and job information */}
        <div className="flex min-w-0 flex-col gap-3 min-[420px]:flex-row min-[420px]:items-start min-[420px]:justify-between">
          <div className="flex min-w-0 flex-1 gap-2.5 sm:gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 sm:h-11 sm:w-11">
              {cardData.companyLogo ? (
                <img
                  src={cardData.companyLogo}
                  alt={`${cardData.companyName} logo`}
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                cardData.companyName.charAt(0).toUpperCase()
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-slate-400 sm:text-[11px]">
                {cardData.companyName}
              </p>

              <h2 className="mt-0.5 break-words text-sm font-semibold tracking-[-0.015em] text-slate-900 sm:text-[15px]">
                {cardData.jobTitle}
              </h2>

              <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[10px] text-slate-400 sm:gap-3 sm:text-[11px]">
                {locationText && (
                  <span className="flex min-w-0 items-start gap-1">
                    <MapPin size={12} className="mt-0.5 shrink-0" />
                    <span className="break-words">{locationText}</span>
                  </span>
                )}

                {cardData.employmentType && (
                  <span className="break-words">
                    {EMPLOYMENT_TYPES[cardData.employmentType] ||
                      cardData.employmentType}
                  </span>
                )}
              </div>
            </div>
          </div>

          <span
            className={`max-w-full self-start rounded-full px-2.5 py-1 text-[10px] font-medium ${
              statusStyle
                ? statusStyle(cardData.status)
                : statusConfig.className
            }`}
          >
            {statusConfig.label}
          </span>
        </div>

        {/* Application progress timeline */}
        <div className="mt-6 min-w-0 sm:mt-7">
          <div className="relative">
            {/* Uncompleted track */}
            <div className="absolute left-[10%] right-[10%] top-[7px] h-px bg-slate-200" />

            {/* Completed progress */}
            <div
              className="absolute left-[10%] top-[7px] h-px bg-violet-500 transition-[width] duration-500 ease-in-out"
              style={{
                width: progressWidth,
              }}
            />

            {/* Timeline stages */}
            <div className="relative grid grid-cols-5">
              {timeline.map((stage) => {
                const completed = stage.completed;
                const current = stage.current;
                const negative =
                  isNegative && stage.key === "closed";

                const dotClass = negative
                  ? "border-red-500 bg-red-500"
                  : completed
                    ? "border-violet-600 bg-violet-600"
                    : current
                      ? "border-indigo-500 bg-indigo-500"
                      : "border-slate-300 bg-white";

                const labelClass = negative
                  ? "text-red-600"
                  : completed || current
                    ? "text-slate-800"
                    : "text-slate-400";

                return (
                  <div
                    key={stage.key}
                    className="flex min-w-0 flex-col items-center"
                  >
                    <div
                      className={`relative z-10 flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full border-2 ring-4 ring-white ${dotClass}`}
                    >
                      {completed && !negative ? (
                        <Check
                          size={9}
                          strokeWidth={3}
                          className="text-white"
                        />
                      ) : negative ? (
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      ) : current ? (
                        <Circle
                          size={7}
                          strokeWidth={3}
                          className="fill-white text-white"
                        />
                      ) : null}
                    </div>

                    <div className="mt-2 w-full min-w-0 px-0.5 text-center sm:px-1">
                      <p
                        className={`break-words text-[8px] font-medium leading-tight min-[380px]:text-[9px] sm:text-[10px] ${labelClass}`}
                      >
                        {stage.label}
                      </p>

                      {stage.date && (
                        <p className="mt-1 break-words text-[8px] leading-tight text-slate-400 min-[380px]:text-[9px]">
                          {formatDate(stage.date)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Resume and application date */}
        <div className="mt-5 flex min-w-0 flex-col gap-3 border-t border-slate-100 pt-3.5 sm:mt-6 sm:flex-row sm:items-center sm:justify-between sm:pt-4">
          <div className="flex min-w-0 flex-col gap-2 text-[10px] text-slate-400 min-[420px]:flex-row min-[420px]:flex-wrap min-[420px]:items-center min-[420px]:gap-x-5 sm:text-[11px]">
            <span className="flex min-w-0 items-center gap-1.5">
              <FileText size={12} className="shrink-0" />
              <span className="min-w-0 truncate">
                {cardData.resumeFile}
              </span>
            </span>

            <span className="break-words">
              Applied{" "}
              {formatDate(cardData.appliedDate) || "date unavailable"}
            </span>
          </div>

          <button
            onClick={() => setDetailModal(true)}
            type="button"
            className="flex min-h-9 w-full shrink-0 items-center justify-center gap-1 rounded-lg border border-violet-100 bg-violet-50/50 px-3 text-[11px] font-medium text-violet-600 transition hover:border-violet-200 hover:bg-violet-50 min-[420px]:w-auto min-[420px]:self-start sm:self-auto"
          >
            View application
            <ChevronRight size={13} />
          </button>
        </div>
      </article>

      {/* Application details modal */}
      {detailModal && (
        <ApplicationDetails
          application={application}
          onClose={() => setDetailModal(false)}
        />
      )}
    </>
  );
};

export default ApplicationCard;