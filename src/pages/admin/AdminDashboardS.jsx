
import {
  Activity,
  AlertCircle,
  ArrowUp,
  ArrowUpRight,
  BriefcaseBusinessIcon,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Edit,
  FileText,
  PauseCircle,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAdmin, useHome } from "../../hooks/Hook";
import DashboardCalendar from "../../components/DashboardCalendar";

const getArray = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.companies)) return value.companies;
  if (Array.isArray(value?.users)) return value.users;
  if (Array.isArray(value?.jobs)) return value.jobs;
  if (Array.isArray(value?.reports)) return value.reports;
  return [];
};

const getId = (item) =>
  item?._id || item?.id || item?.userId || item?.companyId || item?.jobId;

const getCreatedAt = (item) =>
  item?.createdAt || item?.created_at || item?.registeredAt || item?.postedAt;

const getCompanyName = (company) =>
  company?.name ||
  company?.companyName ||
  company?.details?.name ||
  "Unnamed company";

const getCompanyLogo = (company) =>
  company?.logo?.url ||
  company?.logoUrl ||
  company?.companyLogo?.url ||
  "";

const getRelativeTime = (dateValue) => {
  if (!dateValue) return "Date unavailable";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Date unavailable";

  const seconds = Math.max(
    0,
    Math.floor((Date.now() - date.getTime()) / 1000)
  );

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

const isWithinPeriod = (dateValue, period) => {
  if (!dateValue) return false;

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return false;

  const now = new Date();
  let start;

  if (period === "month") {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
  } else {
    start = new Date(now);
    start.setDate(start.getDate() - 30);
  }

  return date >= start && date <= now;
};

const getPeriodLabel = (period) =>
  period === "month" ? "Current Month" : "Last 30 Days";

const getGrowth = (current, previous) => {
  const currentValue = Number(current ?? 0);
  const previousValue = Number(previous ?? 0);

  if (
    !Number.isFinite(currentValue) ||
    !Number.isFinite(previousValue)
  ) {
    return 0;
  }

  if (previousValue === 0) {
    return currentValue === 0 ? 0 : 100;
  }

  return ((currentValue - previousValue) / previousValue) * 100;
};

function GrowthLabel({ current = 0, previous = 0 }) {
  const growth = getGrowth(current, previous);
  const positive = growth >= 0;

  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[10px] font-semibold ${
        positive ? "text-emerald-500" : "text-rose-500"
      }`}
    >
      {positive ? (
        <TrendingUp size={12} />
      ) : (
        <TrendingDown size={12} />
      )}

      {positive ? "+" : ""}
      {growth.toFixed(1)}%
    </span>
  );
}

function AdminDashboardS() {
  const {
    dashboard,
    handleGetAdminDashboard,
    companies: rawCompanies = [],
    handleGetAllCompanies,
    users: rawUsers = [],
    handleGetAllUsers,
    jobs: rawJobs = [],
    handleGetJobs,
    reports: rawReports = [],
    handleGetReports,
  } = useAdmin();
  const {setAdminActivePage} = useHome();
  const [calendar, setCalendar] = useState(false);

  const [period, setPeriod] = useState("30days");

  const companies = useMemo(() => getArray(rawCompanies), [rawCompanies]);
  const users = useMemo(() => getArray(rawUsers), [rawUsers]);
  const jobs = useMemo(() => getArray(rawJobs), [rawJobs]);
  const reports = useMemo(() => getArray(rawReports), [rawReports]);

  useEffect(() => {
    handleGetAdminDashboard?.();
    handleGetAllCompanies?.({
      page: 1,
      limit: 100,
      search: "",
      status: "",
    });
    handleGetAllUsers?.({
      page: 1,
      limit: 100,
      search: "",
      role: "",
    });
    handleGetJobs?.({
      page: 1,
      search: "",
      status: "",
    });
    handleGetReports?.({
      page: 1,
      limit: 100,
      status: "",
    });
  }, [
    handleGetAdminDashboard,
    handleGetAllCompanies,
    handleGetAllUsers,
    handleGetJobs,
    handleGetReports,
  ]);

  const pendingCompanies = useMemo(
    () =>
      companies
        .filter((company) => {
          const status = String(
            company?.verificationStatus ||
              company?.verification?.status ||
              company?.status ||
              ""
          ).toLowerCase();

          const verified =
            company?.isVerified === true ||
            company?.isVerified === "true" ||
            company?.verified === true;

          return (
            !verified &&
            !["verified", "approved", "rejected", "deleted"].includes(status)
          );
        })
        .sort(
          (a, b) =>
            new Date(getCreatedAt(b) || 0).getTime() -
            new Date(getCreatedAt(a) || 0).getTime()
        )
        .slice(0, 3),
    [companies]
  );

  const recentActivity = useMemo(() => {
    const events = [
      ...companies.map((item) => ({
        id: `company-${getId(item)}`,
        type: "company",
        title: "New company registered",
        description: `${getCompanyName(item)} completed registration`,
        createdAt: getCreatedAt(item),
      })),
      ...jobs.map((item) => ({
        id: `job-${getId(item)}`,
        type: "job",
        title: "New job posted",
        description: item?.title || item?.jobTitle || "A new job was posted",
        createdAt: getCreatedAt(item),
      })),
      ...users.map((item) => ({
        id: `user-${getId(item)}`,
        type: "user",
        title: "New user registered",
        description:
          item?.name || item?.fullName || item?.email || "A new user joined",
        createdAt: getCreatedAt(item),
      })),
      ...reports.map((item) => ({
        id: `report-${getId(item)}`,
        type: "report",
        title: "New report submitted",
        description:
          item?.title ||
          item?.subject ||
          item?.reason ||
          "A new platform report was submitted",
        createdAt: getCreatedAt(item),
      })),
    ];

    return events
      .filter((event) => event.createdAt)
      .filter((event) => isWithinPeriod(event.createdAt, period))
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )
      .slice(0, 5);
  }, [companies, jobs, users, reports, period]);

  const togglePeriod = useCallback(() => {
    setPeriod((previous) => (previous === "30days" ? "month" : "30days"));
  }, []);

  const totalUsers = Number(dashboard?.users?.total ?? 0);
  const totalCandidates = Number(dashboard?.users?.candidate ?? 0);
  const totalRecruiters = Number(dashboard?.users?.recruiter ?? 0);
  const totalCompanies = Number(dashboard?.company?.total ?? 0);
  const verifiedCompanies = Number(dashboard?.company?.verified ?? 0);
  const unverifiedCompanies = Number(dashboard?.company?.unVerified ?? 0);
  const totalJobs = Number(dashboard?.job?.total ?? 0);
  const totalApplications = Number(dashboard?.application?.total ?? 0);
  const totalInterviews = Number(dashboard?.interview?.total ?? 0);

  const verifiedPercentage = totalCompanies
    ? ((verifiedCompanies / totalCompanies) * 100).toFixed(1)
    : "0.0";

  const unverifiedPercentage = totalCompanies
    ? ((unverifiedCompanies / totalCompanies) * 100).toFixed(1)
    : "0.0";

  const hiringApplicationPercentage = totalJobs
    ? Math.min(100, (totalApplications / totalJobs) * 100).toFixed(1)
    : "0.0";

  const interviewApplicationPercentage = totalApplications
    ? Math.min(100, (totalInterviews / totalApplications) * 100).toFixed(1)
    : "0.0";

  const userSegments = [
    { value: totalCandidates, className: "bg-violet-600" },
    { value: totalRecruiters, className: "bg-violet-300" },
    { value: totalCompanies, className: "bg-sky-300" },
  ];

  const segmentTotal = userSegments.reduce(
    (total, segment) => total + segment.value,
    0
  );

  const getSegmentWidth = (value) =>
    segmentTotal ? `${(value / segmentTotal) * 100}%` : "0%";

  return (
    <div className="min-h-screen bg-[#F7F8FC] px-6 py-7 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
                Platform healthy
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[#11152A] lg:text-4xl">
              Control Center
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Monitor your platform's performance, growth and key metrics.
            </p>
          </div>

          <button
            onClick={() => setCalendar(true)}
            className={`flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 shadow-sm transition hover:border-violet-200 hover:text-violet-600 ${calendar ? "hidden" : ""}`}
          >
            <CalendarDays size={17} />
            Calendar
            <ChevronRight size={15} />
          </button>
          {calendar && <DashboardCalendar  onSelectDate={(date) => {date;
  }}/>}
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(30,41,59,0.03)]">
          <div className="grid gap-5 xl:grid-cols-[1.7fr_0.8fr_0.8fr]">
            <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-[#FAF9FF] to-white p-5">
              <div className="flex flex-col justify-between gap-6 lg:flex-row">
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                    <Activity size={21} />
                  </div>
                  <div>
                    <h2 className="font-semibold text-[#11152A]">
                      Platform Pulse
                    </h2>
                    <p className="mt-1 max-w-[210px] text-xs leading-5 text-slate-500">
                      Live overview of your platform ecosystem
                    </p>
                  </div>
                </div>
                <div className="min-w-[220px]">
                  <p className="text-3xl font-bold tracking-tight text-[#11152A]">
                    {totalUsers}
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    Total Users
                  </p>
                  <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-slate-100">
                    {userSegments.map((segment, index) => (
                      <div
                        key={index}
                        className={segment.className}
                        style={{ width: getSegmentWidth(segment.value) }}
                      />
                    ))}
                  </div>
                  <div className="mt-3 flex gap-5 text-[11px] text-slate-500">
                    <span>
                      <b className="text-violet-600">●</b> Candidates
                    </span>
                    <span>
                      <b className="text-violet-400">●</b> Recruiters
                    </span>
                    <span>
                      <b className="text-sky-400">●</b> Companies
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-5">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <ShieldCheck size={20} />
                </div>
                <GrowthLabel
                  current={dashboard?.growth?.verifiedCompanies?.current}
                  previous={dashboard?.growth?.verifiedCompanies?.previous}
                />
              </div>
              <p className="mt-5 text-xs font-medium text-slate-500">
                Verified
              </p>
              <p className="mt-1 text-2xl font-bold text-[#11152A]">
                {verifiedCompanies}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                {verifiedPercentage}% of total companies
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-5">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <ShieldAlert size={20} />
                </div>
                <GrowthLabel
                  current={dashboard?.growth?.unverifiedCompanies?.current}
                  previous={dashboard?.growth?.unverifiedCompanies?.previous}
                />
              </div>
              <p className="mt-5 text-xs font-medium text-slate-500">
                Unverified Companies
              </p>
              <p className="mt-1 text-2xl font-bold text-[#11152A]">
                {unverifiedCompanies}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                {unverifiedPercentage}% of total companies
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_1fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(30,41,59,0.03)]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-[#11152A]">
                  Users & Companies
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Platform account distribution
                </p>
              </div>
              <button onClick={() => setAdminActivePage("users")} className="flex items-center cursor-pointer justify-center gap-1 text-xs font-semibold text-violet-600 hover:text-violet-700">
                View All
                <ArrowUpRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  title: "Total Users",
                  value: totalUsers,
                  icon: Users,
                  growth: dashboard?.growth?.users,
                },
                {
                  title: "Candidates",
                  value: totalCandidates,
                  icon: User,
                  growth: dashboard?.growth?.candidates,
                },
                {
                  title: "Recruiters",
                  value: totalRecruiters,
                  icon: Users,
                  growth: dashboard?.growth?.recruiters,
                },
                {
                  title: "Companies",
                  value: totalCompanies,
                  icon: Building2,
                  growth: dashboard?.growth?.companies,
                },
              ].map((item) => {
                const ItemIcon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="group rounded-xl border border-slate-100 p-4 transition hover:border-violet-100 hover:bg-violet-50/30"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                        <ItemIcon size={18} />
                      </div>
                      <GrowthLabel
                        current={item.growth?.current}
                        previous={item.growth?.previous}
                      />
                    </div>
                    <p className="mt-4 text-[11px] font-medium text-slate-400">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xl font-bold text-[#11152A]">
                      {item.value}
                    </p>
                    <div className="mt-4 flex h-7 items-end gap-[3px]">
                      {[3, 5, 4, 7, 6, 8, 7, 10, 9, 12, 10, 14].map(
                        (height, index) => (
                          <div
                            key={index}
                            className="w-full rounded-sm bg-violet-200 transition group-hover:bg-violet-400"
                            style={{ height: `${height * 2}px` }}
                          />
                        )
                      )}
                    </div>
                  </div>
                );
              })}

              <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                  <CheckCircle2 size={18} />
                </div>
                <p className="mt-4 text-[11px] font-medium text-slate-400">
                  Verified Companies
                </p>
                <p className="mt-1 text-xl font-bold text-[#11152A]">
                  {verifiedCompanies}
                </p>
                <div className="mt-4 flex items-center gap-1 text-[10px] font-semibold text-emerald-500">
                  {verifiedPercentage}% verified
                  <TrendingUp size={14} />
                </div>
              </div>

              <div className="rounded-xl border border-orange-100 bg-orange-50/30 p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100 text-orange-500">
                  <AlertCircle size={18} />
                </div>
                <p className="mt-4 text-[11px] font-medium text-slate-400">
                  Unverified Companies
                </p>
                <p className="mt-1 text-xl font-bold text-[#11152A]">
                  {unverifiedCompanies}
                </p>
                <div className="mt-4 flex items-center gap-1 text-[10px] font-semibold text-orange-500">
                  {unverifiedPercentage}% pending
                  <TrendingDown size={14} />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(30,41,59,0.03)]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-[#11152A]">
                  Jobs & Applications
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Job lifecycle and hiring activity
                </p>
              </div>
              <button onClick={() => setAdminActivePage("admin/jobs")} className="flex cursor-pointer items-center gap-1 text-xs font-semibold text-violet-600 hover:text-violet-700">
                View All
                <ArrowUpRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
              {[
                {
                  title: "Total Jobs",
                  value: dashboard?.job?.total ?? 0,
                  icon: BriefcaseBusinessIcon,
                  growth: dashboard?.growth?.jobs,
                },
                {
                  title: "Active jobs",
                  value: dashboard?.job?.active ?? 0,
                  icon: Activity,
                  growth: dashboard?.growth?.activeJobs,
                },
                {
                  title: "Closed Jobs",
                  value: dashboard?.job?.closed ?? 0,
                  icon: BriefcaseBusinessIcon,
                  growth: dashboard?.growth?.closedJobs,
                },
                {
                  title: "Expired Jobs",
                  value: dashboard?.job?.expired ?? 0,
                  icon: Clock,
                  growth: dashboard?.growth?.expiredJobs,
                },
                {
                  title: "Draft Jobs",
                  value: dashboard?.job?.draft ?? 0,
                  icon: Edit,
                  growth: dashboard?.growth?.draftJobs,
                },
                {
                  title: "Paused Jobs",
                  value: dashboard?.job?.paused ?? 0,
                  icon: PauseCircle,
                  growth: dashboard?.growth?.pausedJobs,
                },
              ].map((item) => {
                const ItemIcon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-xl border border-slate-100 p-4 transition hover:border-violet-100 hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                        <ItemIcon size={16} />
                      </div>
                      <GrowthLabel
                        current={item.growth?.current}
                        previous={item.growth?.previous}
                      />
                    </div>
                    <p className="mt-3 text-[10px] font-medium text-slate-400">
                      {item.title}
                    </p>
                    <p className="mt-1 text-lg font-bold text-[#11152A]">
                      {item.value}
                    </p>
                    <div className="mt-3 flex h-5 items-end gap-[2px]">
                      {[4, 7, 5, 8, 6, 10, 8, 11].map((height, index) => (
                        <div
                          key={index}
                          className="w-full rounded-sm bg-violet-200"
                          style={{ height: `${height * 2}px` }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}

              <div className="rounded-lg border border-violet-100 bg-violet-50/30 p-4 lg:col-span-2">
                <div className="flex items-start justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                    <FileText size={18} />
                  </div>
                  <GrowthLabel
                    current={dashboard?.growth?.applications?.current}
                    previous={dashboard?.growth?.applications?.previous}
                  />
                </div>
                <p className="mt-4 text-[11px] font-medium text-slate-400">
                  Total Applications
                </p>
                <p className="mt-1 text-2xl font-bold text-[#11152A]">
                  {totalApplications}
                </p>
              </div>

              <div className="rounded-lg border border-emerald-100 bg-violet-50/30 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                    <CalendarDays size={18} />
                  </div>
                  <GrowthLabel
                    current={dashboard?.growth?.interviews?.current}
                    previous={dashboard?.growth?.interviews?.previous}
                  />
                </div>
                <p className="mt-4 text-[11px] font-medium text-slate-400">
                  Total Interview
                </p>
                <p className="mt-1 text-2xl font-bold text-[#11152A]">
                  {totalInterviews}
                </p>
              </div>
            </div>
          </section>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(30,41,59,0.03)]">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="font-semibold text-[#11152A]">Hiring Flow</h2>
              <p className="mt-1 text-xs text-slate-400">
                From job posting to interview — platform conversion
              </p>
            </div>
            <button onClick={() => setAdminActivePage("admin/jobs")} className="flex cursor-pointer items-center gap-1 text-xs font-semibold text-violet-600">
              Detailed report
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="grid items-center gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                  <BriefcaseBusinessIcon size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Jobs Posted</p>
                  <p className="text-xl font-bold text-[#11152A]">
                    {totalJobs}
                  </p>
                </div>
              </div>
              <div className="mt-4 inline-flex rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-semibold text-violet-600">
                100%
              </div>
            </div>

            <div className="hidden text-center md:block">
              <p className="text-xs font-semibold text-violet-600">
                {hiringApplicationPercentage}%
              </p>
              <ArrowUpRight size={18} className="mx-auto text-violet-500" />
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                  <BriefcaseBusinessIcon size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Applications</p>
                  <p className="text-xl font-bold text-[#11152A]">
                    {totalApplications}
                  </p>
                </div>
              </div>
              <div className="mt-4 inline-flex rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-semibold text-violet-600">
                {hiringApplicationPercentage}%
              </div>
            </div>

            <div className="hidden text-center md:block">
              <p className="text-xs font-semibold text-violet-600">
                {interviewApplicationPercentage}%
              </p>
              <ArrowUpRight size={18} className="mx-auto text-violet-500" />
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <BriefcaseBusinessIcon size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Interviews</p>
                  <p className="text-xl font-bold text-[#11152A]">
                    {totalInterviews}
                  </p>
                </div>
              </div>
              <div className="mt-4 inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold text-emerald-600">
                {interviewApplicationPercentage}%
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(30,41,59,0.03)]">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="font-semibold text-[#11152A]">
                  Company Verification
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Companies requiring admin attention
                </p>
              </div>
              <span className="rounded-full bg-orange-50 px-3 py-1 text-[10px] font-semibold text-orange-600">
                {unverifiedCompanies} pending
              </span>
            </div>

            <div className="space-y-3">
              {pendingCompanies.length > 0 ? (
                pendingCompanies.map((company) => {
                  const name = getCompanyName(company);
                  const logo = getCompanyLogo(company);

                  return (
                    <div
                      key={getId(company)}
                      className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        {logo ? (
                          <img
                            src={logo}
                            alt={`${name} logo`}
                            className="h-9 w-9 shrink-0 rounded-full border border-slate-100 object-cover"
                          />
                        ) : (
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-600">
                            {name.charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[#11152A]">
                            {name}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {getRelativeTime(getCreatedAt(company))}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-3">
                        <div className="rounded-full bg-orange-100 px-2.5 py-1 text-[9px] font-semibold text-orange-600">
                          Pending
                        </div>
                        <button
                          title="View company"
                          onClick={() =>
                            window.dispatchEvent(
                              new CustomEvent("peer-hiring:open-company", {
                                detail: { companyId: getId(company) },
                              })
                            )
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:border-violet-200 hover:text-violet-600"
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-xl border border-slate-100 px-4 py-6 text-center text-xs text-slate-400">
                  No pending companies found.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(30,41,59,0.03)]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-[#11152A]">
                  Recent Platform Activity
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Latest events across Peer.Hiring
                </p>
              </div>
              <button
                onClick={togglePeriod}
                className="text-xs font-semibold text-violet-600"
              >
                {getPeriodLabel(period)}
              </button>
            </div>

            <div className="space-y-5">
              {recentActivity.length > 0 ? (
                recentActivity.map((event, index) => {
                  const IconComponent =
                    event.type === "company"
                      ? Building2
                      : event.type === "job"
                        ? BriefcaseBusinessIcon
                        : event.type === "report"
                          ? FileText
                          : User;

                  return (
                    <div
                      key={event.id || `${event.type}-${index}`}
                      className="flex gap-3"
                    >
                      <div className="relative">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                          <IconComponent size={16} />
                        </div>
                        {index < recentActivity.length - 1 && (
                          <div className="absolute left-1/2 top-9 h-6 w-px -translate-x-1/2 bg-slate-200" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#11152A]">
                          {event.title}
                        </p>
                        <p className="mt-1 truncate text-[11px] text-slate-400">
                          {event.description}
                        </p>
                        <p className="mt-1 text-[10px] text-slate-300">
                          {getRelativeTime(event.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="py-6 text-center text-xs text-slate-400">
                  No recent activity found for{" "}
                  {getPeriodLabel(period).toLowerCase()}.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardS;
