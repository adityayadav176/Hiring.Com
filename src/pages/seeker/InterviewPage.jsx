
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Building2,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Code2,
  ExternalLink,
  FileText,
  Globe2,
  MapPin,
  MessageSquare,
  RefreshCw,
  Search,
  Sparkles,
  Star,
  UserRound,
  Users,
  Video,
  X,
  XCircle,
} from "lucide-react";

import { useInterview } from "../../hooks/Hook";

// --------------------------------------------------
// CONSTANTS: presentation only, not interview data
// --------------------------------------------------

const TABS = ["Upcoming", "All", "Completed", "Cancelled"];

const TERMINAL_STATUSES = new Set([
  "Completed",
  "Cancelled",
  "Rejected",
  "No Show",
]);

const STATUS_STYLES = {
  Scheduled: "bg-[#EEF0FF] text-[#5B4FE9]",
  Accepted: "bg-emerald-50 text-emerald-700",
  Rejected: "bg-red-50 text-red-600",
  Completed: "bg-emerald-50 text-emerald-700",
  Cancelled: "bg-red-50 text-red-600",
  "Reschedule Requested": "bg-amber-50 text-amber-700",
  Rescheduled: "bg-sky-50 text-sky-700",
  "No Show": "bg-slate-100 text-slate-600",
};

// --------------------------------------------------
// DATA HELPERS
// --------------------------------------------------

function getText(value) {
  if (typeof value === "string") return value.trim();

  if (typeof value === "number") return String(value);

  return "";
}

function getId(value) {
  if (!value) return "";

  if (typeof value === "string") return value;

  return String(value._id || value.id || "");
}

function getDisplayName(person) {
  if (!person || typeof person !== "object") return "";

  const firstLast = [person.firstName, person.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    getText(person.name) ||
    getText(person.fullName) ||
    firstLast ||
    getText(person.username) ||
    getText(person.email)
  );
}

function getCompanyName(interview) {
  const company = interview?.company;

  if (company && typeof company === "object") {
    return getText(company.name);
  }

  return "";
}

function getJobTitle(interview) {
  const job = interview?.job;

  if (job && typeof job === "object") {
    return getText(job.title);
  }

  return "";
}

function getCompanyLogo(interview) {
  const company = interview?.company;

  if (!company || typeof company !== "object") return "";

  return (
    getText(company.logo?.url) ||
    getText(company.logoUrl) ||
    ""
  );
}

function getInitials(value) {
  const name = getText(value);

  if (!name) return "?";

  const words = name.split(/\s+/).filter(Boolean);

  if (words.length > 1) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  return name.slice(0, 2).toUpperCase();
}

function getTimezone(interview) {
  return getText(interview?.timezone) || "Asia/Kolkata";
}

function getScheduledDate(interview) {
  const rawDate = interview?.scheduledAt || interview?.date;

  if (!rawDate) return null;

  const parsed = new Date(rawDate);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getInterviewTimestamp(interview) {
  const scheduledDate = getScheduledDate(interview);

  if (!scheduledDate) return null;

  // scheduledAt is the preferred source because it includes
  // the scheduled instant, unlike separate date/time fields.
  if (interview?.scheduledAt) {
    return scheduledDate.getTime();
  }

  const time = getText(interview?.time);

  // Support records that only have date + time.
  if (time) {
    const match = time.match(
      /^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i
    );

    if (match) {
      let hours = Number(match[1]);
      const minutes = Number(match[2]);
      const meridiem = match[3]?.toUpperCase();

      if (meridiem === "PM" && hours < 12) hours += 12;
      if (meridiem === "AM" && hours === 12) hours = 0;

      if (
        hours >= 0 &&
        hours <= 23 &&
        minutes >= 0 &&
        minutes <= 59
      ) {
        const result = new Date(scheduledDate);

        result.setHours(hours, minutes, 0, 0);

        return result.getTime();
      }
    }
  }

  return scheduledDate.getTime();
}

function formatDate(interview) {
  const date = getScheduledDate(interview);

  if (!date) return "Date not provided";

  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: getTimezone(interview),
    }).format(date);
  } catch {
    return date.toLocaleDateString("en-IN");
  }
}

function formatTime(interview) {
  const date = getScheduledDate(interview);

  if (!date) {
    return getText(interview?.time) || "Time not provided";
  }

  // If the API provides scheduledAt, format the actual instant
  // in the interview's configured timezone.
  if (interview?.scheduledAt) {
    try {
      return new Intl.DateTimeFormat("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: getTimezone(interview),
      }).format(date);
    } catch {
      return date.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
      });
    }
  }

  return getText(interview?.time) || "Time not provided";
}

