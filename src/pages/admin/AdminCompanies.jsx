import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Building2,
  Users,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Search,
  RefreshCw,
  LoaderCircle,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Eye,
  CheckCircle,
  XCircle,
  X,
  CalendarDays,
  Mail,
  MapPin,
  AlertCircle,
  Filter,
  ChevronDown,
  BriefcaseBusiness,
  Globe,
  ExternalLink,
  Link as LinkIcon,
} from "lucide-react";

import { useAdmin } from "../../hooks/Hook";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const PAGE_SIZE = 8;

/* ----------------------------- Helpers ----------------------------- */

const cn = (...classes) => classes.filter(Boolean).join(" ");

const getCompanyId = (company) =>
  company?._id || company?.id || company?.companyId || "";

const getCompanyName = (company) =>
  company?.name || company?.companyName || "Unnamed company";

const getLogo = (company) => {
  const logo = company?.logo;

  if (typeof logo === "string") return logo;

  return logo?.url || company?.logoUrl || "";
};

const getRecruiters = (company) => {
  if (!Array.isArray(company?.recruiters)) return [];

  return company.recruiters.map((item) =>
    item?.recruiterId && typeof item.recruiterId === "object"
      ? item.recruiterId
      : item
  );
};

const getLocation = (company) => {
  const headquarters = company?.headquarters || {};

  return [
    headquarters.city,
    headquarters.state,
    headquarters.country,
  ]
    .filter(Boolean)
    .join(", ");
};

const getCompanyStatus = (company) => {
  if (
    company?.isDeleted === true ||
    company?.deletedAt ||
    company?.status === "deleted"
  ) {
    return "deleted";
  }

  if (
    company?.isVerified === true ||
    company?.verificationStatus === "verified" ||
    company?.status === "verified"
  ) {
    return "verified";
  }

  return "unverified";
};

const getStatusLabel = (status) => {
  const labels = {
    verified: "Verified",
    unverified: "Pending",
    deleted: "Deleted",
  };

  return labels[status] || "Pending";
};

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "CO";

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

const getPagination = (pagination, count) => {
  const totalValue =
    pagination?.totalCompanies ??
    pagination?.total ??
    pagination?.totalItems ??
    pagination?.count ??
    count;

  const pageValue =
    pagination?.currentPage ??
    pagination?.page ??
    pagination?.current ??
    1;

  const limitValue =
    pagination?.limit ??
    pagination?.pageSize ??
    PAGE_SIZE;

  const total = Number(totalValue);
  const page = Number(pageValue);
  const limit = Number(limitValue);

  const totalPagesValue =
    pagination?.totalPages ??
    pagination?.pages ??
    Math.max(1, Math.ceil(total / limit));

  const totalPages = Number(totalPagesValue);

  return {
    total: Number.isFinite(total) && total >= 0 ? total : count,
    page: Number.isFinite(page) && page > 0 ? page : 1,
    limit: Number.isFinite(limit) && limit > 0 ? limit : PAGE_SIZE,
    totalPages:
      Number.isFinite(totalPages) && totalPages > 0
        ? totalPages
        : 1,
  };
};

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.data?.message ||
  error?.message ||
  fallback;

const normalizeCompanyResponse = (response) =>
  response?.company ??
  response?.data?.company ??
  response?.data?.data?.company ??
  response?.data?.data ??
  response?.data ??
  response;

const normalizeCompanyList = (response) => {
  const data =
    response?.data?.data ??
    response?.data ??
    response;

  if (Array.isArray(data)) return data;

  if (Array.isArray(data?.companies)) return data.companies;

  if (Array.isArray(data?.results)) return data.results;

  if (Array.isArray(data?.items)) return data.items;

  return [];
};

const normalizeUrl = (url) => {
  if (!url) return "";
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
};

/* ----------------------------- Status badges ----------------------------- */

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "verified", label: "Verified" },
  { value: "unverified", label: "Pending verification" },
  { value: "deleted", label: "Deleted" },
];

const STATUS_STYLES = {
  verified: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  unverified: "bg-amber-50 text-amber-700 ring-amber-600/15",
  deleted: "bg-slate-100 text-slate-600 ring-slate-500/15",
};

