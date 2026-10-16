import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Ban,
  Building2,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  LoaderCircle,
  MoreVertical,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  UserRound,
  Users,
  X,
  XCircle,
  Globe,
  MapPin,
  CalendarDays,
  ExternalLink,
} from "lucide-react";
import { useAdmin } from "../../hooks/Hook";

const PAGE_SIZE = 10;

const STATUS_CONFIG = {
  verified: {
    label: "Verified",
    className: "bg-green-50 text-green-700",
    dot: "bg-green-500",
  },
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  },
  deleted: {
    label: "Deleted",
    className: "bg-red-50 text-red-700",
    dot: "bg-red-500",
  },
};

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.message ||
  fallback;

const formatDate = (date) => {
  if (!date) return "-";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "-";

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getCompanyStatus = (company) => {
  if (company?.isDeleted || company?.deletedAt) {
    return "deleted";
  }

  return company?.isVerified ? "verified" : "pending";
};

const getRecruiters = (company) =>
  Array.isArray(company?.recruiters)
    ? company.recruiters.filter((item) => item?.recruiterId)
    : [];

const getUserFromRecruiter = (recruiter) => {
  const user = recruiter?.recruiterId;
  return user && typeof user === "object" ? user : null;
};

function Companies() {
  const {
    companies,
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
  const [showMenu, setShowMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [pageError, setPageError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [confirmation, setConfirmation] = useState({
    type: null,
    company: null,
  });

  const companyList = useMemo(
    () => (Array.isArray(companies) ? companies : []),
    [companies]
  );

  const totalCompanies =
    Number(companiesPagination?.totalCompanies) || 0;

  const totalPages = Math.max(
    1,
    Number(companiesPagination?.totalPages) || 1
  );

  const currentPage =
    Number(companiesPagination?.currentPage) || page;

  const verifiedCompanies = companyList.filter(
    (company) => getCompanyStatus(company) === "verified"
  ).length;

  const pendingCompanies = companyList.filter(
    (company) => getCompanyStatus(company) === "pending"
  ).length;

  const deletedCompanies = companyList.filter(
    (company) => getCompanyStatus(company) === "deleted"
  ).length;

  const refreshCompanies = useCallback(() => {
    setRefreshKey((value) => value + 1);
  }, []);

  const fetchCompanies = useCallback(async () => {
    if (typeof handleGetAllCompanies !== "function") {
      setPageError("Company list handler is unavailable.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setPageError("");

    try {
      await handleGetAllCompanies({
        page,
        limit: PAGE_SIZE,
        search: search.trim(),
        status: statusFilter === "all" ? "" : statusFilter,
      });
    } catch (error) {
      setPageError(
        getErrorMessage(error, "Failed to fetch companies.")
      );
    } finally {
      setLoading(false);
    }
  }, [
    handleGetAllCompanies,
    page,
    search,
    statusFilter,
    refreshKey,
  ]);

  useEffect(() => {
    const timeout = setTimeout(fetchCompanies, search.trim() ? 300 : 0);
    return () => clearTimeout(timeout);
  }, [fetchCompanies, search]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(1);
  };

  const closeConfirmation = useCallback(() => {
    setConfirmation({ type: null, company: null });
  }, []);

  const handleViewCompany = useCallback(
    async (companyId) => {
      if (!companyId) {
        setPageError("Company ID is missing.");
        return;
      }

      setShowMenu(null);
      setPageError("");
      setActionLoading(companyId);

      try {
        if (typeof handleGetCompanyById !== "function") {
          throw new Error("Company details handler is unavailable.");
        }

        const result = await handleGetCompanyById(companyId);

        const company =
          result?.company ??
          result?.data?.company ??
          result?.data?.data?.company ??
          result?.data?.data ??
          result?.data ??
          result;

        if (!company?._id) {
          throw new Error("Company details could not be loaded.");
        }

        setSelectedCompany(company);
      } catch (error) {
        setPageError(
          getErrorMessage(error, "Failed to fetch company details.")
        );
      } finally {
        setActionLoading(null);
      }
    },
    [handleGetCompanyById, setSelectedCompany]
  );

  const runCompanyAction = useCallback(
    async (type, company) => {
      const companyId = company?._id;

      if (!companyId) {
        setPageError("Company ID is missing.");
        return;
      }

      setShowMenu(null);
      setPageError("");
      setActionLoading(companyId);

      try {
        const handler =
          type === "verify"
            ? handleVerifyCompany
            : type === "reject"
              ? handleRejectCompany
              : null;

        if (typeof handler !== "function") {
          throw new Error(`${type} company handler is unavailable.`);
        }

        await handler(companyId);

        if (selectedCompany?._id === companyId) {
          if (type === "verify") {
            setSelectedCompany({
              ...selectedCompany,
              isVerified: true,
            });
          } else {
            setSelectedCompany({
              ...selectedCompany,
              isVerified: false,
            });
          }
        }

        closeConfirmation();
        refreshCompanies();
      } catch (error) {
        setPageError(
          getErrorMessage(error, `Failed to ${type} company.`)
        );
      } finally {
        setActionLoading(null);
      }
    },
    [
      handleVerifyCompany,
      handleRejectCompany,
      selectedCompany,
      setSelectedCompany,
      closeConfirmation,
      refreshCompanies,
    ]
  );

  const openConfirmation = (type, company) => {
    if (!company?._id) {
      setPageError("Company ID is missing.");
      return;
    }

    setShowMenu(null);
    setPageError("");
    setConfirmation({ type, company });
  };

  const statusBadge = (company) => {
    const config =
      STATUS_CONFIG[getCompanyStatus(company)] || STATUS_CONFIG.pending;

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ${config.className}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
        {config.label}
      </span>
    );
  };

  const renderActions = (company) => {
    const status = getCompanyStatus(company);
    const busy = actionLoading === company?._id;

    return (
      <div className="relative flex justify-end">
        <button
          type="button"
          aria-label={`Actions for ${company?.name || "company"}`}
          disabled={busy}
          onClick={() =>
            setShowMenu((current) =>
              current === company._id ? null : company._id
            )
          }
          className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-100 disabled:opacity-50"
        >
          {busy ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <MoreVertical className="h-4 w-4 text-slate-500" />
          )}
        </button>

        {showMenu === company._id && (
          <div className="absolute right-0 top-10 z-30 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
            <button
              type="button"
              onClick={() => handleViewCompany(company._id)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
            >
              <Eye className="h-4 w-4" />
              View company
            </button>

            {status === "pending" && (
              <>
                <button
                  type="button"
                  onClick={() => runCompanyAction("verify", company)}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-green-600 hover:bg-green-50"
                >
                  <CheckCircle className="h-4 w-4" />
                  Verify company
                </button>

                <button
                  type="button"
                  onClick={() => openConfirmation("reject", company)}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-orange-600 hover:bg-orange-50"
                >
                  <XCircle className="h-4 w-4" />
                  Reject company
                </button>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-full w-full bg-[#F7F8FC] p-4 md:p-6">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">
                Companies
              </h1>
              <span className="rounded-full bg-[#EEF0FF] px-2.5 py-1 text-xs font-semibold text-[#5950E6]">
                {totalCompanies}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Manage, verify, and monitor registered companies.
            </p>
          </div>

          <button
            type="button"
            onClick={refreshCompanies}
            disabled={loading}
            className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 sm:self-auto"
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {pageError && (
          <div
            role="alert"
            className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <p>{pageError}</p>
            <button
              type="button"
              onClick={() => setPageError("")}
              aria-label="Dismiss error"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Companies"
            count={totalCompanies}
            description="Matching companies"
            icon={<Building2 className="h-5 w-5 text-[#5950E6]" />}
            iconBg="bg-[#EEF0FF]"
          />
          <StatCard
            title="Verified"
            count={verifiedCompanies}
            description="On this page"
            icon={<ShieldCheck className="h-5 w-5 text-green-600" />}
            iconBg="bg-green-50"
          />
          <StatCard
            title="Pending"
            count={pendingCompanies}
            description="On this page"
            icon={<Clock3 className="h-5 w-5 text-amber-600" />}
            iconBg="bg-amber-50"
          />
          <StatCard
            title="Deleted"
            count={deletedCompanies}
            description="On this page"
            icon={<Trash2 className="h-5 w-5 text-red-500" />}
            iconBg="bg-red-50"
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search company, industry, city, or slug..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 text-sm outline-none focus:border-[#5950E6] focus:bg-white"
              />
            </div>

            <select
              value={statusFilter}
              onChange={handleStatusChange}
              className="h-11 rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm text-slate-600 outline-none focus:border-[#5950E6]"
            >
              <option value="all">All status</option>
              <option value="verified">Verified</option>
              <option value="unverified">Pending</option>
              <option value="deleted">Deleted</option>
            </select>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 md:px-6">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                All Companies
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                {totalCompanies} matching companies
              </p>
            </div>
            {loading && (
              <LoaderCircle className="h-5 w-5 animate-spin text-[#5950E6]" />
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-slate-50">
                <tr>
                  {[
                    "Company",
                    "Industry",
                    "Size",
                    "Location",
                    "Recruiters",
                    "Status",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading && companyList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <LoaderCircle className="mx-auto h-6 w-6 animate-spin text-[#5950E6]" />
                      <p className="mt-3 text-sm text-slate-500">
                        Loading companies...
                      </p>
                    </td>
                  </tr>
                ) : companyList.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-16 text-center text-sm text-slate-500"
                    >
                      No companies found. Try another search or filter.
                    </td>
                  </tr>
                ) : (
                  companyList.map((company) => (
                    <tr
                      key={company._id}
                      className="border-t border-slate-100 hover:bg-slate-50/70"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {company.logo?.url ? (
                            <img
                              src={company.logo.url}
                              alt={`${company.name || "Company"} logo`}
                              className="h-11 w-11 rounded-xl border border-slate-200 object-cover"
                            />
                          ) : (
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF0FF] text-[#5950E6]">
                              <Building2 className="h-5 w-5" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="max-w-[200px] truncate text-sm font-semibold text-slate-900">
                              {company.name || "Unnamed company"}
                            </p>
                            <p className="mt-0.5 max-w-[200px] truncate text-xs text-slate-400">
                              {company.slug || company._id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {company.industry || "-"}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {company.companySize || "-"}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {[
                          company.headquarters?.city,
                          company.headquarters?.state,
                          company.headquarters?.country,
                        ]
                          .filter(Boolean)
                          .join(", ") || "-"}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-600">
                            {getRecruiters(company).length}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">{statusBadge(company)}</td>
                      <td className="px-6 py-4">{renderActions(company)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
            <p className="text-xs text-slate-400">
              Page{" "}
              <span className="font-semibold text-slate-600">
                {currentPage}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-600">
                {totalPages}
              </span>{" "}
              · {totalCompanies} companies
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() =>
                  setPage((current) => Math.max(1, current - 1))
                }
                className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              <button
                type="button"
                disabled={page >= totalPages || loading}
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
                className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {selectedCompany && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-[2px]"
          onClick={() => setSelectedCompany(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="company-details-title"
            className="my-auto max-h-[90dvh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
              <div>
                <h2
                  id="company-details-title"
                  className="text-lg font-bold text-slate-900"
                >
                  Company Details
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Company profile, verification, and recruiters
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCompany(null)}
                aria-label="Close company details"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              {selectedCompany.banner?.url && (
                <img
                  src={selectedCompany.banner.url}
                  alt={`${selectedCompany.name || "Company"} banner`}
                  className="h-40 w-full rounded-xl border border-slate-100 object-cover"
                />
              )}

              <div className="mt-5 flex items-start gap-4">
                {selectedCompany.logo?.url ? (
                  <img
                    src={selectedCompany.logo.url}
                    alt={`${selectedCompany.name || "Company"} logo`}
                    className="h-16 w-16 shrink-0 rounded-2xl border border-slate-200 object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#EEF0FF] text-[#5950E6]">
                    <Building2 className="h-7 w-7" />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <h3 className="break-words text-xl font-bold text-slate-900">
                    {selectedCompany.name || "Unnamed company"}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {selectedCompany.industry || "Industry not specified"}
                    {" · "}
                    {selectedCompany.companySize || "Size not specified"}
                  </p>
                  <div className="mt-2">{statusBadge(selectedCompany)}</div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <DetailCard label="Company email" value={selectedCompany.email} />
                <DetailCard label="Slug" value={selectedCompany.slug} />
                <DetailCard
                  label="Founded year"
                  value={selectedCompany.foundedYear}
                />
                <DetailCard
                  label="Company size"
                  value={selectedCompany.companySize}
                />
                <DetailCard
                  label="Industry"
                  value={selectedCompany.industry}
                />
                <DetailCard
                  label="Created at"
                  value={formatDate(selectedCompany.createdAt)}
                />
                <DetailCard
                  label="Updated at"
                  value={formatDate(selectedCompany.updatedAt)}
                />
                <DetailCard
                  label="Country"
                  value={selectedCompany.headquarters?.country}
                />
                <DetailCard
                  label="State"
                  value={selectedCompany.headquarters?.state}
                />
                <DetailCard
                  label="City"
                  value={selectedCompany.headquarters?.city}
                />
                <DetailCard
                  label="Recruiters"
                  value={getRecruiters(selectedCompany).length}
                />
                <DetailCard label="Company ID" value={selectedCompany._id} />
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Description
                </p>
                <div className="mt-2 rounded-xl bg-slate-50 p-4">
                  <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                    {selectedCompany.description || "No description provided."}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Social links
                </p>
                <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <SocialLink
                    label="Website"
                    value={selectedCompany.socialLinks?.website}
                  />
                  <SocialLink
                    label="LinkedIn"
                    value={selectedCompany.socialLinks?.linkedin}
                  />
                  <SocialLink
                    label="GitHub"
                    value={selectedCompany.socialLinks?.github}
                  />
                  <SocialLink
                    label="Twitter"
                    value={selectedCompany.socialLinks?.twitter}
                  />
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Recruiters
                  </p>
                  <span className="text-xs text-slate-400">
                    {getRecruiters(selectedCompany).length} connected
                  </span>
                </div>

                <div className="mt-2 space-y-2">
                  {getRecruiters(selectedCompany).length > 0 ? (
                    getRecruiters(selectedCompany).map((recruiter, index) => {
                      const user = getUserFromRecruiter(recruiter);
                      const recruiterId =
                        user?._id || recruiter.recruiterId;

                      return (
                        <div
                          key={recruiterId || index}
                          className="flex items-center gap-3 rounded-xl bg-slate-50 p-4"
                        >
                          {user?.avatar?.url ? (
                            <img
                              src={user.avatar.url}
                              alt={user.name || "Recruiter"}
                              className="h-10 w-10 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white">
                              <UserRound className="h-4 w-4 text-slate-500" />
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-800">
                              {user?.name || "Recruiter"}
                            </p>
                            <p className="truncate text-xs text-slate-400">
                              {user?.email || "-"}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {user?.phoneNo || ""}
                            </p>
                          </div>

                          <div className="hidden text-right sm:block">
                            <p className="text-xs text-slate-400">Joined</p>
                            <p className="text-xs font-medium text-slate-600">
                              {formatDate(recruiter.joinedAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="rounded-xl bg-slate-50 p-4 text-center text-xs text-slate-400">
                      No recruiter connected.
                    </div>
                  )}
                </div>
              </div>

              {getCompanyStatus(selectedCompany) === "pending" && (
                <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    disabled={actionLoading === selectedCompany._id}
                    onClick={() =>
                      runCompanyAction("verify", selectedCompany)
                    }
                    className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-green-50 px-4 text-sm font-semibold text-green-700 hover:bg-green-100 disabled:opacity-50"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Verify company
                  </button>
                  <button
                    type="button"
                    disabled={actionLoading === selectedCompany._id}
                    onClick={() => openConfirmation("reject", selectedCompany)}
                    className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-orange-50 px-4 text-sm font-semibold text-orange-700 hover:bg-orange-100 disabled:opacity-50"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject company
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {confirmation.type && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
          onClick={closeConfirmation}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="company-confirmation-title"
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                {confirmation.type === "reject" ? (
                  <XCircle className="h-5 w-5" />
                ) : (
                  <Ban className="h-5 w-5" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3
                  id="company-confirmation-title"
                  className="text-base font-bold text-slate-900"
                >
                  Reject company
                </h3>
                <p className="mt-1 break-words text-sm text-slate-500">
                  Reject the verification request for{" "}
                  <span className="font-semibold text-slate-700">
                    {confirmation.company?.name || "this company"}
                  </span>
                  ?
                </p>
              </div>

              <button
                type="button"
                onClick={closeConfirmation}
                aria-label="Close confirmation"
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
              Confirm only if you intend to reject this company verification.
            </p>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeConfirmation}
                className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading === confirmation.company?._id}
                onClick={() =>
                  runCompanyAction(
                    confirmation.type,
                    confirmation.company
                  )
                }
                className="h-10 rounded-xl bg-[#5950E6] px-4 text-sm font-semibold text-white hover:bg-[#4840CF] disabled:opacity-50"
              >
                {actionLoading === confirmation.company?._id
                  ? "Processing..."
                  : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, count, description, icon, iconBg }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">{count}</h2>
          <p className="mt-1 text-xs text-slate-400">{description}</p>
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function DetailCard({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-slate-800">
        {value === 0 ? "0" : value || "-"}
      </p>
    </div>
  );
}

function SocialLink({ label, value }) {
  if (!value) {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
        <Globe className="h-4 w-4 text-slate-400" />
        <div>
          <p className="text-xs text-slate-400">{label}</p>
          <p className="mt-1 text-sm text-slate-500">Not provided</p>
        </div>
      </div>
    );
  }

  const href = /^https?:\/\//i.test(value)
    ? value
    : `https://${value}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex min-w-0 items-center gap-3 rounded-xl bg-slate-50 p-3 hover:bg-violet-50"
    >
      <Globe className="h-4 w-4 shrink-0 text-[#5950E6]" />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="truncate text-sm font-medium text-slate-700">{value}</p>
      </div>
      <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" />
    </a>
  );
}

export default Companies;