function formatDuration(minutes) {
  const value = Number(minutes);

  if (!Number.isFinite(value) || value <= 0) {
    return "Duration not provided";
  }

  const hours = Math.floor(value / 60);
  const remainingMinutes = value % 60;

  if (hours && remainingMinutes) {
    return `${hours} hr ${remainingMinutes} min`;
  }

  if (hours) return `${hours} hr`;

  return `${remainingMinutes} min`;
}

function formatDateTime(value, timezone = "Asia/Kolkata") {
  if (!value) return "Not provided";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not provided";

  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: timezone,
    }).format(date);
  } catch {
    return date.toLocaleString("en-IN");
  }
}

function formatEnum(value) {
  if (!value) return "";

  return String(value)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getJobLocation(interview) {
  const location = interview?.job?.location;

  if (!location || typeof location !== "object") return "";

  return [
    location.city,
    location.state,
    location.country,
  ]
    .filter(Boolean)
    .join(", ");
}

function getCompanyHeadquarters(interview) {
  const headquarters = interview?.company?.headquarters;

  if (!headquarters || typeof headquarters !== "object") return "";

  return [
    headquarters.city,
    headquarters.state,
    headquarters.country,
  ]
    .filter(Boolean)
    .join(", ");
}

function getInterviewLocation(interview) {
  const type = getText(interview?.interviewType);
  const location = getText(interview?.location);

  if (location) return location;

  if (type === "Online") return "Online interview";
  if (type === "Phone") return "Phone interview";

  return (
    getJobLocation(interview) ||
    getCompanyHeadquarters(interview) ||
    "Location not provided"
  );
}

function getApplicationReference(interview) {
  const application = interview?.application;

  if (!application || typeof application !== "object") {
    return getId(application) || "";
  }

  return (
    getText(application.applicationNumber) ||
    getText(application.reference) ||
    getId(application)
  );
}

function getStatusIcon(status) {
  if (status === "Completed" || status === "Accepted") {
    return <CheckCircle2 size={13} />;
  }

  if (
    status === "Cancelled" ||
    status === "Rejected" ||
    status === "No Show"
  ) {
    return <XCircle size={13} />;
  }

  if (status === "Reschedule Requested") {
    return <RefreshCw size={13} />;
  }

  return <CalendarClock size={13} />;
}

function isUpcoming(interview, now = Date.now()) {
  const timestamp = getInterviewTimestamp(interview);

  return (
    timestamp !== null &&
    timestamp >= now &&
    !TERMINAL_STATUSES.has(interview?.status)
  );
}

// --------------------------------------------------
// REUSABLE UI
// --------------------------------------------------

function StatusBadge({ status }) {
  const label = getText(status) || "Status unavailable";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        STATUS_STYLES[label] || "bg-gray-100 text-gray-600"
      }`}
    >
      {getStatusIcon(label)}
      {label}
    </span>
  );
}

function CompanyLogo({ interview, size = "md" }) {
  const [imageFailed, setImageFailed] = useState(false);

  const companyName = getCompanyName(interview);
  const logo = getCompanyLogo(interview);

  const sizeClasses = {
    sm: "h-10 w-10 rounded-xl text-sm",
    md: "h-12 w-12 rounded-2xl text-base",
    lg: "h-16 w-16 rounded-2xl text-xl",
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;

  useEffect(() => {
    setImageFailed(false);
  }, [logo]);

  return (
    <div
      className={`${sizeClass} flex shrink-0 items-center justify-center overflow-hidden bg-[#FFF7E6] font-bold text-[#D97706]`}
      title={companyName || "Company"}
    >
      {logo && !imageFailed ? (
        <img
          src={logo}
          alt={companyName ? `${companyName} logo` : "Company logo"}
          className="h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        getInitials(companyName)
      )}
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="min-w-0 rounded-xl bg-[#F8F8FC] p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[#9396A7]">
        {label}
      </p>

      <div className="mt-1.5 flex min-w-0 items-start gap-1.5 text-xs font-semibold text-[#303145]">
        <Icon size={14} className="mt-0.5 shrink-0 text-[#6D28D9]" />
        <span className="break-words">{value || "Not provided"}</span>
      </div>
    </div>
  );
}

function DetailRow({ label, children }) {
  return (
    <div className="flex flex-col gap-1 border-b border-[#F0F0F4] py-3 last:border-b-0 sm:flex-row sm:justify-between sm:gap-5">
      <span className="shrink-0 text-xs text-[#858899]">{label}</span>
      <span className="break-words text-left text-xs font-semibold text-[#292A3D] sm:max-w-[65%] sm:text-right">
        {children || "Not provided"}
      </span>
    </div>
  );
}

