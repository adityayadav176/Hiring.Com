
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Users,
  UserRound,
  ShieldCheck,
  ShieldAlert,
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
  CalendarDays,
  Mail,
  Phone,
  AlertCircle,
  Filter,
  ChevronDown,
  Hash,
  UserCheck,
} from "lucide-react";

import { useAdmin } from "../../hooks/Hook";

const PAGE_SIZE = 8;

/* ----------------------------- Helpers ----------------------------- */

const cn = (...classes) => classes.filter(Boolean).join(" ");

const getUserId = (user) =>
  user?._id || user?.id || user?.userId || "";

const getUserName = (user) =>
  user?.fullName ||
  user?.name ||
  [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
  user?.username ||
  "Unknown user";

const getEmail = (user) =>
  user?.email || user?.emailAddress || "No email available";

const getPhone = (user) =>
  user?.phoneNo ||
  user?.phoneNumber ||
  user?.phone ||
  user?.mobile ||
  "Not specified";

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";

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

const getUserRole = (user) =>
  String(user?.role || user?.accountType || "user").toLowerCase();

const getAvatar = (user) => {
  const avatar = user?.avatar;

  if (typeof avatar === "string") return avatar;
  if (typeof avatar?.url === "string") return avatar.url;

  const image =
    user?.profilePicture ||
    user?.profileImage ||
    user?.photoURL;

  if (typeof image === "string") return image;
  if (typeof image?.url === "string") return image.url;

  return "";
};

const getUserStatus = (user) => {
  if (!user) return "unknown";

  if (
    user.isDeleted === true ||
    user.deletedAt ||
    user.accountStatus === "deleted" ||
    user.status === "deleted"
  ) {
    return "deleted";
  }

  if (user.isBlocked === true || user.isLocked === true) {
    return "blocked";
  }

  if (user.lockUntil) {
    const lockTime = new Date(user.lockUntil).getTime();

    if (!Number.isNaN(lockTime)) {
      if (lockTime > Date.now()) return "blocked";

      // An expired temporary lock is active only when the backend
      // has not explicitly kept the account marked as blocked.
      if (
        lockTime <= Date.now() &&
        user.accountStatus !== "blocked" &&
        user.status !== "blocked"
      ) {
        return "active";
      }
    }
  }

  if (
    user.accountStatus === "blocked" ||
    user.status === "blocked"
  ) {
    return "blocked";
  }

  if (
    user.accountStatus === "active" ||
    user.status === "active" ||
    user.isActive === true
  ) {
    return "active";
  }

  return "unknown";
};

const isEmailVerified = (user) =>
  user?.isEmailVerified === true ||
  user?.emailVerified === true ||
  user?.isVerified === true;

const getPagination = (pagination, count) => {
  const total = Number(
    pagination?.totalUsers ??
      pagination?.total ??
      pagination?.totalItems ??
      count
  );

  const page = Number(
    pagination?.currentPage ??
      pagination?.page ??
      pagination?.current ??
      1
  );

  const limit = Number(
    pagination?.limit ??
      pagination?.pageSize ??
      PAGE_SIZE
  );

  const totalPages = Number(
    pagination?.totalPages ??
      pagination?.pages ??
      Math.max(1, Math.ceil(total / limit))
  );

  return {
    total: Number.isFinite(total) ? total : count,
    page: Number.isFinite(page) && page > 0 ? page : 1,
    limit: Number.isFinite(limit) && limit > 0 ? limit : PAGE_SIZE,
    totalPages:
      Number.isFinite(totalPages) && totalPages > 0
        ? totalPages
        : 1,
  };
};

const getReturnedUser = (result) => {
  const candidates = [
    result?.data?.user,
    result?.data?.data?.user,
    result?.data?.data,
    result?.data,
    result?.user,
    result,
  ];

  return (
    candidates.find(
      (item) =>
        item &&
        typeof item === "object" &&
        (item._id || item.id || item.userId || item.email)
    ) || null
  );
};

/* ----------------------------- Badges ----------------------------- */

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "blocked", label: "Blocked" },
];

