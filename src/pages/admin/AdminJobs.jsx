
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  BriefcaseBusiness,
  Users,
  Ban,
  Trash2,
  Search,
  RefreshCw,
  LoaderCircle,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Eye,
  CheckCircle,
  Clock,
  X,
  MapPin,
  Building2,
  CalendarDays,
  IndianRupee,
  AlertCircle,
  ShieldCheck,
  FileText,
  CircleDollarSign,
  Filter,
  ChevronDown,
  UserRound,
  Layers,
} from "lucide-react";

import { useAdmin } from "../../hooks/Hook";

const PAGE_SIZE = 8;

/* ----------------------------- Helpers ----------------------------- */

const cn = (...classes) => classes.filter(Boolean).join(" ");

const formatDate = (value) => {
  if (!value) return "Not specified";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not specified";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatLabel = (value) => {
  if (value === null || value === undefined || value === "") {
    return "Not specified";
  }

  return String(value)
    .trim()
    .replace(/[_-]+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const getItemText = (item) => {
  if (typeof item === "string" || typeof item === "number") {
    return String(item);
  }

  if (item && typeof item === "object") {
    return (
      item.name ||
      item.title ||
      item.label ||
      item.value ||
      ""
    );
  }

  return "";
};

const formatSalary = (salary) => {
  if (!salary || typeof salary !== "object") {
    return "Not specified";
  }

  const { min, max, currency, isNegotiable } = salary;

  const currencyCode = currency || "INR";

  const formatAmount = (amount) =>
    Number(amount).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });

  const symbol = currencyCode.toUpperCase() === "INR"
    ? "₹"
    : `${currencyCode.toUpperCase()} `;

  if (min == null && max == null) {
    return isNegotiable ? "Negotiable" : "Not specified";
  }

  if (min != null && max != null) {
    return `${symbol}${formatAmount(min)} – ${symbol}${formatAmount(max)}`;
  }

  if (min != null) {
    return `From ${symbol}${formatAmount(min)}`;
  }

  return `Up to ${symbol}${formatAmount(max)}`;
};

const getCompanyName = (job) => {
  const company = job?.companyId || job?.company;

  if (typeof company === "object" && company !== null) {
    return company.name || company.companyName || "Unknown company";
  }

  return job?.companyName || "Unknown company";
};

const getCompanyLogo = (job) => {
  const company = job?.companyId || job?.company;
  const logo = company?.logo;

  if (typeof logo === "string") return logo;

  return logo?.url || company?.logoUrl || "";
};

const getRecruiterName = (job) => {
  const recruiter = job?.recruiterId || job?.recruiter;

  if (typeof recruiter === "object" && recruiter !== null) {
    return (
      recruiter.name ||
      recruiter.fullName ||
      recruiter.email ||
      "Not specified"
    );
  }

  return job?.recruiterName || "Not specified";
};

const getLocation = (job) => {
  const location = job?.location;

  if (typeof location === "string" && location.trim()) {
    return location;
  }

  if (location && typeof location === "object") {
    const parts = [
      location.city,
      location.state,
      location.country,
    ].filter(Boolean);

    return parts.length ? parts.join(", ") : "Not specified";
  }

  return "Not specified";
};

/*
 * Moderation status takes priority over the normal job lifecycle status.
 * The actual Job schema uses uppercase lifecycle enum values.
 */
const getJobStatus = (job) => {
  if (job?.isDeleted === true) return "deleted";
  if (job?.isBlocked === true) return "blocked";

  const status = String(job?.status || "DRAFT").toUpperCase();

  if (status === "OPEN") {
    const deadline = job?.applicationDeadline;

    if (deadline) {
      const deadlineTime = new Date(deadline).getTime();

      if (
        !Number.isNaN(deadlineTime) &&
        deadlineTime < Date.now()
      ) {
        return "expired";
      }
    }

    return "open";
  }

  if (status === "PAUSED") return "paused";
  if (status === "CLOSED") return "closed";
  if (status === "EXPIRED") return "expired";
  if (status === "DRAFT") return "draft";

  return "unknown";
};

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "open", label: "Open" },
  { value: "blocked", label: "Blocked" },
  { value: "deleted", label: "Deleted" },
  { value: "paused", label: "Paused" },
  { value: "closed", label: "Closed" },
  { value: "expired", label: "Expired" },
  { value: "draft", label: "Draft" },
];

