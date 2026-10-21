
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useApplication } from "../../hooks/Hook";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Download,
  Users,
  UserCheck,
  Clock3,
  BriefcaseBusiness,
  CheckCircle2,
  XCircle,
  Eye,
  MessageSquareText,
  MapPin,
  Mail,
  Phone,
  ArrowUpDown,
  X,
  Check,
  Sparkles,
  MoreHorizontal,
  FileText,
  RotateCcw,
  LayoutGrid,
  List,
  ShieldCheck,
  CircleDot,
  LoaderCircle,
  AlertCircle,
  ExternalLink,
  GraduationCap,
  Code2,
  RefreshCw,
} from "lucide-react";

const STATUS_OPTIONS = [
  { value: "applied", label: "New application" },
  { value: "screening", label: "In screening" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "interview_scheduled", label: "Interview scheduled" },
  { value: "interview_completed", label: "Interview completed" },
  { value: "selected", label: "Selected" },
  { value: "rejected", label: "Rejected" },
  { value: "withdrawn", label: "Withdrawn" },
  { value: "closed", label: "Closed" },
];

const STATUS_META = {
  applied: {
    label: "New application",
    className: "bg-sky-50 text-sky-700 ring-sky-200",
    dot: "bg-sky-500",
  },
  screening: {
    label: "In screening",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
    dot: "bg-amber-500",
  },
  shortlisted: {
    label: "Shortlisted",
    className: "bg-violet-50 text-violet-700 ring-violet-200",
    dot: "bg-violet-500",
  },
  interview_scheduled: {
    label: "Interview scheduled",
    className: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    dot: "bg-indigo-500",
  },
  interview_completed: {
    label: "Interview completed",
    className: "bg-cyan-50 text-cyan-700 ring-cyan-200",
    dot: "bg-cyan-500",
  },
  selected: {
    label: "Selected",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500",
  },
  rejected: {
    label: "Rejected",
    className: "bg-rose-50 text-rose-700 ring-rose-200",
    dot: "bg-rose-500",
  },
  withdrawn: {
    label: "Withdrawn",
    className: "bg-slate-100 text-slate-600 ring-slate-200",
    dot: "bg-slate-400",
  },
  closed: {
    label: "Closed",
    className: "bg-slate-100 text-slate-600 ring-slate-200",
    dot: "bg-slate-400",
  },
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatRelativeDate = (value) => {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const appliedDate = new Date(date);
  appliedDate.setHours(0, 0, 0, 0);

  const days = Math.floor(
    (today.getTime() - appliedDate.getTime()) / 86400000
  );

  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;

  return formatDate(value);
};

const getId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value._id || value.id || "";
};

const getName = (candidate) => {
  if (!candidate || typeof candidate !== "object") {
    return "Unknown candidate";
  }

  return candidate.name || candidate.fullName || "Unknown candidate";
};

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "U";

const getReference = (primary, fallback) => {
  if (primary && typeof primary === "object") return primary;
  if (fallback && typeof fallback === "object") return fallback;
  return primary || fallback || {};
};

/*
 * Supports populated MongoDB references and legacy field names.
 *
 * Expected application fields:
 * candidateId, jobId, companyId, resumeId, status, createdAt.
 *
 * This component also supports candidate/job/resume fields when
 * those references are populated by Mongoose.
 */
