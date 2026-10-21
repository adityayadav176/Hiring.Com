
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Building2,
  Search,
  RefreshCw,
  LoaderCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  Ban,
  Trash2,
  AlertCircle,
  Clock3,
  Users,
  Globe,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  ExternalLink,
  Filter,
  RotateCcw,
  BriefcaseBusiness,
} from "lucide-react";

import { useAdmin, useCompany } from "../../hooks/Hook";

const PAGE_SIZE = 8;

const cn = (...classes) => classes.filter(Boolean).join(" ");

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.data?.message ||
  error?.message ||
  fallback;

const getCompanyId = (company) =>
  company?._id || company?.id || company?.companyId || "";

const getCompanyName = (company) =>
  company?.name ||
  company?.companyName ||
  company?.companyDetails?.name ||
  "Unnamed company";

const getVerificationStatus = (company) => {
  const status = String(company?.verificationStatus || "").toLowerCase();

  if (["verified", "approved"].includes(status) || company?.isVerified === true) {
    return "verified";
  }

  if (status === "rejected") return "rejected";

  return "pending";
};

const getCompanyStatus = (company) => {
  if (
    company?.isDeleted ||
    company?.deletedAt ||
    String(company?.status || "").toLowerCase() === "deleted"
  ) {
    return "deleted";
  }

  if (
    company?.isBlocked ||
    String(company?.status || "").toLowerCase() === "blocked"
  ) {
    return "blocked";
  }

  return "active";
};

const formatDate = (value) => {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatCompanySize = (value) => {
  if (!value) return "Not specified";

  if (typeof value === "object") {
    return (
      value.label ||
      value.value ||
      value.name ||
      "Not specified"
    );
  }

  return String(value);
};

const statusStyles = {
  verified: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  rejected: "bg-rose-50 text-rose-700 ring-rose-200",
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  blocked: "bg-orange-50 text-orange-700 ring-orange-200",
  deleted: "bg-gray-100 text-gray-600 ring-gray-200",
};

function StatusBadge({ status }) {
  const labels = {
    verified: "Verified",
    pending: "Pending review",
    rejected: "Rejected",
    active: "Active",
    blocked: "Blocked",
    deleted: "Deleted",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        statusStyles[status] || statusStyles.pending
      )}
    >
      {status === "verified" || status === "active" ? (
        <CheckCircle2 size={13} />
      ) : status === "blocked" || status === "rejected" ? (
        <ShieldAlert size={13} />
      ) : status === "deleted" ? (
        <Trash2 size={13} />
      ) : (
        <Clock3 size={13} />
      )}
      {labels[status] || status}
    </span>
  );
}

function Toast({ toast, onClose }) {
  if (!toast) return null;

  const variants = {
    success: {
      wrapper: "border-emerald-200 bg-white",
      icon: "bg-emerald-50 text-emerald-600",
      Icon: CheckCircle2,
    },
    error: {
      wrapper: "border-rose-200 bg-white",
      icon: "bg-rose-50 text-rose-600",
      Icon: XCircle,
    },
    warning: {
      wrapper: "border-amber-200 bg-white",
      icon: "bg-amber-50 text-amber-600",
      Icon: AlertCircle,
    },
    info: {
      wrapper: "border-violet-200 bg-white",
      icon: "bg-violet-50 text-violet-600",
      Icon: ShieldCheck,
    },
  };

  const style = variants[toast.type] || variants.info;
  const Icon = style.Icon;

  return (
    <div
      className="fixed right-4 top-4 z-[120] w-[calc(100%-2rem)] max-w-md"
      role={toast.type === "error" ? "alert" : "status"}
      aria-live="polite"
    >
      <div
        className={cn(
          "flex items-start gap-3 rounded-2xl border p-4 shadow-xl shadow-slate-900/10",
          style.wrapper
        )}
      >
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            style.icon
          )}
        >
          <Icon size={20} />
        </span>

        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-sm font-bold text-slate-900">
            {toast.type === "success"
              ? "Success"
              : toast.type === "error"
              ? "Something went wrong"
              : toast.type === "warning"
              ? "Attention required"
              : "Notification"}
          </p>
          <p className="mt-1 break-words text-sm leading-5 text-slate-600">
            {toast.message}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close notification"
          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X size={17} />
        </button>
      </div>
    </div>
  );
}

