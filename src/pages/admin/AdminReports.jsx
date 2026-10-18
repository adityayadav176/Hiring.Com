import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ShieldCheck,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  RefreshCw,
  LoaderCircle,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Eye,
  X,
  AlertCircle,
  Filter,
  ChevronDown,
  UserRound,
  BriefcaseBusiness,
  CalendarDays,
  MessageSquareText,
  UserCheck,
  ShieldAlert,
} from "lucide-react";

import { useReport } from "../../hooks/Hook";

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

const formatDateTime = (value) => {
  if (!value) return "Not specified";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not specified";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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

const getId = (value) => {
  if (!value) return "";

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  return String(value._id || value.id || "");
};

const getUserName = (user) => {
  if (!user) return "Unknown user";

  if (typeof user === "string") {
    return user;
  }

  return (
    user.name ||
    user.fullName ||
    user.username ||
    user.email ||
    getId(user) ||
    "Unknown user"
  );
};

const getUserEmail = (user) => {
  if (!user || typeof user !== "object") {
    return "Not specified";
  }

  return user.email || "Not specified";
};

const getJobTitle = (job) => {
  if (!job) return "Unknown job";

  if (typeof job === "string") {
    return `Job ID: ${job}`;
  }

  return job.title || job.jobTitle || getId(job) || "Unknown job";
};

const getJobCompany = (job) => {
  if (!job || typeof job !== "object") {
    return "Not specified";
  }

  const company = job.companyId || job.company;

  if (company && typeof company === "object") {
    return (
      company.name ||
      company.companyName ||
      "Company not specified"
    );
  }

  return job.companyName || "Company not specified";
};

const getTargetType = (report) => {
  if (report?.reportedUser) return "user";
  if (report?.reportedJob) return "job";
  return "unknown";
};

const getTargetName = (report) => {
  if (report?.reportedUser) {
    return getUserName(report.reportedUser);
  }

  if (report?.reportedJob) {
    return getJobTitle(report.reportedJob);
  }

  return "Target unavailable";
};

const getReportStatus = (report) => {
  const status = String(report?.status || "pending").toLowerCase();

  if (["pending", "resolved", "rejected"].includes(status)) {
    return status;
  }

  return "pending";
};

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "resolved", label: "Resolved" },
  { value: "rejected", label: "Rejected" },
];

const TARGET_OPTIONS = [
  { value: "all", label: "All report types" },
  { value: "user", label: "User reports" },
  { value: "job", label: "Job reports" },
  { value: "unknown", label: "Unknown target" },
];

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-700 ring-amber-600/15",
  resolved: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  rejected: "bg-red-50 text-red-700 ring-red-600/15",
};

