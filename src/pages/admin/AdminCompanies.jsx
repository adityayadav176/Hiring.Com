import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Building2,
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
  MapPin,
  BriefcaseBusiness,
  BadgeCheck,
  RotateCcw,
  Users,
} from "lucide-react";

import { useAdmin } from "../../hooks/Hook";

const PAGE_SIZE = 8;

const cn = (...classes) => classes.filter(Boolean).join(" ");

const getCompanyId = (company) =>
  company?._id || company?.id || company?.companyId || "";

const getCompanyName = (company) =>
  company?.name || company?.companyName || "Unnamed company";

const getCompanyEmail = (company) =>
  company?.email ||
  company?.contactEmail ||
  company?.recruiters?.[0]?.email ||
  "No email available";

const getCompanyPhone = (company) =>
  company?.phone ||
  company?.phoneNo ||
  company?.contactPhone ||
  company?.recruiters?.[0]?.phoneNo ||
  "Not specified";

const getCompanyLogo = (company) => {
  const logo = company?.logo;

  if (typeof logo === "string") return logo;
  if (typeof logo?.url === "string") return logo.url;

  return company?.logoUrl || company?.image || company?.profileImage || "";
};

const getCompanyLocation = (company) => {
  const headquarters = company?.headquarters;

  if (typeof headquarters === "string") return headquarters;

  return (
    [
      headquarters?.city,
      headquarters?.state,
      headquarters?.country,
    ]
      .filter(Boolean)
      .join(", ") ||
    company?.location ||
    "Not specified"
  );
};

const getCompanyIndustry = (company) =>
  company?.industry || "Not specified";

const getCompanySize = (company) =>
  company?.companySize || company?.size || "Not specified";

const getCompanyInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "C";

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

const getVerificationStatus = (company) => {
  if (!company) return "unknown";

  const status = String(company.verificationStatus || "")
    .trim()
    .toLowerCase();

  if (["pending", "verified", "rejected"].includes(status)) {
    return status;
  }

  if (company.isVerified === true) return "verified";
  if (company.isVerified === false) return "pending";

  return "unknown";
};

const getCompanyStatus = (company) => {
  if (!company) return "unknown";

  if (
    company.isDeleted === true ||
    company.deletedAt ||
    company.status === "deleted"
  ) {
    return "deleted";
  }

  if (company.isBlocked === true || company.status === "blocked") {
    return "blocked";
  }

  return "active";
};

const getRecruiters = (company) =>
  Array.isArray(company?.recruiters) ? company.recruiters : [];

const getPagination = (pagination, count) => {
  const total = Number(
    pagination?.totalCompanies ??
      pagination?.total ??
      pagination?.totalItems ??
      count
  );

  const page = Number(
    pagination?.currentPage ?? pagination?.page ?? pagination?.current ?? 1
  );

  const limit = Number(
    pagination?.limit ?? pagination?.pageSize ?? PAGE_SIZE
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
      Number.isFinite(totalPages) && totalPages > 0 ? totalPages : 1,
  };
};

const getReturnedCompany = (result) => {
  const candidates = [
    result?.data?.company,
    result?.data?.data?.company,
    result?.data?.data,
    result?.data,
    result?.company,
    result,
  ];

  return (
    candidates.find(
      (item) =>
        item &&
        typeof item === "object" &&
        (item._id || item.id || item.companyId)
    ) || null
  );
};

const COMPANY_STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "blocked", label: "Blocked" },
  { value: "deleted", label: "Deleted" },
];

const VERIFICATION_OPTIONS = [
  { value: "all", label: "All verification" },
  { value: "pending", label: "Pending" },
  { value: "verified", label: "Verified" },
  { value: "rejected", label: "Rejected" },
];

const COMPANY_SIZE_OPTIONS = [
  { value: "all", label: "All company sizes" },
  { value: "1-10", label: "1–10 employees" },
  { value: "11-50", label: "11–50 employees" },
  { value: "51-200", label: "51–200 employees" },
  { value: "201-500", label: "201–500 employees" },
  { value: "501-1000", label: "501–1,000 employees" },
  { value: "1001-5000", label: "1,001–5,000 employees" },
  { value: "5001-10000", label: "5,001–10,000 employees" },
];

