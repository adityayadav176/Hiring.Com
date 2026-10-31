import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Code2,
  FileText,
  Globe2,
  LoaderCircle,
  MapPin,
  MessageSquare,
  RefreshCw,
  Search,
  SearchX,
  SlidersHorizontal,
  Sparkles,
  Star,
  UserRound,
  Users,
  Video,
  X,
  XCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useInterview } from "../../hooks/Hook";

const TABS = ["All", "Upcoming", "Completed", "Cancelled"];

const TERMINAL_STATUSES = [
  "completed",
  "cancelled",
  "rejected",
  "no show",
];

const JOINABLE_STATUSES = [
  "scheduled",
  "accepted",
  "rescheduled",
];

const JOIN_BEFORE_MINUTES = 15;

const STATUS_STYLES = {
  scheduled: "border-blue-100 bg-blue-50 text-blue-700",
  accepted: "border-emerald-100 bg-emerald-50 text-emerald-700",
  rejected: "border-rose-100 bg-rose-50 text-rose-700",
  completed: "border-emerald-100 bg-emerald-50 text-emerald-700",
  cancelled: "border-rose-100 bg-rose-50 text-rose-700",
  "reschedule requested":
    "border-amber-100 bg-amber-50 text-amber-700",
  rescheduled: "border-sky-100 bg-sky-50 text-sky-700",
  "no show": "border-slate-200 bg-slate-100 text-slate-600",
};

const normalize = (value) =>
  String(value ?? "")
    .trim()
    .replaceAll("_", " ")
    .toLowerCase();

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

  const firstLast = [
    person.firstName,
    person.lastName,
  ]
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

function getCompany(interview) {
  return interview?.company || interview?.companyId || null;
}

function getJob(interview) {
  return interview?.job || interview?.jobId || null;
}

function getCompanyName(interview) {
  const company = getCompany(interview);

  if (typeof company === "string") {
    return getText(interview?.companyName);
  }

  return (
    getText(company?.name) ||
    getText(company?.companyName) ||
    getText(interview?.companyName)
  );
}

function getJobTitle(interview) {
  const job = getJob(interview);

  if (typeof job === "string") {
    return getText(interview?.jobTitle);
  }

  return (
    getText(job?.title) ||
    getText(job?.jobTitle) ||
    getText(job?.position) ||
    getText(interview?.jobTitle)
  );
}

function getCompanyLogo(interview) {
  const company = getCompany(interview);

  if (!company || typeof company !== "object") return "";

  if (typeof company.logo === "string") {
    return company.logo;
  }

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
  if (!interview || typeof interview !== "object") {
    return null;
  }

  if (interview.scheduledAt) {
    const scheduledDate = new Date(interview.scheduledAt);

    return Number.isNaN(scheduledDate.getTime())
      ? null
      : scheduledDate.getTime();
  }

  if (!interview.date) return null;

  const date = new Date(interview.date);

  if (Number.isNaN(date.getTime())) return null;

  const time = getText(interview.time);

  if (!time) return null;

  const match = time.match(
    /^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i
  );

  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3]?.toUpperCase();

  if (minutes < 0 || minutes > 59) return null;

  if (meridiem) {
    if (hours < 1 || hours > 12) return null;

    if (meridiem === "PM" && hours < 12) {
      hours += 12;
    }

    if (meridiem === "AM" && hours === 12) {
      hours = 0;
    }
  } else if (hours < 0 || hours > 23) {
    return null;
  }

  const result = new Date(date);

  result.setHours(hours, minutes, 0, 0);

  const timestamp = result.getTime();

  return Number.isFinite(timestamp) ? timestamp : null;
}

function getInterviewDuration(interview) {
  const duration = Number(interview?.duration);

  if (!Number.isFinite(duration) || duration <= 0) {
    return null;
  }

  return duration;
}

function canJoinInterview(interview, now = Date.now()) {
  if (!interview || typeof interview !== "object") {
    return false;
  }

  const interviewId = getText(interview._id);

  if (!/^[a-f\d]{24}$/i.test(interviewId)) {
    return false;
  }

  if (normalize(interview.interviewType) !== "online") {
    return false;
  }

  const status = getStatus(interview);

  if (!JOINABLE_STATUSES.includes(status)) {
    return false;
  }

  const startTime = getInterviewTimestamp(interview);

  if (startTime === null || !Number.isFinite(startTime)) {
    return false;
  }

  const duration = getInterviewDuration(interview);

  if (duration === null) {
    return false;
  }

  const endTime = startTime + duration * 60 * 1000;
  const joinStartTime =
    startTime - JOIN_BEFORE_MINUTES * 60 * 1000;

  return now >= joinStartTime && now < endTime;
}

