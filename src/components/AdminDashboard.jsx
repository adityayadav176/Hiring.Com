import React from "react";
import {
  Users,
  UserRound,
  BriefcaseBusiness,
  Building2,
  ShieldCheck,
  ShieldAlert,
  FileText,
  CalendarDays,
  Clock3,
  PauseCircle,
  FilePenLine,
  TrendingUp,
  TrendingDown,
  Activity,
  ArrowUpRight,
  ChevronRight,
  CircleCheck,
  AlertCircle,
} from "lucide-react";

const AdminDashboard = () => {
  // Replace these values with your API response
  const stats = {
    totalUsers: 12842,
    totalCandidates: 8421,
    totalRecruiters: 2817,
    totalCompanies: 1604,

    verifiedCompany: 1248,
    NoVerifiedCompany: 356,

    totalJobs: 6482,
    activeJobs: 4321,
    ClosedJobs: 1642,
    expiredJobs: 892,
    draftJobs: 421,
    pausedJobs: 206,

    totalApplications: 48230,
    totalInterviews: 8642,
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat("en-IN").format(number);
  };

  const userStats = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      change: "+12%",
      icon: Users,
      positive: true,
    },
    {
      title: "Candidates",
      value: stats.totalCandidates,
      change: "+14%",
      icon: UserRound,
      positive: true,
    },
    {
      title: "Recruiters",
      value: stats.totalRecruiters,
      change: "+9%",
      icon: Users,
      positive: true,
    },
    {
      title: "Companies",
      value: stats.totalCompanies,
      change: "+11%",
      icon: Building2,
      positive: true,
    },
  ];

  const jobStats = [
    {
      title: "Total Jobs",
      value: stats.totalJobs,
      change: "+16%",
      icon: BriefcaseBusiness,
      positive: true,
      type: "primary",
    },
    {
      title: "Active Jobs",
      value: stats.activeJobs,
      change: "+18%",
      icon: Activity,
      positive: true,
      type: "success",
    },
    {
      title: "Closed Jobs",
      value: stats.ClosedJobs,
      change: "+7%",
      icon: BriefcaseBusiness,
      positive: true,
      type: "blue",
    },
    {
      title: "Expired Jobs",
      value: stats.expiredJobs,
      change: "-3%",
      icon: Clock3,
      positive: false,
      type: "orange",
    },
    {
      title: "Draft Jobs",
      value: stats.draftJobs,
      change: "+6%",
      icon: FilePenLine,
      positive: true,
      type: "purple",
    },
    {
      title: "Paused Jobs",
      value: stats.pausedJobs,
      change: "-2%",
      icon: PauseCircle,
      positive: false,
      type: "gray",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F8FC] px-6 py-7 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-6">

        {/* =========================================================
            HEADER
        ========================================================= */}
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

          <button className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 shadow-sm transition hover:border-violet-200 hover:text-violet-600">
            <CalendarDays size={17} />
            Last 30 days
            <ChevronRight size={15} />
          </button>
        </div>

        {/* =========================================================
            PLATFORM PULSE
        ========================================================= */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(30,41,59,0.03)]">
          <div className="grid gap-5 xl:grid-cols-[1.7fr_0.8fr_0.8fr]">

            {/* Main pulse */}
            <div className="rounded-xl border border-violet-100 bg-gradient-to-br from-[#FAF9FF] to-white p-5">
              <div className="flex flex-col justify -between gap-6 lg:flex-row">

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
                    {formatNumber(stats.totalUsers)}
                  </p>

                  <p className="mt-1 text-xs font-medium text-slate-500">
                    Total Users
                  </p>

                  <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="bg-violet-600"
                      style={{ width: "65%" }}
                    />
                    <div
                      className="bg-violet-300"
                      style={{ width: "22%" }}
                    />
                    <div
                      className="bg-sky-300"
                      style={{ width: "13%" }}
                    />
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

            {/* Verified */}
            <div className="rounded-xl border border-slate-200 p-5">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <ShieldCheck size={20} />
                </div>

                <span className="text-xs font-semibold text-emerald-500">
                  ↑ 8%
                </span>
              </div>

              <p className="mt-5 text-xs font-medium text-slate-500">
                Verified Companies
              </p>

              <p className="mt-1 text-2xl font-bold text-[#11152A]">
                {formatNumber(stats.verifiedCompany)}
              </p>

              <p className="mt-1 text-[11px] text-slate-400">
                78% of total companies
              </p>
            </div>

            {/* Unverified */}
            <div className="rounded-xl border border-slate-200 p-5">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                  <ShieldAlert size={20} />
                </div>

                <span className="text-xs font-semibold text-orange-500">
                  ↓ 5%
                </span>
              </div>

              <p className="mt-5 text-xs font-medium text-slate-500">
                Unverified Companies
              </p>

              <p className="mt-1 text-2xl font-bold text-[#11152A]">
                {formatNumber(stats.NoVerifiedCompany)}
              </p>

              <p className="mt-1 text-[11px] text-slate-400">
                22% of total companies
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================
            USERS + JOBS
        ========================================================= */}
        <div className="grid gap-6 xl:grid-cols-[1.05fr_1fr]">

          {/* USERS & COMPANIES */}
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

              <button className="flex items-center gap-1 text-xs font-semibold text-violet-600 hover:text-violet-700">
                View all
                <ArrowUpRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">

              {userStats.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="group rounded-xl border border-slate-100 p-4 transition hover:border-violet-100 hover:bg-violet-50/30"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                        <Icon size={18} />
                      </div>

                      <span className="text-[10px] font-semibold text-emerald-500">
                        {item.change}
                      </span>
                    </div>

                    <p className="mt-4 text-[11px] font-medium text-slate-400">
                      {item.title}
                    </p>

                    <p className="mt-1 text-xl font-bold text-[#11152A]">
                      {formatNumber(item.value)}
                    </p>

                    {/* mini graph */}
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

              {/* Verified company */}
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                  <CircleCheck size={18} />
                </div>

                <p className="mt-4 text-[11px] font-medium text-slate-400">
                  Verified Companies
                </p>

                <p className="mt-1 text-xl font-bold text-[#11152A]">
                  {formatNumber(stats.verifiedCompany)}
                </p>

                <div className="mt-4 flex items-center gap-1 text-[10px] font-semibold text-emerald-500">
                  <TrendingUp size={13} />
                  8% growth
                </div>
              </div>

              {/* Unverified company */}
              <div className="rounded-xl border border-orange-100 bg-orange-50/30 p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100 text-orange-500">
                  <AlertCircle size={18} />
                </div>

                <p className="mt-4 text-[11px] font-medium text-slate-400">
                  Unverified Companies
                </p>

                <p className="mt-1 text-xl font-bold text-[#11152A]">
                  {formatNumber(stats.NoVerifiedCompany)}
                </p>

                <div className="mt-4 flex items-center gap-1 text-[10px] font-semibold text-orange-500">
                  <TrendingDown size={13} />
                  5% decrease
                </div>
              </div>

            </div>
          </section>

          {/* JOBS & APPLICATIONS */}
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

              <button className="flex items-center gap-1 text-xs font-semibold text-violet-600 hover:text-violet-700">
                View all
                <ArrowUpRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">

              {jobStats.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-xl border border-slate-100 p-4 transition hover:border-violet-100 hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                          item.type === "success"
                            ? "bg-emerald-50 text-emerald-600"
                            : item.type === "orange"
                            ? "bg-orange-50 text-orange-500"
                            : item.type === "gray"
                            ? "bg-slate-100 text-slate-500"
                            : "bg-violet-50 text-violet-600"
                        }`}
                      >
                        <Icon size={16} />
                      </div>

                      <span
                        className={`text-[10px] font-semibold ${
                          item.positive
                            ? "text-emerald-500"
                            : "text-orange-500"
                        }`}
                      >
                        {item.change}
                      </span>
                    </div>

                    <p className="mt-3 text-[10px] font-medium text-slate-400">
                      {item.title}
                    </p>

                    <p className="mt-1 text-lg font-bold text-[#11152A]">
                      {formatNumber(item.value)}
                    </p>

                    <div className="mt-3 flex h-5 items-end gap-[2px]">
                      {[4, 7, 5, 8, 6, 10, 8, 11].map((height, i) => (
                        <div
                          key={i}
                          className="w-full rounded-sm bg-violet-200"
                          style={{ height: `${height * 1.5}px` }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Applications */}
              <div className="rounded-xl border border-violet-100 bg-violet-50/30 p-4 lg:col-span-2">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                    <FileText size={18} />
                  </div>

                  <span className="text-[10px] font-semibold text-emerald-500">
                    ↑ 22%
                  </span>
                </div>

                <p className="mt-4 text-[11px] font-medium text-slate-400">
                  Total Applications
                </p>

                <p className="mt-1 text-2xl font-bold text-[#11152A]">
                  {formatNumber(stats.totalApplications)}
                </p>
              </div>

              {/* Interviews */}
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                    <CalendarDays size={18} />
                  </div>

                  <span className="text-[10px] font-semibold text-emerald-500">
                    ↑ 17%
                  </span>
                </div>

                <p className="mt-4 text-[11px] font-medium text-slate-400">
                  Total Interviews
                </p>

                <p className="mt-1 text-2xl font-bold text-[#11152A]">
                  {formatNumber(stats.totalInterviews)}
                </p>
              </div>

            </div>
          </section>
        </div>

        {/* =========================================================
            HIRING FLOW
        ========================================================= */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(30,41,59,0.03)]">

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-[#11152A]">
                Hiring Flow
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                From job posting to interview — platform conversion
              </p>
            </div>

            <button className="flex items-center gap-1 text-xs font-semibold text-violet-600">
              Detailed report
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="grid items-center gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">

            {/* Jobs */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                  <BriefcaseBusiness size={20} />
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Jobs Posted
                  </p>

                  <p className="text-xl font-bold text-[#11152A]">
                    {formatNumber(stats.totalJobs)}
                  </p>
                </div>
              </div>

              <div className="mt-4 inline-flex rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-semibold text-violet-600">
                100%
              </div>
            </div>

            <div className="hidden text-center md:block">
              <p className="text-xs font-semibold text-violet-600">
                74%
              </p>
              <ArrowUpRight className="mx-auto text-violet-500" size={18} />
            </div>

            {/* Applications */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                  <FileText size={20} />
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Applications
                  </p>

                  <p className="text-xl font-bold text-[#11152A]">
                    {formatNumber(stats.totalApplications)}
                  </p>
                </div>
              </div>

              <div className="mt-4 inline-flex rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-semibold text-violet-600">
                74%
              </div>
            </div>

            <div className="hidden text-center md:block">
              <p className="text-xs font-semibold text-violet-600">
                18%
              </p>
              <ArrowUpRight className="mx-auto text-violet-500" size={18} />
            </div>

            {/* Interviews */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <CalendarDays size={20} />
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Interviews
                  </p>

                  <p className="text-xl font-bold text-[#11152A]">
                    {formatNumber(stats.totalInterviews)}
                  </p>
                </div>
              </div>

              <div className="mt-4 inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold text-emerald-600">
                18%
              </div>
            </div>

          </div>
        </section>

        {/* =========================================================
            BOTTOM INSIGHTS
        ========================================================= */}
        <div className="grid gap-6 lg:grid-cols-2">

          {/* Company verification */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(30,41,59,0.03)]">

            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-[#11152A]">
                  Company Verification
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Companies requiring admin attention
                </p>
              </div>

              <span className="rounded-full bg-orange-50 px-3 py-1 text-[10px] font-semibold text-orange-600">
                {stats.NoVerifiedCompany} pending
              </span>
            </div>

            <div className="space-y-3">

              {[
                ["TechNova Solutions", "2 hours ago", "Pending"],
                ["BrightMind Labs", "5 hours ago", "Under Review"],
                ["NextGen Systems", "8 hours ago", "Approved"],
              ].map(([company, time, status]) => (
                <div
                  key={company}
                  className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-600">
                      {company.charAt(0)}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[#11152A]">
                        {company}
                      </p>

                      <p className="text-[10px] text-slate-400">
                        {time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${
                        status === "Approved"
                          ? "bg-emerald-50 text-emerald-600"
                          : status === "Pending"
                          ? "bg-orange-50 text-orange-600"
                          : "bg-blue-50 text-blue-600"
                      }`}
                    >
                      {status}
                    </span>

                    <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:border-violet-200 hover:text-violet-600">
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))}

            </div>
          </section>

          {/* Recent activity */}
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

              <button className="text-xs font-semibold text-violet-600">
                View activity
              </button>
            </div>

            <div className="space-y-5">

              {[
                {
                  icon: Building2,
                  title: "New company registered",
                  text: "TechNova Solutions completed registration",
                  time: "2 hours ago",
                },
                {
                  icon: BriefcaseBusiness,
                  title: "Job posted",
                  text: "Senior Frontend Developer was published",
                  time: "4 hours ago",
                },
                {
                  icon: FileText,
                  title: "New application",
                  text: "Application received for Backend Developer",
                  time: "6 hours ago",
                },
                {
                  icon: CalendarDays,
                  title: "Interview scheduled",
                  text: "Technical interview has been scheduled",
                  time: "8 hours ago",
                },
              ].map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={index}
                    className="flex gap-3"
                  >
                    <div className="relative">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                        <Icon size={16} />
                      </div>

                      {index !== 3 && (
                        <div className="absolute left-1/2 top-9 h-6 w-px -translate-x-1/2 bg-slate-200" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#11152A]">
                        {item.title}
                      </p>

                      <p className="mt-1 truncate text-[11px] text-slate-400">
                        {item.text}
                      </p>

                      <p className="mt-1 text-[10px] text-slate-300">
                        {item.time}
                      </p>
                    </div>
                  </div>
                );
              })}

            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;