const StatusBadge = ({ status }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1",
      "text-xs font-semibold ring-1 ring-inset",
      STATUS_STYLES[status] || STATUS_STYLES.unverified
    )}
  >
    <span
      className={cn(
        "h-1.5 w-1.5 rounded-full",
        status === "verified" && "bg-emerald-500",
        status === "unverified" && "bg-amber-500",
        status === "deleted" && "bg-slate-400"
      )}
    />
    {getStatusLabel(status)}
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

const CompanyAvatar = ({ company, size = "md" }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const logo = getLogo(company);
  const name = getCompanyName(company);

  const sizeClass =
    size === "lg"
      ? "h-14 w-14 text-lg"
      : size === "sm"
        ? "h-10 w-10 text-xs"
        : "h-10 w-10 text-sm";

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-xl",
        "border border-slate-100 bg-violet-50 font-bold text-violet-700",
        sizeClass
      )}
    >
      {logo && !imageFailed ? (
        <img
          src={logo}
          alt={`${name} logo`}
          className="h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        getInitials(name)
      )}
    </div>
  );
};

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
          : String(value)}
      </p>
    </div>
  </div>
);

/* ----------------------------- Company details modal ----------------------------- */

const CompanyDetailsModal = ({
  company,
  onClose,
  onVerify,
  onReject,
  busy,
}) => {
  if (!company) return null;

  const status = getCompanyStatus(company);
  const recruiters = getRecruiters(company);
  const location = getLocation(company);
  const socialLinks = company?.socialLinks || {};

  const socials = [
    {
      label: "Website",
      url: socialLinks.website || company.website,
      icon: Globe,
    },
    {
      label: "LinkedIn",
      url: socialLinks.linkedin,
      icon: FaLinkedin,
    },
    {
      label: "GitHub",
      url: socialLinks.github,
      icon: FaGithub,
    },
    {
      label: "Twitter / X",
      url: socialLinks.twitter,
      icon: LinkIcon,
    },
  ].filter((item) => item.url);

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
        aria-labelledby="company-details-title"
        className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-violet-700 via-violet-700 to-indigo-800 px-5 py-6 text-white sm:px-8">
          <div className="absolute -right-10 -top-20 h-56 w-56 rounded-full bg-white/10 blur-2xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-4">
              <CompanyAvatar company={company} size="lg" />

              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold">
                    Company details
                  </span>

                  <StatusBadge status={status} />
                </div>

                <h2
                  id="company-details-title"
                  className="break-words text-xl font-bold sm:text-2xl"
                >
                  {getCompanyName(company)}
                </h2>

                <p className="mt-1 break-all text-sm text-violet-100">
                  {company.slug ? `@${company.slug}` : getCompanyId(company)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              aria-label="Close company details"
              className="shrink-0 rounded-xl p-2 text-white/80 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
            >
              <X size={21} />
            </button>
          </div>

          <div className="relative mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-violet-100">
            <span className="inline-flex items-center gap-1.5">
              <BriefcaseBusiness size={15} />
              {company.industry || "Industry not specified"}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={15} />
              Joined {formatDate(company.createdAt)}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Users size={15} />
              {recruiters.length} recruiter(s)
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-7 overflow-y-auto p-5 sm:p-8">
          <section>
            <h3 className="mb-3 text-sm font-bold text-slate-900">
              Company information
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <DetailItem
                icon={Building2}
                label="Company name"
                value={getCompanyName(company)}
              />

              <DetailItem
                icon={BriefcaseBusiness}
                label="Industry"
                value={company.industry}
              />

              <DetailItem
                icon={Users}
                label="Company size"
                value={company.companySize}
              />

              <DetailItem
                icon={MapPin}
                label="Headquarters"
                value={location}
              />

              <DetailItem
                icon={Mail}
                label="Company email"
                value={company.email}
              />

              <DetailItem
                icon={CalendarDays}
                label="Founded year"
                value={company.foundedYear}
              />

              <DetailItem
                icon={CalendarDays}
                label="Created at"
                value={formatDateTime(company.createdAt)}
              />

              <DetailItem
                icon={Clock}
                label="Last updated"
                value={formatDateTime(company.updatedAt)}
              />

              <DetailItem
                icon={ShieldCheck}
                label="Verification"
                value={getStatusLabel(status)}
              />

              <DetailItem
                icon={Users}
                label="Recruiters"
                value={recruiters.length}
              />

              <DetailItem
                icon={Globe}
                label="Website"
                value={socialLinks.website || company.website}
              />

              <DetailItem
                icon={LinkIcon}
                label="Company ID"
                value={getCompanyId(company)}
              />
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-bold text-slate-900">
              Description
            </h3>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                {company.description || "No company description provided."}
              </p>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-bold text-slate-900">
              Social links
            </h3>

            {socials.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {socials.map(({ label, url, icon: Icon }) => (
                  <a
                    key={label}
                    href={normalizeUrl(url)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                  >
                    <Icon size={16} />
                    {label}
                    <ExternalLink size={13} />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No social links provided.
              </p>
            )}
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-slate-900">
                Associated recruiters
              </h3>

              <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700">
                {recruiters.length}
              </span>
            </div>

            {recruiters.length ? (
              <div className="divide-y divide-slate-100 rounded-2xl border border-slate-100">
                {recruiters.map((recruiter, index) => {
                  const name =
                    recruiter?.fullName ||
                    recruiter?.name ||
                    [recruiter?.firstName, recruiter?.lastName]
                      .filter(Boolean)
                      .join(" ") ||
                    recruiter?.email ||
                    `Recruiter ${index + 1}`;

                  return (
                    <div
                      key={recruiter?._id || recruiter?.id || index}
                      className="flex items-center gap-3 p-3"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-sm font-bold text-violet-700">
                        {getInitials(name)}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {name}
                        </p>

                        <p className="truncate text-xs text-slate-500">
                          {recruiter?.email || "No email available"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No associated recruiters found.
              </p>
            )}
          </section>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:flex-row sm:justify-between sm:px-8">
          <div>
            {status === "unverified" && (
              <button
                type="button"
                onClick={() => onReject(company)}
                disabled={busy}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-50"
              >
                <XCircle size={16} />
                Reject verification
              </button>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {status === "unverified" && (
              <button
                type="button"
                onClick={() => onVerify(company)}
                disabled={busy}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
              >
                {busy ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : (
                  <CheckCircle size={16} />
                )}
                Verify company
              </button>
            )}

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
    </div>
  );
};

/* ----------------------------- Confirmation modal ----------------------------- */

const RejectCompanyModal = ({
  company,
  loading,
  onCancel,
  onConfirm,
}) => {
  if (!company) return null;

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
        className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl"
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <ShieldAlert size={23} />
        </div>

        <h3 className="text-lg font-bold text-slate-900">
          Reject company verification?
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Confirm rejection for this company. The action will use your existing
          admin context handler.
        </p>

        <div className="mt-4 rounded-xl bg-slate-50 p-3">
          <p className="break-words text-sm font-semibold text-slate-800">
            {getCompanyName(company)}
          </p>

          <p className="mt-1 break-all text-xs text-slate-500">
            {company.email || getCompanyId(company)}
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
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            {loading && (
              <LoaderCircle size={16} className="animate-spin" />
            )}
            {loading ? "Rejecting..." : "Reject company"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ----------------------------- Main page ----------------------------- */

export default function AdminCompanies() {
  const {
    companies: rawCompanies = [],
    companiesPagination,
    selectedCompany,
    setSelectedCompany,
    handleGetAllCompanies,
    handleGetCompanyById,
    handleVerifyCompany,
    handleRejectCompany,
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
  const [rejectTarget, setRejectTarget] = useState(null);
  const [menuCompanyId, setMenuCompanyId] = useState(null);

  const companies = useMemo(
    () => (Array.isArray(rawCompanies) ? rawCompanies : normalizeCompanyList(rawCompanies)),
    [rawCompanies]
  );

  const pagination = useMemo(
    () => getPagination(companiesPagination, companies.length),
    [companiesPagination, companies.length]
  );

  /* Fetch through the existing AdminContext. */
  const fetchCompanies = useCallback(
    async (isRefresh = false) => {
      if (typeof handleGetAllCompanies !== "function") {
        setError("The company list handler is unavailable.");
        setInitialLoading(false);
        setRefreshing(false);
        return false;
      }

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setInitialLoading(true);
      }

      setError("");

      try {
        await handleGetAllCompanies({
          page,
          limit: PAGE_SIZE,
          search: search.trim(),
          status: statusFilter === "all" ? "" : statusFilter,
        });

        return true;
      } catch (err) {
        setError(
          getErrorMessage(err, "Unable to load companies. Please try again.")
        );

        return false;
      } finally {
        setInitialLoading(false);
        setRefreshing(false);
      }
    },
    [handleGetAllCompanies, page, search, statusFilter]
  );

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const filteredCompanies = useMemo(() => {
    const query = search.trim().toLowerCase();

    return companies.filter((company) => {
      const status = getCompanyStatus(company);

      const matchesStatus =
        statusFilter === "all" || status === statusFilter;

      const searchable = [
        getCompanyName(company),
        company?.slug,
        company?.email,
        company?.industry,
        company?.companySize,
        getCompanyId(company),
        getLocation(company),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && (!query || searchable.includes(query));
    });
  }, [companies, search, statusFilter]);

  const hasServerPagination =
    Boolean(companiesPagination) &&
    (
      companiesPagination.totalPages != null ||
      companiesPagination.total != null ||
      companiesPagination.totalCompanies != null ||
      companiesPagination.totalItems != null
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

  const stats = useMemo(
    () => ({
      total: pagination.total,
      verified: companies.filter(
        (company) => getCompanyStatus(company) === "verified"
      ).length,
      pending: companies.filter(
        (company) => getCompanyStatus(company) === "unverified"
      ).length,
      deleted: companies.filter(
        (company) => getCompanyStatus(company) === "deleted"
      ).length,
      recruiters: companies.reduce(
        (total, company) => total + getRecruiters(company).length,
        0
      ),
    }),
    [companies, pagination.total]
  );

  const clearMessages = () => {
    setError("");
    setNotice("");
  };

  const handleRefresh = async () => {
    clearMessages();
    await fetchCompanies(true);
  };

  const closeDetails = () => {
    if (actionLoading) return;

    setSelected(null);
    setSelectedCompany?.(null);
  };

  const openCompanyDetails = useCallback(
    async (company) => {
      setMenuCompanyId(null);
      setSelected(company);
      setSelectedCompany?.(company);
      setDetailsLoading(true);
      setError("");

      try {
        if (typeof handleGetCompanyById === "function") {
          const result = await handleGetCompanyById(getCompanyId(company));
          const fullCompany = normalizeCompanyResponse(result);

          if (
            fullCompany &&
            typeof fullCompany === "object" &&
            !Array.isArray(fullCompany)
          ) {
            const merged = { ...company, ...fullCompany };

            setSelected(merged);
            setSelectedCompany?.(merged);
          } else if (
            selectedCompany &&
            typeof selectedCompany === "object"
          ) {
            const merged = { ...company, ...selectedCompany };

            setSelected(merged);
            setSelectedCompany?.(merged);
          }
        }
      } catch (err) {
        setError(
          getErrorMessage(err, "Could not load complete company details.")
        );
      } finally {
        setDetailsLoading(false);
      }
    },
    [handleGetCompanyById, selectedCompany, setSelectedCompany]
  );

  const runCompanyAction = async (company, type) => {
    const companyId = getCompanyId(company);

    if (!companyId) {
      setError("Cannot perform this action because the company ID is missing.");
      return;
    }

    const handler =
      type === "verify" ? handleVerifyCompany : handleRejectCompany;

    if (typeof handler !== "function") {
      setError(
        type === "verify"
          ? "The company verification handler is unavailable."
          : "The company rejection handler is unavailable."
      );
      return;
    }

    setActionLoading(true);
    clearMessages();
    setMenuCompanyId(null);

    try {
      await handler(companyId);

      setNotice(
        type === "verify"
          ? `${getCompanyName(company)} verified successfully.`
          : `Verification rejected for ${getCompanyName(company)}.`
      );

      setRejectTarget(null);

      setSelected((previous) => {
        if (!previous || getCompanyId(previous) !== companyId) {
          return previous;
        }

        return {
          ...previous,
          isVerified: type === "verify",
          verificationStatus: type === "verify" ? "verified" : "unverified",
        };
      });

      await fetchCompanies(true);
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          type === "verify"
            ? "Unable to verify this company."
            : "Unable to reject this company."
        )
      );
    } finally {
      setActionLoading(false);
    }
  };

  const requestReject = (company) => {
    setMenuCompanyId(null);
    setRejectTarget(company);
  };

  return (
    <div
      className="min-h-screen bg-[#F7F8FC] px-4 py-6 text-slate-900 sm:px-6 lg:px-8"
      onClick={() => {
        if (menuCompanyId) setMenuCompanyId(null);
      }}
    >
      <div className="mx-auto max-w-[1600px] space-y-6">
        {/* Header: same structure and dimensions as AdminUsers */}
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
              Manage registered companies, review verification requests, and
              inspect company profiles and associated recruiters across your
              Peer.Hiring platform.
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
            {refreshing ? "Refreshing..." : "Refresh companies"}
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

        {/* Statistics: same grid and card sizing as AdminUsers */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total companies"
            value={stats.total}
            description="Companies matching the current API query"
            icon={Building2}
            iconClass="bg-violet-50 text-violet-700"
          />

          <StatCard
            title="Verified companies"
            value={stats.verified}
            description="Companies verified by admin"
            icon={ShieldCheck}
            iconClass="bg-emerald-50 text-emerald-700"
          />

          <StatCard
            title="Pending verification"
            value={stats.pending}
            description="Companies awaiting review"
            icon={Clock}
            iconClass="bg-amber-50 text-amber-700"
          />

          <StatCard
            title="Associated recruiters"
            value={stats.recruiters}
            description="Recruiters in the loaded results"
            icon={Users}
            iconClass="bg-sky-50 text-sky-700"
          />
        </div>

        {/* Main table: same container and filter row as AdminUsers */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-4 sm:p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  All companies
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {filteredCompanies.length} matching{" "}
                  {filteredCompanies.length === 1 ? "company" : "companies"}
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
                    placeholder="Search name, email, industry..."
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
                    aria-label="Filter companies by status"
                    className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm font-medium outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100 sm:min-w-[200px]"
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

          {/* Loading and empty states: same sizing as AdminUsers */}
          {initialLoading ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 px-4">
              <LoaderCircle
                size={32}
                className="animate-spin text-violet-600"
              />

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
                {search || statusFilter !== "all"
                  ? "Try changing your search or filters."
                  : "There are no companies in the collection returned by the server."}
              </p>

              {(search || statusFilter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("all");
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
                        "Company",
                        "Industry",
                        "Location",
                        "Status",
                        "Recruiters",
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
                    {visibleCompanies.map((company) => {
                      const companyId = getCompanyId(company);
                      const name = getCompanyName(company);
                      const status = getCompanyStatus(company);
                      const recruiters = getRecruiters(company);
                      const location = getLocation(company);

                      return (
                        <tr
                          key={companyId || name}
                          className="transition hover:bg-violet-50/30"
                        >
                          <td className="px-4 py-4">
                            <div className="flex min-w-0 items-start gap-3">
                              <CompanyAvatar company={company} />

                              <div className="min-w-0 max-w-[280px]">
                                <button
                                  type="button"
                                  onClick={() => openCompanyDetails(company)}
                                  className="block max-w-full truncate text-left text-sm font-bold text-slate-900 hover:text-violet-700"
                                >
                                  {name}
                                </button>

                                <p className="mt-1 truncate text-xs text-slate-500">
                                  {company.slug
                                    ? `@${company.slug}`
                                    : company.email || "No contact email"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex max-w-[180px] items-start gap-2 text-sm text-slate-600">
                              <BriefcaseBusiness
                                size={15}
                                className="mt-0.5 shrink-0 text-slate-400"
                              />
                              <span className="break-words">
                                {company.industry || "Not specified"}
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex max-w-[200px] items-start gap-2 text-sm text-slate-600">
                              <MapPin
                                size={15}
                                className="mt-0.5 shrink-0 text-slate-400"
                              />
                              <span className="break-words">
                                {location || "Not specified"}
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <StatusBadge status={status} />
                          </td>

                          <td className="px-4 py-4">
                            <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                              <Users size={15} className="text-slate-400" />
                              {recruiters.length}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex items-start gap-2">
                              <CalendarDays
                                size={15}
                                className="mt-0.5 shrink-0 text-slate-400"
                              />

                              <span className="whitespace-nowrap text-sm text-slate-700">
                                {formatDate(company.createdAt)}
                              </span>
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

                              <IconButton
                                title="Verify company"
                                disabled={
                                  status !== "unverified" || actionLoading
                                }
                                onClick={() =>
                                  runCompanyAction(company, "verify")
                                }
                              >
                                <CheckCircle size={17} />
                              </IconButton>

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
                                    className="absolute right-0 top-11 z-20 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl"
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

                                    {status === "unverified" && (
                                      <>
                                        <button
                                          type="button"
                                          disabled={actionLoading}
                                          onClick={() =>
                                            runCompanyAction(company, "verify")
                                          }
                                          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
                                        >
                                          <CheckCircle size={16} />
                                          Verify company
                                        </button>

                                        <button
                                          type="button"
                                          disabled={actionLoading}
                                          onClick={() => requestReject(company)}
                                          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                                        >
                                          <XCircle size={16} />
                                          Reject verification
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

              {/* Mobile cards: same breakpoint and card pattern as AdminUsers */}
              <div className="space-y-3 p-3 md:hidden">
                {visibleCompanies.map((company) => {
                  const companyId = getCompanyId(company);
                  const name = getCompanyName(company);
                  const status = getCompanyStatus(company);
                  const recruiters = getRecruiters(company);
                  const location = getLocation(company);

                  return (
                    <article
                      key={companyId || name}
                      className="rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <div className="flex items-start gap-3">
                        <CompanyAvatar company={company} />

                        <div className="min-w-0 flex-1">
                          <h3 className="break-words text-sm font-bold text-slate-900">
                            {name}
                          </h3>

                          <p className="mt-1 break-all text-xs text-slate-500">
                            {company.slug
                              ? `@${company.slug}`
                              : company.email || "No contact email"}
                          </p>

                          <div className="mt-2 flex flex-wrap gap-2">
                            <StatusBadge status={status} />
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
                          <BriefcaseBusiness
                            size={15}
                            className="mt-0.5 shrink-0 text-slate-400"
                          />
                          <span>{company.industry || "Industry not specified"}</span>
                        </div>

                        <div className="flex items-start gap-2 text-sm text-slate-600">
                          <MapPin
                            size={15}
                            className="mt-0.5 shrink-0 text-slate-400"
                          />
                          <span>{location || "Location not specified"}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Users
                            size={15}
                            className="shrink-0 text-slate-400"
                          />
                          <span>
                            {recruiters.length} recruiter
                            {recruiters.length === 1 ? "" : "s"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <CalendarDays
                            size={15}
                            className="shrink-0 text-slate-400"
                          />
                          <span>Joined {formatDate(company.createdAt)}</span>
                        </div>
                      </div>

                      {status === "unverified" && (
                        <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
                          <button
                            type="button"
                            disabled={actionLoading}
                            onClick={() =>
                              runCompanyAction(company, "verify")
                            }
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-200 px-3 py-2.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
                          >
                            <CheckCircle size={15} />
                            Verify
                          </button>

                          <button
                            type="button"
                            disabled={actionLoading}
                            onClick={() => requestReject(company)}
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 px-3 py-2.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                          >
                            <XCircle size={15} />
                            Reject
                          </button>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>

              {/* Pagination: same placement and sizing as AdminUsers */}
              <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <p className="text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-semibold text-slate-800">
                    {filteredCompanies.length === 0
                      ? 0
                      : (safePage - 1) * PAGE_SIZE + 1}
                    {"–"}
                    {hasServerPagination
                      ? Math.min(
                          safePage * PAGE_SIZE,
                          pagination.total
                        )
                      : Math.min(
                          safePage * PAGE_SIZE,
                          filteredCompanies.length
                        )}
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
                    onClick={() =>
                      setPage((current) => Math.max(1, current - 1))
                    }
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
          Company verification totals are calculated from the companies
          currently loaded from your API. Global totals require corresponding
          server-side statistics.
        </p>
      </div>

      {/* Company details modal */}
      {selected && (
        <CompanyDetailsModal
          company={selected}
          onClose={closeDetails}
          onVerify={(company) => runCompanyAction(company, "verify")}
          onReject={requestReject}
          busy={actionLoading}
        />
      )}

      {/* Reject confirmation */}
      {rejectTarget && (
        <RejectCompanyModal
          company={rejectTarget}
          loading={actionLoading}
          onCancel={() => {
            if (!actionLoading) setRejectTarget(null);
          }}
          onConfirm={() => runCompanyAction(rejectTarget, "reject")}
        />
      )}

      {/* Details loading indicator */}
      {detailsLoading && selected && (
        <div className="fixed bottom-5 right-5 z-[70] flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-lg">
          <LoaderCircle size={17} className="animate-spin text-violet-600" />
          Loading full company details...
        </div>
      )}
    </div>
  );
}