const StatusBadge = ({ status }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1",
      "text-xs font-semibold capitalize ring-1 ring-inset",
      STATUS_STYLES[status] || STATUS_STYLES.pending
    )}
  >
    <span
      className={cn(
        "h-1.5 w-1.5 rounded-full",
        status === "pending" && "bg-amber-500",
        status === "resolved" && "bg-emerald-500",
        status === "rejected" && "bg-red-500"
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

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  iconClass,
}) => (
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

/* ----------------------------- Report details modal ----------------------------- */

const ReportDetailsModal = ({
  report,
  onClose,
  onResolve,
  onReject,
  busy,
}) => {
  if (!report) return null;

  const status = getReportStatus(report);
  const reporter = report.reporter;
  const targetType = getTargetType(report);
  const targetUser = report.reportedUser;
  const targetJob = report.reportedJob;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-details-title"
        className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        {/* Header matches the violet administration theme */}
        <div className="relative overflow-hidden bg-gradient-to-br from-violet-700 via-violet-700 to-indigo-800 px-5 py-6 text-white sm:px-8">
          <div className="absolute -right-10 -top-20 h-56 w-56 rounded-full bg-white/10 blur-2xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
                <ShieldAlert size={26} />
              </div>

              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold">
                    Report details
                  </span>

                  <StatusBadge status={status} />
                </div>

                <h2
                  id="report-details-title"
                  className="break-words text-xl font-bold sm:text-2xl"
                >
                  {formatLabel(report.reason)}
                </h2>

                <p className="mt-1 break-all text-sm text-violet-100">
                  Report ID: {getId(report) || "Not specified"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              aria-label="Close report details"
              className="shrink-0 rounded-xl p-2 text-white/80 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
            >
              <X size={21} />
            </button>
          </div>

          <div className="relative mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-violet-100">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={15} />
              Submitted {formatDate(report.createdAt)}
            </span>

            <span className="inline-flex items-center gap-1.5">
              {targetType === "job" ? (
                <BriefcaseBusiness size={15} />
              ) : (
                <UserRound size={15} />
              )}
              {formatLabel(targetType)} report
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-7 overflow-y-auto p-5 sm:p-8">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <DetailItem
              icon={UserRound}
              label="Reported by"
              value={getUserName(reporter)}
            />

            <DetailItem
              icon={MessageSquareText}
              label="Reporter email"
              value={getUserEmail(reporter)}
            />

            <DetailItem
              icon={ShieldCheck}
              label="Report status"
              value={formatLabel(status)}
            />

            <DetailItem
              icon={FileText}
              label="Reason"
              value={formatLabel(report.reason)}
            />

            <DetailItem
              icon={CalendarDays}
              label="Submitted on"
              value={formatDateTime(report.createdAt)}
            />

            <DetailItem
              icon={CalendarDays}
              label="Last updated"
              value={formatDateTime(report.updatedAt)}
            />

            {targetUser && (
              <>
                <DetailItem
                  icon={UserRound}
                  label="Reported user"
                  value={getUserName(targetUser)}
                />

                <DetailItem
                  icon={MessageSquareText}
                  label="Reported user email"
                  value={getUserEmail(targetUser)}
                />

                <DetailItem
                  icon={FileText}
                  label="Reported user ID"
                  value={getId(targetUser)}
                />
              </>
            )}

            {targetJob && (
              <>
                <DetailItem
                  icon={BriefcaseBusiness}
                  label="Reported job"
                  value={getJobTitle(targetJob)}
                />

                <DetailItem
                  icon={BriefcaseBusiness}
                  label="Company"
                  value={getJobCompany(targetJob)}
                />

                <DetailItem
                  icon={FileText}
                  label="Reported job ID"
                  value={getId(targetJob)}
                />
              </>
            )}

            <DetailItem
              icon={UserCheck}
              label="Resolved by"
              value={report.resolvedBy}
            />

            <DetailItem
              icon={CalendarDays}
              label="Resolved at"
              value={formatDateTime(report.resolvedAt)}
            />

            <DetailItem
              icon={FileText}
              label="Report ID"
              value={getId(report)}
            />
          </div>

          <section>
            <h3 className="mb-3 text-sm font-bold text-slate-900">
              Report description
            </h3>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
                {report.description?.trim() ||
                  "No additional description was provided."}
              </p>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-bold text-slate-900">
              Admin note
            </h3>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
                {report.adminNote?.trim() || "No admin note recorded."}
              </p>
            </div>
          </section>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex flex-col gap-2 sm:flex-row">
            {status === "pending" && (
              <>
                <button
                  type="button"
                  onClick={() => onReject(report)}
                  disabled={busy}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-50"
                >
                  <XCircle size={16} />
                  Reject report
                </button>

                <button
                  type="button"
                  onClick={() => onResolve(report)}
                  disabled={busy}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:opacity-50"
                >
                  {busy ? (
                    <LoaderCircle size={16} className="animate-spin" />
                  ) : (
                    <CheckCircle size={16} />
                  )}
                  Resolve report
                </button>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
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
  report,
  onCancel,
  onConfirm,
  loading,
}) => {
  if (!action || !report) return null;

  const isResolve = action === "resolve";

  const title = isResolve
    ? "Resolve this report?"
    : "Reject this report?";

  const description = isResolve
    ? "Confirm that this report has been reviewed and should be marked as resolved."
    : "Confirm that this report has been reviewed and should be marked as rejected.";

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) {
          onCancel();
        }
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
            isResolve
              ? "bg-emerald-50 text-emerald-600"
              : "bg-red-50 text-red-600"
          )}
        >
          {isResolve ? <CheckCircle size={23} /> : <XCircle size={23} />}
        </div>

        <h3 id="confirm-title" className="text-lg font-bold text-slate-900">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {description}
        </p>

        <div className="mt-4 rounded-xl bg-slate-50 p-3">
          <p className="break-words text-sm font-semibold text-slate-800">
            {formatLabel(report.reason)}
          </p>

          <p className="mt-1 break-all text-xs text-slate-500">
            Report ID: {getId(report) || "Not specified"}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Reported target: {getTargetName(report)}
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
              "inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5",
              "text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60",
              isResolve
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-red-600 hover:bg-red-700"
            )}
          >
            {loading && (
              <LoaderCircle size={16} className="animate-spin" />
            )}

            {loading
              ? "Processing..."
              : isResolve
                ? "Resolve report"
                : "Reject report"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ----------------------------- Main page ----------------------------- */

export default function AdminReports() {
  const {
    reports: rawReports = [],
    selected: contextSelected,
    setSelected: setContextSelected,
    reportsPagination,
    handleGetReports,
    handleGetReportById,
    handleResolveReport,
    handleRejectReport,
  } = useReport();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [targetFilter, setTargetFilter] = useState("all");
  const [page, setPage] = useState(1);

  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [selected, setSelected] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [menuReportId, setMenuReportId] = useState(null);

  /* Fetch reports through your existing ReportContext handler. */
  const fetchReports = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setInitialLoading(true);
      }

      setError("");

      try {
        await handleGetReports();
        return true;
      } catch (err) {
        setError(
          err?.message || "Unable to load reports. Please try again."
        );
        return false;
      } finally {
        setInitialLoading(false);
        setRefreshing(false);
      }
    },
    [handleGetReports]
  );

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, targetFilter]);

  useEffect(() => {
    if (!menuReportId) return;

    const closeMenu = (event) => {
      if (event.key === "Escape") {
        setMenuReportId(null);
      }
    };

    document.addEventListener("keydown", closeMenu);

    return () => document.removeEventListener("keydown", closeMenu);
  }, [menuReportId]);

  const reports = useMemo(
    () => (Array.isArray(rawReports) ? rawReports : []),
    [rawReports]
  );

  const stats = useMemo(() => {
    return {
      total: reports.length,
      pending: reports.filter(
        (report) => getReportStatus(report) === "pending"
      ).length,
      resolved: reports.filter(
        (report) => getReportStatus(report) === "resolved"
      ).length,
      rejected: reports.filter(
        (report) => getReportStatus(report) === "rejected"
      ).length,
    };
  }, [reports]);

  const filteredReports = useMemo(() => {
    const query = search.trim().toLowerCase();

    return reports.filter((report) => {
      const status = getReportStatus(report);
      const targetType = getTargetType(report);

      const matchesStatus =
        statusFilter === "all" || status === statusFilter;

      const matchesTarget =
        targetFilter === "all" || targetType === targetFilter;

      const searchable = [
        getId(report),
        report.reason,
        report.description,
        report.adminNote,
        report.status,
        getUserName(report.reporter),
        getUserEmail(report.reporter),
        getTargetName(report),
        getId(report.reportedUser),
        getId(report.reportedJob),
        getJobCompany(report.reportedJob),
        report.resolvedBy,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        matchesStatus &&
        matchesTarget &&
        (!query || searchable.includes(query))
      );
    });
  }, [reports, search, statusFilter, targetFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredReports.length / PAGE_SIZE)
  );

  const safePage = Math.min(page, totalPages);

  const visibleReports = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;

    return filteredReports.slice(start, start + PAGE_SIZE);
  }, [filteredReports, safePage]);

  const openReportDetails = useCallback(
    async (report) => {
      setMenuReportId(null);
      setSelected(report);
      setDetailsLoading(true);
      setError("");

      try {
        await handleGetReportById({ reportId: getId(report) });

        /*
         * Your context's handleGetReportById sets `selected` itself.
         * Read the latest value on the next render below.
         */
      } catch (err) {
        setError(
          err?.message ||
            "Could not load complete report details. Showing available information."
        );
      } finally {
        setDetailsLoading(false);
      }
    },
    [handleGetReportById]
  );

  useEffect(() => {
    if (
      contextSelected &&
      typeof contextSelected === "object" &&
      getId(contextSelected)
    ) {
      setSelected(contextSelected);
    }
  }, [contextSelected]);

  const requestAction = useCallback((report, type) => {
    setMenuReportId(null);

    if (getReportStatus(report) !== "pending") return;

    setConfirmAction({ type, report });
  }, []);

  const runConfirmedAction = useCallback(async () => {
    const report = confirmAction?.report;
    const reportId = getId(report);

    if (!reportId) return;

    const { type } = confirmAction;

    setActionLoading(true);
    setError("");
    setNotice("");

    try {
      if (type === "resolve") {
        await handleResolveReport({ reportId });
        setNotice("Report resolved successfully.");
      } else if (type === "reject") {
        await handleRejectReport({ reportId });
        setNotice("Report rejected successfully.");
      }

      setConfirmAction(null);

      /*
       * Refresh the list so the latest server status is displayed.
       * This also restores rejected reports if the current context removes
       * them optimistically after rejection.
       */
      await fetchReports(true);

      if (getId(selected) === reportId) {
        try {
          await handleGetReportById({ reportId });
        } catch {
          // The refreshed report list remains available.
        }
      }
    } catch (err) {
      setError(
        err?.message || "The action failed. Please try again."
      );
    } finally {
      setActionLoading(false);
    }
  }, [
    confirmAction,
    selected,
    handleResolveReport,
    handleRejectReport,
    handleGetReportById,
    fetchReports,
  ]);

  const handleRefresh = async () => {
    setNotice("");
    await fetchReports(true);
  };

  const closeDetails = () => {
    if (actionLoading) return;

    setSelected(null);

    if (typeof setContextSelected === "function") {
      setContextSelected(null);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#F7F8FC] px-4 py-6 text-slate-900 sm:px-6 lg:px-8"
      onClick={() => {
        if (menuReportId) setMenuReportId(null);
      }}
    >
      <div className="mx-auto max-w-[1600px] space-y-6">
        {/* Page heading: same size and placement as AdminJobs */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-violet-600">
              <ShieldCheck size={15} />
              Administration
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Reports management
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Review user and job reports, investigate reported content,
              and manage report resolutions from one place.
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

            {refreshing ? "Refreshing..." : "Refresh reports"}
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

        {/* Statistics: same card dimensions as AdminJobs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Loaded reports"
            value={stats.total}
            description="Reports returned by the current API request"
            icon={FileText}
            iconClass="bg-violet-50 text-violet-700"
          />

          <StatCard
            title="Pending reports"
            value={stats.pending}
            description="Reports awaiting admin review"
            icon={Clock}
            iconClass="bg-amber-50 text-amber-700"
          />

          <StatCard
            title="Resolved reports"
            value={stats.resolved}
            description="Reports reviewed and resolved"
            icon={CheckCircle}
            iconClass="bg-emerald-50 text-emerald-700"
          />

          <StatCard
            title="Rejected reports"
            value={stats.rejected}
            description="Reports reviewed and rejected"
            icon={XCircle}
            iconClass="bg-red-50 text-red-700"
          />
        </div>

        {/* Main table: same container, padding, search, and filter styling */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-4 sm:p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  All reports
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {filteredReports.length} matching{" "}
                  {filteredReports.length === 1 ? "report" : "reports"}
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
                    placeholder="Search report, user, reason..."
                    aria-label="Search reports"
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
                    onChange={(event) =>
                      setStatusFilter(event.target.value)
                    }
                    onClick={(event) => event.stopPropagation()}
                    aria-label="Filter by report status"
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

                <div className="relative">
                  <select
                    value={targetFilter}
                    onChange={(event) =>
                      setTargetFilter(event.target.value)
                    }
                    onClick={(event) => event.stopPropagation()}
                    aria-label="Filter by report target"
                    className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-9 text-sm font-medium outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100 sm:min-w-[155px]"
                  >
                    {TARGET_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
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
                Loading reports...
              </p>
            </div>
          ) : visibleReports.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center px-5 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                <FileText size={29} />
              </div>

              <h3 className="mt-4 text-base font-bold text-slate-900">
                No reports found
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {search ||
                statusFilter !== "all" ||
                targetFilter !== "all"
                  ? "Try changing your search or filters."
                  : "There are no reports in the collection returned by the server."}
              </p>

              {(search ||
                statusFilter !== "all" ||
                targetFilter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("all");
                    setTargetFilter("all");
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
                        "Report",
                        "Reporter",
                        "Reported target",
                        "Reason",
                        "Status",
                        "Submitted",
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
                    {visibleReports.map((report) => {
                      const status = getReportStatus(report);
                      const targetType = getTargetType(report);
                      const pending = status === "pending";

                      return (
                        <tr
                          key={getId(report)}
                          className="transition hover:bg-violet-50/30"
                        >
                          {/* Report */}
                          <td className="px-4 py-4">
                            <div className="flex min-w-0 items-start gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                                <FileText size={19} />
                              </div>

                              <div className="min-w-0 max-w-[230px]">
                                <button
                                  type="button"
                                  onClick={() =>
                                    openReportDetails(report)
                                  }
                                  className="block max-w-full truncate text-left text-sm font-bold text-slate-900 hover:text-violet-700"
                                >
                                  {formatLabel(report.reason)}
                                </button>

                                <p className="mt-1 truncate text-xs text-slate-500">
                                  ID: {getId(report) || "Not specified"}
                                </p>

                                <div className="mt-2 flex flex-wrap gap-1.5">
                                  <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                                    {formatLabel(targetType)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Reporter */}
                          <td className="px-4 py-4">
                            <p className="max-w-[165px] truncate text-sm font-medium text-slate-800">
                              {getUserName(report.reporter)}
                            </p>

                            <p className="mt-1 max-w-[165px] truncate text-xs text-slate-500">
                              {getUserEmail(report.reporter)}
                            </p>
                          </td>

                          {/* Target */}
                          <td className="px-4 py-4">
                            <div className="flex max-w-[190px] items-start gap-2">
                              <div className="mt-0.5 shrink-0 text-slate-400">
                                {targetType === "job" ? (
                                  <BriefcaseBusiness size={15} />
                                ) : (
                                  <UserRound size={15} />
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="break-words text-sm font-medium text-slate-800">
                                  {getTargetName(report)}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                  {targetType === "job"
                                    ? getJobCompany(report.reportedJob)
                                    : targetType === "user"
                                      ? getUserEmail(report.reportedUser)
                                      : "Target unavailable"}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Reason */}
                          <td className="px-4 py-4">
                            <p className="max-w-[175px] break-words text-sm font-medium text-slate-800">
                              {formatLabel(report.reason)}
                            </p>

                            <p className="mt-1 max-w-[175px] truncate text-xs text-slate-500">
                              {report.description?.trim() ||
                                "No description"}
                            </p>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-4">
                            <StatusBadge status={status} />
                          </td>

                          {/* Date */}
                          <td className="px-4 py-4">
                            <p className="whitespace-nowrap text-sm text-slate-700">
                              {formatDate(report.createdAt)}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              Updated: {formatDate(report.updatedAt)}
                            </p>
                          </td>

                          {/* Actions: same eye, check, and menu buttons */}
                          <td className="px-4 py-4">
                            <div
                              className="relative flex items-center justify-end gap-2"
                              onClick={(event) => event.stopPropagation()}
                            >
                              <IconButton
                                title="View report details"
                                onClick={() =>
                                  openReportDetails(report)
                                }
                              >
                                <Eye size={17} />
                              </IconButton>

                              <IconButton
                                title={
                                  pending
                                    ? "Resolve report"
                                    : "Report already reviewed"
                                }
                                disabled={!pending || actionLoading}
                                onClick={() =>
                                  requestAction(report, "resolve")
                                }
                              >
                                <CheckCircle size={17} />
                              </IconButton>

                              <div className="relative">
                                <IconButton
                                  title="More actions"
                                  onClick={() =>
                                    setMenuReportId((current) =>
                                      current === getId(report)
                                        ? null
                                        : getId(report)
                                    )
                                  }
                                >
                                  <MoreVertical size={18} />
                                </IconButton>

                                {menuReportId === getId(report) && (
                                  <div
                                    className="absolute right-0 top-11 z-20 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl"
                                    onClick={(event) =>
                                      event.stopPropagation()
                                    }
                                  >
                                    <button
                                      type="button"
                                      onClick={() =>
                                        openReportDetails(report)
                                      }
                                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-violet-50 hover:text-violet-700"
                                    >
                                      <Eye size={16} />
                                      View details
                                    </button>

                                    {pending && (
                                      <>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            requestAction(
                                              report,
                                              "resolve"
                                            )
                                          }
                                          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                                        >
                                          <CheckCircle size={16} />
                                          Resolve report
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() =>
                                            requestAction(
                                              report,
                                              "reject"
                                            )
                                          }
                                          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                                        >
                                          <XCircle size={16} />
                                          Reject report
                                        </button>
                                      </>
                                    )}
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
                {visibleReports.map((report) => {
                  const status = getReportStatus(report);
                  const targetType = getTargetType(report);
                  const pending = status === "pending";

                  return (
                    <article
                      key={getId(report)}
                      className="rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                          <FileText size={20} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="break-words text-sm font-bold text-slate-900">
                            {formatLabel(report.reason)}
                          </h3>

                          <p className="mt-1 break-all text-xs text-slate-500">
                            ID: {getId(report) || "Not specified"}
                          </p>

                          <div className="mt-2 flex flex-wrap gap-2">
                            <StatusBadge status={status} />

                            <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                              {formatLabel(targetType)}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          aria-label="View report details"
                          onClick={() => openReportDetails(report)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-violet-50 hover:text-violet-700"
                        >
                          <Eye size={18} />
                        </button>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-100 pt-3">
                        <div className="flex items-start gap-2 text-sm text-slate-600">
                          <UserRound
                            size={15}
                            className="mt-0.5 shrink-0 text-slate-400"
                          />

                          <div className="min-w-0">
                            <p className="break-words font-medium text-slate-800">
                              {getUserName(report.reporter)}
                            </p>

                            <p className="break-words text-xs text-slate-500">
                              {getUserEmail(report.reporter)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2 text-sm text-slate-600">
                          {targetType === "job" ? (
                            <BriefcaseBusiness
                              size={15}
                              className="mt-0.5 shrink-0 text-slate-400"
                            />
                          ) : (
                            <UserRound
                              size={15}
                              className="mt-0.5 shrink-0 text-slate-400"
                            />
                          )}

                          <span className="break-words">
                            {getTargetName(report)}
                          </span>
                        </div>

                        <div className="flex items-start gap-2 text-sm text-slate-600">
                          <MessageSquareText
                            size={15}
                            className="mt-0.5 shrink-0 text-slate-400"
                          />

                          <span className="break-words">
                            {report.description?.trim() ||
                              "No description provided."}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <CalendarDays
                            size={15}
                            className="shrink-0 text-slate-400"
                          />

                          <span>Submitted {formatDate(report.createdAt)}</span>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
                        {pending && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                requestAction(report, "resolve")
                              }
                              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-200 px-3 py-2.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                            >
                              <CheckCircle size={15} />
                              Resolve
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                requestAction(report, "reject")
                              }
                              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 px-3 py-2.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                            >
                              <XCircle size={15} />
                              Reject
                            </button>
                          </>
                        )}

                        <button
                          type="button"
                          onClick={() => openReportDetails(report)}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          <Eye size={15} />
                          Details
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Pagination: same dimensions as AdminJobs */}
              <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <p className="text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-semibold text-slate-800">
                    {filteredReports.length === 0
                      ? 0
                      : (safePage - 1) * PAGE_SIZE + 1}
                    –
                    {Math.min(
                      safePage * PAGE_SIZE,
                      filteredReports.length
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-800">
                    {filteredReports.length}
                  </span>{" "}
                  reports
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setPage((current) => Math.max(1, current - 1))
                    }
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
                      setPage((current) =>
                        Math.min(totalPages, current + 1)
                      )
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
          Statistics and pagination cover the reports currently returned
          by your API. If your backend paginates reports, use server-side
          pagination and filtering to include reports outside the loaded
          response.
        </p>
      </div>

      {/* Report details modal */}
      {selected && (
        <ReportDetailsModal
          report={selected}
          onClose={closeDetails}
          onResolve={(report) => requestAction(report, "resolve")}
          onReject={(report) => requestAction(report, "reject")}
          busy={actionLoading}
        />
      )}

      {/* Confirmation modal */}
      {confirmAction && (
        <ConfirmModal
          action={confirmAction.type}
          report={confirmAction.report}
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
          <LoaderCircle
            size={17}
            className="animate-spin text-violet-600"
          />
          Loading full report details...
        </div>
      )}
    </div>
  );
}