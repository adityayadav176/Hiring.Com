
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
  Flag,
  Hash,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  Mail,
} from "lucide-react";

import { useReport } from "../../hooks/Hook";
import { hash } from './../../../node_modules/goober/src/core/hash';

const PAGE_SIZE = 8;

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
  if (typeof user === "string") return user;

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
  if (typeof job === "string") return `Job ID: ${job}`;

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

  return ["pending", "resolved", "rejected"].includes(status)
    ? status
    : "pending";
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

const IconButton = ({
  title,
  onClick,
  children,
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
      "border border-slate-200 text-slate-600 transition",
      "hover:bg-slate-50 hover:text-violet-700",
      "disabled:cursor-not-allowed disabled:opacity-40"
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
    <Icon size={17} className="mt-0.5 shrink-0 text-violet-600" />

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


const getStatusStyle = (status) =>
  STATUS_STYLES[String(status || "pending").toLowerCase()] ||
  "bg-slate-100 text-slate-600 ring-slate-200";

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "U";

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="min-w-0">
    <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">
      <Icon size={14} />
      {label}
    </p>
    <p className="break-words text-sm font-semibold text-slate-800">
      {value || "Not available"}
    </p>
  </div>
);

const Section = ({ icon: Icon, title, children, action }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
    <div className="mb-4 flex items-center justify-between gap-3">
      <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
          <Icon size={16} />
        </span>
        {title}
      </h3>
      {action}
    </div>
    {children}
  </section>
);

const ReportDetailsModal = ({
  report,
  onClose,
  onResolve,
  onReject,
  loading = false,
}) => {
  const [adminNote, setAdminNote] = useState("");
  const [actionType, setActionType] = useState("");

  useEffect(() => {
    if (!report) return;

    setAdminNote(report.adminNote || report.reviewNote || "");
    setActionType("");
  }, [report]);

  useEffect(() => {
    if (!report) return;

    const handleEscape = (event) => {
      if (event.key === "Escape" && !loading) onClose?.();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [report, loading, onClose]);

  if (!report) return null;

  // Adjust these aliases if your backend uses a different response shape.
  const reporter =
    report.reporter ||
    report.reportedBy ||
    report.user ||
    report.createdBy ||
    {};

  const target =
    report.target ||
    report.reportedTarget ||
    report.reportedUser ||
    report.job ||
    {};

  const reporterName =
    reporter.fullName ||
    reporter.name ||
    [reporter.firstName, reporter.lastName].filter(Boolean).join(" ") ||
    report.reporterName ||
    "Unknown user";

  const targetName =
    target.title ||
    target.fullName ||
    target.name ||
    target.companyName ||
    report.targetName ||
    report.reportedName ||
    "Target information unavailable";

  const targetType =
    report.targetType ||
    report.reportType ||
    report.entityType ||
    (report.job ? "Job" : report.reportedUser ? "User" : "Reported target");

  const reason =
    report.reason ||
    report.reportReason ||
    report.category ||
    "Reason not specified";

  const description =
    report.description ||
    report.message ||
    report.details ||
    report.content ||
    "";

  const status = String(report.status || "pending").toLowerCase();
  const isPending = status === "pending";

  const reportId = report._id || report.id || "N/A";

  const handleAction = async (type) => {
    setActionType(type);

    try {
      const callback = type === "resolve" ? onResolve : onReject;

      // Supports callbacks that accept (reportId, adminNote).
      await callback?.(reportId, adminNote.trim());
    } finally {
      setActionType("");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) onClose?.();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-modal-title"
        className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/60 bg-slate-50 shadow-2xl shadow-slate-950/20"
      >
        {/* Header */}
        <div className="relative overflow-hidden border-b border-slate-200 bg-white px-5 py-5 sm:px-7">
          <div className="pointer-events-none absolute -right-12 -top-20 h-48 w-48 rounded-full bg-violet-100/70 blur-3xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                <Flag size={23} />
              </div>

              <div className="min-w-0">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-violet-700">
                    Report review
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ring-1 ring-inset ${getStatusStyle(status)}`}
                  >
                    {status}
                  </span>
                </div>

                <h2
                  id="report-modal-title"
                  className="break-words text-xl font-bold tracking-tight text-slate-950 sm:text-2xl"
                >
                  {reason}
                </h2>

                <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <Hash size={13} />
                    {String(reportId).slice(-12)}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays size={13} />
                    {formatDate(report.createdAt || report.submittedAt)}
                  </span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              aria-label="Close report details"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-4 py-5 sm:px-7 sm:py-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-4">
              {/* Report summary */}
              <Section icon={AlertTriangle} title="Report summary">
                <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                  <InfoItem
                    icon={Flag}
                    label="Reason"
                    value={reason}
                  />
                  <InfoItem
                    icon={Clock3}
                    label="Submitted"
                    value={formatDate(report.createdAt || report.submittedAt)}
                  />
                  <InfoItem
                    icon={FileText}
                    label="Target type"
                    value={targetType}
                  />
                  <InfoItem
                    icon={ShieldCheck}
                    label="Review status"
                    value={status}
                  />
                </div>

                <div className="mt-5 border-t border-slate-100 pt-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Description
                  </p>

                  <div className="whitespace-pre-wrap break-words rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                    {description || "No additional description was provided."}
                  </div>
                </div>
              </Section>

              {/* Reporter */}
              <Section icon={UserRound} title="Reported by">
                <div className="flex items-start gap-3">
                  {reporter.avatar || reporter.profilePicture ? (
                    <img
                      src={reporter.avatar || reporter.profilePicture}
                      alt={reporterName}
                      className="h-12 w-12 shrink-0 rounded-2xl object-cover ring-1 ring-slate-200"
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-sm font-bold text-violet-700">
                      {getInitials(reporterName)}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="break-words font-bold text-slate-900">
                      {reporterName}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 break-all text-xs text-slate-500">
                      <Mail size={13} className="shrink-0" />
                      {reporter.email || report.reporterEmail || "Email unavailable"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                  <InfoItem
                    icon={Hash}
                    label="Reporter ID"
                    value={reporter._id || reporter.id || report.reporterId}
                  />
                  <InfoItem
                    icon={CalendarDays}
                    label="Reported on"
                    value={formatDate(report.createdAt || report.submittedAt)}
                  />
                </div>
              </Section>

              {/* Admin review */}
              <Section icon={MessageSquareText} title="Admin review">
                <label
                  htmlFor="report-admin-note"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Internal review note
                </label>

                <textarea
                  id="report-admin-note"
                  value={adminNote}
                  onChange={(event) => setAdminNote(event.target.value)}
                  rows={4}
                  maxLength={2000}
                  disabled={!isPending || loading}
                  placeholder="Record the reason for your decision or any relevant review details..."
                  className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:bg-slate-100 disabled:text-slate-500"
                />

                <div className="mt-2 flex items-center justify-between gap-3 text-xs text-slate-400">
                  <span>
                    {isPending
                      ? "Add context before taking action."
                      : "This report is no longer pending."}
                  </span>
                  <span>{adminNote.length}/2000</span>
                </div>

                {(report.reviewedBy || report.resolvedAt || report.reviewedAt) && (
                  <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
                    {report.reviewedBy && (
                      <p>
                        Reviewed by:{" "}
                        <span className="font-semibold text-slate-700">
                          {report.reviewedBy.fullName ||
                            report.reviewedBy.name ||
                            report.reviewedBy.email ||
                            "Admin"}
                        </span>
                      </p>
                    )}
                    {(report.resolvedAt || report.reviewedAt) && (
                      <p>
                        Review date:{" "}
                        <span className="font-semibold text-slate-700">
                          {formatDate(report.resolvedAt || report.reviewedAt)}
                        </span>
                      </p>
                    )}
                  </div>
                )}
              </Section>
            </div>

            {/* Reported target */}
            <div className="space-y-4">
              <Section icon={BriefcaseBusiness} title="Reported target">
                <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-4">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-violet-700 shadow-sm ring-1 ring-violet-100">
                    {String(targetType).toLowerCase().includes("user") ? (
                      <UserRound size={20} />
                    ) : (
                      <BriefcaseBusiness size={20} />
                    )}
                  </div>

                  <p className="text-xs font-medium text-slate-500">
                    {targetType}
                  </p>

                  <h4 className="mt-1 break-words text-base font-bold text-slate-900">
                    {targetName}
                  </h4>

                  {target.email && (
                    <p className="mt-1 break-all text-xs text-slate-500">
                      {target.email}
                    </p>
                  )}

                  {(target.companyName || target.company?.name) && (
                    <p className="mt-2 text-sm text-slate-600">
                      Company: {target.companyName || target.company?.name}
                    </p>
                  )}

                  {(target._id || target.id || report.targetId) && (
                    <p className="mt-3 break-all border-t border-violet-100 pt-3 text-xs text-slate-500">
                      Target ID: {target._id || target.id || report.targetId}
                    </p>
                  )}
                </div>

                {target.title && target.company && (
                  <div className="mt-4 space-y-3">
                    <InfoItem
                      icon={BriefcaseBusiness}
                      label="Job title"
                      value={target.title}
                    />
                    <InfoItem
                      icon={UserRound}
                      label="Company"
                      value={target.company.name || target.companyName}
                    />
                  </div>
                )}

                {target.description && (
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Target description
                    </p>
                    <p className="line-clamp-5 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
                      {target.description}
                    </p>
                  </div>
                )}
              </Section>

              {/* Decision guidance */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <ShieldCheck size={18} />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Moderation checklist
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Review the report details, verify the target, and record
                      your reasoning before deciding.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Close
          </button>

          {isPending && (
            <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
              <button
                type="button"
                onClick={() => handleAction("reject")}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-bold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading && actionType === "reject" ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : (
                  <XCircle size={16} />
                )}
                Reject report
              </button>

              <button
                type="button"
                onClick={() => handleAction("resolve")}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-violet-200 transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading && actionType === "resolve" ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={16} />
                )}
                Resolve report
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ConfirmModal = ({
  action,
  report,
  adminNote,
  setAdminNote,
  onCancel,
  onConfirm,
  loading,
}) => {
  if (!action || !report) return null;

  const isResolve = action === "resolve";

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
        aria-labelledby="confirm-report-title"
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

        <h3
          id="confirm-report-title"
          className="text-lg font-bold text-slate-900"
        >
          {isResolve ? "Resolve this report?" : "Reject this report?"}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {isResolve
            ? "Confirm that this report has been reviewed and should be marked as resolved."
            : "Confirm that this report has been reviewed and should be marked as rejected."}
        </p>

        <div className="mt-4 rounded-xl bg-slate-50 p-3">
          <p className="break-words text-sm font-semibold text-slate-800">
            {formatLabel(report.reason)}
          </p>
          <p className="mt-1 break-all text-xs text-slate-500">
            Report ID: {getId(report)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Target: {getTargetName(report)}
          </p>
        </div>

        <label
          htmlFor="report-admin-note"
          className="mt-5 block text-sm font-semibold text-slate-700"
        >
          Admin note <span className="font-normal text-slate-400">(optional)</span>
        </label>

        <textarea
          id="report-admin-note"
          value={adminNote}
          onChange={(event) => setAdminNote(event.target.value)}
          disabled={loading}
          maxLength={2000}
          rows={3}
          placeholder="Add a reason for your decision..."
          className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:bg-slate-50"
        />

        <p className="mt-1 text-right text-xs text-slate-400">
          {adminNote.length}/2000
        </p>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60",
              isResolve
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-red-600 hover:bg-red-700"
            )}
          >
            {loading && <LoaderCircle size={16} className="animate-spin" />}
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

/* -------------------- Main admin reports page -------------------- */

export default function AdminReports() {
  const {
    reports: rawReports = [],
    selected: contextSelected,
    setSelected: setContextSelected,
    reportsPagination = {},
    handleGetReports,
    handleGetReportById,
    handleResolveReport,
    handleRejectReport,
  } = useReport();

  const [searchInput, setSearchInput] = useState("");
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
  const [adminNote, setAdminNote] = useState("");
  const [menuReportId, setMenuReportId] = useState(null);

  // Debounce search to avoid making a request on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchReports = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setInitialLoading(true);
      }

      setError("");

      try {
        await handleGetReports({
          page,
          limit: PAGE_SIZE,
          status: statusFilter === "all" ? "" : statusFilter,
          search,
          targetType: targetFilter === "all" ? "" : targetFilter,
          sortBy: "createdAt",
          sortOrder: "desc",
        });

        return true;
      } catch (err) {
        setError(err?.message || "Failed to load reports.");
        return false;
      } finally {
        setInitialLoading(false);
        setRefreshing(false);
      }
    },
    [
      handleGetReports,
      page,
      search,
      statusFilter,
      targetFilter,
    ]
  );

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, targetFilter]);

  useEffect(() => {
    const closeMenu = (event) => {
      if (event.key === "Escape") {
        setMenuReportId(null);
      }
    };

    document.addEventListener("keydown", closeMenu);
    return () => document.removeEventListener("keydown", closeMenu);
  }, []);

  const reports = useMemo(
    () => (Array.isArray(rawReports) ? rawReports : []),
    [rawReports]
  );

  const stats = useMemo(
    () => ({
      loaded: reports.length,
      pending: reports.filter(
        (item) => getReportStatus(item) === "pending"
      ).length,
      resolved: reports.filter(
        (item) => getReportStatus(item) === "resolved"
      ).length,
      rejected: reports.filter(
        (item) => getReportStatus(item) === "rejected"
      ).length,
    }),
    [reports]
  );

  const currentPage = Number(reportsPagination.currentPage || page);
  const totalPages = Math.max(
    1,
    Number(reportsPagination.totalPages || 1)
  );
  const totalReports = Number(
    reportsPagination.totalReports ?? reports.length
  );

  const openReportDetails = useCallback(
    async (report) => {
      setMenuReportId(null);
      setSelected(report);
      setDetailsLoading(true);
      setError("");

      try {
        const fullReport = await handleGetReportById({
          reportId: getId(report),
        });

        if (fullReport) {
          setSelected(fullReport);
        }
      } catch (err) {
        setError(
          err?.message ||
            "Could not load full report details. Showing available data."
        );
      } finally {
        setDetailsLoading(false);
      }
    },
    [handleGetReportById]
  );

  const requestAction = useCallback((report, type) => {
    setMenuReportId(null);

    if (getReportStatus(report) !== "pending") return;

    setAdminNote(report.adminNote || "");
    setConfirmAction({ type, report });
  }, []);

  const closeDetails = () => {
    if (actionLoading) return;

    setSelected(null);

    if (typeof setContextSelected === "function") {
      setContextSelected(null);
    }
  };

  const runConfirmedAction = async () => {
    const report = confirmAction?.report;
    const reportId = getId(report);

    if (!reportId || actionLoading) return;

    setActionLoading(true);
    setError("");
    setNotice("");

    try {
      const payload = { reportId, adminNote: adminNote.trim() };

      const updatedReport =
        confirmAction.type === "resolve"
          ? await handleResolveReport(payload)
          : await handleRejectReport(payload);

      if (updatedReport) {
        setSelected((current) =>
          getId(current) === reportId ? updatedReport : current
        );

        if (typeof setContextSelected === "function") {
          setContextSelected((current) =>
            getId(current) === reportId ? updatedReport : current
          );
        }
      }

      setConfirmAction(null);
      setNotice(
        confirmAction.type === "resolve"
          ? "Report resolved successfully."
          : "Report rejected successfully."
      );

      // Reload the same server-side page with its active filters.
      await fetchReports(true);

      // Refresh the selected report so its modal displays current data.
      if (getId(selected) === reportId) {
        try {
          const refreshedReport = await handleGetReportById({ reportId });

          if (refreshedReport) {
            setSelected(refreshedReport);
          }
        } catch {
          // The status update itself has already succeeded.
        }
      }
    } catch (err) {
      setError(err?.message || "Could not update the report.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRefresh = async () => {
    setNotice("");
    await fetchReports(true);
  };

  return (
    <div
      className="min-h-screen bg-[#F7F8FC] px-4 py-6 text-slate-900 sm:px-6 lg:px-8"
      onClick={() => {
        if (menuReportId) setMenuReportId(null);
      }}
    >
      <div className="mx-auto max-w-[1600px] space-y-6">
        {/* Header */}
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
              and manage report resolutions.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing || initialLoading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-200 hover:text-violet-700 disabled:opacity-60 sm:self-center"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            {refreshing ? "Refreshing..." : "Refresh reports"}
          </button>
        </div>

        {/* Error and success feedback */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            <AlertCircle size={19} className="mt-0.5 shrink-0" />
            <p className="min-w-0 flex-1 break-words">{error}</p>
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
              aria-label="Dismiss success message"
              className="rounded-lg p-1 hover:bg-emerald-100"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* Summary cards describe the current API page, not global totals. */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Loaded reports"
            value={stats.loaded}
            description="Reports on this page"
            icon={FileText}
            iconClass="bg-violet-50 text-violet-700"
          />
          <StatCard
            title="Pending on page"
            value={stats.pending}
            description="Awaiting admin review"
            icon={Clock}
            iconClass="bg-amber-50 text-amber-700"
          />
          <StatCard
            title="Resolved on page"
            value={stats.resolved}
            description="Reviewed and resolved"
            icon={CheckCircle}
            iconClass="bg-emerald-50 text-emerald-700"
          />
          <StatCard
            title="Rejected on page"
            value={stats.rejected}
            description="Reviewed and rejected"
            icon={XCircle}
            iconClass="bg-red-50 text-red-700"
          />
        </div>

        {/* Reports table */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-4 sm:p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  All reports
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {totalReports} matching reports
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative min-w-0 sm:min-w-[260px]">
                  <Search
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="search"
                    value={searchInput}
                    onChange={(event) =>
                      setSearchInput(event.target.value)
                    }
                    onClick={(event) => event.stopPropagation()}
                    placeholder="Search reports, users, reasons..."
                    aria-label="Search reports"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
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
                    aria-label="Filter reports by status"
                    className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-9 text-sm font-medium outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 sm:min-w-[165px]"
                  >
                    {STATUS_OPTIONS.map((option) => (
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

                <div className="relative">
                  <select
                    value={targetFilter}
                    onChange={(event) =>
                      setTargetFilter(event.target.value)
                    }
                    onClick={(event) => event.stopPropagation()}
                    aria-label="Filter reports by target"
                    className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-9 text-sm font-medium outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 sm:min-w-[155px]"
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
            <div className="flex min-h-[320px] flex-col items-center justify-center gap-3">
              <LoaderCircle
                size={32}
                className="animate-spin text-violet-600"
              />
              <p className="text-sm font-medium text-slate-600">
                Loading reports...
              </p>
            </div>
          ) : reports.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center px-5 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                <FileText size={29} />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">
                No reports found
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Try changing the search or filters, or refresh the list.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  setSearch("");
                  setStatusFilter("all");
                  setTargetFilter("all");
                  setPage(1);
                }}
                className="mt-4 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
              >
                Clear filters
              </button>
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
                    {reports.map((report) => {
                      const status = getReportStatus(report);
                      const targetType = getTargetType(report);
                      const pending = status === "pending";
                      const reportId = getId(report);

                      return (
                        <tr
                          key={reportId}
                          className="transition hover:bg-violet-50/30"
                        >
                          <td className="px-4 py-4">
                            <div className="flex items-start gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                                <FileText size={19} />
                              </div>
                              <div className="min-w-0 max-w-[220px]">
                                <button
                                  type="button"
                                  onClick={() => openReportDetails(report)}
                                  className="block max-w-full truncate text-left text-sm font-bold text-slate-900 hover:text-violet-700"
                                >
                                  {formatLabel(report.reason)}
                                </button>
                                <p className="mt-1 truncate text-xs text-slate-500">
                                  ID: {reportId}
                                </p>
                                <span className="mt-2 inline-flex rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                                  {formatLabel(targetType)}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <p className="max-w-[165px] truncate text-sm font-medium text-slate-800">
                              {getUserName(report.reporter)}
                            </p>
                            <p className="mt-1 max-w-[165px] truncate text-xs text-slate-500">
                              {getUserEmail(report.reporter)}
                            </p>
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex max-w-[190px] items-start gap-2">
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
                              <div className="min-w-0">
                                <p className="break-words text-sm font-medium text-slate-800">
                                  {getTargetName(report)}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  {targetType === "job"
                                    ? getJobCompany(report.reportedJob)
                                    : getUserEmail(report.reportedUser)}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <p className="max-w-[175px] break-words text-sm font-medium text-slate-800">
                              {formatLabel(report.reason)}
                            </p>
                            <p className="mt-1 max-w-[175px] truncate text-xs text-slate-500">
                              {report.description?.trim() || "No description"}
                            </p>
                          </td>

                          <td className="px-4 py-4">
                            <StatusBadge status={status} />
                          </td>

                          <td className="px-4 py-4">
                            <p className="whitespace-nowrap text-sm text-slate-700">
                              {formatDate(report.createdAt)}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              Updated: {formatDate(report.updatedAt)}
                            </p>
                          </td>

                          <td className="px-4 py-4">
                            <div
                              className="relative flex items-center justify-end gap-2"
                              onClick={(event) => event.stopPropagation()}
                            >
                              <IconButton
                                title="View report details"
                                onClick={() => openReportDetails(report)}
                              >
                                <Eye size={17} />
                              </IconButton>

                              <IconButton
                                title="Resolve report"
                                disabled={!pending || actionLoading}
                                onClick={() => requestAction(report, "resolve")}
                              >
                                <CheckCircle size={17} />
                              </IconButton>

                              <div className="relative">
                                <IconButton
                                  title="More actions"
                                  onClick={() =>
                                    setMenuReportId((current) =>
                                      current === reportId ? null : reportId
                                    )
                                  }
                                >
                                  <MoreVertical size={18} />
                                </IconButton>

                                {menuReportId === reportId && (
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
                                            requestAction(report, "resolve")
                                          }
                                          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-emerald-700 hover:bg-emerald-50"
                                        >
                                          <CheckCircle size={16} />
                                          Resolve report
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() =>
                                            requestAction(report, "reject")
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
                {reports.map((report) => {
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
                            ID: {getId(report)}
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

                      <div className="mt-4 space-y-3 border-t border-slate-100 pt-3">
                        <div className="flex items-start gap-2 text-sm">
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
                            {report.description?.trim() || "No description"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <CalendarDays
                            size={15}
                            className="shrink-0 text-slate-400"
                          />
                          Submitted {formatDate(report.createdAt)}
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
                        {pending && (
                          <>
                            <button
                              type="button"
                              onClick={() => requestAction(report, "resolve")}
                              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-200 px-3 py-2.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                            >
                              <CheckCircle size={15} />
                              Resolve
                            </button>

                            <button
                              type="button"
                              onClick={() => requestAction(report, "reject")}
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

              {/* Server-side pagination */}
              <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <p className="text-sm text-slate-500">
                  Page{" "}
                  <span className="font-semibold text-slate-800">
                    {currentPage}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-800">
                    {totalPages}
                  </span>
                  {" · "}
                  <span className="font-semibold text-slate-800">
                    {totalReports}
                  </span>{" "}
                  total reports
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setPage((current) => Math.max(1, current - 1))
                    }
                    disabled={currentPage <= 1 || initialLoading}
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setPage((current) =>
                        Math.min(totalPages, current + 1)
                      )
                    }
                    disabled={currentPage >= totalPages || initialLoading}
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
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
          Summary cards count the reports loaded on the current page.
          The total count and page navigation come from the backend.
        </p>
      </div>

      {/* Full report details */}
      {selected && (
        <ReportDetailsModal
          report={selected}
          onClose={closeDetails}
          onResolve={(report) => requestAction(report, "resolve")}
          onReject={(report) => requestAction(report, "reject")}
          busy={actionLoading}
        />
      )}

      {/* Resolve / reject confirmation */}
      {confirmAction && (
        <ConfirmModal
          action={confirmAction.type}
          report={confirmAction.report}
          adminNote={adminNote}
          setAdminNote={setAdminNote}
          loading={actionLoading}
          onCancel={() => {
            if (!actionLoading) setConfirmAction(null);
          }}
          onConfirm={runConfirmedAction}
        />
      )}

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
