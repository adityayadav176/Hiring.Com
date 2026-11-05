import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Download,
  ExternalLink,
  FileText,
  Globe,
  MapPin,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Wallet,
  XCircle,
} from "lucide-react";

import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';
const APPLICATION_STAGES = [
  { key: "applied", label: "Application submitted" },
  { key: "screening", label: "Under review" },
  { key: "shortlisted", label: "Shortlisted" },
  { key: "interview_scheduled", label: "Interview scheduled" },
  { key: "interview_completed", label: "Interview completed" },
  { key: "selected", label: "Selected" },
];

const STATUS_CONFIG = {
  applied: {
    label: "Application submitted",
    color: "bg-violet-50 text-violet-700 border-violet-200",
    dot: "bg-violet-500",
  },
  screening: {
    label: "Under review",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },
  shortlisted: {
    label: "Shortlisted",
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    dot: "bg-indigo-500",
  },
  interview_scheduled: {
    label: "Interview scheduled",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  interview_completed: {
    label: "Interview completed",
    color: "bg-cyan-50 text-cyan-700 border-cyan-200",
    dot: "bg-cyan-500",
  },
  selected: {
    label: "Selected",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  rejected: {
    label: "Not selected",
    color: "bg-rose-50 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
  },
  withdrawn: {
    label: "Withdrawn",
    color: "bg-gray-100 text-gray-600 border-gray-200",
    dot: "bg-gray-400",
  },
  closed: {
    label: "Application closed",
    color: "bg-gray-100 text-gray-600 border-gray-200",
    dot: "bg-gray-400",
  },
};

const formatDate = (date) => {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (date) => {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatSalary = (salary) => {
  if (!salary) return "Salary not specified";

  const { min, max, currency = "INR", isNegotiable } = salary;

  const formatAmount = (amount) => {
    if (amount === undefined || amount === null) return null;

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isNegotiable) return "Salary negotiable";

  if (min && max) {
    return `${formatAmount(min)} – ${formatAmount(max)}`;
  }

  if (min) return `From ${formatAmount(min)}`;
  if (max) return `Up to ${formatAmount(max)}`;

  return "Salary not specified";
};

const formatEnum = (value) => {
  if (!value) return null;

  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatFileSize = (bytes) => {
  if (!bytes || bytes <= 0) return "File";

  if (bytes < 1024) return `${bytes} B`;

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getCompanyInitials = (name = "Company") => {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || {
    label: formatEnum(status) || "Unknown status",
    color: "bg-gray-100 text-gray-600 border-gray-200",
    dot: "bg-gray-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${config.color}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mb-5">
      {eyebrow && (
        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-500">
          {eyebrow}
        </p>
      )}

      <h2 className="text-lg font-semibold tracking-tight text-gray-900">
        {title}
      </h2>

      {description && (
        <p className="mt-1 text-sm leading-6 text-gray-500">{description}</p>
      )}
    </div>
  );
}

function DetailItem({ icon: Icon, label, value }) {
  if (!value) return null;

  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-500 ring-1 ring-gray-100">
        <Icon size={16} strokeWidth={1.8} />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="mt-1 break-words text-sm font-medium text-gray-800">
          {value}
        </p>
      </div>
    </div>
  );
}

function ApplicationTimeline({ application }) {
  const { status, createdAt, reviewAt, shortlistedAt, closedAt } = application;

  const isRejected = status === "rejected";
  const isWithdrawn = status === "withdrawn";
  const isClosed = status === "closed";

  const terminalStatus = isRejected || isWithdrawn || isClosed;

  const currentIndex = APPLICATION_STAGES.findIndex(
    (stage) => stage.key === status
  );

  const events = [
    {
      key: "applied",
      title: "Application submitted",
      date: createdAt,
      description: "Your application was successfully received.",
      completed: true,
    },
    {
      key: "screening",
      title: "Under review",
      date: reviewAt,
      description: "The recruiter started reviewing your application.",
      completed:
        currentIndex >= 1 ||
        Boolean(reviewAt) ||
        status === "selected" ||
        status === "rejected",
    },
    {
      key: "shortlisted",
      title: "Shortlisted",
      date: shortlistedAt,
      description: "Your profile was shortlisted for the next stage.",
      completed:
        currentIndex >= 2 ||
        Boolean(shortlistedAt) ||
        status === "selected",
    },
    {
      key: "interview_scheduled",
      title: "Interview stage",
      date: application.interviewId?.scheduledAt,
      description: "Your application has reached the interview stage.",
      completed:
        currentIndex >= 3 ||
        status === "interview_completed" ||
        status === "selected",
    },
  ];

  if (isRejected || isWithdrawn || isClosed) {
    events.push({
      key: "terminal",
      title: STATUS_CONFIG[status]?.label || formatEnum(status),
      date: closedAt || application.updatedAt,
      description:
        status === "rejected"
          ? "The recruiter has closed your application."
          : status === "withdrawn"
            ? "You withdrew this application."
            : "This application has been closed.",
      completed: true,
      terminal: true,
    });
  } else if (status === "selected") {
    events.push({
      key: "selected",
      title: "Selected",
      date: closedAt,
      description: "Congratulations! You were selected for this position.",
      completed: true,
    });
  }

  return (
    <div className="relative">
      {events.map((event, index) => {
        const last = index === events.length - 1;

        return (
          <div key={event.key} className="relative flex gap-4 pb-7 last:pb-0">
            {!last && (
              <div
                className={`absolute left-[15px] top-8 h-[calc(100%-16px)] w-px ${
                  event.completed ? "bg-violet-200" : "bg-gray-200"
                }`}
              />
            )}

            <div
              className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                event.completed
                  ? event.terminal
                    ? "border-rose-200 bg-rose-50 text-rose-500"
                    : "border-violet-200 bg-violet-50 text-violet-600"
                  : "border-gray-200 bg-white text-gray-300"
              }`}
            >
              {event.completed ? (
                event.terminal ? (
                  <XCircle size={15} />
                ) : (
                  <Check size={15} strokeWidth={2.5} />
                )
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
              )}
            </div>

            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p
                  className={`text-sm font-semibold ${
                    event.completed ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {event.title}
                </p>

                {event.date && (
                  <span className="text-xs text-gray-400">
                    {formatDate(event.date)}
                  </span>
                )}
              </div>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                {event.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ResumePanel({ resume }) {
  if (!resume) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/70 p-5">
        <div className="flex items-center gap-3">
          <FileText className="text-gray-400" size={22} />
          <div>
            <p className="text-sm font-medium text-gray-700">
              No resume information
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Resume details were not included in this application.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const resumeFile = resume.resume || {};
  const resumeUrl = resumeFile.url;
  const fileName = resumeFile.originalName || "Resume";
  const fileSize = formatFileSize(resumeFile.sizeBytes);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:border-violet-200 hover:shadow-[0_8px_30px_rgba(109,40,217,0.07)]">
      <div className="flex items-center gap-4 p-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
          <FileText size={23} strokeWidth={1.7} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900">
            {resume.title || fileName}
          </p>

          <p className="mt-1 truncate text-xs text-gray-500">{fileName}</p>

          <p className="mt-1 text-[11px] text-gray-400">{fileSize}</p>
        </div>

        {resumeUrl && (
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open resume"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
          >
            <ExternalLink size={16} />
          </a>
        )}
      </div>

      {resumeUrl && (
        <a
          href={resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between border-t border-gray-100 px-4 py-3 text-xs font-semibold text-violet-600 transition hover:bg-violet-50/60"
        >
          View submitted resume
          <ArrowUpRight size={15} />
        </a>
      )}
    </div>
  );
}

function CompanySocialLinks({ socialLinks }) {
  if (!socialLinks) return null;

  const links = [
    { key: "website", label: "Website", icon: Globe },
    { key: "linkedin", label: "LinkedIn", icon: FaLinkedin },
    { key: "github", label: "GitHub", icon: FaGithub },
    { key: "twitter", label: "FaLinkedin", icon: FaLinkedin },
  ].filter(({ key }) => socialLinks[key]);

  if (!links.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {links.map(({ key, label, icon: Icon }) => {
        let url = socialLinks[key];

        if (key === "website" && !/^https?:\/\//i.test(url)) {
          url = `https://${url}`;
        }

        return (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title={label}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
          >
            <Icon size={16} />
          </a>
        );
      })}
    </div>
  );
}

export default function ApplicationDetails({
  application,
  onBack,
}) {
  const navigate = useNavigate();

  if (!application) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#faf9fc] px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
            <FileText size={25} />
          </div>

          <h2 className="text-lg font-semibold text-gray-900">
            Application not found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            We couldn’t find the application details.
          </p>

          <button
            onClick={onBack || (() => navigate(-1))}
            className="mt-5 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const company = application.companyId || {};
  const job = application.jobId || {};
  const resume = application.resumeId || {};
  const location = job.location || {};
  const salary = job.salary || {};
  const headquarters = company.headquarters || {};

  const status = application.status || "applied";
  const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.applied;

  const companyName = company.name || "Company";
  const jobTitle = job.title || "Untitled position";

  const jobLocation = [
    location.city,
    location.state,
    location.country,
  ]
    .filter(Boolean)
    .join(", ");

  const companyLocation = [
    headquarters.city,
    headquarters.state,
    headquarters.country,
  ]
    .filter(Boolean)
    .join(", ");

  const companyLogo = company.logo?.url;

  const isTerminal = ["rejected", "withdrawn", "closed"].includes(status);

  return (
    <main className="min-h-screen bg-[#faf9fc] text-gray-900">
      {/* Top navigation */}
      <header className="sticky top-0 z-30 border-b border-gray-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack || (() => navigate(-1))}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
              aria-label="Go back"
            >
              <ArrowLeft size={17} />
            </button>

            <div>
              <p className="text-sm font-semibold tracking-tight text-gray-900">
                Application details
              </p>
              <p className="text-[11px] text-gray-400">
                Your career workspace
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <span className="text-xs text-gray-400">Application ID</span>
            <span className="rounded-lg bg-gray-100 px-2.5 py-1 font-mono text-[11px] text-gray-600">
              {application._id?.slice(-8) || "N/A"}
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        {/* Page introduction */}
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-400">
              <span>My applications</span>
              <ChevronRight size={13} />
              <span className="text-violet-600">Application overview</span>
            </div>

            <h1 className="text-2xl font-semibold tracking-[-0.04em] text-gray-950 sm:text-3xl">
              Your application
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
              Everything you need to know about your application, in one place.
            </p>
          </div>

          <StatusBadge status={status} />
        </div>

        {/* Split workspace */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_390px]">
          {/* LEFT: Job and company workspace */}
          <div className="min-w-0 space-y-6">
            {/* Job introduction */}
            <section className="overflow-hidden rounded-[24px] border border-gray-200/80 bg-white">
              <div className="p-5 sm:p-7">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                  <div className="flex h-[66px] w-[66px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
                    {companyLogo ? (
                      <img
                        src={companyLogo}
                        alt={`${companyName} logo`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-bold tracking-tight text-violet-600">
                        {getCompanyInitials(companyName)}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-gray-500">
                        {companyName}
                      </p>

                      {company.isVerified && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                          <ShieldCheck size={12} />
                          Verified
                        </span>
                      )}
                    </div>

                    <h2 className="mt-2 text-2xl font-semibold leading-tight tracking-[-0.04em] text-gray-950 sm:text-[30px]">
                      {jobTitle}
                    </h2>

                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
                      {jobLocation && (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin size={14} />
                          {jobLocation}
                        </span>
                      )}

                      {job.employmentType && (
                        <span className="inline-flex items-center gap-1.5">
                          <BriefcaseBusiness size={14} />
                          {formatEnum(job.employmentType)}
                        </span>
                      )}

                      {job.experienceLevel && (
                        <span className="inline-flex items-center gap-1.5">
                          <Sparkles size={14} />
                          {formatEnum(job.experienceLevel)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-7 flex flex-col gap-4 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-gray-400">
                      Compensation
                    </p>

                    <p className="mt-1.5 text-xl font-semibold tracking-tight text-gray-900">
                      {formatSalary(salary)}
                    </p>

                    {salary.isNegotiable && (
                      <p className="mt-1 text-xs text-gray-400">
                        Compensation is open for discussion.
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {job.category && (
                      <span className="rounded-lg border border-violet-100 bg-violet-50/70 px-3 py-1.5 text-xs font-medium text-violet-700">
                        {job.category}
                      </span>
                    )}

                    {job.workSpaceType && (
                      <span className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600">
                        {formatEnum(job.workSpaceType)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Job overview */}
            <section className="rounded-[24px] border border-gray-200/80 bg-white p-5 sm:p-7">
              <SectionHeading
                eyebrow="Position overview"
                title="About this opportunity"
                description="The role and expectations associated with this position."
              />

              {job.description ? (
                <div className="whitespace-pre-line break-words text-sm leading-7 text-gray-600">
                  {job.description}
                </div>
              ) : (
                <p className="text-sm text-gray-400">
                  No job description was provided.
                </p>
              )}

              {/* Job requirements */}
              {job.requirements?.length > 0 && (
                <div className="mt-7 border-t border-gray-100 pt-6">
                  <h3 className="mb-3 text-sm font-semibold text-gray-900">
                    Requirements
                  </h3>

                  <ul className="space-y-2.5">
                    {job.requirements.map((requirement, index) => (
                      <li
                        key={`${requirement}-${index}`}
                        className="flex items-start gap-2.5 text-sm leading-6 text-gray-600"
                      >
                        <CheckCircle2
                          size={16}
                          className="mt-1 shrink-0 text-violet-500"
                        />
                        <span>{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Responsibilities */}
              {job.responsibilities?.length > 0 && (
                <div className="mt-7 border-t border-gray-100 pt-6">
                  <h3 className="mb-3 text-sm font-semibold text-gray-900">
                    Responsibilities
                  </h3>

                  <ul className="space-y-2.5">
                    {job.responsibilities.map((responsibility, index) => (
                      <li
                        key={`${responsibility}-${index}`}
                        className="flex items-start gap-2.5 text-sm leading-6 text-gray-600"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                        <span>{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Skills */}
              {job.skills?.length > 0 && (
                <div className="mt-7 border-t border-gray-100 pt-6">
                  <h3 className="mb-3 text-sm font-semibold text-gray-900">
                    Skills required
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <span
                        key={`${skill}-${index}`}
                        className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Company information */}
            <section className="rounded-[24px] border border-gray-200/80 bg-white p-5 sm:p-7">
              <SectionHeading
                eyebrow="The organization"
                title="About the company"
              />

              {company.description ? (
                <p className="whitespace-pre-line text-sm leading-7 text-gray-600">
                  {company.description}
                </p>
              ) : (
                <p className="text-sm text-gray-400">
                  No company description is available.
                </p>
              )}

              <div className="mt-6 grid grid-cols-1 gap-5 border-t border-gray-100 pt-6 sm:grid-cols-2">
                <DetailItem
                  icon={Building2}
                  label="Industry"
                  value={company.industry}
                />

                <DetailItem
                  icon={Wallet}
                  label="Company size"
                  value={company.companySize}
                />

                <DetailItem
                  icon={CalendarDays}
                  label="Founded"
                  value={company.foundedYear?.toString()}
                />

                <DetailItem
                  icon={MapPin}
                  label="Headquarters"
                  value={companyLocation}
                />
              </div>

              {company.socialLinks && (
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-5">
                  <p className="text-xs font-medium text-gray-500">
                    Explore the company
                  </p>

                  <CompanySocialLinks socialLinks={company.socialLinks} />
                </div>
              )}
            </section>
          </div>

          {/* RIGHT: Application workspace */}
          <aside className="min-w-0 space-y-6 lg:sticky lg:top-[92px]">
            {/* Application status */}
            <section className="overflow-hidden rounded-[24px] border border-gray-200/80 bg-white">
              <div className="border-b border-gray-100 p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                    Application status
                  </p>

                  <span
                    className={`h-2 w-2 rounded-full ${statusConfig.dot}`}
                  />
                </div>

                <h2 className="mt-3 text-xl font-semibold tracking-tight text-gray-950">
                  {statusConfig.label}
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {status === "selected"
                    ? "Congratulations! Your application has been selected."
                    : status === "rejected"
                      ? "This application is no longer progressing."
                      : status === "withdrawn"
                        ? "You have withdrawn this application."
                        : status === "closed"
                          ? "This application has been closed."
                          : "Keep track of your application as it progresses through the hiring process."}
                </p>
              </div>

              <div className="p-5 sm:p-6">
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">
                    Application journey
                  </p>

                  <span className="text-xs text-gray-400">
                    {isTerminal ? "Closed" : "In progress"}
                  </span>
                </div>

                <ApplicationTimeline application={application} />
              </div>
            </section>

            {/* Application metadata */}
            <section className="rounded-[24px] border border-gray-200/80 bg-white p-5 sm:p-6">
              <SectionHeading
                eyebrow="Application record"
                title="Submission details"
              />

              <div className="space-y-5">
                <DetailItem
                  icon={CalendarDays}
                  label="Applied on"
                  value={formatDateTime(application.createdAt)}
                />

                <DetailItem
                  icon={Clock3}
                  label="Last updated"
                  value={formatDateTime(application.updatedAt)}
                />

                {application.reviewAt && (
                  <DetailItem
                    icon={CheckCircle2}
                    label="Reviewed on"
                    value={formatDateTime(application.reviewAt)}
                  />
                )}

                {application.shortlistedAt && (
                  <DetailItem
                    icon={Sparkles}
                    label="Shortlisted on"
                    value={formatDateTime(application.shortlistedAt)}
                  />
                )}

                {application.closedAt && (
                  <DetailItem
                    icon={CalendarDays}
                    label="Closed on"
                    value={formatDateTime(application.closedAt)}
                  />
                )}
              </div>

              {application.atsScore !== null &&
                application.atsScore !== undefined && (
                  <div className="mt-5 rounded-xl bg-violet-50/70 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-violet-700">
                        Resume compatibility
                      </span>

                      <span className="text-sm font-bold text-violet-700">
                        {application.atsScore}%
                      </span>
                    </div>

                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-violet-100">
                      <div
                        className="h-full rounded-full bg-violet-500 transition-all"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(0, application.atsScore)
                          )}%`,
                        }}
                      />
                    </div>

                    <p className="mt-2 text-[11px] text-violet-600">
                      ATS status: {formatEnum(application.atsStatus)}
                    </p>
                  </div>
                )}
            </section>

            {/* Submitted resume */}
            <section className="rounded-[24px] border border-gray-200/80 bg-white p-5 sm:p-6">
              <SectionHeading
                eyebrow="Your document"
                title="Submitted resume"
                description="The resume attached to this application."
              />

              <ResumePanel resume={resume} />
            </section>

            {/* Recruiter message */}
            {application.messageToRecruiter && (
              <section className="rounded-[24px] border border-gray-200/80 bg-white p-5 sm:p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <MessageSquareText size={18} />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Your message
                    </h3>
                    <p className="mt-0.5 text-xs text-gray-400">
                      Message sent to the recruiter
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-gray-50 px-4 py-3.5">
                  <p className="whitespace-pre-line break-words text-sm leading-6 text-gray-600">
                    {application.messageToRecruiter}
                  </p>
                </div>
              </section>
            )}

            {/* Recruiter notes */}
            {application.recruiterNotes && (
              <section className="rounded-[24px] border border-gray-200/80 bg-white p-5 sm:p-6">
                <SectionHeading
                  eyebrow="Recruiter feedback"
                  title="Recruiter notes"
                />

                <p className="whitespace-pre-line break-words text-sm leading-6 text-gray-600">
                  {application.recruiterNotes}
                </p>
              </section>
            )}

            {/* Interview information */}
            {application.interviewId && (
              <section className="rounded-[24px] border border-violet-100 bg-violet-50/50 p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-violet-600 ring-1 ring-violet-100">
                    <CalendarDays size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Interview details
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Information linked to your application
                    </p>
                  </div>
                </div>

                {application.interviewId.scheduledAt && (
                  <div className="mt-4 rounded-xl bg-white p-4">
                    <p className="text-xs text-gray-400">Scheduled for</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {formatDateTime(application.interviewId.scheduledAt)}
                    </p>
                  </div>
                )}

                {application.interviewId.status && (
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Interview status
                    </span>

                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-violet-700">
                      {formatEnum(application.interviewId.status)}
                    </span>
                  </div>
                )}
              </section>
            )}

            {/* Bottom note */}
            <div className="flex items-start gap-3 px-2 py-1">
              <ShieldCheck
                size={16}
                className="mt-0.5 shrink-0 text-gray-400"
              />

              <p className="text-xs leading-5 text-gray-400">
                Your application information is private and visible to the
                relevant hiring team.
              </p>
            </div>
          </aside>
        </div>

        {/* Footer */}
        <footer className="mt-10 flex flex-col justify-between gap-3 border-t border-gray-200/80 py-6 sm:flex-row sm:items-center">
          <p className="text-xs text-gray-400">
            Peer.Hiring · Application workspace
          </p>

          <button
            onClick={onBack || (() => navigate(-1))}
            className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600 transition hover:text-violet-800"
          >
            <ArrowLeft size={15} />
            Back to applications
          </button>
        </footer>
      </div>
    </main>
  );
}