const normalizeApplication = (raw = {}) => {
  const candidate = getReference(raw.candidateId, raw.candidate);
  const job = getReference(raw.jobId, raw.job);
  const resume = getReference(raw.resumeId, raw.resume);

  const profile =
    candidate?.profile && typeof candidate.profile === "object"
      ? candidate.profile
      : raw.profile || {};

  const skills = Array.isArray(profile.skills)
    ? profile.skills
        .map((skill) =>
          typeof skill === "string" ? skill : skill?.name
        )
        .filter(Boolean)
    : Array.isArray(candidate?.skills)
      ? candidate.skills
          .map((skill) =>
            typeof skill === "string" ? skill : skill?.name
          )
          .filter(Boolean)
      : [];

  const education = Array.isArray(profile.education)
    ? profile.education
    : candidate?.education
      ? [
          {
            degree: candidate.education,
            institute: candidate.university || "",
          },
        ]
      : [];

  const experience = Array.isArray(profile.experience)
    ? profile.experience
    : [];

  const latestExperience = experience[0] || {};

  const score =
    typeof raw.atsScore === "number"
      ? raw.atsScore
      : typeof raw.score === "number"
        ? raw.score
        : null;

  const jobTitle =
    typeof job === "string"
      ? job
      : job?.title || job?.jobTitle || "Job unavailable";

  return {
    ...raw,

    _id: raw._id || raw.applicationId || "",

    candidate,
    candidateName: getName(candidate),
    candidateEmail:
      typeof candidate === "object" ? candidate?.email || "" : "",
    candidatePhone:
      typeof candidate === "object"
        ? candidate?.phoneNo || candidate?.phone || ""
        : "",
    candidateAvatar:
      candidate?.avatar?.url ||
      (typeof candidate?.avatar === "string" ? candidate.avatar : ""),
    candidateLocation:
      profile?.location?.city ||
      profile?.location?.name ||
      (typeof profile?.location === "string" ? profile.location : "") ||
      candidate?.location ||
      "",
    candidateRole:
      profile?.headline ||
      latestExperience?.position ||
      latestExperience?.role ||
      candidate?.currentRole ||
      "",
    candidateSkills: skills,
    candidateEducation: education,
    candidateProfile: profile,
    candidatePortfolio:
      profile?.socialLinks?.portfolio ||
      profile?.socialLinks?.github ||
      candidate?.portfolio ||
      "",

    job,
    jobId: getId(raw.jobId || raw.job),
    jobTitle,
    jobDepartment:
      job?.department ||
      job?.category ||
      job?.employmentType ||
      "",

    resume,
    resumeTitle:
      resume?.title ||
      resume?.resume?.originalName ||
      resume?.originalName ||
      resume?.fileName ||
      "Resume",
    resumeUrl:
      resume?.resume?.url ||
      resume?.url ||
      resume?.fileUrl ||
      "",

    score,
    appliedAt: raw.createdAt || raw.appliedAt || raw.updatedAt,
    recruiterNotes: raw.recruiterNotes || "",
    messageToRecruiter: raw.messageToRecruiter || "",
    status: raw.status || "applied",
  };
};