const STATUS_STYLES = {
  open: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  blocked: "bg-red-50 text-red-700 ring-red-600/15",
  deleted: "bg-slate-100 text-slate-600 ring-slate-500/15",
  paused: "bg-amber-50 text-amber-700 ring-amber-600/15",
  closed: "bg-slate-100 text-slate-700 ring-slate-500/15",
  expired: "bg-orange-50 text-orange-700 ring-orange-600/15",
  draft: "bg-violet-50 text-violet-700 ring-violet-600/15",
  unknown: "bg-slate-100 text-slate-600 ring-slate-500/15",
};

const StatusBadge = ({ status }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1",
      "text-xs font-semibold capitalize ring-1 ring-inset",
      STATUS_STYLES[status] || STATUS_STYLES.unknown
    )}
  >
    <span
      className={cn(
        "h-1.5 w-1.5 rounded-full",
        status === "open" && "bg-emerald-500",
        status === "blocked" && "bg-red-500",
        status === "deleted" && "bg-slate-400",
        status === "paused" && "bg-amber-500",
        status === "closed" && "bg-slate-400",
        status === "expired" && "bg-orange-500",
        status === "draft" && "bg-violet-500"
      )}
    />
    {formatLabel(status)}
  </span>
);

/* ----------------------------- UI pieces ----------------------------- */

const IconButton = ({
  title,
  onClick,
  children,
  danger = false,
  disabled = false,
}) => (
  <button
    type="button"
    title={title}
    aria-label={title}
    disabled={disabled}
    onClick={onClick}
    className={cn(
      "inline-flex h-9 w-9 items-center justify-center rounded-xl",
      "border transition disabled:cursor-not-allowed disabled:opacity-50",
      danger
        ? "border-red-100 text-red-600 hover:bg-red-50"
        : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-violet-700"
    )}
  >
    {children}
  </button>
);

const StatCard = ({ title, value, description, icon: Icon, iconClass }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
          {value}
        </p>
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      </div>

      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
          iconClass
        )}
      >
        <Icon size={21} />
      </div>
    </div>
  </div>
);

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex min-w-0 gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3">
    <div className="mt-0.5 shrink-0 text-violet-600">
      <Icon size={17} />
    </div>

    <div className="min-w-0">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-slate-800">
        {value === null || value === undefined || value === ""
          ? "Not specified"
          : value}
      </p>
    </div>
  </div>
);

