import React, { useEffect, useState } from "react";
import {
  X,
  ShieldAlert,
  BriefcaseBusiness,
  UserRound,
  ChevronDown,
  FileText,
  Send,
  Check,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";

const REPORT_REASONS = {
  job: [
    "Misleading or fraudulent listing",
    "Fake company or recruiter",
    "Discriminatory job posting",
    "Incorrect job information",
    "Spam or duplicate listing",
    "Other",
  ],
  user: [
    "Fake or impersonating profile",
    "Harassment or abusive behavior",
    "Spam or unsolicited messages",
    "Fraudulent activity",
    "Inappropriate content",
    "Other",
  ],
};

const getId = (target) => {
  if (!target) return "";
  if (typeof target === "string") return target;
  return target._id || target.id || "";
};

export default function ReportModal({
  isOpen,
  onClose,
  job = null,
  user = null,
  onSubmit,
}) {
  const [type, setType] = useState(job ? "job" : "user");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

useEffect(() => {
  if (!isOpen) return;

  setType(job ? "job" : user ? "user" : "job");
  setReason("");
  setDescription("");
  setError("");
}, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !loading) {
        onClose?.();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const target = type === "job" ? job : user;
  const targetId = getId(target);

  const targetName =
    type === "job"
      ? target?.title || "Selected job"
      : target?.name || target?.fullName || "Selected user";

  const targetSubtitle =
    type === "job"
      ? target?.companyId?.name || "Job posting"
      : target?.email || "Peer.Hiring member";

  const handleTypeChange = (nextType) => {
  if (nextType === "job" && !job) return;
  if (nextType === "user" && !user) return;

  setType(nextType);
  setReason("");
  setError("");
};

const handleSubmit = async (event) => {
  event.preventDefault();

  if (!targetId) {
    setError("The item you want to report could not be identified.");
    return;
  }

  if (!reason.trim()) {
    setError("Please select a reason for reporting.");
    return;
  }

  if (typeof onSubmit !== "function") {
    setError("Report submission is not configured.");
    return;
  }

  setLoading(true);
  setError("");

  try {
    const payload = {
      reportedJob: type === "job" ? targetId : null,
      reportedUser: type === "user" ? targetId : null,
      reason: reason.trim(),
      description: description.trim(),
    };

    await onSubmit(payload);
    onClose();
  } catch (error) {
    setError(error?.message || "Failed to submit the report.");
  } finally {
    setLoading(false);
  }
};

  const TypeCard = ({ value, title, subtitle, Icon }) => {
    const selected = type === value;

    return (
      <button
        type="button"
        onClick={() => handleTypeChange(value)}
        aria-pressed={selected}
        className={`group relative flex min-w-0 items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 ${
          selected
            ? "border-violet-400 bg-violet-50/80 ring-2 ring-violet-100"
            : "border-slate-200 bg-white hover:border-violet-200 hover:bg-slate-50"
        }`}
      >
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
            selected
              ? "bg-violet-600 text-white shadow-sm shadow-violet-200"
              : "bg-slate-100 text-slate-500 group-hover:bg-violet-100 group-hover:text-violet-700"
          }`}
        >
          <Icon size={19} strokeWidth={1.9} />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold text-slate-900">
            {title}
          </span>
          <span className="mt-0.5 block text-xs leading-4 text-slate-500">
            {subtitle}
          </span>
        </span>

        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
            selected
              ? "border-violet-600 bg-violet-600 text-white"
              : "border-slate-300 bg-white"
          }`}
        >
          {selected && <Check size={12} strokeWidth={3} />}
        </span>
      </button>
    );
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex min-h-full items-center justify-center overflow-y-auto bg-slate-950/45 p-3 backdrop-blur-[5px] sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) {
          onClose?.();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-modal-title"
        className="my-auto max-h-[calc(100dvh-24px)] w-full max-w-[500px] overflow-y-auto overscroll-contain rounded-2xl border border-white/70 bg-white shadow-[0_24px_90px_-20px_rgba(15,23,42,0.35)] sm:max-h-[calc(100dvh-40px)]"
      >
        <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
              <ShieldAlert size={23} strokeWidth={1.8} />
            </div>

            <div className="min-w-0">
              <h2
                id="report-modal-title"
                className="text-lg font-bold tracking-tight text-slate-950"
              >
                Report an issue
              </h2>
              <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                Help keep Peer.Hiring safe and trustworthy.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close report dialog"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-5 py-5 sm:px-6">
            <div>
              <label className="mb-2.5 block text-sm font-semibold text-slate-700">
                What would you like to report?
              </label>

              <div className="grid grid-cols-2 gap-3">
                <TypeCard
                  value="job"
                  title="A job"
                  subtitle="Suspicious job posting"
                  Icon={BriefcaseBusiness}
                />
                <TypeCard
                  value="user"
                  title="A user"
                  subtitle="Profile or behavior"
                  Icon={UserRound}
                />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Reporting
                </span>
                <span className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  {type}
                </span>
              </div>

              <p className="mt-2 truncate text-sm font-bold text-slate-900">
                {targetName}
              </p>
              <p className="mt-1 truncate text-xs text-slate-500">
                {targetSubtitle}
              </p>

              {!targetId && (
                <p className="mt-2 text-xs font-medium text-rose-600">
                  No valid {type} ID was provided.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="report-reason"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Reason for reporting <span className="text-rose-500">*</span>
              </label>

              <div className="relative">
                <select
                  id="report-reason"
                  value={reason}
                  onChange={(event) => {
                    setReason(event.target.value);
                    setError("");
                  }}
                  required
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 pr-10 text-sm text-slate-800 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                >
                  <option value="" disabled>
                    Select a reason
                  </option>
                  {REPORT_REASONS[type].map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={17}
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor="report-description"
                  className="text-sm font-semibold text-slate-700"
                >
                  Additional details{" "}
                  <span className="font-normal text-slate-400">
                    (optional)
                  </span>
                </label>

                <span
                  className={`shrink-0 text-xs tabular-nums ${
                    description.length > 1900
                      ? "text-rose-500"
                      : "text-slate-400"
                  }`}
                >
                  {description.length}/2000
                </span>
              </div>

              <div className="relative">
                <FileText
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-3.5 text-slate-400"
                />
                <textarea
                  id="report-description"
                  value={description}
                  onChange={(event) => {
                    setDescription(event.target.value);
                    setError("");
                  }}
                  rows={3}
                  maxLength={2000}
                  placeholder="Share any details that can help our review team..."
                  className="w-full resize-y rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3.5 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <p className="mt-2 text-xs leading-5 text-slate-400">
                Please don’t include passwords or other sensitive information.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-lg border border-rose-100 bg-rose-50 px-3.5 py-3 text-sm text-rose-700"
              >
                {error}
              </div>
            )}
          </div>

          <footer className="border-t border-slate-100 bg-slate-50/60 px-5 py-4 sm:px-6">
            <div className="flex flex-col-reverse gap-2.5 sm:flex-row">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading || !reason.trim() || !targetId}
                title={
                  !targetId
                    ? `No valid ${type} selected`
                    : !reason.trim()
                      ? "Select a reason to continue"
                      : "Submit report"
                }
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-violet-200 transition hover:bg-violet-800 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-violet-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <LoaderCircle size={17} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Submit report
                  </>
                )}
              </button>
            </div>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck size={13} />
              Reviewed by the Peer.Hiring moderation team
            </p>
          </footer>
        </form>
      </section>
    </div>
  );
}