const getApplicationFromResponse = (result) => {
  if (!result) return null;

  if (result.application) return result.application;
  if (result.data?.application) return result.data.application;
  if (result.data && !Array.isArray(result.data)) return result.data;

  return result;
};

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.applied;

  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${meta.className}`}
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

function MetricCard({ title, value, description, icon: Icon, tone }) {
  const tones = {
    violet: "bg-violet-50 text-violet-700",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    emerald: "bg-emerald-50 text-emerald-700",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            {value}
          </p>
        </div>

        <div className={`rounded-xl p-3 ${tones[tone] || tones.violet}`}>
          <Icon size={21} />
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-500">{description}</p>
    </div>
  );
}

function CandidateAvatar({ candidate, size = "normal" }) {
  const name = getName(candidate);

  const avatar =
    candidate?.avatar?.url ||
    (typeof candidate?.avatar === "string" ? candidate.avatar : "");

  const sizes =
    size === "large"
      ? "h-14 w-14 rounded-2xl text-lg"
      : "h-10 w-10 rounded-xl text-sm";

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className={`${sizes} shrink-0 object-cover ring-1 ring-black/5`}
        loading="lazy"
      />
    );
  }

  return (
    <div
      className={`${sizes} flex shrink-0 items-center justify-center bg-violet-100 font-bold text-violet-700 ring-1 ring-black/5`}
    >
      {getInitials(name)}
    </div>
  );
}

function DetailField({ icon: Icon, children }) {
  if (children === undefined || children === null || children === "") {
    return null;
  }

  return (
    <div className="flex min-w-0 items-center gap-2 text-sm text-slate-600">
      <Icon size={16} className="shrink-0 text-slate-400" />
      <span className="min-w-0 break-words">{children}</span>
    </div>
  );
}

function ApplicationDrawer({
  application: rawApplication,
  onClose,
  onStatusChange,
  onNotesSave,
  busyStatus,
  busyNotes,
}) {
  const application = useMemo(
    () => normalizeApplication(rawApplication),
    [rawApplication]
  );

  const [notes, setNotes] = useState(
    application.recruiterNotes || ""
  );

  useEffect(() => {
    setNotes(application.recruiterNotes || "");
  }, [application._id, application.recruiterNotes]);

  const education = application.candidateEducation || [];
  const skills = application.candidateSkills || [];

  const isTerminal = [
    "selected",
    "rejected",
    "withdrawn",
    "closed",
  ].includes(application.status);

  const saveNotes = async () => {
    await onNotesSave(application._id, notes);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close application details"
        className="absolute inset-0 cursor-default bg-slate-950/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <aside className="relative flex h-full w-full max-w-xl flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-200">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-700">
              Application details
            </p>
            <p className="mt-1 truncate text-xs text-slate-500">
              ID: {application._id || "Unavailable"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-5 sm:p-6">
          <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-violet-50 via-white to-white p-5">
            <div className="flex items-start gap-4">
              <CandidateAvatar
                candidate={application.candidate}
                size="large"
              />

              <div className="min-w-0 flex-1">
                <h2 className="break-words text-xl font-bold text-slate-950">
                  {application.candidateName}
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  {application.candidateRole || "Role not provided"}
                </p>

                <div className="mt-3">
                  <StatusBadge status={application.status} />
                </div>
              </div>

              <div className="shrink-0 rounded-xl border border-violet-100 bg-white px-3 py-2 text-center">
                <p className="text-2xl font-bold text-violet-700">
                  {application.score ?? "—"}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  ATS score
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 border-t border-violet-100 pt-4">
              <DetailField icon={Mail}>
                {application.candidateEmail}
              </DetailField>

              <DetailField icon={Phone}>
                {application.candidatePhone}
              </DetailField>

              <DetailField icon={MapPin}>
                {application.candidateLocation}
              </DetailField>

              <DetailField icon={BriefcaseBusiness}>
                {application.candidateRole}
              </DetailField>
            </div>

            {application.candidatePortfolio && (
              <a
                href={application.candidatePortfolio}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-violet-700 hover:text-violet-900"
              >
                View candidate portfolio
                <ExternalLink size={15} />
              </a>
            )}
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="font-semibold text-slate-950">
                Application status
              </h3>
              <span className="text-xs text-slate-400">
                Saved to server
              </span>
            </div>

            <label
              htmlFor="application-status"
              className="mb-2 block text-xs font-medium text-slate-500"
            >
              Update candidate stage
            </label>

            <select
              id="application-status"
              value={application.status}
              disabled={busyStatus}
              onChange={(event) =>
                onStatusChange(application._id, event.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100 disabled:opacity-60"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className="mt-3 flex flex-wrap gap-2">
              {!isTerminal && (
                <button
                  type="button"
                  disabled={
                    busyStatus || application.status === "shortlisted"
                  }
                  onClick={() =>
                    onStatusChange(application._id, "shortlisted")
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <UserCheck size={16} />
                  Shortlist
                </button>
              )}

              {!isTerminal && (
                <button
                  type="button"
                  disabled={busyStatus}
                  onClick={() =>
                    onStatusChange(application._id, "rejected")
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:opacity-50"
                >
                  <XCircle size={16} />
                  Reject
                </button>
              )}
            </div>
          </section>

          <section>
            <h3 className="mb-3 font-semibold text-slate-950">
              Position applied for
            </h3>

            <div className="rounded-xl border border-slate-200 p-4">
              <p className="break-words font-semibold text-slate-900">
                {application.jobTitle}
              </p>

              {application.jobDepartment && (
                <p className="mt-1 text-sm text-slate-500">
                  {application.jobDepartment}
                </p>
              )}

              <p className="mt-2 text-xs text-slate-500">
                Applied {formatDate(application.appliedAt)}
              </p>
            </div>
          </section>

          <section>
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-950">
              <Code2 size={17} className="text-violet-600" />
              Skills
            </h3>

            {skills.length ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                No skills have been added to the candidate profile.
              </p>
            )}
          </section>

          <section>
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-950">
              <GraduationCap size={18} className="text-violet-600" />
              Education
            </h3>

            {education.length ? (
              <div className="space-y-3">
                {education.map((item, index) => (
                  <div
                    key={item._id || `${item.institute}-${index}`}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <p className="font-semibold text-slate-900">
                      {[item.degree, item.field]
                        .filter(Boolean)
                        .join(" · ") || "Education"}
                    </p>

                    {item.institute && (
                      <p className="mt-1 text-sm text-slate-600">
                        {item.institute}
                      </p>
                    )}

                    {(item.startYear || item.endYear) && (
                      <p className="mt-2 text-xs text-slate-500">
                        {item.startYear || "—"} –{" "}
                        {item.endYear || "Present"}
                      </p>
                    )}

                    {item.grade && (
                      <p className="mt-1 text-xs text-slate-500">
                        Grade: {item.grade}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                No education details are available.
              </p>
            )}
          </section>

          <section>
            <h3 className="mb-3 font-semibold text-slate-950">
              Candidate message
            </h3>

            <div className="whitespace-pre-wrap break-words rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              {application.messageToRecruiter || "No message provided."}
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="font-semibold text-slate-950">
                Private recruiter notes
              </h3>
              <ShieldCheck size={17} className="text-violet-600" />
            </div>

            <p className="mb-3 text-xs text-slate-500">
              Visible to authorized recruiting team members only.
            </p>

            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              maxLength={5000}
              rows={4}
              placeholder="Add interview feedback, observations, or follow-up reminders..."
              className="w-full resize-y rounded-xl border border-slate-200 p-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            />

            <div className="mt-2 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                {notes.length}/5000 characters
              </span>

              <button
                type="button"
                onClick={saveNotes}
                disabled={busyNotes || notes.length > 5000}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busyNotes ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : (
                  <Check size={16} />
                )}
                {busyNotes ? "Saving..." : "Save notes"}
              </button>
            </div>
          </section>

          <section>
            <h3 className="mb-3 font-semibold text-slate-950">
              Resume
            </h3>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
              <div className="rounded-xl bg-rose-50 p-3 text-rose-600">
                <FileText size={22} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="break-words text-sm font-semibold text-slate-800">
                  {application.resumeTitle}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Resume attached to this application
                </p>
              </div>

              {application.resumeUrl ? (
                <a
                  href={application.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700 hover:bg-violet-100"
                >
                  Open
                  <ExternalLink size={13} />
                </a>
              ) : (
                <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-500">
                  Unavailable
                </span>
              )}
            </div>
          </section>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-5 py-4 sm:px-6">
          <span className="text-xs text-slate-500">
            Applied {formatRelativeDate(application.appliedAt)}
          </span>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Close details
          </button>
        </div>
      </aside>
    </div>
  );
}

export default function RecruiterApplication() {
  const {
    applications = [],
    myApplicationPagination,
    handleGetRecruiterApplications,
    handleGetApplicationById,
    handleUpdateApplicationStatus,
    handleUpdateRecruiterNotes,
  } = useApplication();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobFilter, setJobFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [view, setView] = useState("table");

  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busyStatus, setBusyStatus] = useState(false);
  const [busyNotes, setBusyNotes] = useState(false);

  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const items = useMemo(
    () =>
      Array.isArray(applications)
        ? applications.map(normalizeApplication)
        : [],
    [applications]
  );

  const notify = useCallback((message) => {
    setToast(message);
  }, []);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(() => setToast(""), 2800);

    return () => window.clearTimeout(timer);
  }, [toast]);

  const fetchApplications = useCallback(
    async ({ silent = false } = {}) => {
      if (typeof handleGetRecruiterApplications !== "function") {
        setError(
          "Recruiter applications handler is missing from ApplicationContext."
        );
        setLoading(false);
        setRefreshing(false);
        return;
      }

      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      try {
        await handleGetRecruiterApplications({
          page,
          limit: pageSize,
          search: search.trim(),
          status: statusFilter === "all" ? "" : statusFilter,
          jobId: jobFilter,
          sortBy,
          includeDeleted: false,
        });
      } catch (err) {
        setError(err?.message || "Unable to load applications.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [
      handleGetRecruiterApplications,
      page,
      pageSize,
      search,
      statusFilter,
      jobFilter,
      sortBy,
    ]
  );

  useEffect(() => {
    fetchApplications();
  }, []);

  const totalItems =
    myApplicationPagination?.total ??
    myApplicationPagination?.totalApplications ??
    myApplicationPagination?.totalDocs ??
    items.length;

  const totalPages = Math.max(
    1,
    Number(
      myApplicationPagination?.totalPages ??
        Math.ceil(totalItems / pageSize)
    ) || 1
  );

  const safePage = Math.min(page, totalPages);

  useEffect(() => {
    if (page !== safePage) {
      setPage(safePage);
    }
  }, [page, safePage]);

  const stats = useMemo(
    () => ({
      total: items.length,
      review: items.filter((item) =>
        ["applied", "screening"].includes(item.status)
      ).length,
      shortlisted: items.filter(
        (item) => item.status === "shortlisted"
      ).length,
      interviews: items.filter((item) =>
        ["interview_scheduled", "interview_completed"].includes(
          item.status
        )
      ).length,
      selected: items.filter((item) => item.status === "selected").length,
    }),
    [items]
  );

  const jobOptions = useMemo(() => {
    const options = new Map();

    items.forEach((item) => {
      const id = getId(item.job) || item.jobId;

      if (id && item.jobTitle) {
        options.set(id, item.jobTitle);
      }
    });

    if (jobFilter && !options.has(jobFilter)) {
      options.set(jobFilter, "Selected job");
    }

    return [...options.entries()].map(([id, title]) => ({
      id,
      title,
    }));
  }, [items, jobFilter]);

  const openApplication = async (applicationId) => {
    if (!applicationId) {
      notify("This application does not have a valid ID.");
      return;
    }

    if (typeof handleGetApplicationById !== "function") {
      setError("Application details handler is missing from ApplicationContext.");
      return;
    }

    setError("");

    try {
      const result = await handleGetApplicationById({ applicationId });
      const detail = getApplicationFromResponse(result);

      if (!detail || typeof detail !== "object" || !detail._id) {
        notify("Application details could not be loaded.");
        return;
      }

      setSelectedApplication(detail);
    } catch (err) {
      setError(err?.message || "Unable to load application details.");
    }
  };

  const updateStatus = async (applicationId, status) => {
    const current = items.find((item) => item._id === applicationId);

    if (!current || current.status === status) return;

    if (typeof handleUpdateApplicationStatus !== "function") {
      setError("Application status handler is missing from ApplicationContext.");
      return;
    }

    setBusyStatus(true);
    setError("");

    try {
      await handleUpdateApplicationStatus({
        applicationId,
        status,
      });

      setSelectedApplication((previous) =>
        previous?._id === applicationId
          ? { ...previous, status }
          : previous
      );

      notify(
        `Status updated to ${STATUS_META[status]?.label || status}.`
      );

      await fetchApplications({ silent: true });
    } catch (err) {
      setError(err?.message || "Unable to update application status.");
      notify("Status update failed.");
    } finally {
      setBusyStatus(false);
    }
  };

  const saveNotes = async (applicationId, recruiterNotes) => {
    if (typeof handleUpdateRecruiterNotes !== "function") {
      setError("Recruiter notes handler is missing from ApplicationContext.");
      return;
    }

    setBusyNotes(true);
    setError("");

    try {
      await handleUpdateRecruiterNotes({
        applicationId,
        recruiterNotes,
      });

      setSelectedApplication((previous) =>
        previous?._id === applicationId
          ? { ...previous, recruiterNotes }
          : previous
      );

      notify("Recruiter notes saved.");

      await fetchApplications({ silent: true });
    } catch (err) {
      setError(err?.message || "Unable to save recruiter notes.");
      notify("Saving recruiter notes failed.");
    } finally {
      setBusyNotes(false);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setJobFilter("");
    setSortBy("newest");
    setPage(1);
  };

  const changeFilter = (setter, value) => {
    setter(value);
    setPage(1);
  };

  const exportCsv = () => {
    if (items.length === 0) {
      notify("There are no applications to export.");
      return;
    }

    const headers = [
      "Application ID",
      "Candidate",
      "Email",
      "Position",
      "Status",
      "ATS Score",
      "Applied Date",
      "Recruiter Notes",
    ];

    const rows = items.map((item) => [
      item._id,
      item.candidateName,
      item.candidateEmail,
      item.jobTitle,
      STATUS_META[item.status]?.label || item.status,
      item.score ?? "",
      formatDate(item.appliedAt),
      item.recruiterNotes,
    ]);

    const escapeCsv = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `peer-hiring-applications-page-${safePage}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);

    setShowExportMenu(false);
    notify("Current page exported to CSV.");
  };

  const visibleRangeStart =
    totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;

  const visibleRangeEnd = Math.min(
    (safePage - 1) * pageSize + items.length,
    totalItems
  );

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-slate-900">
      <main className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">
        <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">
              <Sparkles size={15} />
              Talent workspace
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Applications
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Review real candidates, manage hiring stages, and keep your
              recruitment pipeline moving.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setShowExportMenu((previous) => !previous)
                }
                disabled={items.length === 0}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
              >
                <Download size={16} />
                Export current page
                <ChevronDown size={15} />
              </button>

              {showExportMenu && (
                <div className="absolute right-0 top-12 z-20 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                  <button
                    type="button"
                    onClick={exportCsv}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-violet-50 hover:text-violet-700"
                  >
                    <FileText size={16} />
                    Export this page as CSV
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => fetchApplications({ silent: true })}
              disabled={refreshing || loading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-800"
            >
              <RotateCcw size={16} />
              Reset filters
            </button>
          </div>
        </header>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
          >
            <AlertCircle size={19} className="mt-0.5 shrink-0" />

            <div className="min-w-0 flex-1">
              <p className="font-semibold">Something went wrong</p>
              <p className="mt-1 break-words">{error}</p>
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="rounded-md p-1 hover:bg-rose-100"
              aria-label="Dismiss error"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Applications on page"
            value={loading ? "—" : stats.total}
            description={`${totalItems} matching application(s) across all pages`}
            icon={Users}
            tone="violet"
          />

          <MetricCard
            title="Needs review"
            value={loading ? "—" : stats.review}
            description="New applications and screening on this page"
            icon={Clock3}
            tone="amber"
          />

          <MetricCard
            title="Shortlisted"
            value={loading ? "—" : stats.shortlisted}
            description="Shortlisted candidates on this page"
            icon={UserCheck}
            tone="blue"
          />

          <MetricCard
            title="Interviews"
            value={loading ? "—" : stats.interviews}
            description={`${stats.selected} selected on this page`}
            icon={CalendarDays}
            tone="emerald"
          />
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-bold text-slate-950">
                Hiring pipeline
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Manage applications returned by your recruiter account.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {[
                { label: "New", value: "applied" },
                { label: "Screening", value: "screening" },
                { label: "Shortlisted", value: "shortlisted" },
                {
                  label: "Interview",
                  value: "interview_scheduled",
                },
                { label: "Selected", value: "selected" },
              ].map((stage) => {
                const count = items.filter(
                  (item) => item.status === stage.value
                ).length;

                return (
                  <button
                    key={stage.value}
                    type="button"
                    onClick={() =>
                      changeFilter(setStatusFilter, stage.value)
                    }
                    className={`rounded-xl border px-3 py-2 text-left transition ${
                      statusFilter === stage.value
                        ? "border-violet-300 bg-violet-50"
                        : "border-slate-200 bg-white hover:border-violet-200 hover:bg-violet-50/50"
                    }`}
                  >
                    <span className="block text-[11px] font-medium text-slate-500">
                      {stage.label}
                    </span>
                    <span className="mt-0.5 block text-base font-bold text-slate-900">
                      {loading ? "—" : count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3 border-b border-slate-100 p-4 sm:p-5">
            <div className="flex flex-col gap-3 xl:flex-row">
              <div className="relative min-w-0 flex-1">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(event) =>
                    changeFilter(setSearch, event.target.value)
                  }
                  placeholder="Search candidates, email, skills, or applications..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => changeFilter(setSearch, "")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                    aria-label="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="relative min-w-[180px] flex-1 sm:flex-none">
                  <BriefcaseBusiness
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <select
                    value={jobFilter}
                    onChange={(event) =>
                      changeFilter(setJobFilter, event.target.value)
                    }
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-9 text-sm font-medium text-slate-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                  >
                    <option value="">All jobs</option>
                    {jobOptions.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.title}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowFilters((previous) => !previous)
                  }
                  className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    showFilters || statusFilter !== "all"
                      ? "border-violet-200 bg-violet-50 text-violet-700"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <SlidersHorizontal size={16} />
                  Filters
                  <ChevronDown
                    size={14}
                    className={
                      showFilters
                        ? "rotate-180 transition"
                        : "transition"
                    }
                  />
                </button>

                <div className="flex rounded-xl border border-slate-200 bg-white p-1">
                  <button
                    type="button"
                    onClick={() => setView("table")}
                    title="Table view"
                    aria-label="Table view"
                    className={`rounded-lg p-2 transition ${
                      view === "table"
                        ? "bg-violet-100 text-violet-700"
                        : "text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    <List size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setView("grid")}
                    title="Grid view"
                    aria-label="Grid view"
                    className={`rounded-lg p-2 transition ${
                      view === "grid"
                        ? "bg-violet-100 text-violet-700"
                        : "text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    <LayoutGrid size={18} />
                  </button>
                </div>
              </div>
            </div>

            {showFilters && (
              <div className="grid gap-3 rounded-xl border border-violet-100 bg-violet-50/40 p-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label
                    htmlFor="status-filter"
                    className="mb-1.5 block text-xs font-semibold text-slate-600"
                  >
                    Application status
                  </label>

                  <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={(event) =>
                      changeFilter(setStatusFilter, event.target.value)
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-500"
                  >
                    <option value="all">All statuses</option>
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="application-sort"
                    className="mb-1.5 block text-xs font-semibold text-slate-600"
                  >
                    Sort applications
                  </label>

                  <select
                    id="application-sort"
                    value={sortBy}
                    onChange={(event) =>
                      changeFilter(setSortBy, event.target.value)
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-500"
                  >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="updated">Recently updated</option>
                    <option value="score_high">Highest ATS score</option>
                    <option value="score_low">Lowest ATS score</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-100"
                  >
                    <RotateCcw size={15} />
                    Clear all filters
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <p>
                Showing{" "}
                <span className="font-semibold text-slate-800">
                  {loading
                    ? "—"
                    : `${visibleRangeStart}–${visibleRangeEnd}`}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-800">
                  {loading ? "—" : totalItems}
                </span>{" "}
                matching applications
              </p>

              {(search || statusFilter !== "all" || jobFilter) && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 font-semibold text-violet-700 hover:text-violet-900"
                >
                  Clear active filters
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-72 flex-col items-center justify-center gap-3 p-8 text-center">
              <LoaderCircle
                size={32}
                className="animate-spin text-violet-700"
              />
              <p className="text-sm font-semibold text-slate-700">
                Loading applications...
              </p>
              <p className="text-xs text-slate-500">
                Fetching your recruiter pipeline.
              </p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center px-5 py-16 text-center">
              <div className="rounded-2xl bg-violet-50 p-4 text-violet-700">
                <Search size={27} />
              </div>

              <h3 className="mt-4 text-base font-bold text-slate-900">
                No applications found
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                There are no applications matching these filters. Try a
                different search or clear your filters.
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              {view === "table" ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1000px] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        <th className="px-5 py-4">
                          <span className="inline-flex items-center gap-2">
                            Candidate
                            <ArrowUpDown size={12} />
                          </span>
                        </th>
                        <th className="px-5 py-4">Applied for</th>
                        <th className="px-5 py-4">ATS score</th>
                        <th className="px-5 py-4">Applied date</th>
                        <th className="px-5 py-4">Status</th>
                        <th className="px-5 py-4 text-right">Actions</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {items.map((item) => (
                        <tr
                          key={item._id}
                          className="group transition hover:bg-violet-50/30"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <CandidateAvatar candidate={item.candidate} />

                              <div className="min-w-0">
                                <button
                                  type="button"
                                  onClick={() =>
                                    openApplication(item._id)
                                  }
                                  className="block max-w-[220px] truncate text-sm font-semibold text-slate-900 hover:text-violet-700"
                                >
                                  {item.candidateName}
                                </button>

                                <p className="mt-1 max-w-[220px] truncate text-xs text-slate-500">
                                  {item.candidateEmail ||
                                    "No email available"}
                                </p>

                                <p className="mt-1 max-w-[220px] truncate text-xs text-slate-400">
                                  {item.candidateRole ||
                                    "Role not provided"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <p className="max-w-[230px] truncate text-sm font-medium text-slate-800">
                              {item.jobTitle}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {item.jobDepartment || "Position"}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            {item.score !== null ? (
                              <>
                                <div className="flex items-center gap-2">
                                  <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                                    <div
                                      className="h-full rounded-full bg-violet-600"
                                      style={{
                                        width: `${Math.min(
                                          100,
                                          Math.max(0, item.score)
                                        )}%`,
                                      }}
                                    />
                                  </div>

                                  <span className="text-sm font-bold text-slate-800">
                                    {item.score}%
                                  </span>
                                </div>

                                <p className="mt-1 text-[10px] text-slate-400">
                                  ATS score
                                </p>
                              </>
                            ) : (
                              <span className="text-xs text-slate-400">
                                Not scored
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <p className="text-sm font-medium text-slate-700">
                              {formatDate(item.appliedAt)}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              {formatRelativeDate(item.appliedAt)}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex flex-col items-start gap-2">
                              <StatusBadge status={item.status} />

                              <select
                                value={item.status}
                                disabled={busyStatus}
                                onChange={(event) =>
                                  updateStatus(
                                    item._id,
                                    event.target.value
                                  )
                                }
                                aria-label={`Update status for ${item.candidateName}`}
                                className="max-w-[190px] cursor-pointer rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium outline-none focus:border-violet-500 disabled:opacity-50"
                              >
                                {STATUS_OPTIONS.map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() =>
                                  openApplication(item._id)
                                }
                                title="View application"
                                aria-label="View application"
                                className="rounded-lg p-2 text-slate-500 transition hover:bg-violet-100 hover:text-violet-700"
                              >
                                <Eye size={17} />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  openApplication(item._id)
                                }
                                title="Recruiter notes"
                                aria-label="Open recruiter notes"
                                className="rounded-lg p-2 text-slate-500 transition hover:bg-violet-100 hover:text-violet-700"
                              >
                                <MessageSquareText size={17} />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  openApplication(item._id)
                                }
                                title="More details"
                                aria-label="More details"
                                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                              >
                                <MoreHorizontal size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
                  {items.map((item) => (
                    <article
                      key={item._id}
                      className="rounded-2xl border border-slate-200 p-5 transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <CandidateAvatar
                          candidate={item.candidate}
                          size="large"
                        />
                        <StatusBadge status={item.status} />
                      </div>

                      <h3 className="mt-4 break-words font-bold text-slate-950">
                        {item.candidateName}
                      </h3>

                      <p className="mt-1 truncate text-sm text-slate-500">
                        {item.candidateRole || "Role not provided"}
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-400">
                        {item.candidateEmail}
                      </p>

                      <div className="mt-4 rounded-xl bg-slate-50 p-3">
                        <p className="text-xs font-medium text-slate-500">
                          Applied for
                        </p>
                        <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                          {item.jobTitle}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                          ATS score
                        </span>
                        <span className="text-sm font-bold text-violet-700">
                          {item.score === null
                            ? "Not scored"
                            : `${item.score}%`}
                        </span>
                      </div>

                      {item.score !== null && (
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-violet-600"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.max(0, item.score)
                              )}%`,
                            }}
                          />
                        </div>
                      )}

                      <p className="mt-3 text-xs text-slate-500">
                        Applied {formatDate(item.appliedAt)}
                      </p>

                      {item.candidateSkills.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {item.candidateSkills.slice(0, 4).map(
                            (skill, index) => (
                              <span
                                key={`${skill}-${index}`}
                                className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600"
                              >
                                {skill}
                              </span>
                            )
                          )}

                          {item.candidateSkills.length > 4 && (
                            <span className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] text-slate-500">
                              +{item.candidateSkills.length - 4}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
                        <button
                          type="button"
                          onClick={() => openApplication(item._id)}
                          className="flex-1 rounded-xl bg-violet-700 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800"
                        >
                          View application
                        </button>

                        <select
                          value={item.status}
                          disabled={busyStatus}
                          onChange={(event) =>
                            updateStatus(item._id, event.target.value)
                          }
                          aria-label={`Update status for ${item.candidateName}`}
                          className="max-w-[145px] rounded-xl border border-slate-200 bg-white px-2 text-xs font-medium outline-none focus:border-violet-500 disabled:opacity-50"
                        >
                          {STATUS_OPTIONS.map((option) => (
                            <option
                              key={option.value}
                              value={option.value}
                            >
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              <footer className="flex flex-col justify-between gap-4 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <p className="text-xs text-slate-500">Rows per page</p>

                  <select
                    value={pageSize}
                    onChange={(event) => {
                      setPageSize(Number(event.target.value));
                      setPage(1);
                    }}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-violet-500"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>

                  <span className="hidden text-xs text-slate-400 sm:inline">
                    {totalItems} total results
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <p className="text-xs font-medium text-slate-500">
                    Page {safePage} of {totalPages}
                  </p>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={safePage <= 1 || loading}
                      onClick={() =>
                        setPage((previous) => Math.max(1, previous - 1))
                      }
                      aria-label="Previous page"
                      className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft size={17} />
                    </button>

                    {Array.from(
                      { length: totalPages },
                      (_, index) => index + 1
                    )
                      .filter(
                        (number) =>
                          number === 1 ||
                          number === totalPages ||
                          Math.abs(number - safePage) <= 1
                      )
                      .map((number, index, array) => (
                        <React.Fragment key={number}>
                          {index > 0 &&
                            number - array[index - 1] > 1 && (
                              <span className="px-1 text-slate-400">
                                …
                              </span>
                            )}

                          <button
                            type="button"
                            disabled={loading}
                            onClick={() => setPage(number)}
                            className={`min-w-9 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                              number === safePage
                                ? "bg-violet-700 text-white"
                                : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                            }`}
                          >
                            {number}
                          </button>
                        </React.Fragment>
                      ))}

                    <button
                      type="button"
                      disabled={safePage >= totalPages || loading}
                      onClick={() =>
                        setPage((previous) =>
                          Math.min(totalPages, previous + 1)
                        )
                      }
                      aria-label="Next page"
                      className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronRight size={17} />
                    </button>
                  </div>
                </div>
              </footer>
            </>
          )}
        </section>

        <div className="flex flex-col justify-between gap-2 pb-2 text-xs text-slate-400 sm:flex-row sm:items-center">
          <p>Peer.Hiring · Recruiter workspace</p>

          <p className="inline-flex items-center gap-1.5">
            <CircleDot size={12} className="text-emerald-500" />
            Connected to recruiter application API
          </p>
        </div>
      </main>

      {selectedApplication && (
        <ApplicationDrawer
          key={selectedApplication._id}
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onStatusChange={updateStatus}
          onNotesSave={saveNotes}
          busyStatus={busyStatus}
          busyNotes={busyNotes}
        />
      )}

      {toast && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-[70] flex max-w-[calc(100vw-2.5rem)] items-center gap-3 rounded-xl bg-slate-950 px-4 py-3 text-sm font-medium text-white shadow-2xl"
        >
          <CheckCircle2
            size={18}
            className="shrink-0 text-emerald-400"
          />

          <span>{toast}</span>

          <button
            type="button"
            onClick={() => setToast("")}
            className="ml-1 rounded-md p-1 text-slate-400 hover:bg-white/10 hover:text-white"
            aria-label="Dismiss notification"
          >
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