function InterviewCard({ interview, onView }) {
  const companyName = getCompanyName(interview);
  const jobTitle = getJobTitle(interview);
  const recruiterName = getDisplayName(interview?.recruiter);
  const location = getInterviewLocation(interview);

  return (
    <article className="group rounded-2xl border border-[#E8EAF2] bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D8D5FF] hover:shadow-[0_12px_35px_rgba(25,25,60,0.07)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <CompanyLogo interview={interview} />

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="break-words text-[15px] font-bold text-[#171827]">
                {jobTitle || "Job title unavailable"}
              </h3>

              <StatusBadge status={interview?.status} />
            </div>

            <p className="mt-1 text-sm font-medium text-[#626579]">
              {companyName || "Company not provided"}
            </p>
          </div>
        </div>

        <span
          className="shrink-0 rounded-lg bg-[#F8F8FC] p-2 text-[#8A8EA0]"
          title={getText(interview?.interviewType) || "Interview type"}
        >
          {interview?.interviewType === "Online" ? (
            <Video size={17} />
          ) : interview?.interviewType === "Phone" ? (
            <MessageSquare size={17} />
          ) : (
            <Building2 size={17} />
          )}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <InfoItem
          icon={CalendarDays}
          label="Date"
          value={formatDate(interview)}
        />

        <InfoItem
          icon={Clock3}
          label="Time"
          value={formatTime(interview)}
        />

        <InfoItem
          icon={Code2}
          label="Round"
          value={interview?.round ? `Round ${interview.round}` : ""}
        />

        <InfoItem
          icon={Clock3}
          label="Duration"
          value={formatDuration(interview?.duration)}
        />
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-[#F0F0F4] pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F0F0F8] text-[#6D28D9]">
            <UserRound size={16} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-[#303145]">
              {recruiterName || "Recruiter not provided"}
            </p>

            <p className="truncate text-[10px] text-[#9295A5]">
              {getText(interview?.recruiter?.email)}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onView(interview)}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#E3E2F7] px-3.5 py-2.5 text-xs font-bold text-[#5B4FE9] transition hover:border-[#6D28D9] hover:bg-[#F7F6FF]"
        >
          View details
          <ArrowUpRight size={14} />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-[#858899]">
        <span className="inline-flex items-center gap-1.5">
          <Globe2 size={13} />
          {formatEnum(interview?.interviewType) || "Type not provided"}
        </span>

        <span className="inline-flex items-center gap-1.5">
          <MapPin size={13} />
          {location}
        </span>
      </div>
    </article>
  );
}

// --------------------------------------------------
// DETAILS MODAL
// All displayed interview values come from API data.
// --------------------------------------------------

function DetailModal({ interview, onClose }) {
  useEffect(() => {
    if (!interview) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [interview, onClose]);

  if (!interview) return null;

  const companyName = getCompanyName(interview);
  const jobTitle = getJobTitle(interview);
  const recruiter = interview?.recruiter;
  const candidate = interview?.candidate;
  const feedback = interview?.feedback;

  const location = getInterviewLocation(interview);
  const timezone = getTimezone(interview);
  const applicationReference = getApplicationReference(interview);

  const hasFeedback =
    feedback?.rating != null ||
    Boolean(interview?.recommendation) ||
    Boolean(interview?.notes);

  const isOnline =
    interview?.interviewType === "Online";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Interview details"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#10101A]/45 p-3 backdrop-blur-[3px] sm:p-5"
    >
      <div className="max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-[24px] border border-white/50 bg-white shadow-[0_30px_100px_rgba(0,0,0,0.20)]">
        <div className="flex items-start justify-between gap-4 border-b border-[#ECECF2] px-5 py-5 sm:px-6">
          <div className="flex min-w-0 items-center gap-4">
            <CompanyLogo interview={interview} size="lg" />

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="break-words text-lg font-bold text-[#171827] sm:text-xl">
                  {jobTitle || "Interview details"}
                </h2>

                <StatusBadge status={interview?.status} />
              </div>

              <p className="mt-1 text-sm text-[#717487]">
                {companyName || "Company not provided"}
                {interview?.round
                  ? ` · Round ${interview.round}`
                  : ""}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close interview details"
            className="shrink-0 rounded-xl p-2 text-[#7B7E90] transition hover:bg-[#F5F5F8] hover:text-[#202132]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[calc(92vh-90px)] overflow-y-auto p-5 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <InfoItem
              icon={CalendarDays}
              label="Date"
              value={formatDate(interview)}
            />

            <InfoItem
              icon={Clock3}
              label="Time"
              value={formatTime(interview)}
            />

            <InfoItem
              icon={Clock3}
              label="Duration"
              value={formatDuration(interview?.duration)}
            />

            <InfoItem
              icon={Globe2}
              label="Interview type"
              value={formatEnum(interview?.interviewType)}
            />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="min-w-0 space-y-6">
              <section>
                <h3 className="text-sm font-bold text-[#202132]">
                  About this interview
                </h3>

                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-[#6E7182]">
                  {getText(interview?.description) ||
                    "No interview description has been provided."}
                </p>
              </section>

              <section>
                <h3 className="text-sm font-bold text-[#202132]">
                  Interviewer
                </h3>

                <div className="mt-3 flex items-center gap-3 rounded-2xl border border-[#ECECF2] p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F0EEFF] text-[#6D28D9]">
                    <UserRound size={19} />
                  </div>

                  <div className="min-w-0">
                    <p className="break-words text-sm font-bold text-[#292A3D]">
                      {getDisplayName(recruiter) ||
                        "Recruiter details unavailable"}
                    </p>

                    <p className="mt-0.5 break-words text-xs text-[#858899]">
                      {getText(recruiter?.email)}
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-bold text-[#202132]">
                  Candidate
                </h3>

                <div className="mt-3 flex items-center gap-3 rounded-2xl border border-[#ECECF2] p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F0EEFF] text-[#6D28D9]">
                    <UserRound size={19} />
                  </div>

                  <div className="min-w-0">
                    <p className="break-words text-sm font-bold text-[#292A3D]">
                      {getDisplayName(candidate) ||
                        "Candidate details unavailable"}
                    </p>

                    <p className="mt-0.5 break-words text-xs text-[#858899]">
                      {getText(candidate?.email)}
                    </p>
                  </div>
                </div>
              </section>

              {interview?.application && (
                <section>
                  <h3 className="text-sm font-bold text-[#202132]">
                    Application
                  </h3>

                  <div className="mt-3 rounded-2xl border border-[#ECECF2] p-4">
                    <DetailRow label="Application reference">
                      {applicationReference}
                    </DetailRow>

                    <DetailRow label="Application status">
                      {formatEnum(interview?.application?.status)}
                    </DetailRow>

                    <DetailRow label="Application created">
                      {formatDateTime(
                        interview?.application?.createdAt,
                        timezone
                      )}
                    </DetailRow>
                  </div>
                </section>
              )}

              {hasFeedback && (
                <section className="rounded-2xl bg-[#F8F7FF] p-4">
                  <h3 className="text-sm font-bold text-[#202132]">
                    Interview feedback
                  </h3>

                  {feedback?.rating != null && (
                    <div className="mt-3 flex items-center gap-2 text-sm font-bold text-amber-600">
                      <Star size={16} fill="currentColor" />
                      {feedback.rating} / 5
                    </div>
                  )}

                  {interview?.recommendation && (
                    <p className="mt-3 text-xs text-[#747789]">
                      Recommendation:{" "}
                      <span className="font-bold text-[#5B4FE9]">
                        {interview.recommendation}
                      </span>
                    </p>
                  )}

                  {interview?.notes && (
                    <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-[#626579]">
                      {interview.notes}
                    </p>
                  )}
                </section>
              )}

              {interview?.cancellationReason && (
                <section className="rounded-2xl bg-red-50 p-4">
                  <h3 className="text-sm font-bold text-red-700">
                    Cancellation reason
                  </h3>

                  <p className="mt-2 whitespace-pre-wrap break-words text-sm text-red-700">
                    {interview.cancellationReason}
                  </p>
                </section>
              )}

              {interview?.rescheduleReason && (
                <section className="rounded-2xl bg-amber-50 p-4">
                  <h3 className="text-sm font-bold text-amber-800">
                    Reschedule reason
                  </h3>

                  <p className="mt-2 whitespace-pre-wrap break-words text-sm text-amber-800">
                    {interview.rescheduleReason}
                  </p>
                </section>
              )}
            </div>

            <aside className="h-fit rounded-2xl border border-[#ECECF2] p-4">
              <p className="text-xs font-bold text-[#858899]">
                Interview information
              </p>

              <div className="mt-3">
                <DetailRow label="Status">
                  <StatusBadge status={interview?.status} />
                </DetailRow>

                <DetailRow label="Round">
                  {interview?.round}
                </DetailRow>

                <DetailRow label="Location">
                  {location}
                </DetailRow>

                <DetailRow label="Timezone">
                  {timezone}
                </DetailRow>

                <DetailRow label="Room ID">
                  {getText(interview?.interviewRoomId)}
                </DetailRow>

                <DetailRow label="Company">
                  {companyName}
                </DetailRow>

                <DetailRow label="Job">
                  {jobTitle}
                </DetailRow>

                <DetailRow label="Job location">
                  {getJobLocation(interview)}
                </DetailRow>

                <DetailRow label="Company headquarters">
                  {getCompanyHeadquarters(interview)}
                </DetailRow>

                <DetailRow label="Completed at">
                  {formatDateTime(interview?.completedAt, timezone)}
                </DetailRow>

                <DetailRow label="Created at">
                  {formatDateTime(interview?.createdAt, timezone)}
                </DetailRow>

                <DetailRow label="Last updated">
                  {formatDateTime(interview?.updatedAt, timezone)}
                </DetailRow>
              </div>

              {isOnline && interview?.interviewRoomId && (
                <p className="mt-4 rounded-xl bg-[#F8F7FF] p-3 text-xs leading-5 text-[#5B4FE9]">
                  An online room ID is available. Connect the Join
                  Interview action to your authenticated interview-room
                  route before enabling navigation.
                </p>
              )}

              <button
                type="button"
                onClick={() =>
                  window.print()
                }
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#E6E5EF] px-4 py-3 text-xs font-bold text-[#5B4FE9] transition hover:bg-[#F8F7FF]"
              >
                <FileText size={15} />
                Print details
              </button>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------
// MAIN PAGE
// --------------------------------------------------

export default function InterviewPage() {
  const {
    Interviews,
    handleGetMyInterviews,
  } = useInterview();

  const [activeTab, setActiveTab] = useState("Upcoming");
  const [search, setSearch] = useState("");
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );

  const interviews = useMemo(
    () => (Array.isArray(Interviews) ? Interviews : []),
    [Interviews]
  );

  const refreshInterviews = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      await handleGetMyInterviews();
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          requestError?.message ||
          "Unable to load interviews. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [handleGetMyInterviews]);

  useEffect(() => {
    refreshInterviews();
  }, [refreshInterviews, refreshKey]);

  const now = Date.now();

  const upcomingInterviews = useMemo(() => {
    return interviews
      .filter((item) => isUpcoming(item, now))
      .sort(
        (a, b) =>
          getInterviewTimestamp(a) - getInterviewTimestamp(b)
      );
  }, [interviews, now]);

  const nextInterview = upcomingInterviews[0] || null;

  const completedCount = interviews.filter(
    (item) => item?.status === "Completed"
  ).length;

  const actionRequiredCount = interviews.filter(
    (item) => item?.status === "Reschedule Requested"
  ).length;

  const filteredInterviews = useMemo(() => {
    let data = [...interviews];

    if (activeTab === "Upcoming") {
      data = data.filter((item) => isUpcoming(item));
    } else if (activeTab === "Completed") {
      data = data.filter((item) => item?.status === "Completed");
    } else if (activeTab === "Cancelled") {
      data = data.filter((item) => item?.status === "Cancelled");
    }

    const query = search.trim().toLowerCase();

    if (query) {
      data = data.filter((item) => {
        const searchableValues = [
          getCompanyName(item),
          getJobTitle(item),
          getDisplayName(item?.recruiter),
          getDisplayName(item?.candidate),
          item?.status,
          item?.interviewType,
          item?.location,
          item?.description,
          item?.round,
          item?.interviewRoomId,
          getJobLocation(item),
          getCompanyHeadquarters(item),
        ];

        return searchableValues.some((value) =>
          String(value || "").toLowerCase().includes(query)
        );
      });
    }

    return data.sort((a, b) => {
      const first = getInterviewTimestamp(a) ?? 0;
      const second = getInterviewTimestamp(b) ?? 0;

      return first - second;
    });
  }, [interviews, activeTab, search]);

  const calendarData = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Monday-first calendar layout.
    const leadingDays = (firstDay.getDay() + 6) % 7;
    const days = [];

    for (let index = 0; index < leadingDays; index += 1) {
      days.push(null);
    }

    for (let day = 1; day <= lastDay.getDate(); day += 1) {
      days.push(day);
    }

    const interviewDays = new Set();

    interviews.forEach((interview) => {
      const date = getScheduledDate(interview);

      if (!date) return;

      try {
        const parts = new Intl.DateTimeFormat("en-CA", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          timeZone: getTimezone(interview),
        }).formatToParts(date);

        const values = Object.fromEntries(
          parts.map((part) => [part.type, part.value])
        );

        if (
          Number(values.year) === year &&
          Number(values.month) - 1 === month
        ) {
          interviewDays.add(Number(values.day));
        }
      } catch {
        if (
          date.getFullYear() === year &&
          date.getMonth() === month
        ) {
          interviewDays.add(date.getDate());
        }
      }
    });

    return { days, interviewDays };
  }, [calendarMonth, interviews]);

  const changeCalendarMonth = (direction) => {
    setCalendarMonth(
      (current) =>
        new Date(
          current.getFullYear(),
          current.getMonth() + direction,
          1
        )
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-[#171827]">
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Page heading */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#777A8B]">
              <span>Workspace</span>
              <span>/</span>
              <span className="text-[#5B4FE9]">Interviews</span>
            </div>

            <h1 className="text-2xl font-bold tracking-[-0.03em] text-[#171827] sm:text-3xl">
              Interviews
            </h1>

            <p className="mt-1.5 max-w-2xl text-sm text-[#777A8B]">
              Keep track of your scheduled interviews, interview rounds,
              and feedback in one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setCalendarOpen((value) => !value)}
              className="inline-flex items-center gap-2 rounded-2xl border border-[#E3E4EC] bg-white px-4 py-2.5 text-xs font-bold text-[#444658] transition hover:border-[#D5D2F7] hover:bg-[#FBFAFF]"
            >
              <CalendarDays size={15} />
              {calendarOpen ? "Hide calendar" : "Calendar"}
            </button>

            <button
              type="button"
              onClick={() => setRefreshKey((value) => value + 1)}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-[#6D28D9] px-4 py-2.5 text-xs font-bold text-white shadow-[0_8px_20px_rgba(109,40,217,0.16)] transition hover:bg-[#5B21B6] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={15}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mt-5 flex flex-col gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"
          >
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setRefreshKey((value) => value + 1)}
              className="inline-flex items-center gap-2 self-start rounded-lg border border-red-200 px-3 py-2 text-xs font-bold hover:bg-red-100 sm:self-auto"
            >
              <RefreshCw size={13} />
              Try again
            </button>
          </div>
        )}

        {/* Statistics */}
        <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            icon={CalendarClock}
            label="Upcoming"
            description="Future interviews"
            value={upcomingInterviews.length}
            iconClass="bg-[#EEEAFE] text-[#6D28D9]"
          />

          <StatCard
            icon={AlertCircle}
            label="Action required"
            description="Reschedule requests"
            value={actionRequiredCount}
            iconClass="bg-amber-50 text-amber-600"
          />

          <StatCard
            icon={CheckCircle2}
            label="Completed"
            description="Completed interviews"
            value={completedCount}
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <StatCard
            icon={Users}
            label="Total"
            description="Interview history"
            value={interviews.length}
            iconClass="bg-[#EEF6FF] text-blue-600"
          />
        </div>

        {/* Dynamic calendar */}
        {calendarOpen && (
          <section className="mt-6 rounded-2xl border border-[#E8E9F0] bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-[#202132]">
                  Interview calendar
                </h2>

                <p className="mt-1 text-xs text-[#858899]">
                  Dates with a marker have interview records.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous month"
                  onClick={() => changeCalendarMonth(-1)}
                  className="rounded-lg border border-[#E8E9F0] p-2 hover:bg-[#F8F8FC]"
                >
                  <ChevronLeft size={16} />
                </button>

                <span className="min-w-[120px] text-center text-xs font-bold text-[#303145]">
                  {calendarMonth.toLocaleDateString("en-IN", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>

                <button
                  type="button"
                  aria-label="Next month"
                  onClick={() => changeCalendarMonth(1)}
                  className="rounded-lg border border-[#E8E9F0] p-2 hover:bg-[#F8F8FC]"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-7 gap-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                (day) => (
                  <div
                    key={day}
                    className="py-2 text-center text-[10px] font-bold text-[#858899]"
                  >
                    {day}
                  </div>
                )
              )}

              {calendarData.days.map((day, index) => (
                <div
                  key={`${calendarMonth.getFullYear()}-${calendarMonth.getMonth()}-${index}`}
                  className="flex min-h-10 items-center justify-center"
                >
                  {day ? (
                    <div
                      className={`relative flex h-9 w-9 items-center justify-center rounded-xl text-xs font-semibold ${
                        calendarData.interviewDays.has(day)
                          ? "bg-[#EEEAFE] text-[#5B4FE9]"
                          : "text-[#55586B]"
                      }`}
                    >
                      {day}

                      {calendarData.interviewDays.has(day) && (
                        <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[#6D28D9]" />
                      )}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Main layout */}
        <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <main className="min-w-0">
            {/* Next interview */}
            {nextInterview && (
              <section className="relative overflow-hidden rounded-[24px] bg-[#19162E] p-6 text-white shadow-[0_20px_50px_rgba(31,23,67,0.15)] sm:p-7">
                <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#6D28D9]/30 blur-3xl" />

                <div className="pointer-events-none absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-[#4F46E5]/20 blur-3xl" />

                <div className="relative flex flex-col justify-between gap-6 md:flex-row">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white/80">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Next interview
                      </span>

                      <span className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-semibold text-white/70">
                        {nextInterview?.round
                          ? `Round ${nextInterview.round}`
                          : "Round not provided"}
                      </span>
                    </div>

                    <div className="mt-6 flex items-center gap-4">
                      <CompanyLogo interview={nextInterview} size="lg" />

                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white/60">
                          {getCompanyName(nextInterview) ||
                            "Company not provided"}
                        </p>

                        <h2 className="mt-0.5 break-words text-xl font-bold tracking-[-0.02em] sm:text-2xl">
                          {getJobTitle(nextInterview) ||
                            "Job title unavailable"}
                        </h2>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white/85">
                        <CalendarDays size={14} />
                        {formatDate(nextInterview)}
                      </span>

                      <span className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white/85">
                        <Clock3 size={14} />
                        {formatTime(nextInterview)}
                      </span>

                      <span className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white/85">
                        <Video size={14} />
                        {formatDuration(nextInterview?.duration)}
                      </span>
                    </div>

                    <p className="mt-3 flex items-start gap-2 text-xs text-white/65">
                      <MapPin size={14} className="mt-0.5 shrink-0" />
                      {getInterviewLocation(nextInterview)}
                    </p>
                  </div>

                  <div className="flex flex-col justify-end gap-4 md:items-end">
                    <div className="md:text-right">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                        Interviewer
                      </p>

                      <p className="mt-1 break-words text-sm font-semibold">
                        {getDisplayName(nextInterview?.recruiter) ||
                          "Recruiter not provided"}
                      </p>

                      <p className="mt-0.5 break-words text-xs text-white/50">
                        {getText(nextInterview?.recruiter?.email)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedInterview(nextInterview)}
                        className="rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/15"
                      >
                        View details
                      </button>

                      {nextInterview?.interviewType === "Online" &&
                        nextInterview?.interviewRoomId && (
                          <button
                            type="button"
                            onClick={() => setSelectedInterview(nextInterview)}
                            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-[#4C32A7] transition hover:bg-[#F6F4FF]"
                            title="Open the interview details to view the room ID"
                          >
                            <Video size={14} />
                            Room details
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Tabs and search */}
            <div className="mt-7 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex gap-1 overflow-x-auto rounded-xl border border-[#E7E8EF] bg-white p-1">
                {TABS.map((tab) => (
                  <button
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    key={tab}
                    className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-bold transition ${
                      activeTab === tab
                        ? "bg-[#F0EEFF] text-[#5B4FE9]"
                        : "text-[#858899] hover:bg-[#F7F7FA] hover:text-[#444658]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="relative min-w-0 lg:w-72">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999CAB]"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search interviews..."
                  className="w-full rounded-xl border border-[#E7E8EF] bg-white py-3 pl-10 pr-4 text-xs outline-none transition placeholder:text-[#A0A3B1] focus:border-[#B8AFFA] focus:ring-2 focus:ring-[#EEEAFE]"
                />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <p className="text-xs text-[#858899]">
                Showing{" "}
                <span className="font-bold text-[#303145]">
                  {filteredInterviews.length}
                </span>{" "}
                {filteredInterviews.length === 1
                  ? "interview"
                  : "interviews"}
              </p>

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-xs font-semibold text-[#5B4FE9] hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>

            {/* Interview list */}
            <div className="mt-4 space-y-4">
              {loading && interviews.length === 0 ? (
                <div className="rounded-2xl border border-[#E8E9F0] bg-white p-10 text-center">
                  <RefreshCw
                    size={22}
                    className="mx-auto animate-spin text-[#6D28D9]"
                  />

                  <p className="mt-3 text-sm font-semibold text-[#303145]">
                    Loading interviews...
                  </p>
                </div>
              ) : filteredInterviews.length > 0 ? (
                filteredInterviews.map((interview) => (
                  <InterviewCard
                    key={getId(interview) || `${getJobTitle(interview)}-${getInterviewTimestamp(interview)}`}
                    interview={interview}
                    onView={setSelectedInterview}
                  />
                ))
              ) : (
                <div className="rounded-2xl border border-[#E8E9F0] bg-white px-5 py-12 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0EEFF] text-[#6D28D9]">
                    <CalendarDays size={22} />
                  </div>

                  <h3 className="mt-4 text-sm font-bold text-[#303145]">
                    {search
                      ? "No matching interviews"
                      : activeTab === "Upcoming"
                      ? "No upcoming interviews"
                      : "No interviews found"}
                  </h3>

                  <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[#858899]">
                    {search
                      ? "Try another search term or clear your search."
                      : "Interview information will appear here when it is available from your account."}
                  </p>

                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="mt-4 rounded-xl bg-[#6D28D9] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#5B21B6]"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              )}
            </div>
          </main>

          {/* Sidebar */}
          <aside className="space-y-5">
            <section className="rounded-2xl border border-[#E8E9F0] bg-white p-5">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F0EEFF] text-[#6D28D9]">
                  <Sparkles size={17} />
                </div>

                <div>
                  <h2 className="text-sm font-bold text-[#202132]">
                    Interview overview
                  </h2>

                  <p className="mt-0.5 text-[11px] text-[#858899]">
                    From your interview records
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <DetailRow label="Upcoming">
                  {upcomingInterviews.length}
                </DetailRow>

                <DetailRow label="Completed">
                  {completedCount}
                </DetailRow>

                <DetailRow label="Reschedule requests">
                  {actionRequiredCount}
                </DetailRow>

                <DetailRow label="Total interviews">
                  {interviews.length}
                </DetailRow>
              </div>

              <button
                type="button"
                onClick={() => setRefreshKey((value) => value + 1)}
                disabled={loading}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#E6E5EF] px-4 py-3 text-xs font-bold text-[#5B4FE9] transition hover:bg-[#F8F7FF] disabled:opacity-60"
              >
                <RefreshCw
                  size={14}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh interview data
              </button>
            </section>

            <section className="rounded-2xl border border-[#E8E9F0] bg-white p-5">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEF6FF] text-blue-600">
                  <CalendarDays size={17} />
                </div>

                <div>
                  <h2 className="text-sm font-bold text-[#202132]">
                    Next interview
                  </h2>

                  <p className="mt-0.5 text-[11px] text-[#858899]">
                    Nearest future interview
                  </p>
                </div>
              </div>

              {nextInterview ? (
                <>
                  <div className="mt-4 flex items-start gap-3">
                    <CompanyLogo interview={nextInterview} size="sm" />

                    <div className="min-w-0">
                      <p className="break-words text-xs font-bold text-[#303145]">
                        {getJobTitle(nextInterview) ||
                          "Job title unavailable"}
                      </p>

                      <p className="mt-1 break-words text-[11px] text-[#858899]">
                        {getCompanyName(nextInterview) ||
                          "Company not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <DetailRow label="Date">
                      {formatDate(nextInterview)}
                    </DetailRow>

                    <DetailRow label="Time">
                      {formatTime(nextInterview)}
                    </DetailRow>

                    <DetailRow label="Type">
                      {formatEnum(nextInterview?.interviewType)}
                    </DetailRow>

                    <DetailRow label="Duration">
                      {formatDuration(nextInterview?.duration)}
                    </DetailRow>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedInterview(nextInterview)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6D28D9] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#5B21B6]"
                  >
                    View interview
                    <ArrowRight size={14} />
                  </button>
                </>
              ) : (
                <p className="mt-4 rounded-xl bg-[#F8F8FC] p-4 text-xs leading-5 text-[#858899]">
                  No future interview is currently available in your
                  interview records.
                </p>
              )}
            </section>
          </aside>
        </div>
      </div>

      <DetailModal
        interview={selectedInterview}
        onClose={() => setSelectedInterview(null)}
      />
    </div>
  );
}

// --------------------------------------------------
// STAT CARD
// --------------------------------------------------

function StatCard({
  icon: Icon,
  label,
  description,
  value,
  iconClass,
}) {
  return (
    <section className="rounded-2xl border border-[#E8E9F0] bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={19} />
        </div>

        <span className="text-right text-[10px] font-bold uppercase tracking-wide text-[#9A9DAD]">
          {label}
        </span>
      </div>

      <p className="mt-5 text-2xl font-bold text-[#202132]">
        {value}
      </p>

      <p className="mt-1 text-xs text-[#888B9B]">
        {description}
      </p>
    </section>
  );
}