function StatCard({ title, value, description, icon: Icon, accent }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>

        <span
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl",
            accent
          )}
        >
          <Icon size={21} />
        </span>
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value, href }) {
  const displayValue =
    value === undefined || value === null || value === ""
      ? "Not provided"
      : value;

  return (
    <div className="flex items-start gap-3 py-3">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
        <Icon size={17} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>

        {href && displayValue !== "Not provided" ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-flex max-w-full items-center gap-1 break-all text-sm font-medium text-violet-700 hover:underline"
          >
            {displayValue}
            <ExternalLink size={13} />
          </a>
        ) : (
          <p className="mt-1 break-words text-sm font-medium text-slate-800">
            {displayValue}
          </p>
        )}
      </div>
    </div>
  );
}

export default function AdminCompanies() {
  const {
    companies,
    companiesPagination,
    handleGetAllAdminCompanies,
    handleGetCompanyById,
    handleVerifyCompany,
    handleRejectCompany,
    handleBlockCompany,
    handleUnblockCompany,
    handleSoftDeleteCompany,
    handleRestoreCompany
  } = useAdmin();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((type, message) => {
    setToast({ type, message });
  }, []);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  const fetchCompanies = useCallback(
    async (requestedPage = page) => {
      setLoading(true);
      setError("");

      try {
        if (typeof handleGetAllAdminCompanies !== "function") {
          throw new Error(
            "The admin companies API handler is missing from AdminContext."
          );
        }

        await handleGetAllAdminCompanies({
  page: requestedPage,
  limit: PAGE_SIZE,
  search: search.trim(),
  ...(statusFilter !== "all" && { status: statusFilter }),
  ...(verificationFilter !== "all" && {
    verificationStatus: verificationFilter,
  }),
  ...(sizeFilter !== "all" && {
    companySize: sizeFilter,
  }),
  sortBy: "createdAt",
  sortOrder: "desc",
});
      } catch (err) {
        const message = getErrorMessage(
          err,
          "Unable to load companies. Please try again."
        );

        setError(message);
        showToast("error", message);
      } finally {
        setLoading(false);
      }
    },
    [
      handleGetAllAdminCompanies,
      page,
      search,
      statusFilter,
      verificationFilter,
      sizeFilter,
      showToast,
    ]
  );

  useEffect(() => {
    fetchCompanies(page);
  }, [fetchCompanies, page]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, verificationFilter, sizeFilter]);

  const companyList = useMemo(
    () => (Array.isArray(companies) ? companies : []),
    [companies]
  );

  const pagination = companiesPagination || {};
  const total = Number(
    pagination.total ??
      pagination.totalCompanies ??
      pagination.totalItems ??
      companyList.length
  );

  const totalPages = Math.max(
    1,
    Number(
      pagination.totalPages ??
        Math.ceil(total / PAGE_SIZE) ??
        1
    )
  );

  const currentPage = Math.min(
    Math.max(1, Number(pagination.page ?? page)),
    totalPages
  );

  const stats = useMemo(() => {
    const verified = companyList.filter(
      (company) => getVerificationStatus(company) === "verified"
    ).length;

    const pending = companyList.filter(
      (company) => getVerificationStatus(company) === "pending"
    ).length;

    const blocked = companyList.filter(
      (company) => getCompanyStatus(company) === "blocked"
    ).length;

    return { verified, pending, blocked };
  }, [companyList]);

  const openCompanyDetails = async (company) => {
    const companyId = getCompanyId(company);

    if (!companyId) {
      showToast("error", "This company does not have a valid ID.");
      return;
    }

    setDetailsLoading(true);

    try {
      if (typeof handleGetCompanyById !== "function") {
        setSelected(company);
        return;
      }

      const result = await handleGetCompanyById(companyId);

      const details =
        result?.data?.company ||
        result?.data?.data?.company ||
        result?.data?.data ||
        result?.data ||
        result?.company ||
        result ||
        company;

      setSelected(
        details && typeof details === "object" ? details : company
      );
    } catch (err) {
      const message = getErrorMessage(
        err,
        "Could not load company details."
      );

      showToast("error", message);
    } finally {
      setDetailsLoading(false);
    }
  };

  const runConfirmedAction = async (type, company) => {
    const companyId = getCompanyId(company);
    const companyName = getCompanyName(company);

    if (!companyId) {
      showToast("error", "This company does not have a valid ID.");
      return;
    }

    const actionConfig = {
      verify: {
        handler: handleVerifyCompany,
        confirm: `Verify ${companyName}?`,
        success: "Company verified successfully.",
        missing: "Company verification is not available.",
      },
      reject: {
        handler: handleRejectCompany,
        confirm: `Reject verification for ${companyName}?`,
        success: "Company verification rejected.",
        missing: "Company rejection is not available.",
      },
      block: {
        handler: handleBlockCompany,
        confirm: `Block ${companyName}? The company may lose access to restricted features.`,
        success: "Company blocked successfully.",
        missing: "Company blocking is not available.",
      },
      unblock: {
        handler: handleUnblockCompany,
        confirm: `Unblock ${companyName}?`,
        success: "Company unblocked successfully.",
        missing: "Company unblocking is not available.",
      },
      delete: {
        handler: handleSoftDeleteCompany,
        confirm: `Soft-delete ${companyName}? Make sure you want to continue.`,
        success: "Company moved to deleted status.",
        missing: "Company deletion is not available.",
      },
      restore: {
        handler: handleRestoreCompany,
        confirm: `Restore ${companyName}?`,
        success: "Company restored successfully.",
        missing: "Company restoration is not available.",
      },
    };

    const config = actionConfig[type];

    if (!config) {
      showToast("error", "Unknown company action.");
      return;
    }

    if (typeof config.handler !== "function") {
      showToast("error", config.missing);
      return;
    }

    if (!window.confirm(config.confirm)) return;

    setActionLoading(`${type}:${companyId}`);

    try {
     const result = await config.handler(companyId);

if (result?.success === false) {
  throw new Error(result.message || `Unable to ${type} company.`);
}

      const message =
        result?.message ||
        result?.data?.message ||
        config.success;

      showToast("success", message);

      await fetchCompanies(page);

      if (selected && getCompanyId(selected) === companyId) {
        setSelected(null);
      }
    } catch (err) {
      const message = getErrorMessage(
        err,
        `Unable to ${type} this company. Please try again.`
      );

      showToast("error", message);
    } finally {
      setActionLoading("");
    }
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setVerificationFilter("all");
    setSizeFilter("all");
    setPage(1);
    showToast("info", "Filters have been reset.");
  };

  const isActionBusy = (type, company) =>
    actionLoading === `${type}:${getCompanyId(company)}`;

  return (
    <div className="min-h-screen bg-[#F7F8FC] px-4 py-6 sm:px-6 lg:px-8">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="mx-auto max-w-[1600px] space-y-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-violet-700">
              <ShieldCheck size={17} />
              ADMINISTRATION
            </div>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Company Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Review, verify, and manage companies registered on Peer.Hiring.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchCompanies(page)}
            disabled={loading}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh companies
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Companies found"
            value={total}
            description="Matching your current filters"
            icon={Building2}
            accent="bg-violet-50 text-violet-700"
          />

          <StatCard
            title="Verified on this page"
            value={stats.verified}
            description="Companies marked as verified"
            icon={CheckCircle2}
            accent="bg-emerald-50 text-emerald-700"
          />

          <StatCard
            title="Pending on this page"
            value={stats.pending}
            description="Awaiting verification review"
            icon={Clock3}
            accent="bg-amber-50 text-amber-700"
          />

          <StatCard
            title="Blocked on this page"
            value={stats.blocked}
            description="Currently blocked companies"
            icon={Ban}
            accent="bg-rose-50 text-rose-700"
          />
        </div>

        {/* Filters */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-center gap-2">
            <Filter size={18} className="text-violet-700" />
            <h2 className="font-bold text-slate-900">Search and filters</h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search company..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
            >
              <option value="all">All company statuses</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
              <option value="deleted">Deleted</option>
            </select>

            <select
              value={verificationFilter}
              onChange={(event) =>
                setVerificationFilter(event.target.value)
              }
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
            >
              <option value="all">All verification statuses</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={sizeFilter}
              onChange={(event) => setSizeFilter(event.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
            >
              <option value="all">All company sizes</option>
              <option value="1-10">1–10 employees</option>
              <option value="11-50">11–50 employees</option>
              <option value="51-200">51–200 employees</option>
              <option value="201-500">201–500 employees</option>
              <option value="501-1000">501–1,000 employees</option>
              <option value="1000+">1,000+ employees</option>
            </select>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              {loading
                ? "Loading company records..."
                : `${companyList.length} record(s) on this page`}
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-violet-700"
            >
              <RotateCcw size={15} />
              Reset filters
            </button>
          </div>
        </section>

        {/* Error banner */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800"
          >
            <AlertCircle size={20} className="mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold">Could not load companies</p>
              <p className="mt-1 break-words text-sm">{error}</p>
            </div>
            <button
              type="button"
              onClick={() => fetchCompanies(page)}
              className="shrink-0 rounded-lg bg-white px-3 py-2 text-xs font-bold text-rose-700 ring-1 ring-rose-200 hover:bg-rose-100"
            >
              Retry
            </button>
          </div>
        )}

        {/* Company table */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-bold text-slate-900">Registered companies</h2>
              <p className="mt-1 text-xs text-slate-500">
                Company information and administrative actions
              </p>
            </div>

            {loading && (
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-violet-700">
                <LoaderCircle size={15} className="animate-spin" />
                Updating records
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">
              <thead className="bg-slate-50">
                <tr className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-4">Company</th>
                  <th className="px-5 py-4">Contact</th>
                  <th className="px-5 py-4">Company size</th>
                  <th className="px-5 py-4">Verification</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Registered</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading && companyList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-16 text-center">
                      <LoaderCircle
                        size={30}
                        className="mx-auto animate-spin text-violet-600"
                      />
                      <p className="mt-3 text-sm font-semibold text-slate-700">
                        Loading companies
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Please wait while records are retrieved.
                      </p>
                    </td>
                  </tr>
                ) : companyList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-16 text-center">
                      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                        <Building2 size={26} />
                      </span>
                      <p className="mt-4 text-sm font-bold text-slate-800">
                        No companies found
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Try changing your search or filters.
                      </p>
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="mt-4 rounded-xl bg-violet-700 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-800"
                      >
                        Clear filters
                      </button>
                    </td>
                  </tr>
                ) : (
                  companyList.map((company) => {
                    const id = getCompanyId(company);
                    const verification = getVerificationStatus(company);
                    const companyStatus = getCompanyStatus(company);
                    const logo =
                      company?.logo?.url ||
                      company?.logoUrl ||
                      company?.companyLogo ||
                      "";

                    const email =
                      company?.email ||
                      company?.contactEmail ||
                      company?.recruiter?.email ||
                      company?.owner?.email ||
                      "";

                    const website =
                      company?.website ||
                      company?.websiteUrl ||
                      "";

                    const busy =
                      actionLoading.endsWith(`:${id}`) && Boolean(actionLoading);

                    return (
                      <tr
                        key={id || getCompanyName(company)}
                        className="transition hover:bg-violet-50/30"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-violet-50 text-violet-700">
                              {logo ? (
                                <img
                                  src={logo}
                                  alt={`${getCompanyName(company)} logo`}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Building2 size={20} />
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-[220px] truncate text-sm font-bold text-slate-900">
                                {getCompanyName(company)}
                              </p>
                              <p className="mt-1 max-w-[220px] truncate text-xs text-slate-500">
                                {company?.industry ||
                                  company?.category ||
                                  "Industry not specified"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <p className="max-w-[220px] truncate text-sm font-medium text-slate-700">
                            {email || "No email provided"}
                          </p>
                          <p className="mt-1 max-w-[220px] truncate text-xs text-slate-500">
                            {company?.phone ||
                              company?.contactNumber ||
                              "No phone provided"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span className="text-sm text-slate-700">
                            {formatCompanySize(
                              company?.companySize || company?.size
                            )}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge status={verification} />
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge status={companyStatus} />
                        </td>

                        <td className="px-5 py-4">
                          <span className="text-sm text-slate-600">
                            {formatDate(
                              company?.createdAt || company?.registeredAt
                            )}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              title="View company details"
                              aria-label={`View ${getCompanyName(company)}`}
                              onClick={() => openCompanyDetails(company)}
                              disabled={busy}
                              className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 disabled:opacity-50"
                            >
                              <Eye size={16} />
                            </button>

                            {verification !== "verified" &&
                              companyStatus !== "deleted" && (
                                <button
                                  type="button"
                                  title="Verify company"
                                  aria-label={`Verify ${getCompanyName(company)}`}
                                  onClick={() =>
                                    runConfirmedAction("verify", company)
                                  }
                                  disabled={busy}
                                  className="rounded-lg border border-emerald-200 p-2 text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-50"
                                >
                                  {isActionBusy("verify", company) ? (
                                    <LoaderCircle
                                      size={16}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <CheckCircle2 size={16} />
                                  )}
                                </button>
                              )}

                            {verification !== "rejected" &&
                              verification !== "verified" &&
                              companyStatus !== "deleted" && (
                                <button
                                  type="button"
                                  title="Reject verification"
                                  aria-label={`Reject ${getCompanyName(company)}`}
                                  onClick={() =>
                                    runConfirmedAction("reject", company)
                                  }
                                  disabled={busy}
                                  className="rounded-lg border border-rose-200 p-2 text-rose-700 transition hover:bg-rose-50 disabled:opacity-50"
                                >
                                  {isActionBusy("reject", company) ? (
                                    <LoaderCircle
                                      size={16}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <XCircle size={16} />
                                  )}
                                </button>
                              )}

                            {companyStatus === "blocked" ? (
                              <button
                                type="button"
                                title="Unblock company"
                                aria-label={`Unblock ${getCompanyName(company)}`}
                                onClick={() =>
                                  runConfirmedAction("unblock", company)
                                }
                                disabled={busy}
                                className="rounded-lg border border-violet-200 p-2 text-violet-700 transition hover:bg-violet-50 disabled:opacity-50"
                              >
                                {isActionBusy("unblock", company) ? (
                                  <LoaderCircle
                                    size={16}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <ShieldCheck size={16} />
                                )}
                              </button>
                            ) : (
                              companyStatus === "active" && (
                                <button
                                  type="button"
                                  title="Block company"
                                  aria-label={`Block ${getCompanyName(company)}`}
                                  onClick={() =>
                                    runConfirmedAction("block", company)
                                  }
                                  disabled={busy}
                                  className="rounded-lg border border-orange-200 p-2 text-orange-700 transition hover:bg-orange-50 disabled:opacity-50"
                                >
                                  {isActionBusy("block", company) ? (
                                    <LoaderCircle
                                      size={16}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <Ban size={16} />
                                  )}
                                </button>
                              )
                            )}

                            
{companyStatus === "deleted" ? (
  <button
    type="button"
    title="Restore company"
    aria-label={`Restore ${getCompanyName(company)}`}
    onClick={() => runConfirmedAction("restore", company)}
    disabled={busy}
    className="rounded-lg border border-emerald-200 p-2 text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-50"
  >
    {isActionBusy("restore", company) ? (
      <LoaderCircle size={16} className="animate-spin" />
    ) : (
      <RotateCcw size={16} />
    )}
  </button>
) : (
  <button
    type="button"
    title="Soft-delete company"
    aria-label={`Delete ${getCompanyName(company)}`}
    onClick={() => runConfirmedAction("delete", company)}
    disabled={busy}
    className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50"
  >
    {isActionBusy("delete", company) ? (
      <LoaderCircle size={16} className="animate-spin" />
    ) : (
      <Trash2 size={16} />
    )}
  </button>
)}

                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              Page{" "}
              <span className="font-bold text-slate-800">{currentPage}</span>{" "}
              of{" "}
              <span className="font-bold text-slate-800">{totalPages}</span>
              <span className="mx-2 text-slate-300">|</span>
              <span className="font-bold text-slate-800">{total}</span>{" "}
              total companies
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={loading || currentPage <= 1}
                className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <button
                type="button"
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
                disabled={loading || currentPage >= totalPages}
                className="inline-flex h-9 items-center gap-1 rounded-lg bg-violet-700 px-3 text-sm font-semibold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Company details drawer */}
      {(selected || detailsLoading) && (
        <div
          className="fixed inset-0 z-[100] flex justify-end bg-slate-950/40 backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !detailsLoading) {
              setSelected(null);
            }
          }}
        >
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Company details"
            className="flex h-full w-full max-w-xl flex-col overflow-hidden bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-violet-700">
                  Company profile
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Company details
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Review the company's registered information.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelected(null)}
                disabled={detailsLoading}
                aria-label="Close company details"
                className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 disabled:opacity-50"
              >
                <X size={19} />
              </button>
            </div>

            {detailsLoading ? (
              <div className="flex flex-1 flex-col items-center justify-center">
                <LoaderCircle
                  size={32}
                  className="animate-spin text-violet-700"
                />
                <p className="mt-3 text-sm font-semibold text-slate-700">
                  Loading company details...
                </p>
              </div>
            ) : selected ? (
              <>
                <div className="flex-1 space-y-6 overflow-y-auto px-5 py-6 sm:px-6">
                  <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white bg-white text-violet-700 shadow-sm">
                        {(
                          selected?.logo?.url ||
                          selected?.logoUrl ||
                          selected?.companyLogo
                        ) ? (
                          <img
                            src={
                              selected?.logo?.url ||
                              selected?.logoUrl ||
                              selected?.companyLogo
                            }
                            alt={`${getCompanyName(selected)} logo`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Building2 size={28} />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="break-words text-lg font-bold text-slate-900">
                          {getCompanyName(selected)}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {selected?.industry ||
                            selected?.category ||
                            "Industry not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <StatusBadge
                        status={getVerificationStatus(selected)}
                      />
                      <StatusBadge status={getCompanyStatus(selected)} />
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 text-sm font-bold text-slate-900">
                      Contact information
                    </h3>
                    <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 px-4">
                      <DetailRow
                        icon={Mail}
                        label="Email"
                        value={
                          selected?.email ||
                          selected?.contactEmail ||
                          selected?.recruiter?.email ||
                          selected?.owner?.email
                        }
                      />
                      <DetailRow
                        icon={Phone}
                        label="Phone"
                        value={
                          selected?.phone ||
                          selected?.contactNumber ||
                          selected?.mobile
                        }
                      />
                      <DetailRow
                        icon={Globe}
                        label="Website"
                        value={selected?.website || selected?.websiteUrl}
                        href={
                          selected?.website || selected?.websiteUrl
                            ? /^https?:\/\//i.test(
                                selected.website || selected.websiteUrl
                              )
                              ? selected.website || selected.websiteUrl
                              : `https://${selected.website || selected.websiteUrl}`
                            : undefined
                        }
                      />
                      <DetailRow
                        icon={MapPin}
                        label="Location"
                        value={[
                          selected?.address,
                          selected?.city,
                          selected?.state,
                          selected?.country,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 text-sm font-bold text-slate-900">
                      Company information
                    </h3>
                    <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 px-4">
                      <DetailRow
                        icon={BriefcaseBusiness}
                        label="Industry"
                        value={selected?.industry || selected?.category}
                      />
                      <DetailRow
                        icon={Users}
                        label="Company size"
                        value={formatCompanySize(
                          selected?.companySize || selected?.size
                        )}
                      />
                      <DetailRow
                        icon={CalendarDays}
                        label="Registration date"
                        value={formatDate(
                          selected?.createdAt || selected?.registeredAt
                        )}
                      />
                      <DetailRow
                        icon={ShieldCheck}
                        label="Company ID"
                        value={getCompanyId(selected)}
                      />
                    </div>
                  </div>

                  {(selected?.description || selected?.about) && (
                    <div>
                      <h3 className="mb-2 text-sm font-bold text-slate-900">
                        About the company
                      </h3>
                      <p className="whitespace-pre-wrap rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                        {selected.description || selected.about}
                      </p>
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-100 bg-white p-4 sm:px-6">
                  <div className="flex flex-wrap gap-2">
                    {getVerificationStatus(selected) !== "verified" &&
                      getCompanyStatus(selected) !== "deleted" && (
                        <button
                          type="button"
                          onClick={() =>
                            runConfirmedAction("verify", selected)
                          }
                          disabled={Boolean(actionLoading)}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                        >
                          <CheckCircle2 size={16} />
                          Verify company
                        </button>
                      )}

                    {getCompanyStatus(selected) === "blocked" ? (
                      <button
                        type="button"
                        onClick={() =>
                          runConfirmedAction("unblock", selected)
                        }
                        disabled={Boolean(actionLoading)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800 disabled:opacity-50"
                      >
                        <ShieldCheck size={16} />
                        Unblock
                      </button>
                    ) : (
                      getCompanyStatus(selected) === "active" && (
                        <button
                          type="button"
                          onClick={() =>
                            runConfirmedAction("block", selected)
                          }
                          disabled={Boolean(actionLoading)}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-semibold text-orange-700 transition hover:bg-orange-100 disabled:opacity-50"
                        >
                          <Ban size={16} />
                          Block
                        </button>
                      )
                    )}

                    {getCompanyStatus(selected) !== "deleted" && (
                      <button
                        type="button"
                        onClick={() =>
                          runConfirmedAction("delete", selected)
                        }
                        disabled={Boolean(actionLoading)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : null}
          </aside>
        </div>
      )}
    </div>
  );
}