const STATUS_STYLES = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  blocked: "bg-red-50 text-red-700 ring-red-600/15",
  deleted: "bg-slate-100 text-slate-600 ring-slate-500/15",
  unknown: "bg-amber-50 text-amber-700 ring-amber-600/15",
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
        status === "active" && "bg-emerald-500",
        status === "blocked" && "bg-red-500",
        status === "deleted" && "bg-slate-400",
        status === "unknown" && "bg-amber-500"
      )}
    />
    {formatLabel(status)}
  </span>
);

const RoleBadge = ({ role }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1",
      "text-xs font-semibold capitalize",
      role === "admin"
        ? "bg-amber-50 text-amber-700"
        : role === "recruiter"
          ? "bg-violet-50 text-violet-700"
          : "bg-slate-100 text-slate-600"
    )}
  >
    {role === "admin" ? (
      <ShieldCheck size={12} />
    ) : role === "recruiter" ? (
      <ShieldAlert size={12} />
    ) : (
      <UserRound size={12} />
    )}
    {formatLabel(role)}
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


const UserDetailsModal = ({
  user,
  onClose,
  onBlock,
  onUnblock,
  onDelete,
  busy,
}) => {
  if (!user) return null;

  const status = getUserStatus(user);
  const role = getUserRole(user);
  const avatar = getAvatar(user);
  const userId = getUserId(user);

  const InfoCard = ({ icon: Icon, label, value, iconColor = "text-violet-600" }) => (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-3.5 sm:p-4">
      <div className="flex items-center gap-2">
        <Icon size={16} className={cn("shrink-0", iconColor)} />
        <span className="text-xs font-medium text-slate-500">{label}</span>
      </div>

      <p className="mt-2 break-words text-sm font-semibold leading-5 text-slate-800">
        {value || "Not specified"}
      </p>
    </div>
  );

  const SectionHeading = ({ title, description }) => (
    <div className="mb-3 sm:mb-4">
      <h3 className="text-sm font-bold text-slate-900">{title}</h3>
      {description && (
        <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
      )}
    </div>
  );

  const isBlocked = status === "blocked";
  const isDeleted = status === "deleted";

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-details-title"
        className={cn(
          "flex h-full w-full flex-col overflow-hidden bg-white",
          "sm:mx-auto sm:my-6 sm:h-[calc(100%-3rem)] sm:max-h-[900px]",
          "sm:max-w-4xl sm:rounded-2xl sm:border sm:border-slate-200 sm:shadow-2xl"
        )}
      >
        {/* Header */}
        <header className="shrink-0 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between gap-3 px-4 py-3.5 sm:px-6 sm:py-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                <UserRound size={19} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold text-violet-700">
                  User profile
                </p>
                <p className="text-sm font-bold text-slate-900 sm:text-base">
                  Account details
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              aria-label="Close user details"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50"
            >
              <X size={19} />
            </button>
          </div>
        </header>

        {/* Scrollable body */}
        <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[#F7F8FC]">
          {/* Profile hero */}
          <section className="border-b border-slate-200 bg-white px-4 py-5 sm:px-6 sm:py-6">
            <div className="flex items-start gap-3.5 sm:gap-5">
              {avatar ? (
                <img
                  src={avatar}
                  alt={getUserName(user)}
                  className="h-16 w-16 shrink-0 rounded-2xl border border-slate-200 object-cover sm:h-20 sm:w-20"
                />
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-lg font-bold text-violet-700 sm:h-20 sm:w-20 sm:text-xl">
                  {getInitials(getUserName(user))}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <h2
                  id="user-details-title"
                  className="break-words text-lg font-bold leading-6 tracking-tight text-slate-950 sm:text-2xl"
                >
                  {getUserName(user)}
                </h2>

                <p className="mt-1 break-all text-xs leading-5 text-slate-500 sm:text-sm">
                  {getEmail(user)}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <StatusBadge status={status} />
                  <RoleBadge role={role} />
                </div>

                <div className="mt-2 flex items-center gap-1.5 text-xs">
                  {isEmailVerified(user) ? (
                    <CheckCircle size={14} className="text-emerald-600" />
                  ) : (
                    <Clock size={14} className="text-amber-600" />
                  )}

                  <span
                    className={
                      isEmailVerified(user)
                        ? "font-medium text-emerald-700"
                        : "font-medium text-amber-700"
                    }
                  >
                    {isEmailVerified(user)
                      ? "Email verified"
                      : "Email not verified"}
                  </span>
                </div>
              </div>
            </div>

            {/* User ID */}
            <div className="mt-4 flex min-w-0 items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
              <Hash size={15} className="shrink-0 text-slate-400" />
              <span className="shrink-0 text-xs font-medium text-slate-500">
                User ID
              </span>
              <span className="min-w-0 flex-1 truncate font-mono text-xs text-slate-700">
                {userId || "Not available"}
              </span>
              {userId && (
                <button
                  type="button"
                  onClick={() => navigator.clipboard?.writeText(userId)}
                  className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-violet-700 hover:bg-violet-100"
                >
                  Copy
                </button>
              )}
            </div>
          </section>

          <div className="space-y-5 p-4 sm:space-y-6 sm:p-6">
            {/* Account information */}
            <section>
              <SectionHeading
                title="Account information"
                description="Contact information and account settings."
              />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <InfoCard
                  icon={Mail}
                  label="Email address"
                  value={getEmail(user)}
                />

                <InfoCard
                  icon={Phone}
                  label="Phone number"
                  value={getPhone(user)}
                  iconColor="text-slate-500"
                />

                <InfoCard
                  icon={ShieldCheck}
                  label="Account role"
                  value={formatLabel(role)}
                />

                <InfoCard
                  icon={CheckCircle}
                  label="Email verification"
                  value={isEmailVerified(user) ? "Verified" : "Not verified"}
                  iconColor={
                    isEmailVerified(user)
                      ? "text-emerald-600"
                      : "text-amber-600"
                  }
                />
              </div>
            </section>

            {/* Account activity */}
            <section>
              <SectionHeading
                title="Account activity"
                description="Account creation and recent updates."
              />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <InfoCard
                  icon={CalendarDays}
                  label="Account created"
                  value={formatDateTime(user.createdAt || user.joinedAt)}
                  iconColor="text-slate-500"
                />

                <InfoCard
                  icon={Clock}
                  label="Last updated"
                  value={formatDateTime(user.updatedAt)}
                  iconColor="text-slate-500"
                />

                <InfoCard
                  icon={ShieldAlert}
                  label="Blocked until"
                  value={isBlocked ? formatDateTime(user.lockUntil) : "Not blocked"}
                  iconColor={isBlocked ? "text-red-600" : "text-slate-500"}
                />
              </div>
            </section>

            {/* Block reason */}
            {user.blockReason && (
              <section className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                    <AlertCircle size={18} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-amber-950">
                      Block reason
                    </h3>
                    <p className="mt-1.5 whitespace-pre-wrap break-words text-sm leading-6 text-amber-900">
                      {user.blockReason}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Status summary */}
            <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
              <SectionHeading title="Account status" />

              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                    status === "active"
                      ? "bg-emerald-50 text-emerald-600"
                      : status === "blocked"
                        ? "bg-red-50 text-red-600"
                        : status === "deleted"
                          ? "bg-slate-100 text-slate-500"
                          : "bg-amber-50 text-amber-600"
                  )}
                >
                  {status === "active" ? (
                    <CheckCircle size={19} />
                  ) : status === "blocked" ? (
                    <Ban size={19} />
                  ) : status === "deleted" ? (
                    <Trash2 size={19} />
                  ) : (
                    <AlertCircle size={19} />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-800">
                    {status === "active"
                      ? "Account is active"
                      : status === "blocked"
                        ? "Account access is restricted"
                        : status === "deleted"
                          ? "Account is marked as deleted"
                          : "Status not identified"}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {status === "active"
                      ? "This user currently has an active account."
                      : status === "blocked"
                        ? "This user is currently restricted from accessing the platform."
                        : status === "deleted"
                          ? "This account is marked as deleted."
                          : "The current account status could not be determined."}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </main>

        {/* Sticky action footer */}
        <footer className="z-10 shrink-0 border-t border-slate-200 bg-white px-3 py-3 pb-[max(12px,env(safe-area-inset-bottom))] sm:px-6 sm:py-4">
          <div className="flex gap-2 sm:justify-between">
            <button
              type="button"
              onClick={() => onDelete(user)}
              disabled={busy}
              className="inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 px-3 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50 sm:flex-none sm:px-4"
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </button>

            {!isDeleted && (
              <button
                type="button"
                onClick={() => (isBlocked ? onUnblock(user) : onBlock(user))}
                disabled={busy}
                className={cn(
                  "inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold transition disabled:opacity-50 sm:flex-none sm:px-4",
                  isBlocked
                    ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    : "border-red-200 text-red-600 hover:bg-red-50"
                )}
              >
                {isBlocked ? <CheckCircle size={16} /> : <Ban size={16} />}
                <span>{isBlocked ? "Unblock" : "Block"}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="inline-flex min-w-0 flex-1 items-center justify-center rounded-xl bg-violet-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:opacity-50 sm:flex-none sm:px-6"
            >
              Done
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};


/* ----------------------------- Confirmation modal ----------------------------- */

const ConfirmModal = ({
  action,
  user,
  duration,
  setDuration,
  reason,
  setReason,
  onCancel,
  onConfirm,
  loading,
}) => {
  if (!action || !user) return null;

  const isDelete = action === "delete";
  const isUnblock = action === "unblock";

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
        className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl"
      >
        <div
          className={cn(
            "mb-4 flex h-12 w-12 items-center justify-center rounded-2xl",
            isDelete || action === "block"
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

        <h3 className="text-lg font-bold text-slate-900">
          {isDelete
            ? "Delete this user?"
            : isUnblock
              ? "Unblock this user?"
              : "Block this user?"}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {isDelete
            ? "Confirm that you want to delete this account."
            : isUnblock
              ? "This will remove the account block through your admin handler."
              : "Choose a block duration and provide a reason before restricting this account."}
        </p>

        <div className="mt-4 rounded-xl bg-slate-50 p-3">
          <p className="break-words text-sm font-semibold text-slate-800">
            {getUserName(user)}
          </p>
          <p className="mt-1 break-all text-xs text-slate-500">
            {getEmail(user)}
          </p>
        </div>

        {action === "block" && (
          <div className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="userBlockDuration"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Block duration
              </label>

              <select
                id="userBlockDuration"
                value={duration}
                onChange={(event) => setDuration(Number(event.target.value))}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              >
                <option value={15}>15 minutes</option>
                <option value={60}>1 hour</option>
                <option value={360}>6 hours</option>
                <option value={1440}>24 hours</option>
                <option value={10080}>7 days</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="userBlockReason"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Reason for blocking
                <span className="ml-1 text-red-500">*</span>
              </label>

              <textarea
                id="userBlockReason"
                rows={3}
                maxLength={500}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Enter the reason for blocking this account..."
                className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              />

              <p className="mt-1 text-right text-xs text-slate-400">
                {reason.length}/500
              </p>
            </div>
          </div>
        )}

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
            disabled={loading || (action === "block" && !reason.trim())}
            onClick={onConfirm}
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5",
              "text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60",
              isDelete || action === "block"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-emerald-600 hover:bg-emerald-700"
            )}
          >
            {loading && <LoaderCircle size={16} className="animate-spin" />}
            {loading
              ? "Processing..."
              : isDelete
                ? "Delete user"
                : isUnblock
                  ? "Unblock user"
                  : "Confirm block"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ----------------------------- Main page ----------------------------- */

export default function AdminUsers() {
  const {
    users: rawUsers = [],
    usersPagination,
    selectedUser,
    setSelectedUser,
    handleGetAllUsers,
    handleGetUserById,
    handleBlockUser,
    handleUnblockUser,
    handleDeleteUser,
  } = useAdmin();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);

  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [selected, setSelected] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [menuUserId, setMenuUserId] = useState(null);

  const [blockDuration, setBlockDuration] = useState(60);
  const [blockReason, setBlockReason] = useState("");

  /* ----------------------------- Fetch users ----------------------------- */

  const fetchUsers = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setInitialLoading(true);
      }

      setError("");

      try {
        await handleGetAllUsers({
          page,
          limit: PAGE_SIZE,
          search: search.trim(),
          accountStatus: statusFilter === "all" ? "" : statusFilter,
          role: roleFilter === "all" ? "" : roleFilter,
        });

        return true;
      } catch (err) {
        setError(
          err?.message || "Unable to load users. Please try again."
        );
        return false;
      } finally {
        setInitialLoading(false);
        setRefreshing(false);
      }
    },
    [handleGetAllUsers, page, search, statusFilter, roleFilter]
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, roleFilter]);

  const users = useMemo(
    () => (Array.isArray(rawUsers) ? rawUsers : []),
    [rawUsers]
  );

  const pagination = useMemo(
    () => getPagination(usersPagination, users.length),
    [usersPagination, users.length]
  );

  const hasServerPagination = Boolean(usersPagination);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const status = getUserStatus(user);
      const role = getUserRole(user);

      const matchesStatus =
        statusFilter === "all" || status === statusFilter;

      const matchesRole =
        roleFilter === "all" || role === roleFilter;

      const searchable = [
        getUserName(user),
        getEmail(user),
        getUserId(user),
        user.username,
        getPhone(user),
        role,
        status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        matchesStatus &&
        matchesRole &&
        (!query || searchable.includes(query))
      );
    });
  }, [users, search, statusFilter, roleFilter]);

  const stats = useMemo(
    () => ({
      total: pagination.total,
      active: users.filter(
        (user) => getUserStatus(user) === "active"
      ).length,
      blocked: users.filter(
        (user) => getUserStatus(user) === "blocked"
      ).length,
      deleted: users.filter(
        (user) => getUserStatus(user) === "deleted"
      ).length,
    }),
    [pagination.total, users]
  );

  const totalPages = hasServerPagination
    ? pagination.totalPages
    : Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));

  const safePage = Math.min(page, totalPages);

  const visibleUsers = useMemo(() => {
    if (hasServerPagination) return filteredUsers;

    const start = (safePage - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, hasServerPagination, safePage]);

  const showingStart =
    visibleUsers.length === 0
      ? 0
      : hasServerPagination
        ? (safePage - 1) * pagination.limit + 1
        : (safePage - 1) * PAGE_SIZE + 1;

  const showingEnd =
    visibleUsers.length === 0
      ? 0
      : hasServerPagination
        ? Math.min(
            (safePage - 1) * pagination.limit + visibleUsers.length,
            pagination.total
          )
        : Math.min(
            (safePage - 1) * PAGE_SIZE + visibleUsers.length,
            filteredUsers.length
          );

  /* ----------------------------- Actions ----------------------------- */

  const clearMessages = useCallback(() => {
    setError("");
    setNotice("");
  }, []);

  const handleRefresh = async () => {
    clearMessages();
    await fetchUsers(true);
  };

  const closeDetails = () => {
    if (actionLoading) return;

    setSelected(null);
    setSelectedUser?.(null);
  };

  const openUserDetails = useCallback(
    async (user) => {
      setMenuUserId(null);
      setSelected(user);
      setSelectedUser?.(user);
      setDetailsLoading(true);
      setError("");

      try {
        const result = await handleGetUserById(getUserId(user));
        const fullUser = getReturnedUser(result);

        if (fullUser) {
          setSelected(fullUser);
          setSelectedUser?.(fullUser);
        }
      } catch (err) {
        setError(
          err?.message || "Could not load complete user details."
        );
      } finally {
        setDetailsLoading(false);
      }
    },
    [handleGetUserById, setSelectedUser]
  );

  const requestBlockAction = (user) => {
    setMenuUserId(null);
    setBlockDuration(60);
    setBlockReason("");

    setConfirmAction({
      type: getUserStatus(user) === "blocked" ? "unblock" : "block",
      user,
    });
  };

  const requestUnblockAction = (user) => {
    setMenuUserId(null);
    setConfirmAction({ type: "unblock", user });
  };

  const requestDeleteAction = (user) => {
    setMenuUserId(null);
    setConfirmAction({ type: "delete", user });
  };

  const runConfirmedAction = async () => {
    if (!confirmAction?.user) return;

    const { type, user } = confirmAction;
    const userId = getUserId(user);

    if (!userId) {
      setError("Cannot perform this action because the user ID is missing.");
      return;
    }

    if (type === "block" && !blockReason.trim()) {
      setError("Please provide a reason for blocking this user.");
      return;
    }

    setActionLoading(true);
    clearMessages();

    try {
      if (type === "delete") {
        await handleDeleteUser( userId );

        setSelected(null);
        setSelectedUser?.(null);
        setNotice("User deleted successfully.");
      } else if (type === "block") {
        // Matches handleBlockUser({ userId, duration, reason }).
        await handleBlockUser({
          userId,
          duration: blockDuration,
          reason: blockReason.trim(),
        });

        setNotice("User blocked successfully.");
      } else if (type === "unblock") {
        // IMPORTANT: pass the string, not { userId }.
        await handleUnblockUser(userId);

        setNotice("User unblocked successfully.");
      }

      setConfirmAction(null);
      setBlockReason("");

      const refreshed = await fetchUsers(true);

      if (
        refreshed &&
        selected &&
        getUserId(selected) === userId &&
        type !== "delete"
      ) {
        try {
          const result = await handleGetUserById(userId);
          const refreshedUser = getReturnedUser(result);

          if (refreshedUser) {
            setSelected(refreshedUser);
            setSelectedUser?.(refreshedUser);
          }
        } catch {
          // Keep the refreshed table even if the details request fails.
        }
      }
    } catch (err) {
      setError(
        err?.message || "The action failed. Please try again."
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* ----------------------------- Render ----------------------------- */

  return (
    <div
      className="min-h-screen bg-[#F7F8FC] px-4 py-6 text-slate-900 sm:px-6 lg:px-8"
      onClick={() => {
        if (menuUserId) setMenuUserId(null);
      }}
    >
      <div className="mx-auto max-w-[1600px] space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-violet-600">
              <ShieldCheck size={15} />
              Administration
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Users management
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Manage user accounts, review account activity, and control
              access across your Peer.Hiring platform.
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
            {refreshing ? "Refreshing..." : "Refresh users"}
          </button>
        </div>

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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total users"
            value={stats.total}
            description="Total from the API pagination"
            icon={Users}
            iconClass="bg-violet-50 text-violet-700"
          />
          <StatCard
            title="Active users"
            value={stats.active}
            description="Active in the loaded results"
            icon={UserCheck}
            iconClass="bg-emerald-50 text-emerald-700"
          />
          <StatCard
            title="Blocked users"
            value={stats.blocked}
            description="Blocked in the loaded results"
            icon={Ban}
            iconClass="bg-red-50 text-red-700"
          />
          <StatCard
            title="Deleted users"
            value={stats.deleted}
            description="Deleted in the loaded results"
            icon={Trash2}
            iconClass="bg-slate-100 text-slate-600"
          />
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-4 sm:p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  All users
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {filteredUsers.length} matching{" "}
                  {filteredUsers.length === 1 ? "user" : "users"} on this page
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
                    placeholder="Search name, email, or user ID..."
                    aria-label="Search users"
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
                    aria-label="Filter by user status"
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
                    value={roleFilter}
                    onChange={(event) => setRoleFilter(event.target.value)}
                    onClick={(event) => event.stopPropagation()}
                    aria-label="Filter by user role"
                    className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-9 text-sm font-medium outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100 sm:min-w-[140px]"
                  >
                    <option value="all">All roles</option>
                    <option value="user">User</option>
                    <option value="recruiter">Recruiter</option>
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
                Loading users...
              </p>
            </div>
          ) : visibleUsers.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center px-5 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                <Users size={29} />
              </div>

              <h3 className="mt-4 text-base font-bold text-slate-900">
                No users found
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {search || statusFilter !== "all" || roleFilter !== "all"
                  ? "Try changing your search or filters."
                  : "There are no users in the collection returned by the server."}
              </p>

              {(search || statusFilter !== "all" || roleFilter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("all");
                    setRoleFilter("all");
                    setPage(1);
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
                        "User",
                        "Role",
                        "Account status",
                        "Phone",
                        "Joined",
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
                    {visibleUsers.map((user) => {
                      const userId = getUserId(user);
                      const name = getUserName(user);
                      const status = getUserStatus(user);
                      const role = getUserRole(user);
                      const avatar = getAvatar(user);

                      return (
                        <tr
                          key={userId || getEmail(user)}
                          className="transition hover:bg-violet-50/30"
                        >
                          <td className="px-4 py-4">
                            <div className="flex min-w-0 items-start gap-3">
                              {avatar ? (
                                <img
                                  src={avatar}
                                  alt={name}
                                  className="h-10 w-10 shrink-0 rounded-xl border border-slate-100 object-cover"
                                />
                              ) : (
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-sm font-bold text-violet-700">
                                  {getInitials(name)}
                                </div>
                              )}

                              <div className="min-w-0 max-w-[280px]">
                                <button
                                  type="button"
                                  onClick={() => openUserDetails(user)}
                                  className="block max-w-full truncate text-left text-sm font-bold text-slate-900 hover:text-violet-700"
                                >
                                  {name}
                                </button>
                                <p className="mt-1 truncate text-xs text-slate-500">
                                  {getEmail(user)}
                                </p>
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                  <span
                                    className={cn(
                                      "rounded-md px-2 py-1 text-[10px] font-semibold",
                                      isEmailVerified(user)
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "bg-amber-50 text-amber-700"
                                    )}
                                  >
                                    {isEmailVerified(user)
                                      ? "Email verified"
                                      : "Email unverified"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <RoleBadge role={role} />
                          </td>

                          <td className="px-4 py-4">
                            <StatusBadge status={status} />
                            {status === "blocked" && user.lockUntil && (
                              <p className="mt-1.5 text-[11px] text-slate-500">
                                Until {formatDate(user.lockUntil)}
                              </p>
                            )}
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex max-w-[180px] items-start gap-1.5 text-sm text-slate-600">
                              <Phone
                                size={15}
                                className="mt-0.5 shrink-0 text-slate-400"
                              />
                              <span className="break-words">
                                {getPhone(user)}
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex items-start gap-2">
                              <CalendarDays
                                size={15}
                                className="mt-0.5 shrink-0 text-slate-400"
                              />
                              <div>
                                <p className="whitespace-nowrap text-sm text-slate-700">
                                  {formatDate(user.createdAt || user.joinedAt)}
                                </p>
                                <p className="mt-1 text-xs text-slate-400">
                                  {user.updatedAt
                                    ? `Updated ${formatDate(user.updatedAt)}`
                                    : "Account"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <div
                              className="relative flex items-center justify-end gap-2"
                              onClick={(event) => event.stopPropagation()}
                            >
                              <IconButton
                                title="View user details"
                                onClick={() => openUserDetails(user)}
                              >
                                <Eye size={17} />
                              </IconButton>

                              <IconButton
                                title={
                                  status === "blocked"
                                    ? "Unblock user"
                                    : "Block user"
                                }
                                disabled={status === "deleted"}
                                onClick={() => requestBlockAction(user)}
                                danger={status !== "blocked"}
                              >
                                {status === "blocked" ? (
                                  <CheckCircle size={17} />
                                ) : (
                                  <Ban size={17} />
                                )}
                              </IconButton>

                              <div className="relative">
                                <IconButton
                                  title="More actions"
                                  onClick={() =>
                                    setMenuUserId((current) =>
                                      current === userId ? null : userId
                                    )
                                  }
                                >
                                  <MoreVertical size={18} />
                                </IconButton>

                                {menuUserId === userId && (
                                  <div
                                    className="absolute right-0 top-11 z-20 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl"
                                    onClick={(event) => event.stopPropagation()}
                                  >
                                    <button
                                      type="button"
                                      onClick={() => openUserDetails(user)}
                                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-violet-50 hover:text-violet-700"
                                    >
                                      <Eye size={16} />
                                      View details
                                    </button>

                                    {status !== "deleted" && (
                                      <button
                                        type="button"
                                        onClick={() => requestBlockAction(user)}
                                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
                                      >
                                        {status === "blocked" ? (
                                          <CheckCircle size={16} />
                                        ) : (
                                          <Ban size={16} />
                                        )}
                                        {status === "blocked"
                                          ? "Unblock user"
                                          : "Block user"}
                                      </button>
                                    )}

                                    <div className="my-1 border-t border-slate-100" />

                                    <button
                                      type="button"
                                      onClick={() => requestDeleteAction(user)}
                                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                                    >
                                      <Trash2 size={16} />
                                      Delete user
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
                {visibleUsers.map((user) => {
                  const userId = getUserId(user);
                  const name = getUserName(user);
                  const status = getUserStatus(user);
                  const avatar = getAvatar(user);

                  return (
                    <article
                      key={userId || getEmail(user)}
                      className="rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <div className="flex items-start gap-3">
                        {avatar ? (
                          <img
                            src={avatar}
                            alt={name}
                            className="h-11 w-11 shrink-0 rounded-xl border border-slate-100 object-cover"
                          />
                        ) : (
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-sm font-bold text-violet-700">
                            {getInitials(name)}
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <h3 className="break-words text-sm font-bold text-slate-900">
                            {name}
                          </h3>
                          <p className="mt-1 break-all text-xs text-slate-500">
                            {getEmail(user)}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <StatusBadge status={status} />
                            <RoleBadge role={getUserRole(user)} />
                          </div>
                        </div>

                        <button
                          type="button"
                          aria-label="View user details"
                          onClick={() => openUserDetails(user)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-violet-50 hover:text-violet-700"
                        >
                          <Eye size={18} />
                        </button>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-100 pt-3">
                        <div className="flex items-start gap-2 text-sm text-slate-600">
                          <Mail size={15} className="mt-0.5 shrink-0 text-slate-400" />
                          <span className="break-all">{getEmail(user)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone size={15} className="shrink-0 text-slate-400" />
                          <span>{getPhone(user)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <CalendarDays size={15} className="shrink-0 text-slate-400" />
                          <span>
                            Joined {formatDate(user.createdAt || user.joinedAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          {isEmailVerified(user) ? (
                            <CheckCircle size={15} className="shrink-0 text-emerald-600" />
                          ) : (
                            <Clock size={15} className="shrink-0 text-amber-600" />
                          )}
                          <span>
                            {isEmailVerified(user)
                              ? "Email verified"
                              : "Email not verified"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
                        {status !== "deleted" && (
                          <button
                            type="button"
                            onClick={() => requestBlockAction(user)}
                            className={cn(
                              "inline-flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold",
                              status === "blocked"
                                ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                : "border-red-200 text-red-700 hover:bg-red-50"
                            )}
                          >
                            {status === "blocked" ? (
                              <CheckCircle size={15} />
                            ) : (
                              <Ban size={15} />
                            )}
                            {status === "blocked" ? "Unblock" : "Block"}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => requestDeleteAction(user)}
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
                    {showingStart}–{showingEnd}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-800">
                    {pagination.total}
                  </span>{" "}
                  users
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    disabled={safePage <= 1 || initialLoading}
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
                    disabled={safePage >= totalPages || initialLoading}
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
          Active, blocked, and deleted counts are based on the users currently
          loaded from the API. Global status counts require backend statistics.
        </p>
      </div>

      {/* User details modal */}
      {selected && (
        <UserDetailsModal
          user={selected}
          onClose={closeDetails}
          onBlock={(user) => requestBlockAction(user)}
          onUnblock={(user) => requestUnblockAction(user)}
          onDelete={(user) => requestDeleteAction(user)}
          busy={actionLoading}
        />
      )}

      {/* Block / unblock / delete confirmation */}
      {confirmAction && (
        <ConfirmModal
          action={confirmAction.type}
          user={confirmAction.user}
          duration={blockDuration}
          setDuration={setBlockDuration}
          reason={blockReason}
          setReason={setBlockReason}
          loading={actionLoading}
          onCancel={() => {
            if (!actionLoading) {
              setConfirmAction(null);
              setBlockReason("");
            }
          }}
          onConfirm={runConfirmedAction}
        />
      )}

      {/* Details loading indicator */}
      {detailsLoading && selected && (
        <div className="fixed bottom-5 right-5 z-[70] flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-lg">
          <LoaderCircle size={17} className="animate-spin text-violet-600" />
          Loading full user details...
        </div>
      )}
    </div>
  );
}