function formatDate(interview) {
  const date = getScheduledDate(interview);

  if (!date) return "Date unavailable";

  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: getTimezone(interview),
    }).format(date);
  } catch {
    return date.toLocaleDateString("en-IN");
  }
}

function formatTime(interview) {
  const timestamp = getInterviewTimestamp(interview);

  if (timestamp === null) {
    return getText(interview?.time) || "Time unavailable";
  }

  const date = new Date(timestamp);

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

function formatDuration(minutes) {
  const value = Number(minutes);

  if (!Number.isFinite(value) || value <= 0) {
    return "Not provided";
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
      day: "numeric",
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

function getStatus(interview) {
  return normalize(interview?.status);
}

function getJobLocation(interview) {
  const job = getJob(interview);
  const location = job?.location;

  if (typeof location === "string") return location;

  if (location && typeof location === "object") {
    return [
      location.city,
      location.state,
      location.country,
    ]
      .filter(Boolean)
      .join(", ");
  }

  return (
    getText(job?.city) ||
    getText(job?.workLocation)
  );
}

function getCompanyHeadquarters(interview) {
  const company = getCompany(interview);
  const headquarters = company?.headquarters;

  if (typeof headquarters === "string") {
    return headquarters;
  }

  if (!headquarters || typeof headquarters !== "object") {
    return "";
  }

  return [
    headquarters.city,
    headquarters.state,
    headquarters.country,
  ]
    .filter(Boolean)
    .join(", ");
}

function getInterviewLocation(interview) {
  const type = normalize(interview?.interviewType);
  const location = getText(interview?.location);

  if (location) return location;

  if (type === "online") return "Online interview";
  if (type === "phone") return "Phone interview";

  return (
    getJobLocation(interview) ||
    getCompanyHeadquarters(interview) ||
    "Location unavailable"
  );
}

function getApplicationReference(interview) {
  const application = interview?.application;

  if (!application || typeof application !== "object") {
    return getId(application);
  }

  return (
    getText(application.applicationNumber) ||
    getText(application.reference) ||
    getId(application)
  );
}

function isUpcoming(interview, now = Date.now()) {
  const timestamp = getInterviewTimestamp(interview);
  const duration = getInterviewDuration(interview);

  if (timestamp === null) return false;

  const endTime =
    duration === null
      ? timestamp
      : timestamp + duration * 60 * 1000;

  return (
    endTime > now &&
    timestamp > now &&
    !TERMINAL_STATUSES.includes(getStatus(interview))
  );
}

function getStatusIcon(status) {
  const normalized = normalize(status);

  if (["completed", "accepted"].includes(normalized)) {
    return <CheckCircle2 size={13} />;
  }

  if (
    ["cancelled", "rejected", "no show"].includes(normalized)
  ) {
    return <XCircle size={13} />;
  }

  if (normalized === "reschedule requested") {
    return <RefreshCw size={13} />;
  }

  return <CalendarClock size={13} />;
}

function StatusBadge({ status }) {
  const label = formatEnum(status) || "Status unavailable";
  const style =
    STATUS_STYLES[normalize(status)] ||
    "border-amber-100 bg-amber-50 text-amber-700";

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold ${style}`}
    >
      {getStatusIcon(status)}
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

  useEffect(() => {
    setImageFailed(false);
  }, [logo]);

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden bg-violet-50 font-bold text-violet-700 ${sizeClasses[size] || sizeClasses.md}`}
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

function MetricCard({
  icon: Icon,
  label,
  value,
  description,
  tone,
}) {
  return (
    <article className="group min-w-0 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">
            {label}
          </p>

          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            {value}
          </p>
        </div>

        <div className={`rounded-xl p-3 ${tone}`}>
          <Icon size={20} />
        </div>
      </div>

      <p className="mt-3 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </article>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="min-w-0 rounded-xl bg-slate-50 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <div className="mt-1.5 flex min-w-0 items-start gap-1.5 text-xs font-semibold text-slate-700">
        <Icon
          size={14}
          className="mt-0.5 shrink-0 text-violet-600"
        />

        <span className="break-words">
          {value || "Not provided"}
        </span>
      </div>
    </div>
  );
}

function DetailRow({ label, children }) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-100 py-3 last:border-b-0 sm:flex-row sm:justify-between sm:gap-5">
      <span className="shrink-0 text-xs text-slate-500">
        {label}
      </span>

      <span className="break-words text-left text-xs font-semibold text-slate-800 sm:max-w-[65%] sm:text-right">
        {children || "Not provided"}
      </span>
    </div>
  );
}

function JoinInterviewButton({
  interview,
  onJoin,
  joiningInterviewId,
  now,
  className = "",
}) {
  if (!canJoinInterview(interview, now)) {
    return null;
  }

  const interviewId = getText(interview?._id);
  const isJoining = joiningInterviewId === interviewId;

  return (
    <button
      type="button"
      onClick={() => onJoin(interview)}
      disabled={Boolean(joiningInterviewId)}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
    >
      {isJoining ? (
        <>
          <LoaderCircle size={15} className="animate-spin" />
          Joining...
        </>
      ) : (
        <>
          <Video size={15} />
          Join Interview
        </>
      )}
    </button>
  );
}

function InterviewCard({
  interview,
  onView,
  onJoin,
  joiningInterviewId,
  now,
}) {
  const companyName = getCompanyName(interview);
  const jobTitle = getJobTitle(interview);
  const recruiterName = getDisplayName(interview?.recruiter);
  const type = normalize(interview?.interviewType);

  return (
    <article className="group rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <CompanyLogo interview={interview} />

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="break-words text-[15px] font-bold text-slate-950">
                {jobTitle || "Job title unavailable"}
              </h3>

              <StatusBadge status={interview?.status} />
            </div>

            <p className="mt-1 text-sm font-medium text-slate-500">
              {companyName || "Company unavailable"}
            </p>
          </div>
        </div>

        <span className="shrink-0 rounded-xl bg-violet-50 p-2 text-violet-700">
          {type === "online" ? (
            <Video size={17} />
          ) : type === "phone" ? (
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
          value={
            interview?.round
              ? `Round ${interview.round}`
              : "Not provided"
          }
        />

        <InfoItem
          icon={Clock3}
          label="Duration"
          value={formatDuration(interview?.duration)}
        />
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-700">
            <UserRound size={16} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-slate-700">
              {recruiterName || "Recruiter unavailable"}
            </p>

            <p className="truncate text-[10px] text-slate-400">
              {getText(interview?.recruiter?.email)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <JoinInterviewButton
            interview={interview}
            onJoin={onJoin}
            joiningInterviewId={joiningInterviewId}
            now={now}
          />

          <button
            type="button"
            onClick={() => onView(interview)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-violet-100 px-3.5 py-2.5 text-xs font-bold text-violet-700 transition hover:border-violet-300 hover:bg-violet-50"
          >
            View details
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <Globe2 size={13} />
          {formatEnum(interview?.interviewType) || "Type unavailable"}
        </span>

        <span className="inline-flex items-center gap-1.5">
          <MapPin size={13} />
          {getInterviewLocation(interview)}
        </span>
      </div>
    </article>
  );
}

function DetailModal({
  interview,
  onClose,
  onJoin,
  joiningInterviewId,
  now,
}) {
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

  useEffect(() => {
    if (!interview) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [interview]);

  if (!interview) return null;

  const companyName = getCompanyName(interview);
  const jobTitle = getJobTitle(interview);
  const recruiter = interview?.recruiter;
  const candidate = interview?.candidate;
  const feedback = interview?.feedback;
  const timezone = getTimezone(interview);

  const hasFeedback =
    feedback?.rating != null ||
    Boolean(interview?.recommendation) ||
    Boolean(interview?.notes);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Interview details"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm sm:p-5"
    >
      <div className="max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-white/50 bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-6">
          <div className="flex min-w-0 items-center gap-4">
            <CompanyLogo interview={interview} size="lg" />

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="break-words text-lg font-bold text-slate-950 sm:text-xl">
                  {jobTitle || "Interview details"}
                </h2>

                <StatusBadge status={interview?.status} />
              </div>

              <p className="mt-1 text-sm text-slate-500">
                {companyName || "Company unavailable"}
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
            className="shrink-0 rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[calc(92vh-90px)] overflow-y-auto p-5 sm:p-6">
          {canJoinInterview(interview, now) && (
            <div className="mb-5 flex flex-col justify-between gap-3 rounded-2xl border border-violet-100 bg-violet-50/70 p-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Ready for your interview?
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Join the online interview with your camera and microphone.
                </p>
              </div>

              <JoinInterviewButton
                interview={interview}
                onJoin={onJoin}
                joiningInterviewId={joiningInterviewId}
                now={now}
                className="py-3 text-sm"
              />
            </div>
          )}

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
                <h3 className="text-sm font-bold text-slate-900">
                  About this interview
                </h3>

                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-500">
                  {getText(interview?.description) ||
                    "No interview description has been provided."}
                </p>
              </section>

              <section>
                <h3 className="text-sm font-bold text-slate-900">
                  Interviewer
                </h3>

                <div className="mt-3 flex items-center gap-3 rounded-2xl border border-slate-200 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-700">
                    <UserRound size={19} />
                  </div>

                  <div className="min-w-0">
                    <p className="break-words text-sm font-bold text-slate-800">
                      {getDisplayName(recruiter) ||
                        "Recruiter details unavailable"}
                    </p>

                    <p className="mt-0.5 break-words text-xs text-slate-500">
                      {getText(recruiter?.email)}
                    </p>
                  </div>
                </div>
              </section>

              {candidate && (
                <section>
                  <h3 className="text-sm font-bold text-slate-900">
                    Candidate
                  </h3>

                  <div className="mt-3 flex items-center gap-3 rounded-2xl border border-slate-200 p-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-700">
                      <UserRound size={19} />
                    </div>

                    <div className="min-w-0">
                      <p className="break-words text-sm font-bold text-slate-800">
                        {getDisplayName(candidate) ||
                          "Candidate details unavailable"}
                      </p>

                      <p className="mt-0.5 break-words text-xs text-slate-500">
                        {getText(candidate?.email)}
                      </p>
                    </div>
                  </div>
                </section>
              )}

              {interview?.application && (
                <section>
                  <h3 className="text-sm font-bold text-slate-900">
                    Application
                  </h3>

                  <div className="mt-3 rounded-2xl border border-slate-200 px-4">
                    <DetailRow label="Reference">
                      {getApplicationReference(interview)}
                    </DetailRow>

                    <DetailRow label="Status">
                      {formatEnum(interview.application?.status)}
                    </DetailRow>

                    <DetailRow label="Created">
                      {formatDateTime(
                        interview.application?.createdAt,
                        timezone
                      )}
                    </DetailRow>
                  </div>
                </section>
              )}

              {hasFeedback && (
                <section className="rounded-2xl bg-violet-50/70 p-4">
                  <h3 className="text-sm font-bold text-slate-900">
                    Interview feedback
                  </h3>

                  {feedback?.rating != null && (
                    <div className="mt-3 flex items-center gap-2 text-sm font-bold text-amber-600">
                      <Star size={16} fill="currentColor" />
                      {feedback.rating} / 5
                    </div>
                  )}

                  {interview?.recommendation && (
                    <p className="mt-3 text-xs text-slate-600">
                      Recommendation:{" "}
                      <span className="font-bold text-violet-700">
                        {formatEnum(interview.recommendation)}
                      </span>
                    </p>
                  )}

                  {interview?.notes && (
                    <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
                      {interview.notes}
                    </p>
                  )}
                </section>
              )}

              {interview?.cancellationReason && (
                <section className="rounded-2xl bg-rose-50 p-4">
                  <h3 className="text-sm font-bold text-rose-700">
                    Cancellation reason
                  </h3>

                  <p className="mt-2 whitespace-pre-wrap break-words text-sm text-rose-700">
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

            <aside className="h-fit rounded-2xl border border-slate-200 p-4">
              <p className="text-xs font-bold text-slate-500">
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
                  {getInterviewLocation(interview)}
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

                <DetailRow label="Headquarters">
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

              <button
                type="button"
                onClick={() => window.print()}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold text-violet-700 transition hover:bg-violet-50"
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

function CalendarPanel({
  calendarMonth,
  calendarDays,
  interviewDays,
  onChangeMonth,
}) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Interview calendar
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Dates with markers have interview records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => onChangeMonth(-1)}
            className="rounded-lg border border-slate-200 p-2 transition hover:bg-slate-50"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="min-w-[125px] text-center text-xs font-bold text-slate-700">
            {calendarMonth.toLocaleDateString("en-IN", {
              month: "long",
              year: "numeric",
            })}
          </span>

          <button
            type="button"
            aria-label="Next month"
            onClick={() => onChangeMonth(1)}
            className="rounded-lg border border-slate-200 p-2 transition hover:bg-slate-50"
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
              className="py-2 text-center text-[10px] font-bold text-slate-400"
            >
              {day}
            </div>
          )
        )}

        {calendarDays.map((day, index) => (
          <div
            key={`${calendarMonth.getFullYear()}-${calendarMonth.getMonth()}-${index}`}
            className="flex min-h-10 items-center justify-center"
          >
            {day ? (
              <div
                className={`relative flex h-9 w-9 items-center justify-center rounded-xl text-xs font-semibold ${
                  interviewDays.has(day)
                    ? "bg-violet-100 text-violet-800"
                    : "text-slate-600"
                }`}
              >
                {day}

                {interviewDays.has(day) && (
                  <span className="absolute bottom-1 h-1 w-1 rounded-full bg-violet-600" />
                )}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function InterviewPage() {
  const {
    interviews: interviewData,
    handleGetMyInterviews,
  } = useInterview();

  const [activeTab, setActiveTab] = useState("Upcoming");
  const [search, setSearch] = useState("");
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [joiningInterviewId, setJoiningInterviewId] = useState("");
  const [now, setNow] = useState(() => Date.now());

  const navigate = useNavigate();
  const joinTimeoutRef = useRef(null);

  const [calendarMonth, setCalendarMonth] = useState(
    () =>
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      )
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => {
      if (joinTimeoutRef.current) {
        clearTimeout(joinTimeoutRef.current);
      }
    };
  }, []);

  const interviews = useMemo(
    () => (Array.isArray(interviewData) ? interviewData : []),
    [interviewData]
  );

  const handleJoinInterview = useCallback(
    (interview) => {
      if (joiningInterviewId) return;

      const currentTime = Date.now();

      if (!canJoinInterview(interview, currentTime)) {
        setError(
          "This interview is not currently available to join. You can join 15 minutes before its scheduled start time and until its duration expires."
        );
        return;
      }

      const interviewId = getText(interview?._id);

      setError("");
      setJoiningInterviewId(interviewId);

      joinTimeoutRef.current = setTimeout(() => {
        navigate(`/interview/${encodeURIComponent(interviewId)}`);
      }, 500);
    },
    [navigate, joiningInterviewId]
  );

  const refreshInterviews = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await handleGetMyInterviews();

      if (response?.success === false) {
        throw new Error(
          response.message || "Unable to load interviews."
        );
      }
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

  const upcomingInterviews = useMemo(
    () =>
      interviews
        .filter((interview) => isUpcoming(interview, now))
        .sort(
          (a, b) =>
            (getInterviewTimestamp(a) ?? Infinity) -
            (getInterviewTimestamp(b) ?? Infinity)
        ),
    [interviews, now]
  );

  const nextInterview = upcomingInterviews[0] || null;

  const completedCount = interviews.filter(
    (interview) => getStatus(interview) === "completed"
  ).length;

  const actionRequiredCount = interviews.filter(
    (interview) =>
      getStatus(interview) === "reschedule requested"
  ).length;

  const cancelledCount = interviews.filter(
    (interview) => getStatus(interview) === "cancelled"
  ).length;

  const filteredInterviews = useMemo(() => {
    const query = normalize(search);

    return interviews
      .filter((interview) => {
        const status = getStatus(interview);

        if (
          activeTab === "Upcoming" &&
          !isUpcoming(interview, now)
        ) {
          return false;
        }

        if (
          activeTab === "Completed" &&
          status !== "completed"
        ) {
          return false;
        }

        if (
          activeTab === "Cancelled" &&
          status !== "cancelled"
        ) {
          return false;
        }

        if (!query) return true;

        const searchableValues = [
          getCompanyName(interview),
          getJobTitle(interview),
          getDisplayName(interview?.recruiter),
          getDisplayName(interview?.candidate),
          interview?.status,
          interview?.interviewType,
          interview?.location,
          interview?.description,
          interview?.round,
          interview?.interviewRoomId,
          getJobLocation(interview),
          getCompanyHeadquarters(interview),
        ];

        return searchableValues.some((value) =>
          normalize(value).includes(query)
        );
      })
      .sort((a, b) => {
        const first = getInterviewTimestamp(a) ?? 0;
        const second = getInterviewTimestamp(b) ?? 0;

        return second - first;
      });
  }, [interviews, activeTab, search, now]);

  const calendarData = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
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

  const changeCalendarMonth = useCallback((direction) => {
    setCalendarMonth((current) =>
      new Date(
        current.getFullYear(),
        current.getMonth() + direction,
        1
      )
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSearch("");
    setActiveTab("All");
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshKey((value) => value + 1);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#F7F8FC] px-4 py-5 text-slate-900 sm:px-6 sm:py-7 lg:px-8">
      <div className="mx-auto w-full max-w-[1440px] space-y-7">
        <header className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-violet-700">
              <span className="h-2 w-2 rounded-full bg-violet-600" />
              Peer.Hiring / Career workspace
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              My interviews
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Track upcoming interviews, review your interview history,
              and keep every career opportunity organized.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm">
              <BriefcaseBusiness
                size={17}
                className="text-violet-600"
              />
              {interviews.length} interviews
            </div>

            <button
              type="button"
              onClick={() => setCalendarOpen((value) => !value)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50"
            >
              <CalendarDays size={16} />
              {calendarOpen ? "Hide calendar" : "Calendar"}
            </button>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 text-sm font-semibold text-white shadow-sm shadow-violet-200 transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={15}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </header>

        <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-[#211044] via-[#48218E] to-[#6D28D9] p-6 text-white shadow-lg shadow-violet-200/40 sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-20 -z-10 h-64 w-64 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-24 right-1/3 -z-10 h-52 w-52 rounded-full bg-fuchsia-400/20 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-violet-100">
                <Sparkles size={14} />
                Your career, in progress
              </div>

              <h2 className="mt-4 text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
                Every interview brings
                <br className="hidden sm:block" />
                you closer to your next opportunity.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-violet-100/85">
                Prepare for each round, keep track of your schedule,
                and stay ready for your next career move.
              </p>

              {nextInterview && (
                <button
                  type="button"
                  onClick={() => setSelectedInterview(nextInterview)}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-violet-800 transition hover:bg-violet-50"
                >
                  View next interview
                  <ArrowRight size={15} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:min-w-[390px]">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-3 sm:p-4">
                <CalendarDays size={19} className="text-violet-200" />
                <p className="mt-4 text-2xl font-bold">
                  {upcomingInterviews.length}
                </p>
                <p className="mt-1 text-[11px] leading-4 text-violet-100 sm:text-xs">
                  Upcoming
                </p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 p-3 sm:p-4">
                <CheckCircle2 size={19} className="text-emerald-200" />
                <p className="mt-4 text-2xl font-bold">
                  {completedCount}
                </p>
                <p className="mt-1 text-[11px] leading-4 text-violet-100 sm:text-xs">
                  Completed
                </p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 p-3 sm:p-4">
                <RefreshCw size={19} className="text-amber-200" />
                <p className="mt-4 text-2xl font-bold">
                  {actionRequiredCount}
                </p>
                <p className="mt-1 text-[11px] leading-4 text-violet-100 sm:text-xs">
                  Action needed
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={CalendarClock}
            label="Upcoming interviews"
            value={upcomingInterviews.length}
            description="Future interviews that are not in a terminal status"
            tone="bg-violet-50 text-violet-700"
          />

          <MetricCard
            icon={RefreshCw}
            label="Action required"
            value={actionRequiredCount}
            description="Interviews awaiting a reschedule decision"
            tone="bg-amber-50 text-amber-700"
          />

          <MetricCard
            icon={CheckCircle2}
            label="Completed"
            value={completedCount}
            description="Interviews marked as completed"
            tone="bg-emerald-50 text-emerald-700"
          />

          <MetricCard
            icon={Users}
            label="Total interviews"
            value={interviews.length}
            description="All interviews available in your account"
            tone="bg-blue-50 text-blue-700"
          />
        </section>

        {calendarOpen && (
          <CalendarPanel
            calendarMonth={calendarMonth}
            calendarDays={calendarData.days}
            interviewDays={calendarData.interviewDays}
            onChangeMonth={changeCalendarMonth}
          />
        )}

        {error && (
          <div
            role="alert"
            className="flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <AlertCircle
                size={20}
                className="mt-0.5 shrink-0 text-rose-600"
              />

              <div>
                <h3 className="text-sm font-bold text-rose-800">
                  Interview notice
                </h3>

                <p className="mt-1 text-sm leading-5 text-rose-700">
                  {error}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-violet-700 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-violet-800 disabled:opacity-60 sm:self-auto"
            >
              <RefreshCw size={14} />
              Try again
            </button>
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <main className="min-w-0">
            {nextInterview && (
              <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-[#211044] via-[#35205E] to-[#4D2A91] p-5 text-white shadow-lg shadow-violet-200/30 sm:p-7">
                <div className="pointer-events-none absolute -right-20 -top-20 -z-10 h-60 w-60 rounded-full bg-violet-500/20 blur-3xl" />

                <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white/90">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Next interview
                      </span>

                      <StatusBadge status={nextInterview.status} />
                    </div>

                    <div className="mt-5 flex items-center gap-4">
                      <CompanyLogo interview={nextInterview} size="lg" />

                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white/65">
                          {getCompanyName(nextInterview) ||
                            "Company unavailable"}
                        </p>

                        <h2 className="mt-1 break-words text-xl font-bold tracking-tight sm:text-2xl">
                          {getJobTitle(nextInterview) ||
                            "Job title unavailable"}
                        </h2>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white/90">
                        <CalendarDays size={14} />
                        {formatDate(nextInterview)}
                      </span>

                      <span className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white/90">
                        <Clock3 size={14} />
                        {formatTime(nextInterview)}
                      </span>

                      <span className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white/90">
                        <Video size={14} />
                        {formatDuration(nextInterview.duration)}
                      </span>
                    </div>

                    <p className="mt-3 flex items-start gap-2 text-xs text-white/65">
                      <MapPin size={14} className="mt-0.5 shrink-0" />
                      {getInterviewLocation(nextInterview)}
                    </p>
                  </div>

                  <div className="flex flex-col justify-end gap-4 lg:items-end">
                    <div className="lg:text-right">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/45">
                        Interviewer
                      </p>

                      <p className="mt-1 break-words text-sm font-semibold">
                        {getDisplayName(nextInterview.recruiter) ||
                          "Recruiter unavailable"}
                      </p>

                      <p className="mt-0.5 break-words text-xs text-white/55">
                        {getText(nextInterview.recruiter?.email)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedInterview(nextInterview)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-violet-800 transition hover:bg-violet-50"
                    >
                      View details
                      <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              </section>
            )}

            <section className="mt-7 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
              <div className="flex flex-col justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-slate-950">
                    Interview tracker
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Search and review your interview schedule and history.
                  </p>
                </div>

                <div className="inline-flex w-fit items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500">
                  <SlidersHorizontal
                    size={15}
                    className="text-violet-600"
                  />
                  {filteredInterviews.length} results
                </div>
              </div>

              <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative w-full lg:max-w-md">
                  <Search
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by job, company, recruiter..."
                    aria-label="Search interviews"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-50"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      aria-label="Clear search"
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={clearFilters}
                  disabled={!search && activeTab === "All"}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-xs font-semibold text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <RefreshCw size={14} />
                  Clear filters
                </button>
              </div>

              <div className="overflow-x-auto border-b border-slate-100 px-4 sm:px-6">
                <div className="flex min-w-max items-center gap-6 sm:gap-8">
                  {TABS.map((tab) => {
                    const selected = activeTab === tab;

                    const count = interviews.filter((interview) => {
                      if (tab === "All") return true;

                      if (tab === "Upcoming") {
                        return isUpcoming(interview, now);
                      }

                      if (tab === "Completed") {
                        return getStatus(interview) === "completed";
                      }

                      if (tab === "Cancelled") {
                        return getStatus(interview) === "cancelled";
                      }

                      return false;
                    }).length;

                    return (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        aria-pressed={selected}
                        className={`relative inline-flex min-h-14 items-center gap-2 whitespace-nowrap text-sm font-semibold transition ${
                          selected
                            ? "text-violet-700"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        {tab}

                        <span
                          className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                            selected
                              ? "bg-violet-100 text-violet-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {count}
                        </span>

                        {selected && (
                          <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-violet-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 px-5 py-3.5 sm:px-6">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-800">
                    {activeTab === "All"
                      ? "All interviews"
                      : `${activeTab} interviews`}
                  </h3>

                  <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                    {filteredInterviews.length} results
                  </span>
                </div>

                {(search || activeTab !== "All") && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-700 hover:text-violet-900"
                  >
                    <RefreshCw size={13} />
                    Clear search and filters
                  </button>
                )}
              </div>

              <div className="min-w-0 space-y-3 p-4 sm:space-y-4 sm:p-5">
                {loading && interviews.length === 0 ? (
                  <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-slate-100 bg-slate-50/50 px-5 text-center">
                    <RefreshCw
                      size={28}
                      className="animate-spin text-violet-600"
                    />

                    <p className="mt-4 text-sm font-semibold text-slate-800">
                      Loading your interviews
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Getting your latest interview activity...
                    </p>
                  </div>
                ) : error && interviews.length === 0 ? (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-12 text-center">
                    <AlertCircle
                      size={28}
                      className="mx-auto text-rose-600"
                    />

                    <h3 className="mt-4 text-base font-bold text-slate-900">
                      Couldn't load interviews
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                      {error}
                    </p>

                    <button
                      type="button"
                      onClick={handleRefresh}
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-800"
                    >
                      <RefreshCw size={15} />
                      Try again
                    </button>
                  </div>
                ) : filteredInterviews.length > 0 ? (
                  filteredInterviews.map((interview, index) => (
                    <div
                      key={
                        getId(interview) ||
                        `${getJobTitle(interview)}-${getInterviewTimestamp(interview)}-${index}`
                      }
                      className="min-w-0"
                    >
                      <InterviewCard
                        interview={interview}
                        onView={setSelectedInterview}
                        onJoin={handleJoinInterview}
                        joiningInterviewId={joiningInterviewId}
                        now={now}
                      />
                    </div>
                  ))
                ) : (
                  <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/40 px-5 py-12 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-100 bg-violet-50 text-violet-600">
                      {search ? (
                        <SearchX size={24} />
                      ) : (
                        <CalendarDays size={24} />
                      )}
                    </div>

                    <h3 className="mt-4 text-base font-bold text-slate-900">
                      {search
                        ? "No matching interviews"
                        : activeTab === "Upcoming"
                          ? "No upcoming interviews"
                          : activeTab === "Completed"
                            ? "No completed interviews yet"
                            : activeTab === "Cancelled"
                              ? "No cancelled interviews"
                              : "Your interview journey starts here"}
                    </h3>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                      {search
                        ? "Try a different keyword or clear your search to see more results."
                        : "Interview records will appear here when they are available from your account."}
                    </p>

                    {(search || activeTab !== "All") && (
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800"
                      >
                        <RefreshCw size={15} />
                        View all interviews
                        <ArrowUpRight size={14} />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {!loading && !error && interviews.length > 0 && (
                <div className="flex flex-col justify-between gap-2 border-t border-slate-100 bg-slate-50/50 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:px-6">
                  <p>
                    Showing{" "}
                    <span className="font-semibold text-slate-700">
                      {filteredInterviews.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-slate-700">
                      {interviews.length}
                    </span>{" "}
                    interviews
                  </p>

                  <p className="inline-flex items-center gap-1.5">
                    <CheckCircle2
                      size={14}
                      className="text-emerald-600"
                    />
                    Interview activity loaded
                  </p>
                </div>
              )}
            </section>
          </main>

          <aside className="space-y-5">
            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                  <Sparkles size={17} />
                </div>

                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Interview overview
                  </h2>

                  <p className="mt-0.5 text-[11px] text-slate-500">
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

                <DetailRow label="Cancelled">
                  {cancelledCount}
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
                onClick={handleRefresh}
                disabled={loading}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold text-violet-700 transition hover:bg-violet-50 disabled:opacity-60"
              >
                <RefreshCw
                  size={14}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh interview data
              </button>
            </section>

            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <CalendarDays size={17} />
                </div>

                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Next interview
                  </h2>

                  <p className="mt-0.5 text-[11px] text-slate-500">
                    Nearest future interview
                  </p>
                </div>
              </div>

              {nextInterview ? (
                <>
                  <div className="mt-4 flex items-start gap-3">
                    <CompanyLogo interview={nextInterview} size="sm" />

                    <div className="min-w-0">
                      <p className="break-words text-xs font-bold text-slate-800">
                        {getJobTitle(nextInterview) ||
                          "Job title unavailable"}
                      </p>

                      <p className="mt-1 break-words text-[11px] text-slate-500">
                        {getCompanyName(nextInterview) ||
                          "Company unavailable"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-1">
                    <DetailRow label="Date">
                      {formatDate(nextInterview)}
                    </DetailRow>

                    <DetailRow label="Time">
                      {formatTime(nextInterview)}
                    </DetailRow>

                    <DetailRow label="Type">
                      {formatEnum(nextInterview.interviewType)}
                    </DetailRow>

                    <DetailRow label="Duration">
                      {formatDuration(nextInterview.duration)}
                    </DetailRow>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedInterview(nextInterview)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 py-3 text-xs font-bold text-white transition hover:bg-violet-800"
                  >
                    View interview
                    <ArrowRight size={14} />
                  </button>
                </>
              ) : (
                <p className="mt-4 rounded-xl bg-slate-50 p-4 text-xs leading-5 text-slate-500">
                  No future interview is currently available in your
                  interview records.
                </p>
              )}
            </section>

            <section className="rounded-2xl border border-violet-100 bg-violet-50/60 p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-white p-2.5 text-violet-700 shadow-sm">
                  <CheckCircle2 size={18} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Stay interview-ready
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    Review your schedule, prepare for each round, and
                    check for interview updates regularly.
                  </p>
                </div>
              </div>

              <p className="mt-4 text-xs font-semibold text-violet-700">
                {upcomingInterviews.length} upcoming · {completedCount} completed
              </p>
            </section>
          </aside>
        </div>
      </div>

      <DetailModal
        interview={selectedInterview}
        onClose={() => setSelectedInterview(null)}
        onJoin={handleJoinInterview}
        joiningInterviewId={joiningInterviewId}
        now={now}
      />
    </div>
  );
}