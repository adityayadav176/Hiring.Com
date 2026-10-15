
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  BriefcaseBusiness,
  MapPin,
  CalendarDays,
  FileText,
  ExternalLink,
  CheckCircle2,
  Clock3,
  Circle,
  ShieldCheck,
  Users,
  Globe,
  IndianRupee,
} from "lucide-react";

const formatDate = (date) => {
  if (!date) return "Not available";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const statusStyles = {
  applied: "bg-blue-50 text-blue-700",
  screening: "bg-amber-50 text-amber-700",
  shortlisted: "bg-violet-50 text-violet-700",
  interview_scheduled: "bg-indigo-50 text-indigo-700",
  interview_completed: "bg-teal-50 text-teal-700",
  selected: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-700",
  withdrawn: "bg-slate-100 text-slate-600",
  closed: "bg-slate-100 text-slate-600",
};

export default function ApplicationDetails({application, onClose}) {
  const navigate = useNavigate();

  if (!application) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-violet-700"
        >
          <ArrowLeft size={18} />
          Go back
        </button>
        <p className="mt-8 text-slate-600">
          Application data is unavailable. Load the application
          by its ID from your backend.
        </p>
      </div>
    );
  }

  const company = application.companyId ?? {};
  const job = application.jobId ?? {};
  const resume = application.resumeId ?? {};
  const interview = application.interviewId ?? {};

  const status = application.status ?? "applied";

  const stages = [
    { key: "applied", label: "Application submitted",
      date: application.createdAt },
    { key: "screening", label: "Under review",
      date: application.reviewedAt },
    { key: "shortlisted", label: "Shortlisted",
      date: application.shortlistedAt },
    { key: "interview_scheduled", label: "Interview",
      date: interview.scheduledAt },
    { key: "closed", label: "Application decision",
      date: application.closedAt },
  ];

  const completedStages = new Set(["applied"]);

  if (application.reviewedAt) completedStages.add("screening");
  if (application.shortlistedAt) completedStages.add("shortlisted");
  if (
    ["interview_scheduled", "interview_completed", "selected"].includes(status)
  ) {
    completedStages.add("interview_scheduled");
  }
  if (
    application.closedAt ||
    ["selected", "rejected", "withdrawn", "closed"].includes(status)
  ) {
    completedStages.add("closed");
  }

  const locationText = Array.isArray(job.location)
    ? job.location
        .map((item) =>
          typeof item === "string"
            ? item
            : [item?.city, item?.state, item?.country]
                .filter(Boolean)
                .join(", ")
        )
        .filter(Boolean)
        .join(" · ")
    : typeof job.location === "string"
      ? job.location
      : [
          job.location?.city,
          job.location?.state,
          job.location?.country,
        ].filter(Boolean).join(", ");

  const salary = job.salary;
  const socialLinks = Array.isArray(company.socialLinks)
    ? company.socialLinks
    : [];

  return (
    <main className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 fixed inset-0 z-[100] overflow-y-auto min-h-screen bg-[#F5F6FA] text-slate-800">

        {/* Header */}
        <button
          onClick={onClose}
          className="mb-5 flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-violet-700"
        >
          <ArrowLeft size={17} />
          Back to applications
        </button>

        <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:p-7">
          <div className="flex items-start gap-4">
            {company.logo ? (
              <img
                src={company.logo}
                alt={company.name || "Company logo"}
                className="h-14 w-14 rounded-xl border border-slate-200 object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-violet-50 text-xl font-bold text-violet-700">
                {company.name?.charAt(0)?.toUpperCase() || "C"}
              </div>
            )}

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Application details
              </p>
              <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                {job.title || "Untitled position"}
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                {company.name || "Company"}
              </p>
              <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                <MapPin size={15} />
                {locationText || "Location not specified"}
                <span>·</span>
                {job.employmentType || "Employment type not specified"}
              </p>
            </div>
          </div>

          <span
            className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
              statusStyles[status] || "bg-slate-100 text-slate-700"
            }`}
          >
            {status.replaceAll("_", " ")}
          </span>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">

          {/* Main content */}
          <div className="space-y-6 lg:col-span-2">

            {/* Application timeline */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
              <h2 className="text-lg font-semibold text-slate-900">
                Application progress
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Track the progress of your application.
              </p>

              <div className="mt-6 space-y-6">
                {stages.map((stage, index) => {
                  const completed = completedStages.has(stage.key);
                  const isCurrent =
                    stage.key === status ||
                    (stage.key === "interview_scheduled" &&
                      status === "interview_completed");

                  return (
                    <div key={stage.key} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        {completed ? (
                          <CheckCircle2
                            size={22}
                            className="text-violet-600"
                          />
                        ) : isCurrent ? (
                          <Clock3
                            size={22}
                            className="text-violet-600"
                          />
                        ) : (
                          <Circle
                            size={22}
                            className="text-slate-300"
                          />
                        )}

                        {index !== stages.length - 1 && (
                          <div className="mt-2 min-h-7 w-px flex-1 bg-slate-200" />
                        )}
                      </div>

                      <div className="flex-1 pb-1">
                        <p className={`text-sm font-semibold ${
                          completed || isCurrent
                            ? "text-slate-900"
                            : "text-slate-400"
                        }`}>
                          {stage.label}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {stage.date
                            ? formatDate(stage.date)
                            : "Awaiting update"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Message sent with application */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
              <h2 className="text-lg font-semibold text-slate-900">
                Your message to the recruiter
              </h2>
              <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                {application.messageToRecruiter?.trim() ||
                  "No message was included with this application."}
              </div>
            </section>

            {/* Submitted resume */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-900">
                  Submitted resume
                </h2>
                <FileText size={20} className="text-violet-600" />
              </div>

              <div className="mt-4 flex flex-col gap-4 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-violet-50">
                  <FileText size={24} className="text-violet-700" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="break-words text-sm font-semibold text-slate-900">
                    {resume.title || "Submitted resume"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {resume.subtitle || "Resume attached to this application"}
                  </p>
                  {resume.target && (
                    <p className="mt-2 text-xs text-slate-600">
                      Target role: {resume.target}
                    </p>
                  )}
                </div>

                {resume.file && (
                  <a
                    href={resume.file}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    View resume
                    <ExternalLink size={15} />
                  </a>
                )}
              </div>

              {Array.isArray(resume.skills) && resume.skills.length > 0 && (
                <div className="mt-5">
                  <p className="mb-3 text-sm font-semibold text-slate-800">
                    Resume skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {resume.skills.map((skill, index) => (
                      <span
                        key={`${skill}-${index}`}
                        className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs text-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Interview information */}
            {interview._id && (
              <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
                <div className="flex items-center gap-3">
                  <CalendarDays className="text-violet-600" size={22} />
                  <h2 className="text-lg font-semibold text-slate-900">
                    Interview details
                  </h2>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">Scheduled date</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      {formatDate(interview.scheduledAt)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">Interview status</p>
                    <p className="mt-2 text-sm font-semibold capitalize text-slate-900">
                      {(interview.status || "Pending").replaceAll("_", " ")}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Recruiter feedback */}
            {application.recruiterNotes?.trim() && (
              <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
                <h2 className="text-lg font-semibold text-slate-900">
                  Recruiter feedback
                </h2>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                  {application.recruiterNotes}
                </p>
              </section>
            )}

            {/* Company information */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
              <div className="flex items-center gap-3">
                <Building2 size={22} className="text-violet-600" />
                <h2 className="text-lg font-semibold text-slate-900">
                  About the company
                </h2>
                {company.isVerified && (
                  <ShieldCheck
                    size={19}
                    className="text-blue-600"
                    aria-label="Verified company"
                  />
                )}
              </div>

              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                {company.description || "No company description available."}
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <CompanyInfo
                  icon={<BriefcaseBusiness size={17} />}
                  label="Industry"
                  value={company.industry}
                />
                <CompanyInfo
                  icon={<Users size={17} />}
                  label="Company size"
                  value={company.companySize}
                />
                <CompanyInfo
                  icon={<CalendarDays size={17} />}
                  label="Founded"
                  value={company.foundedYear}
                />
                <CompanyInfo
                  icon={<MapPin size={17} />}
                  label="Headquarters"
                  value={company.headquarters}
                />
              </div>

              {socialLinks.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-100 pt-4">
                  {socialLinks.map((item, index) => {
                    const url =
                      typeof item === "string"
                        ? item
                        : item?.url;

                    if (!url) return null;

                    return (
                      <a
                        key={item?.platform || index}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-violet-700 hover:underline"
                      >
                        <Globe size={15} />
                        {item?.platform || "Company link"}
                        <ExternalLink size={13} />
                      </a>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Job information */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
              <div className="flex items-center gap-3">
                <BriefcaseBusiness size={22} className="text-violet-600" />
                <h2 className="text-lg font-semibold text-slate-900">
                  Job information
                </h2>
              </div>

              {salary && (
                <div className="mt-5 flex items-start gap-3">
                  <IndianRupee size={19} className="mt-0.5 text-slate-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      Compensation
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {salary.min != null || salary.max != null
                        ? `${salary.min ?? "—"} – ${salary.max ?? "—"}`
                        : "Salary details available in the job listing"}
                      {salary.isNegotiable ? " · Negotiable" : ""}
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-5">
                <h3 className="text-sm font-semibold text-slate-800">
                  Job description
                </h3>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                  {job.description ||
                    "The job description is not available."}
                </p>
              </div>
            </section>
          </div>

          {/* Right sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-base font-semibold text-slate-900">
                Application summary
              </h2>

              <SummaryRow
                label="Current status"
                value={status.replaceAll("_", " ")}
              />
              <SummaryRow
                label="Applied on"
                value={formatDate(application.createdAt)}
              />
              <SummaryRow
                label="Last updated"
                value={formatDate(application.updatedAt)}
              />
              <SummaryRow
                label="Reviewed on"
                value={formatDate(application.reviewedAt)}
              />
              <SummaryRow
                label="Shortlisted on"
                value={formatDate(application.shortlistedAt)}
              />
              <SummaryRow
                label="Interview date"
                value={formatDate(interview.scheduledAt)}
              />
              <SummaryRow
                label="Closed on"
                value={formatDate(application.closedAt)}
              />
            </section>

            <section className="rounded-2xl border border-violet-100 bg-violet-50 p-5">
              <h2 className="text-base font-semibold text-slate-900">
                What happens next?
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {status === "selected"
                  ? "Congratulations! Check your messages for the next steps from the recruiter."
                  : status === "rejected"
                    ? "This application was not successful. You can continue exploring other opportunities."
                    : status === "withdrawn"
                      ? "You have withdrawn this application."
                      : status === "closed"
                        ? "This application has been closed."
                        : "Keep your profile and resume up to date. Check this page for application progress and interview updates."}
              </p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function CompanyInfo({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-slate-400">{icon}</span>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="mt-1 text-sm font-medium text-slate-800">
          {value ?? "Not provided"}
        </p>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-slate-100 py-3 last:border-b-0">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-right text-xs font-medium capitalize text-slate-800">
        {value}
      </span>
    </div>
  );
}