const ListSection = ({ title, items }) => {
  if (!Array.isArray(items) || items.length === 0) return null;

  const validItems = items.map(getItemText).filter(Boolean);

  if (!validItems.length) return null;

  return (
    <section>
      <h3 className="mb-3 text-sm font-bold text-slate-900">{title}</h3>

      <ul className="space-y-2">
        {validItems.map((item, index) => (
          <li
            key={`${title}-${index}`}
            className="flex items-start gap-2 text-sm leading-6 text-slate-600"
          >
            <CheckCircle
              size={16}
              className="mt-1 shrink-0 text-violet-500"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

/* ----------------------------- Job details modal ----------------------------- */

const JobDetailsModal = ({ job, onClose, onModerate, busy }) => {
  if (!job) return null;

  const status = getJobStatus(job);
  const blocked = job.isBlocked === true;
  const deleted = job.isDeleted === true;

  const companyLogo = getCompanyLogo(job);
  const companyName = getCompanyName(job);

  const skills = Array.isArray(job.skills) ? job.skills : [];

  const applicationCount = Number(job.applicantsCount ?? 0);
  const views = Number(job.views ?? 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-details-title"
        className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-violet-700 via-violet-700 to-indigo-800 px-5 py-6 text-white sm:px-8">
          <div className="absolute -right-10 -top-20 h-56 w-56 rounded-full bg-white/10 blur-2xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white/10">
                {companyLogo ? (
                  <img
                    src={companyLogo}
                    alt={companyName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Building2 size={26} />
                )}
              </div>

              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold">
                    Job details
                  </span>
                  <StatusBadge status={status} />
                </div>

                <h2
                  id="job-details-title"
                  className="break-words text-xl font-bold sm:text-2xl"
                >
                  {job.title || "Untitled job"}
                </h2>

                <p className="mt-1 text-sm text-violet-100">
                  {companyName}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              aria-label="Close job details"
              className="shrink-0 rounded-xl p-2 text-white/80 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
            >
              <X size={21} />
            </button>
          </div>

          <div className="relative mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-violet-100">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={15} />
              {getLocation(job)}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <BriefcaseBusiness size={15} />
              {formatLabel(job.employmentType)}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <IndianRupee size={15} />
              {formatSalary(job.salary)}
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-7 overflow-y-auto p-5 sm:p-8">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <DetailItem
              icon={UserRound}
              label="Recruiter"
              value={getRecruiterName(job)}
            />

            <DetailItem
              icon={Layers}
              label="Category"
              value={formatLabel(job.category)}
            />

            <DetailItem
              icon={BriefcaseBusiness}
              label="Experience level"
              value={formatLabel(job.experienceLevel)}
            />

            <DetailItem
              icon={Building2}
              label="Work mode"
              value={formatLabel(job.workSpaceType)}
            />

            <DetailItem
              icon={Users}
              label="Openings"
              value={job.openings ?? "Not specified"}
            />

            <DetailItem
              icon={Users}
              label="Applications"
              value={applicationCount.toLocaleString("en-IN")}
            />

            <DetailItem
              icon={Eye}
              label="Views"
              value={views.toLocaleString("en-IN")}
            />

            <DetailItem
              icon={CalendarDays}
              label="Posted"
              value={formatDate(job.createdAt)}
            />

            <DetailItem
              icon={Clock}
              label="Application deadline"
              value={formatDate(job.applicationDeadline)}
            />

            <DetailItem
              icon={CircleDollarSign}
              label="Salary negotiable"
              value={job.salary?.isNegotiable ? "Yes" : "No"}
            />

            <DetailItem
              icon={FileText}
              label="Currency"
              value={job.salary?.currency || "INR"}
            />

            <DetailItem
              icon={FileText}
              label="Job ID"
              value={job._id}
            />
          </div>

          {skills.length > 0 && (
            <section>
              <h3 className="mb-3 text-sm font-bold text-slate-900">
                Required skills
              </h3>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => {
                  const label = getItemText(skill);

                  if (!label) return null;

                  return (
                    <span
                      key={`${label}-${index}`}
                      className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700"
                    >
                      {formatLabel(label)}
                    </span>
                  );
                })}
              </div>
            </section>
          )}

          <section>
            <h3 className="mb-3 text-sm font-bold text-slate-900">
              Job description
            </h3>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
                {job.description || "No job description provided."}
              </p>
            </div>
          </section>

          <ListSection title="Responsibilities" items={job.responsibilities} />
          <ListSection title="Requirements" items={job.requirements} />

          <div className="grid gap-3 sm:grid-cols-2">
            <DetailItem
              icon={CalendarDays}
              label="Last updated"
              value={formatDate(job.updatedAt)}
            />

            <DetailItem
              icon={ShieldCheck}
              label="Moderation"
              value={deleted ? "Deleted" : blocked ? "Blocked" : "Not blocked"}
            />
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:flex-row sm:justify-between sm:px-8">
          <button
            type="button"
            onClick={() => onModerate(job)}
            disabled={busy || deleted}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5",
              "text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
              blocked
                ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                : "border-red-200 text-red-700 hover:bg-red-50"
            )}
          >
            {busy ? (
              <LoaderCircle size={16} className="animate-spin" />
            ) : blocked ? (
              <CheckCircle size={16} />
            ) : (
              <Ban size={16} />
            )}

            {blocked ? "Unblock job" : "Block job"}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:opacity-50"
          >
            Close details
          </button>
        </div>
      </div>
    </div>
  );
};

/* ----------------------------- Confirmation modal ----------------------------- */

const ConfirmModal = ({
  action,
  job,
  onCancel,
  onConfirm,
  loading,
}) => {
  if (!action || !job) return null;

  const isDelete = action === "delete";
  const isUnblock = action === "unblock";

  const title = isDelete
    ? "Delete this job?"
    : isUnblock
      ? "Unblock this job?"
      : "Block this job?";

  const description = isDelete
    ? "Confirm that you want to delete this job. The actual effect depends on your backend's delete implementation."
    : isUnblock
      ? "This will clear the job's blocked flag. Its normal lifecycle status will remain unchanged."
      : "This will block the job from normal availability without changing its lifecycle status.";

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) onCancel();
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl"
      >
        <div
          className={cn(
            "mb-4 flex h-12 w-12 items-center justify-center rounded-2xl",
            isDelete || !isUnblock
              ? "bg-red-50 text-red-600"
              : "bg-emerald-50 text-emerald-600"
          )}
        >
          {isDelete ? (
            <Trash2 size={23} />
          ) : isUnblock ? (
            <CheckCircle size={23} />
          ) : (
            <Ban size={23} />
          )}
        </div>

        <h3 id="confirm-title" className="text-lg font-bold text-slate-900">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {description}
        </p>

        <div className="mt-4 rounded-xl bg-slate-50 p-3">
          <p className="break-words text-sm font-semibold text-slate-800">
            {job.title || "Untitled job"}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {getCompanyName(job)}
          </p>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={cn(
              "flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5",
              "text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60",
              isDelete || !isUnblock
                ? "bg-red-600 hover:bg-red-700"
                : "bg-emerald-600 hover:bg-emerald-700"
            )}
          >
            {loading && <LoaderCircle size={16} className="animate-spin" />}

            {loading
              ? "Processing..."
              : isDelete
                ? "Delete job"
                : isUnblock
                  ? "Unblock job"
                  : "Block job"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ----------------------------- Main page ----------------------------- */

export default function AdminJobs() {
  const {
    jobs: rawJobs = [],
    handleGetJobs,
    handleGetJobById,
    handleBlockJob,
    handleUnlockJob,
    handleDeleteJob,
  } = useAdmin();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [selected, setSelected] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [menuJobId, setMenuJobId] = useState(null);

  /* Fetch jobs through your existing AdminContext handler. */
  const fetchJobs = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setInitialLoading(true);
      }

      setError("");

      try {
        await handleGetJobs({
          page: 1,
          search: "",
          status: "",
        });

        return true;
      } catch (err) {
        setError(err?.message || "Unable to load jobs. Please try again.");
        return false;
      } finally {
        setInitialLoading(false);
        setRefreshing(false);
      }
    },
    [handleGetJobs]
  );

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  useEffect(() => {
    if (!menuJobId) return;

    const closeMenu = (event) => {
      if (event.key === "Escape") {
        setMenuJobId(null);
      }
    };

    document.addEventListener("keydown", closeMenu);

    return () => document.removeEventListener("keydown", closeMenu);
  }, [menuJobId]);

  const jobs = useMemo(
    () => (Array.isArray(rawJobs) ? rawJobs : []),
    [rawJobs]
  );

  const stats = useMemo(() => {
    const active = jobs.filter((job) => getJobStatus(job) === "open").length;
    const blocked = jobs.filter((job) => job.isBlocked === true).length;

    const applications = jobs.reduce(
      (total, job) => total + Number(job.applicantsCount ?? 0),
      0
    );

    return {
      total: jobs.length,
      active,
      blocked,
      applications,
    };
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return jobs.filter((job) => {
      const status = getJobStatus(job);

      const matchesStatus =
        statusFilter === "all" || status === statusFilter;

      const searchable = [
        job.title,
        job._id,
        getCompanyName(job),
        getRecruiterName(job),
        getLocation(job),
        job.category,
        job.status,
        job.employmentType,
        job.workSpaceType,
        job.experienceLevel,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && (!query || searchable.includes(query));
    });
  }, [jobs, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const visibleJobs = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredJobs.slice(start, start + PAGE_SIZE);
  }, [filteredJobs, safePage]);

  const openJobDetails = useCallback(
    async (job) => {
      setMenuJobId(null);
      setSelected(job);
      setDetailsLoading(true);
      setError("");

      try {
        const fullJob = await handleGetJobById(job._id);

        // Supports a context handler returning either the job or a response.
        const normalizedJob =
          fullJob?.data?.job ||
          fullJob?.data ||
          fullJob?.job ||
          fullJob;

        if (normalizedJob && typeof normalizedJob === "object") {
          setSelected(normalizedJob);
        }
      } catch (err) {
        setError(
          err?.message ||
            "Could not load complete job details. Showing available information."
        );
      } finally {
        setDetailsLoading(false);
      }
    },
    [handleGetJobById]
  );

  const requestBlockAction = useCallback((job) => {
    setMenuJobId(null);

    if (job.isDeleted === true) return;

    setConfirmAction({
      type: job.isBlocked === true ? "unblock" : "block",
      job,
    });
  }, []);

  const requestDeleteAction = useCallback((job) => {
    setMenuJobId(null);
    setConfirmAction({ type: "delete", job });
  }, []);

  const runConfirmedAction = useCallback(async () => {
    if (!confirmAction?.job?._id) return;

    const { type, job } = confirmAction;

    setActionLoading(true);
    setError("");
    setNotice("");

    try {
      if (type === "delete") {
        await handleDeleteJob(job._id);

        if (selected?._id === job._id) {
          setSelected(null);
        }

        setNotice("Job deleted successfully.");
      } else if (type === "block") {
        await handleBlockJob(job._id);
        setNotice("Job blocked successfully.");
      } else if (type === "unblock") {
        await handleUnlockJob(job._id);
        setNotice("Job unblocked successfully.");
      }

      setConfirmAction(null);

      // Reload list to get the latest server-side state.
      await fetchJobs(true);

      // Refresh selected details when the modal remains open.
      if (selected?._id === job._id && type !== "delete") {
        try {
          const refreshed = await handleGetJobById(job._id);

          const normalizedJob =
            refreshed?.data?.job ||
            refreshed?.data ||
            refreshed?.job ||
            refreshed;

          if (normalizedJob && typeof normalizedJob === "object") {
            setSelected(normalizedJob);
          }
        } catch {
          // The refreshed list remains available if details fail.
        }
      }
    } catch (err) {
      setError(err?.message || "The action failed. Please try again.");
    } finally {
      setActionLoading(false);
    }
  }, [
    confirmAction,
    selected,
    handleDeleteJob,
    handleBlockJob,
    handleUnlockJob,
    handleGetJobById,
    fetchJobs,
  ]);

  const handleRefresh = async () => {
    setNotice("");
    await fetchJobs(true);
  };

  return (
    <div
      className="min-h-screen bg-[#F7F8FC] px-4 py-6 text-slate-900 sm:px-6 lg:px-8"
      onClick={() => {
        if (menuJobId) setMenuJobId(null);
      }}
    >
      <div className="mx-auto max-w-[1600px] space-y-6">
        {/* Page heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-violet-600">
              <ShieldCheck size={15} />
              Administration
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Jobs management
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Review job postings, inspect recruiter listings, and manage
              blocked or inappropriate jobs from one place.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing || initialLoading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-200 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-60 sm:self-center"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            {refreshing ? "Refreshing..." : "Refresh jobs"}
          </button>
        </div>

        {/* Feedback messages */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            <AlertCircle size={19} className="mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold">Something went wrong</p>
              <p className="mt-1 break-words">{error}</p>
            </div>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
              className="rounded-lg p-1 hover:bg-red-100"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {notice && (
          <div
            role="status"
            className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
          >
            <CheckCircle size={19} className="mt-0.5 shrink-0" />
            <p className="flex-1">{notice}</p>
            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Dismiss message"
              className="rounded-lg p-1 hover:bg-emerald-100"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Loaded jobs"
            value={stats.total}
            description="Jobs returned by the current API request"
            icon={BriefcaseBusiness}
            iconClass="bg-violet-50 text-violet-700"
          />

          <StatCard
            title="Open jobs"
            value={stats.active}
            description="Open jobs whose deadlines have not passed"
            icon={CheckCircle}
            iconClass="bg-emerald-50 text-emerald-700"
          />

          <StatCard
            title="Blocked jobs"
            value={stats.blocked}
            description="Jobs blocked by admin moderation"
            icon={Ban}
            iconClass="bg-red-50 text-red-700"
          />

          <StatCard
            title="Applications"
            value={stats.applications.toLocaleString("en-IN")}
            description="Applications for the loaded jobs"
            icon={Users}
            iconClass="bg-blue-50 text-blue-700"
          />
        </div>

        {/* Main jobs table */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-4 sm:p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  All job postings
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {filteredJobs.length} matching{" "}
                  {filteredJobs.length === 1 ? "job" : "jobs"}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative min-w-0 sm:min-w-[280px]">
                  <Search
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    onClick={(event) => event.stopPropagation()}
                    placeholder="Search job, company, recruiter..."
                    aria-label="Search jobs"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                  />
                </div>

                <div className="relative">
                  <Filter
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    onClick={(event) => event.stopPropagation()}
                    aria-label="Filter by job status"
                    className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm font-medium outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100 sm:min-w-[170px]"
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {initialLoading ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 px-4">
              <LoaderCircle
                size={32}
                className="animate-spin text-violet-600"
              />
              <p className="text-sm font-medium text-slate-600">
                Loading jobs...
              </p>
            </div>
          ) : visibleJobs.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center px-5 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                <BriefcaseBusiness size={29} />
              </div>

              <h3 className="mt-4 text-base font-bold text-slate-900">
                No jobs found
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {search || statusFilter !== "all"
                  ? "Try changing your search or status filter."
                  : "There are no jobs in the collection returned by the server."}
              </p>

              {(search || statusFilter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("all");
                  }}
                  className="mt-4 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[1000px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80">
                      {[
                        "Job",
                        "Recruiter",
                        "Location",
                        "Salary",
                        "Status",
                        "Posted",
                        "Actions",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className={cn(
                            "px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500",
                            heading === "Actions" && "text-right"
                          )}
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {visibleJobs.map((job) => {
                      const status = getJobStatus(job);
                      const blocked = job.isBlocked === true;
                      const deleted = job.isDeleted === true;

                      return (
                        <tr
                          key={job._id}
                          className="transition hover:bg-violet-50/30"
                        >
                          <td className="px-4 py-4">
                            <div className="flex min-w-0 items-start gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-violet-50 text-violet-700">
                                {getCompanyLogo(job) ? (
                                  <img
                                    src={getCompanyLogo(job)}
                                    alt={getCompanyName(job)}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <BriefcaseBusiness size={19} />
                                )}
                              </div>

                              <div className="min-w-0 max-w-[280px]">
                                <button
                                  type="button"
                                  onClick={() => openJobDetails(job)}
                                  className="block max-w-full truncate text-left text-sm font-bold text-slate-900 hover:text-violet-700"
                                >
                                  {job.title || "Untitled job"}
                                </button>

                                <p className="mt-1 truncate text-xs text-slate-500">
                                  {getCompanyName(job)}
                                </p>

                                <div className="mt-2 flex flex-wrap gap-1.5">
                                  {job.employmentType && (
                                    <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                                      {formatLabel(job.employmentType)}
                                    </span>
                                  )}

                                  {job.workSpaceType && (
                                    <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                                      {formatLabel(job.workSpaceType)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <p className="max-w-[170px] truncate text-sm font-medium text-slate-800">
                              {getRecruiterName(job)}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              Recruiter
                            </p>
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex max-w-[180px] items-start gap-1.5 text-sm text-slate-600">
                              <MapPin
                                size={15}
                                className="mt-0.5 shrink-0 text-slate-400"
                              />
                              <span>{getLocation(job)}</span>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <p className="whitespace-nowrap text-sm font-semibold text-slate-800">
                              {formatSalary(job.salary)}
                            </p>
                            {job.salary?.isNegotiable && (
                              <p className="mt-1 text-xs text-slate-500">
                                Negotiable
                              </p>
                            )}
                          </td>

                          <td className="px-4 py-4">
                            <StatusBadge status={status} />
                          </td>

                          <td className="px-4 py-4">
                            <p className="whitespace-nowrap text-sm text-slate-700">
                              {formatDate(job.createdAt)}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              Deadline: {formatDate(job.applicationDeadline)}
                            </p>
                          </td>

                          <td className="px-4 py-4">
                            <div
                              className="relative flex items-center justify-end gap-2"
                              onClick={(event) => event.stopPropagation()}
                            >
                              <IconButton
                                title="View job details"
                                onClick={() => openJobDetails(job)}
                              >
                                <Eye size={17} />
                              </IconButton>

                              <IconButton
                                title={blocked ? "Unblock job" : "Block job"}
                                disabled={deleted}
                                onClick={() => requestBlockAction(job)}
                                danger={!blocked}
                              >
                                {blocked ? (
                                  <CheckCircle size={17} />
                                ) : (
                                  <Ban size={17} />
                                )}
                              </IconButton>

                              <div className="relative">
                                <IconButton
                                  title="More actions"
                                  onClick={() =>
                                    setMenuJobId((current) =>
                                      current === job._id ? null : job._id
                                    )
                                  }
                                >
                                  <MoreVertical size={18} />
                                </IconButton>

                                {menuJobId === job._id && (
                                  <div
                                    className="absolute right-0 top-11 z-20 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl"
                                    onClick={(event) => event.stopPropagation()}
                                  >
                                    <button
                                      type="button"
                                      onClick={() => openJobDetails(job)}
                                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-violet-50 hover:text-violet-700"
                                    >
                                      <Eye size={16} />
                                      View details
                                    </button>

                                    {!deleted && (
                                      <button
                                        type="button"
                                        onClick={() => requestBlockAction(job)}
                                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
                                      >
                                        {blocked ? (
                                          <CheckCircle size={16} />
                                        ) : (
                                          <Ban size={16} />
                                        )}
                                        {blocked ? "Unblock job" : "Block job"}
                                      </button>
                                    )}

                                    <div className="my-1 border-t border-slate-100" />

                                    <button
                                      type="button"
                                      onClick={() => requestDeleteAction(job)}
                                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                                    >
                                      <Trash2 size={16} />
                                      Delete job
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="space-y-3 p-3 md:hidden">
                {visibleJobs.map((job) => {
                  const status = getJobStatus(job);
                  const blocked = job.isBlocked === true;
                  const deleted = job.isDeleted === true;

                  return (
                    <article
                      key={job._id}
                      className="rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-violet-50 text-violet-700">
                          {getCompanyLogo(job) ? (
                            <img
                              src={getCompanyLogo(job)}
                              alt={getCompanyName(job)}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <BriefcaseBusiness size={20} />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="break-words text-sm font-bold text-slate-900">
                            {job.title || "Untitled job"}
                          </h3>
                          <p className="mt-1 break-words text-xs text-slate-500">
                            {getCompanyName(job)}
                          </p>
                          <div className="mt-2">
                            <StatusBadge status={status} />
                          </div>
                        </div>

                        <button
                          type="button"
                          aria-label="View job details"
                          onClick={() => openJobDetails(job)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-violet-50 hover:text-violet-700"
                        >
                          <Eye size={18} />
                        </button>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-100 pt-3">
                        <div className="flex items-start gap-2 text-sm text-slate-600">
                          <MapPin size={15} className="mt-0.5 shrink-0 text-slate-400" />
                          <span>{getLocation(job)}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <IndianRupee size={15} className="shrink-0 text-slate-400" />
                          <span>{formatSalary(job.salary)}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <BriefcaseBusiness size={15} className="shrink-0 text-slate-400" />
                          <span>
                            {formatLabel(job.employmentType)} ·{" "}
                            {formatLabel(job.workSpaceType)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <CalendarDays size={15} className="shrink-0 text-slate-400" />
                          <span>Posted {formatDate(job.createdAt)}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Users size={15} className="shrink-0 text-slate-400" />
                          <span>
                            {Number(job.applicantsCount ?? 0).toLocaleString("en-IN")} applications
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
                        {!deleted && (
                          <button
                            type="button"
                            onClick={() => requestBlockAction(job)}
                            className={cn(
                              "inline-flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold",
                              blocked
                                ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                : "border-red-200 text-red-700 hover:bg-red-50"
                            )}
                          >
                            {blocked ? (
                              <CheckCircle size={15} />
                            ) : (
                              <Ban size={15} />
                            )}
                            {blocked ? "Unblock" : "Block"}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => requestDeleteAction(job)}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 px-3 py-2.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                        >
                          <Trash2 size={15} />
                          Delete
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <p className="text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-semibold text-slate-800">
                    {(safePage - 1) * PAGE_SIZE + 1}–
                    {Math.min(safePage * PAGE_SIZE, filteredJobs.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-800">
                    {filteredJobs.length}
                  </span>{" "}
                  jobs
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    disabled={safePage <= 1}
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>

                  <span className="px-2 text-sm font-medium text-slate-600">
                    {safePage} / {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setPage((current) => Math.min(totalPages, current + 1))
                    }
                    disabled={safePage >= totalPages}
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </section>

        <p className="px-1 text-xs leading-5 text-slate-400">
          Statistics and pagination cover only the jobs loaded from your API.
          Increase or paginate the server request if your database contains
          more jobs than the current response returns.
        </p>
      </div>

      {/* Job details modal */}
      {selected && (
        <JobDetailsModal
          job={selected}
          onClose={() => {
            if (!actionLoading) setSelected(null);
          }}
          onModerate={requestBlockAction}
          busy={actionLoading}
        />
      )}

      {/* Confirmation modal */}
      {confirmAction && (
        <ConfirmModal
          action={confirmAction.type}
          job={confirmAction.job}
          loading={actionLoading}
          onCancel={() => {
            if (!actionLoading) setConfirmAction(null);
          }}
          onConfirm={runConfirmedAction}
        />
      )}

      {/* Details loading indicator */}
      {detailsLoading && selected && (
        <div className="fixed bottom-5 right-5 z-[70] flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-lg">
          <LoaderCircle size={17} className="animate-spin text-violet-600" />
          Loading full job details...
        </div>
      )}
    </div>
  );
}