const STATUS_STYLES = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  blocked: "bg-red-50 text-red-700 ring-red-600/15",
  deleted: "bg-slate-100 text-slate-600 ring-slate-500/15",
  unknown: "bg-amber-50 text-amber-700 ring-amber-600/15",
};

const VERIFICATION_STYLES = {
  verified: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  rejected: "bg-red-50 text-red-700",
  unknown: "bg-slate-100 text-slate-600",
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

const VerificationBadge = ({ status }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1",
      "text-xs font-semibold",
      VERIFICATION_STYLES[status] || VERIFICATION_STYLES.unknown
    )}
  >
    {status === "verified" ? (
      <BadgeCheck size={13} />
    ) : status === "rejected" ? (
      <X size={13} />
    ) : (
      <Clock size={13} />
    )}
    {formatLabel(status)}
  </span>
);

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

const CompanyDetailsModal = ({ company, onClose, onAction, busy }) => {
  if (!company) return null;

  const companyStatus = getCompanyStatus(company);
  const verification = getVerificationStatus(company);
  const logo = getCompanyLogo(company);
  const recruiters = getRecruiters(company);
  const companyId = getCompanyId(company);

  const informationItems = [
    {
      icon: Building2,
      label: "Company name",
      value: getCompanyName(company),
    },
    {
      icon: Hash,
      label: "Company ID",
      value: companyId,
    },
    {
      icon: BriefcaseBusiness,
      label: "Industry",
      value: getCompanyIndustry(company),
    },
    {
      icon: Users,
      label: "Company size",
      value: getCompanySize(company),
    },
    {
      icon: CalendarDays,
      label: "Founded year",
      value: company.foundedYear,
    },
    {
      icon: MapPin,
      label: "Headquarters",
      value: getCompanyLocation(company),
    },
    {
      icon: Mail,
      label: "Contact email",
      value: getCompanyEmail(company),
    },
    {
      icon: Phone,
      label: "Contact phone",
      value: getCompanyPhone(company),
    },
    {
      icon: CalendarDays,
      label: "Created on",
      value: formatDateTime(company.createdAt),
    },
    {
      icon: Clock,
      label: "Last updated",
      value: formatDateTime(company.updatedAt),
    },
  ];

  const actionButtonClass =
    "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";

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
        aria-labelledby="company-details-title"
        className="flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-[#F8FAFC] shadow-2xl"
      >
        <div className="relative shrink-0 overflow-hidden border-b border-slate-200 bg-white">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-600 via-indigo-500 to-violet-300" />

          <div className="flex items-center justify-between gap-4 px-5 pb-4 pt-6 sm:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                Peer.Hiring / Administration
              </p>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                Company profile
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Review company information and manage account access.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              aria-label="Close company details"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 disabled:opacity-50"
            >
              <X size={19} />
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-7">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                {logo ? (
                  <img
                    src={logo}
                    alt={getCompanyName(company)}
                    className="h-16 w-16 shrink-0 rounded-2xl border border-slate-200 bg-white object-contain p-1.5 sm:h-20 sm:w-20"
                  />
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-xl font-bold text-violet-700 sm:h-20 sm:w-20">
                    {getCompanyInitials(getCompanyName(company))}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={companyStatus} />
                    <VerificationBadge status={verification} />
                  </div>

                  <h3
                    id="company-details-title"
                    className="mt-3 break-words text-xl font-bold tracking-tight text-slate-950 sm:text-2xl"
                  >
                    {getCompanyName(company)}
                  </h3>

                  <p className="mt-1 break-all text-sm text-slate-500">
                    {company.slug ? `/${company.slug}` : companyId}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <BriefcaseBusiness
                        size={15}
                        className="text-violet-600"
                      />
                      {getCompanyIndustry(company)}
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={15} className="text-violet-600" />
                      {getCompanyLocation(company)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 lg:min-w-[250px]">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-xs font-medium text-slate-500">
                    Recruiters
                  </p>
                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {recruiters.length}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-xs font-medium text-slate-500">
                    Founded
                  </p>
                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {company.foundedYear || "—"}
                  </p>
                </div>

                <div className="col-span-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-xs font-medium text-slate-500">
                    Company created
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {formatDate(company.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                <Building2 size={19} />
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  Company information
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Business details and contact information
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {informationItems.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex min-w-0 gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 transition hover:border-violet-100 hover:bg-violet-50/30"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-violet-600 shadow-sm ring-1 ring-slate-100">
                    <Icon size={17} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-500">
                      {label}
                    </p>
                    <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                      {value === null ||
                      value === undefined ||
                      value === ""
                        ? "Not specified"
                        : value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {company.description && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                  <BriefcaseBusiness size={19} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    About the company
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Company overview and description
                  </p>
                </div>
              </div>

              <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
                {company.description}
              </p>
            </section>
          )}

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                  <Users size={19} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Associated recruiters
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Recruiters connected to this company
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                {recruiters.length}{" "}
                {recruiters.length === 1 ? "recruiter" : "recruiters"}
              </span>
            </div>

            {recruiters.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center">
                <Users
                  size={27}
                  className="mx-auto text-slate-300"
                />
                <p className="mt-3 text-sm font-semibold text-slate-700">
                  No recruiters found
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  There are no recruiters associated with this company.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                {recruiters.map((recruiter, index) => {
                  const recruiterId =
                    recruiter?._id || recruiter?.id || index;

                  const recruiterName =
                    recruiter?.name || "Unnamed recruiter";

                  return (
                    <div
                      key={recruiterId}
                      className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-violet-200 hover:bg-violet-50/20"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-bold text-violet-700">
                        {getCompanyInitials(recruiterName)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="break-words text-sm font-bold text-slate-900">
                          {recruiterName}
                        </p>

                        <p className="mt-1 break-all text-sm text-slate-500">
                          {recruiter?.email || "No email available"}
                        </p>

                        {recruiter?.phoneNo && (
                          <p className="mt-1 text-xs text-slate-500">
                            {recruiter.phoneNo}
                          </p>
                        )}
                      </div>

                      <span className="shrink-0 rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                        Recruiter
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <ShieldCheck size={19} />
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  Account and verification
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Current company account status
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={companyStatus} />
                <VerificationBadge status={verification} />
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {companyStatus === "deleted"
                  ? "This company has been soft-deleted."
                  : companyStatus === "blocked"
                    ? "This company is currently blocked from normal access."
                    : verification === "verified"
                      ? "This company's verification has been completed."
                      : verification === "rejected"
                        ? "This company's verification request has been rejected."
                        : "This company has not completed verification yet."}
              </p>

              {company.deletedAt && (
                <div className="mt-4 border-t border-slate-200 pt-3">
                  <p className="text-xs font-medium text-slate-500">
                    Deleted at
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {formatDateTime(company.deletedAt)}
                  </p>
                </div>
              )}

              {company.updatedAt && (
                <div className="mt-4 border-t border-slate-200 pt-3">
                  <p className="text-xs font-medium text-slate-500">
                    Last modified
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {formatDateTime(company.updatedAt)}
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-4 sm:px-7">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <button
              type="button"
              onClick={() => onAction("delete", company)}
              disabled={busy || companyStatus === "deleted"}
              className={`${actionButtonClass} border-red-200 text-red-700 hover:bg-red-50 lg:mr-auto`}
            >
              <Trash2 size={16} />
              Delete company
            </button>

            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              {companyStatus !== "deleted" && (
                <>
                  {verification !== "verified" && (
                    <button
                      type="button"
                      onClick={() => onAction("verify", company)}
                      disabled={busy || companyStatus === "blocked"}
                      className={`${actionButtonClass} border-emerald-200 text-emerald-700 hover:bg-emerald-50`}
                    >
                      <BadgeCheck size={16} />
                      Verify
                    </button>
                  )}

                  {verification !== "rejected" && (
                    <button
                      type="button"
                      onClick={() => onAction("reject", company)}
                      disabled={busy || companyStatus === "blocked"}
                      className={`${actionButtonClass} border-amber-200 text-amber-700 hover:bg-amber-50`}
                    >
                      <ShieldAlert size={16} />
                      Reject
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      onAction(
                        companyStatus === "blocked" ? "unblock" : "block",
                        company
                      )
                    }
                    disabled={busy}
                    className={`${actionButtonClass} ${
                      companyStatus === "blocked"
                        ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                        : "border-red-200 text-red-700 hover:bg-red-50"
                    }`}
                  >
                    {companyStatus === "blocked" ? (
                      <CheckCircle size={16} />
                    ) : (
                      <Ban size={16} />
                    )}
                    {companyStatus === "blocked" ? "Unblock" : "Block"}
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={onClose}
                disabled={busy}
                className={`${actionButtonClass} border-transparent bg-violet-600 text-white hover:bg-violet-700`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConfirmModal = ({ action, company, onCancel, onConfirm, loading }) => {
  if (!action || !company) return null;

  const isDelete = action === "delete";
  const isBlock = action === "block";
  const isUnblock = action === "unblock";
  const isVerify = action === "verify";
  const isReject = action === "reject";

  const title = isDelete
    ? "Delete this company?"
    : isBlock
      ? "Block this company?"
      : isUnblock
        ? "Unblock this company?"
        : isVerify
          ? "Verify this company?"
          : "Reject this company's verification?";

  const description = isDelete
    ? "This will soft-delete the company. It will no longer appear in the normal company listing."
    : isBlock
      ? "This will block the company according to your admin controller."
      : isUnblock
        ? "This will remove the company block."
        : isVerify
          ? "This will mark the company as verified."
          : "This will mark the company's verification status as rejected.";

  const destructive = isDelete || isBlock || isReject;

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
            destructive ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
          )}
        >
          {isDelete ? (
            <Trash2 size={23} />
          ) : isBlock ? (
            <Ban size={23} />
          ) : isReject ? (
            <ShieldAlert size={23} />
          ) : isVerify ? (
            <BadgeCheck size={23} />
          ) : (
            <CheckCircle size={23} />
          )}
        </div>

        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>

        <div className="mt-4 rounded-xl bg-slate-50 p-3">
          <p className="break-words text-sm font-semibold text-slate-800">
            {getCompanyName(company)}
          </p>
          <p className="mt-1 break-all text-xs text-slate-500">
            {getCompanyId(company)}
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
              destructive ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"
            )}
          >
            {loading && <LoaderCircle size={16} className="animate-spin" />}
            {loading
              ? "Processing..."
              : isDelete
                ? "Delete company"
                : isBlock
                  ? "Block company"
                  : isUnblock
                    ? "Unblock company"
                    : isVerify
                      ? "Verify company"
                      : "Reject verification"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AdminCompanies() {
  const {
    companies: rawCompanies = [],
    companiesPagination,
    handleGetAllAdminCompanies,
    handleGetCompanyById,
    handleVerifyCompany,
    handleRejectCompany,
    handleBlockCompany,
    handleUnblockCompany,
    handleSoftDeleteCompany,
  } = useAdmin();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [page, setPage] = useState(1);

  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [selected, setSelected] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [menuCompanyId, setMenuCompanyId] = useState(null);

  const clearMessages = useCallback(() => {
    setError("");
    setNotice("");
  }, []);

  const fetchCompanies = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setInitialLoading(true);
      }

      setError("");

      try {
        await handleGetAllAdminCompanies({
          page,
          limit: PAGE_SIZE,
          search: search.trim(),
          status: statusFilter,
          verificationStatus: verificationFilter,
          companySize: sizeFilter,
          sortBy: "createdAt",
          sortOrder: "desc",
        });
      } catch (err) {
        setError(err?.message || "Unable to load companies. Please try again.");
      } finally {
        setInitialLoading(false);
        setRefreshing(false);
      }
    },
    [
      handleGetAllAdminCompanies,
      page,
      search,
      statusFilter,
      verificationFilter,
      sizeFilter,
    ]
  );

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, verificationFilter, sizeFilter]);

  const companies = useMemo(
    () => (Array.isArray(rawCompanies) ? rawCompanies : []),
    [rawCompanies]
  );

  const pagination = useMemo(
    () => getPagination(companiesPagination, companies.length),
    [companiesPagination, companies.length]
  );

  const hasServerPagination = Boolean(companiesPagination);

  const filteredCompanies = useMemo(() => {
  const query = search.trim().toLowerCase();

  return companies.filter((company) => {
    const searchable = [
      getCompanyName(company),
      company.slug,
      company.description,
      getCompanyIndustry(company),
      getCompanyLocation(company),
      getCompanyId(company),
      getCompanyEmail(company),
      getCompanyPhone(company),
      getVerificationStatus(company),
      getCompanyStatus(company),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return !query || searchable.includes(query);
  });
}, [companies, search, getVerificationStatus]);

  const stats = useMemo(
    () => ({
      total: pagination.total,
      verified: companies.filter(
        (company) => getVerificationStatus(company) === "verified"
      ).length,
      pending: companies.filter(
        (company) => getVerificationStatus(company) === "pending"
      ).length,
      blocked: companies.filter(
        (company) => getCompanyStatus(company) === "blocked"
      ).length,
    }),
    [pagination.total, companies]
  );

  const totalPages = hasServerPagination
    ? pagination.totalPages
    : Math.max(1, Math.ceil(filteredCompanies.length / PAGE_SIZE));

  const safePage = Math.min(page, totalPages);

  const visibleCompanies = useMemo(() => {
    if (hasServerPagination) return filteredCompanies;

    const start = (safePage - 1) * PAGE_SIZE;
    return filteredCompanies.slice(start, start + PAGE_SIZE);
  }, [filteredCompanies, hasServerPagination, safePage]);

  const showingStart =
    visibleCompanies.length === 0
      ? 0
      : hasServerPagination
        ? (safePage - 1) * pagination.limit + 1
        : (safePage - 1) * PAGE_SIZE + 1;

  const showingEnd =
    visibleCompanies.length === 0
      ? 0
      : hasServerPagination
        ? Math.min(
            (safePage - 1) * pagination.limit + visibleCompanies.length,
            pagination.total
          )
        : Math.min(
            (safePage - 1) * PAGE_SIZE + visibleCompanies.length,
            filteredCompanies.length
          );

  const handleRefresh = async () => {
    clearMessages();
    await fetchCompanies(true);
  };

  const closeDetails = () => {
    if (actionLoading) return;
    setSelected(null);
  };

  const openCompanyDetails = useCallback(
    async (company) => {
      setMenuCompanyId(null);
      setSelected(company);
      setDetailsLoading(true);
      setError("");

      try {
        const result = await handleGetCompanyById(getCompanyId(company));
        const fullCompany = getReturnedCompany(result);

        if (fullCompany) setSelected(fullCompany);
      } catch (err) {
        setError(err?.message || "Could not load complete company details.");
      } finally {
        setDetailsLoading(false);
      }
    },
    [handleGetCompanyById]
  );

  const requestAction = (type, company) => {
    setMenuCompanyId(null);
    setConfirmAction({ type, company });
  };

  const runConfirmedAction = async () => {
    if (!confirmAction?.company) return;

    const { type, company } = confirmAction;
    const companyId = getCompanyId(company);

    if (!companyId) {
      setError("Cannot perform this action because the company ID is missing.");
      return;
    }

    setActionLoading(true);
    clearMessages();

    const successMessages = {
      verify: "Company verified successfully.",
      reject: "Company verification rejected.",
      block: "Company blocked successfully.",
      unblock: "Company unblocked successfully.",
      delete: "Company deleted successfully.",
    };

    const actionFunctions = {
      verify: handleVerifyCompany,
      reject: handleRejectCompany,
      block: handleBlockCompany,
      unblock: handleUnblockCompany,
      delete: handleSoftDeleteCompany,
    };

    try {
      const actionFunction = actionFunctions[type];

      if (typeof actionFunction !== "function") {
        throw new Error(`The ${type} API is not available in useAdmin.`);
      }

      await actionFunction(companyId);

      setNotice(successMessages[type] || "Company updated successfully.");
      setConfirmAction(null);

      if (type === "delete") {
        setSelected(null);
      } else if (selected && getCompanyId(selected) === companyId) {
        try {
          const result = await handleGetCompanyById(companyId);
          const refreshedCompany = getReturnedCompany(result);
          if (refreshedCompany) setSelected(refreshedCompany);
        } catch {
          // Keep current details if refreshing them fails.
        }
      }

      await fetchCompanies(true);
    } catch (err) {
      setError(err?.message || "The action failed. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setVerificationFilter("all");
    setSizeFilter("all");
    setPage(1);
  };

  const hasFilters =
    Boolean(search) ||
    statusFilter !== "all" ||
    verificationFilter !== "all" ||
    sizeFilter !== "all";

  return (
    <div
      className="min-h-screen bg-[#F7F8FC] px-4 py-6 text-slate-900 sm:px-6 lg:px-8"
      onClick={() => {
        if (menuCompanyId) setMenuCompanyId(null);
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
              Companies management
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Review company profiles, manage verification requests, control
              access, and maintain company records across your Peer.Hiring
              platform.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing || initialLoading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-200 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-60 sm:self-center"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh companies"}
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
            title="Total companies"
            value={stats.total}
            description="Total from API pagination"
            icon={Building2}
            iconClass="bg-violet-50 text-violet-700"
          />
          <StatCard
            title="Verified companies"
            value={stats.verified}
            description="Verified in loaded results"
            icon={BadgeCheck}
            iconClass="bg-emerald-50 text-emerald-700"
          />
          <StatCard
            title="Pending verification"
            value={stats.pending}
            description="Pending in loaded results"
            icon={Clock}
            iconClass="bg-amber-50 text-amber-700"
          />
          <StatCard
            title="Blocked companies"
            value={stats.blocked}
            description="Blocked in loaded results"
            icon={Ban}
            iconClass="bg-red-50 text-red-700"
          />
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-4 sm:p-5">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    All companies
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {filteredCompanies.length} matching{" "}
                    {filteredCompanies.length === 1 ? "company" : "companies"}{" "}
                    on this page
                  </p>
                </div>

                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="inline-flex items-center gap-2 self-start rounded-xl px-3 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
                  >
                    <RotateCcw size={15} />
                    Clear filters
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="relative min-w-0">
                  <Search
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    onClick={(event) => event.stopPropagation()}
                    placeholder="Search company, industry, ID..."
                    aria-label="Search companies"
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
                    aria-label="Filter by company status"
                    className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm font-medium outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                  >
                    {COMPANY_STATUS_OPTIONS.map((option) => (
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
                  <ShieldCheck
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <select
                    value={verificationFilter}
                    onChange={(event) => setVerificationFilter(event.target.value)}
                    onClick={(event) => event.stopPropagation()}
                    aria-label="Filter by verification status"
                    className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm font-medium outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                  >
                    {VERIFICATION_OPTIONS.map((option) => (
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
                  <Users
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <select
                    value={sizeFilter}
                    onChange={(event) => setSizeFilter(event.target.value)}
                    onClick={(event) => event.stopPropagation()}
                    aria-label="Filter by company size"
                    className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm font-medium outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                  >
                    {COMPANY_SIZE_OPTIONS.map((option) => (
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
              <LoaderCircle size={32} className="animate-spin text-violet-600" />
              <p className="text-sm font-medium text-slate-600">
                Loading companies...
              </p>
            </div>
          ) : visibleCompanies.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center px-5 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                <Building2 size={29} />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">
                No companies found
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {hasFilters
                  ? "Try changing your search or filters."
                  : "There are no companies in the collection returned by the server."}
              </p>
              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[1150px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80">
                      {[
                        "Company",
                        "Industry",
                        "Verification",
                        "Account status",
                        "Location",
                        "Created",
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
                    {visibleCompanies.map((company) => {
                      const companyId = getCompanyId(company);
                      const name = getCompanyName(company);
                      const status = getCompanyStatus(company);
                      const verification = getVerificationStatus(company);
                      const logo = getCompanyLogo(company);

                      return (
                        <tr
                          key={companyId || name}
                          className="transition hover:bg-violet-50/30"
                        >
                          <td className="px-4 py-4">
                            <div className="flex min-w-0 items-start gap-3">
                              {logo ? (
                                <img
                                  src={logo}
                                  alt={name}
                                  className="h-11 w-11 shrink-0 rounded-xl border border-slate-100 bg-white object-contain p-1"
                                />
                              ) : (
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-sm font-bold text-violet-700">
                                  {getCompanyInitials(name)}
                                </div>
                              )}

                              <div className="min-w-0 max-w-[260px]">
                                <button
                                  type="button"
                                  onClick={() => openCompanyDetails(company)}
                                  className="block max-w-full truncate text-left text-sm font-bold text-slate-900 hover:text-violet-700"
                                >
                                  {name}
                                </button>
                                <p className="mt-1 truncate text-xs text-slate-500">
                                  {company.slug ? `/${company.slug}` : companyId}
                                </p>
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                  <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                                    {getCompanySize(company)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex max-w-[180px] items-start gap-2 text-sm text-slate-600">
                              <BriefcaseBusiness size={15} className="mt-0.5 shrink-0 text-slate-400" />
                              <span className="break-words">{getCompanyIndustry(company)}</span>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <VerificationBadge status={verification} />
                          </td>

                          <td className="px-4 py-4">
                            <StatusBadge status={status} />
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex max-w-[220px] items-start gap-1.5 text-sm text-slate-600">
                              <MapPin size={15} className="mt-0.5 shrink-0 text-slate-400" />
                              <span className="break-words">{getCompanyLocation(company)}</span>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex items-start gap-2">
                              <CalendarDays size={15} className="mt-0.5 shrink-0 text-slate-400" />
                              <div>
                                <p className="whitespace-nowrap text-sm text-slate-700">
                                  {formatDate(company.createdAt)}
                                </p>
                                <p className="mt-1 text-xs text-slate-400">
                                  {company.updatedAt
                                    ? `Updated ${formatDate(company.updatedAt)}`
                                    : "Company"}
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
                                title="View company details"
                                onClick={() => openCompanyDetails(company)}
                              >
                                <Eye size={17} />
                              </IconButton>

                              {status !== "deleted" && (
                                <>
                                  <IconButton
                                    title={verification === "verified" ? "Company is verified" : "Verify company"}
                                    disabled={verification === "verified" || status === "blocked"}
                                    onClick={() => requestAction("verify", company)}
                                  >
                                    <BadgeCheck size={17} />
                                  </IconButton>

                                  <IconButton
                                    title={status === "blocked" ? "Unblock company" : "Block company"}
                                    danger={status !== "blocked"}
                                    onClick={() =>
                                      requestAction(status === "blocked" ? "unblock" : "block", company)
                                    }
                                  >
                                    {status === "blocked" ? (
                                      <CheckCircle size={17} />
                                    ) : (
                                      <Ban size={17} />
                                    )}
                                  </IconButton>
                                </>
                              )}

                              <div className="relative">
                                <IconButton
                                  title="More actions"
                                  onClick={() =>
                                    setMenuCompanyId((current) =>
                                      current === companyId ? null : companyId
                                    )
                                  }
                                >
                                  <MoreVertical size={18} />
                                </IconButton>

                                {menuCompanyId === companyId && (
                                  <div
                                    className="absolute right-0 top-11 z-20 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl"
                                    onClick={(event) => event.stopPropagation()}
                                  >
                                    <button
                                      type="button"
                                      onClick={() => openCompanyDetails(company)}
                                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-violet-50 hover:text-violet-700"
                                    >
                                      <Eye size={16} />
                                      View details
                                    </button>

                                    {status !== "deleted" && (
                                      <>
                                        {verification !== "verified" && (
                                          <button
                                            type="button"
                                            onClick={() => requestAction("verify", company)}
                                            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-emerald-700 hover:bg-emerald-50"
                                          >
                                            <BadgeCheck size={16} />
                                            Verify company
                                          </button>
                                        )}

                                        {verification !== "rejected" && (
                                          <button
                                            type="button"
                                            onClick={() => requestAction("reject", company)}
                                            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-amber-700 hover:bg-amber-50"
                                          >
                                            <ShieldAlert size={16} />
                                            Reject verification
                                          </button>
                                        )}

                                        <button
                                          type="button"
                                          onClick={() =>
                                            requestAction(status === "blocked" ? "unblock" : "block", company)
                                          }
                                          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
                                        >
                                          {status === "blocked" ? <CheckCircle size={16} /> : <Ban size={16} />}
                                          {status === "blocked" ? "Unblock company" : "Block company"}
                                        </button>
                                      </>
                                    )}

                                    <div className="my-1 border-t border-slate-100" />

                                    {status !== "deleted" && (
                                      <button
                                        type="button"
                                        onClick={() => requestAction("delete", company)}
                                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                                      >
                                        <Trash2 size={16} />
                                        Delete company
                                      </button>
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

              <div className="space-y-3 p-3 md:hidden">
                {visibleCompanies.map((company) => {
                  const companyId = getCompanyId(company);
                  const name = getCompanyName(company);
                  const status = getCompanyStatus(company);
                  const verification = getVerificationStatus(company);
                  const logo = getCompanyLogo(company);

                  return (
                    <article
                      key={companyId || name}
                      className="rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <div className="flex items-start gap-3">
                        {logo ? (
                          <img
                            src={logo}
                            alt={name}
                            className="h-12 w-12 shrink-0 rounded-xl border border-slate-100 bg-white object-contain p-1"
                          />
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-sm font-bold text-violet-700">
                            {getCompanyInitials(name)}
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <h3 className="break-words text-sm font-bold text-slate-900">{name}</h3>
                          <p className="mt-1 break-all text-xs text-slate-500">
                            {company.slug ? `/${company.slug}` : companyId}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <StatusBadge status={status} />
                            <VerificationBadge status={verification} />
                          </div>
                        </div>

                        <button
                          type="button"
                          aria-label="View company details"
                          onClick={() => openCompanyDetails(company)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-violet-50 hover:text-violet-700"
                        >
                          <Eye size={18} />
                        </button>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-100 pt-3">
                        <div className="flex items-start gap-2 text-sm text-slate-600">
                          <BriefcaseBusiness size={15} className="mt-0.5 shrink-0 text-slate-400" />
                          <span>{getCompanyIndustry(company)}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-slate-600">
                          <MapPin size={15} className="mt-0.5 shrink-0 text-slate-400" />
                          <span className="break-words">{getCompanyLocation(company)}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-slate-600">
                          <Users size={15} className="mt-0.5 shrink-0 text-slate-400" />
                          <span>{getCompanySize(company)} employees</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-slate-600">
                          <CalendarDays size={15} className="mt-0.5 shrink-0 text-slate-400" />
                          <span>Created {formatDate(company.createdAt)}</span>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                        <button
                          type="button"
                          onClick={() => openCompanyDetails(company)}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          <Eye size={15} />
                          Details
                        </button>

                        {status !== "deleted" && (
                          <>
                            {verification !== "verified" && (
                              <button
                                type="button"
                                onClick={() => requestAction("verify", company)}
                                disabled={status === "blocked"}
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-200 px-3 py-2.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
                              >
                                <BadgeCheck size={15} />
                                Verify
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() =>
                                requestAction(status === "blocked" ? "unblock" : "block", company)
                              }
                              className={cn(
                                "inline-flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold",
                                status === "blocked"
                                  ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                  : "border-red-200 text-red-700 hover:bg-red-50"
                              )}
                            >
                              {status === "blocked" ? <CheckCircle size={15} /> : <Ban size={15} />}
                              {status === "blocked" ? "Unblock" : "Block"}
                            </button>

                            <button
                              type="button"
                              onClick={() => requestAction("delete", company)}
                              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 px-3 py-2.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                            >
                              <Trash2 size={15} />
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>

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
                  companies
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
                    onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
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
          Verified, pending, and blocked counts are calculated from the
          companies currently loaded from the API. Global counts require
          statistics from the backend.
        </p>
      </div>

      {selected && (
        <CompanyDetailsModal
          company={selected}
          onClose={closeDetails}
          onAction={requestAction}
          busy={actionLoading}
        />
      )}

      {confirmAction && (
        <ConfirmModal
          action={confirmAction.type}
          company={confirmAction.company}
          loading={actionLoading}
          onCancel={() => {
            if (!actionLoading) setConfirmAction(null);
          }}
          onConfirm={runConfirmedAction}
        />
      )}

      {detailsLoading && selected && (
        <div className="fixed bottom-5 right-5 z-[70] flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-lg">
          <LoaderCircle size={17} className="animate-spin text-violet-600" />
          Loading full company details...
        </div>
      )}
    </div>
  );
}