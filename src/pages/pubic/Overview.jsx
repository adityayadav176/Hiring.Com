import React, { useEffect, useMemo, useRef } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Eye,
  FileText,
  MapPin,
  Search,
  Sparkles,
  UserRound,
  Video,
} from "lucide-react";

import {
  useApplication,
  useProfile,
  useJob,
  useInterview,
  useHome,
  useAuth,
  useResume,
} from "../../hooks/Hook";

const TERMINAL_STATUSES = new Set([
  "completed",
  "cancelled",
  "canceled",
  "rejected",
  "no show",
  "withdrawn",
]);

const TIME_ZONE = "Asia/Kolkata";

const formatDate = (value) => {
  if (!value) return "Date unavailable";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: TIME_ZONE,
  }).format(date);
};

const formatTime = (value) => {
  if (!value) return "Time unavailable";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Time unavailable";

  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: TIME_ZONE,
  }).format(date);
};

const getInterviewDate = (interview) =>
  interview?.scheduledAt ||
  interview?.interviewDate ||
  interview?.date ||
  null;

const getInterviewCompany = (interview) =>
  interview?.company?.name ||
  interview?.companyId?.name ||
  interview?.job?.companyId?.name ||
  interview?.jobId?.companyId?.name ||
  "Company details unavailable";

const getInterviewJob = (interview) =>
  interview?.job?.title ||
  interview?.jobId?.title ||
  interview?.title ||
  interview?.interviewType ||
  "Interview";

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const normalizeList = (value) => {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") return [value];
  return [];
};

const normalizeInterviewList = (value) => {
  if (Array.isArray(value)) return value;

  if (Array.isArray(value?.interviews)) {
    return value.interviews;
  }

  if (Array.isArray(value?.data?.interviews)) {
    return value.data.interviews;
  }

  if (Array.isArray(value?.data)) {
    return value.data;
  }

  if (value && typeof value === "object" && getInterviewDate(value)) {
    return [value];
  }

  return [];
};

const getTimestamp = (value) => {
  if (!value) return 0;

  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
};

const normalizeStatus = (status) =>
  String(status || "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");

function Overview() {
  const { jobs, handleGetAllJobs } = useJob();

  const {
    profile,
    profileCompletion,
    handleProfileCompletion,
    handleGetMyProfile,
  } = useProfile();

  const { applications, handleGetMyApplications } = useApplication();

  const { resumes, handleGetAllResumes } = useResume();

  const { user, getUser } = useAuth();

  const { setActivePage } = useHome();

  const {
    upcomingInterviews,
    handleGetUpcomingInterviews,
    todayInterviews,
    handleGetTodayInterviews,
  } = useInterview();

  // Prevent duplicate dashboard initialization and infinite fetch loops.
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;

    initializedRef.current = true;

    const tasks = [
      handleGetMyApplications,
      handleGetUpcomingInterviews,
      handleProfileCompletion,
      handleGetAllJobs,
      handleGetTodayInterviews,
      handleGetMyProfile,
      getUser,
      handleGetAllResumes,
    ];

    tasks.forEach((task) => {
      if (typeof task !== "function") return;

      try {
        Promise.resolve(task()).catch((error) => {
          console.error("Dashboard request failed:", error);
        });
      } catch (error) {
        console.error("Dashboard request failed:", error);
      }
    });
  }, []);

  const applicationList = useMemo(
    () => normalizeList(applications),
    [applications]
  );

  const jobList = useMemo(
    () => normalizeList(jobs),
    [jobs]
  );

  const resumeList = useMemo(
    () => normalizeList(resumes),
    [resumes]
  );

  const upcomingInterviewList = useMemo(
    () => normalizeInterviewList(upcomingInterviews),
    [upcomingInterviews]
  );

  const todayInterviewList = useMemo(
    () => normalizeInterviewList(todayInterviews),
    [todayInterviews]
  );

  const completion = Math.min(
    100,
    Math.max(
      0,
      Number(
        profileCompletion?.score ??
          profileCompletion?.completion ??
          profile?.profileCompletion ??
          0
      ) || 0
    )
  );

  const profileViews = Number(profile?.profileViews ?? 0) || 0;

  const nextInterviews = useMemo(() => {
    const now = Date.now();

    return upcomingInterviewList
      .filter((interview) => {
        const timestamp = getTimestamp(getInterviewDate(interview));

        if (!timestamp || timestamp < now) return false;

        const status = normalizeStatus(interview?.status);

        return !TERMINAL_STATUSES.has(status);
      })
      .sort(
        (a, b) =>
          getTimestamp(getInterviewDate(a)) -
          getTimestamp(getInterviewDate(b))
      )
      .slice(0, 3);
  }, [upcomingInterviewList]);

  const profileName =
    profile?.userId?.name ||
    user?.name ||
    "there";

  const avatar =
    profile?.userId?.avatar?.url ||
    user?.avatar?.url ||
    "";

  const profileHeadline =
    profile?.headline ||
    "Add a professional headline to introduce yourself to employers.";

  const profileSteps = useMemo(
    () => [
      {
        title: "Add a profile photo",
        done: Boolean(avatar),
      },
      {
        title: "Write your professional headline",
        done: Boolean(profile?.headline?.trim()),
      },
      {
        title: "Add work experience",
        done:
          Array.isArray(profile?.experience) &&
          profile.experience.length > 0,
      },
      {
        title: "Upload a resume",
        done: resumeList.length > 0,
      },
    ],
    [avatar, profile?.headline, profile?.experience, resumeList.length]
  );

  const incompleteSteps = profileSteps.filter(
    (step) => !step.done
  ).length;

  const recentApplications = useMemo(
    () =>
      [...applicationList]
        .sort(
          (a, b) =>
            getTimestamp(b?.createdAt) -
            getTimestamp(a?.createdAt)
        )
        .slice(0, 4),
    [applicationList]
  );

  return (
    <div className="min-h-full w-full bg-[#F6F7FB] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">
              <span className="h-2 w-2 rounded-full bg-violet-600" />
              Your career workspace
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Dashboard<span className="text-violet-600">.</span>
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Your applications, career profile, and upcoming opportunities
              in one place.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActivePage("jobs")}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white shadow-lg shadow-violet-600/15 transition hover:bg-violet-700"
          >
            <Search size={17} />
            Explore jobs
            <ArrowRight size={16} />
          </button>
        </section>

        <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-[#211044] via-[#381477] to-[#6425D9] p-6 text-white shadow-xl shadow-violet-950/10 sm:p-8 lg:p-9">
          <div className="pointer-events-none absolute -right-16 -top-28 -z-10 h-80 w-80 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-4 -top-16 -z-10 h-64 w-64 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-36 right-1/3 -z-10 h-72 w-72 rounded-full bg-fuchsia-500/15 blur-3xl" />

          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-violet-100">
                <Sparkles size={14} />
                CANDIDATE WORKSPACE
              </span>

              <div className="mt-5 flex items-center gap-4">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={profileName}
                    className="h-14 w-14 rounded-2xl border border-white/20 object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-xl font-bold">
                    {profileName.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0">
                  <p className="text-sm text-violet-200">
                    {getGreeting()},
                  </p>
                  <h2 className="mt-0.5 break-words text-2xl font-bold tracking-tight sm:text-3xl">
                    {profileName}
                  </h2>
                </div>
              </div>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-violet-100/85 sm:text-base">
                {profile?.headline
                  ? profileHeadline
                  : "Build your profile, discover relevant roles, and keep your next career move on track."}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setActivePage("jobs")}
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-violet-800 transition hover:bg-violet-50"
                >
                  Find your next role
                  <ArrowUpRight size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => setActivePage("profile")}
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  <UserRound size={16} />
                  View profile
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:w-[300px]">
              <HeroMetric
                icon={<BriefcaseBusiness size={18} />}
                label="Applications"
                value={applicationList.length}
              />
              <HeroMetric
                icon={<CalendarDays size={18} />}
                label="Upcoming interviews"
                value={nextInterviews.length}
              />
            </div>
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-base font-bold text-slate-900">
              Your career at a glance
            </h2>
            <span className="text-xs text-slate-400">
              Live account data
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={<BriefcaseBusiness size={19} />}
              iconClass="bg-violet-50 text-violet-700"
              title="Applications sent"
              value={applicationList.length}
              footer="Your submitted applications"
              onClick={() => setActivePage("applications")}
            />

            <StatCard
              icon={<Eye size={19} />}
              iconClass="bg-blue-50 text-blue-700"
              title="Profile views"
              value={profileViews.toLocaleString("en-IN")}
              footer="Views of your professional profile"
              onClick={() => setActivePage("profile")}
            />

            <StatCard
              icon={<CalendarDays size={19} />}
              iconClass="bg-emerald-50 text-emerald-700"
              title="Upcoming interviews"
              value={nextInterviews.length}
              footer={
                nextInterviews[0]
                  ? `Next: ${formatDate(getInterviewDate(nextInterviews[0]))}`
                  : "No upcoming interviews"
              }
              onClick={() => setActivePage("interviews")}
            />

            <StatCard
              icon={<FileText size={19} />}
              iconClass="bg-amber-50 text-amber-700"
              title="My resumes"
              value={resumeList.length}
              footer="Resumes available to use"
              onClick={() => setActivePage("resume")}
            />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[0.9fr_1.5fr]">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">
                  Profile spotlight
                </p>
                <h2 className="mt-1.5 text-lg font-bold text-slate-950">
                  Make your profile count
                </h2>
                <p className="mt-1 text-sm leading-5 text-slate-500">
                  A complete profile helps employers understand your strengths.
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                <UserRound size={20} />
              </div>
            </div>

            <div className="mt-6 flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold tracking-tight text-slate-950">
                  {completion}%
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Profile completion
                </p>
              </div>

              <span className="rounded-lg bg-violet-50 px-2.5 py-1.5 text-xs font-semibold text-violet-700">
                {completion >= 100
                  ? "Complete"
                  : `${incompleteSteps} steps left`}
              </span>
            </div>

            <div
              className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"
              role="progressbar"
              aria-valuenow={completion}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Profile completion"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 transition-all duration-500"
                style={{ width: `${completion}%` }}
              />
            </div>

            <div className="mt-5 space-y-4">
              {profileSteps.map((step) => (
                <div key={step.title} className="flex items-center gap-3">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                      step.done
                        ? "bg-emerald-50 text-emerald-600"
                        : "border border-slate-200 text-slate-400"
                    }`}
                  >
                    {step.done ? (
                      <Check size={14} />
                    ) : (
                      <ChevronRight size={14} />
                    )}
                  </span>

                  <span
                    className={`flex-1 text-sm ${
                      step.done
                        ? "text-slate-400 line-through"
                        : "font-medium text-slate-700"
                    }`}
                  >
                    {step.title}
                  </span>

                  <span
                    className={`text-xs font-medium ${
                      step.done ? "text-emerald-600" : "text-violet-600"
                    }`}
                  >
                    {step.done ? "Done" : "Add"}
                  </span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setActivePage("profile")}
              className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 text-sm font-semibold text-violet-700 transition hover:bg-violet-100"
            >
              Improve my profile
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  Recommended opportunities
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Explore jobs from the current job listings.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActivePage("jobs")}
                className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-violet-700 hover:text-violet-800"
              >
                All jobs
                <ArrowUpRight size={16} />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
              {jobList.length > 0 ? (
                jobList.slice(0, 4).map((job, index) => (
                  <JobCard key={job?._id || index} job={job} />
                ))
              ) : (
                <div className="col-span-full">
                  <EmptyState
                    icon={<Search size={22} />}
                    title="No jobs to show yet"
                    message="New opportunities will appear here when job listings are available."
                    action="Explore jobs"
                    onAction={() => setActivePage("jobs")}
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <div className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  Recent applications
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Keep track of your latest submissions.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActivePage("applications")}
                className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-violet-700"
              >
                View all
                <ArrowUpRight size={16} />
              </button>
            </div>

            <div className="mt-5 divide-y divide-slate-100">
              {recentApplications.length > 0 ? (
                recentApplications.map((application, index) => {
                  const job =
                    application?.jobId || application?.job || {};

                  const company =
                    application?.companyId ||
                    application?.company ||
                    job?.companyId ||
                    {};

                  const status = normalizeStatus(
                    application?.status || "applied"
                  );

                  return (
                    <div
                      key={application?._id || index}
                      className="flex items-center gap-3 py-4 first:pt-0 last:pb-0"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                        <BriefcaseBusiness size={18} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {job?.title || "Job application"}
                        </p>
                        <p className="mt-1 truncate text-xs text-slate-500">
                          {company?.name || "Company"}
                          {application?.createdAt
                            ? ` · ${formatDate(application.createdAt)}`
                            : ""}
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-semibold capitalize text-violet-700">
                        {status}
                      </span>
                    </div>
                  );
                })
              ) : (
                <EmptyState
                  icon={<FileText size={22} />}
                  title="Your application journey starts here"
                  message="Apply for a role and your latest application will appear here."
                  action="Browse jobs"
                  onAction={() => setActivePage("jobs")}
                />
              )}
            </div>
          </div>

          <div className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  Next interviews
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Your nearest scheduled conversations.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActivePage("interviews")}
                className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-violet-700"
              >
                View all
                <ArrowUpRight size={16} />
              </button>
            </div>

            <div className="mt-5 divide-y divide-slate-100">
              {nextInterviews.length > 0 ? (
                nextInterviews.map((interview, index) => {
                  const date = getInterviewDate(interview);
                  const parsedDate = new Date(date);

                  const status = String(
                    interview?.status || "Scheduled"
                  );

                  const mode =
                    interview?.interviewType ||
                    interview?.interviewMode ||
                    interview?.mode ||
                    "Interview";

                  return (
                    <div
                      key={interview?._id || `${date}-${index}`}
                      className="flex gap-3 py-4 first:pt-0 last:pb-0"
                    >
                      <div className="flex h-[58px] w-[58px] shrink-0 flex-col items-center justify-center rounded-xl border border-violet-100 bg-violet-50">
                        <span className="text-xl font-bold leading-none text-violet-800">
                          {new Intl.DateTimeFormat("en-IN", {
                            day: "numeric",
                            timeZone: TIME_ZONE,
                          }).format(parsedDate)}
                        </span>
                        <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-violet-600">
                          {new Intl.DateTimeFormat("en-IN", {
                            month: "short",
                            timeZone: TIME_ZONE,
                          }).format(parsedDate)}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {getInterviewJob(interview)}
                        </p>

                        <p className="mt-1 truncate text-xs text-slate-500">
                          {getInterviewCompany(interview)}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            <Clock3 size={13} />
                            {formatTime(date)}
                          </span>

                          <span className="inline-flex items-center gap-1">
                            {String(mode).toLowerCase().includes("online") ? (
                              <Video size={13} />
                            ) : (
                              <CalendarDays size={13} />
                            )}
                            {String(mode).replace(/[_-]+/g, " ")}
                          </span>
                        </div>
                      </div>

                      <span className="h-fit shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold capitalize text-emerald-700">
                        {status.replace(/[_-]+/g, " ")}
                      </span>
                    </div>
                  );
                })
              ) : (
                <EmptyState
                  icon={<CalendarDays size={22} />}
                  title="No upcoming interviews"
                  message="When an interview is scheduled for you, its details will appear here."
                  action="View interviews"
                  onAction={() => setActivePage("interviews")}
                />
              )}
            </div>

            {todayInterviewList.length > 0 && (
              <div className="mt-4 flex items-start gap-2 rounded-xl bg-violet-50 p-3 text-xs leading-5 text-violet-800">
                <Sparkles size={15} className="mt-0.5 shrink-0" />
                You have {todayInterviewList.length} interview
                {todayInterviewList.length === 1 ? "" : "s"} scheduled today.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function HeroMetric({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-violet-100">
        {icon}
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-white">
        {value}
      </p>
      <p className="mt-1 text-xs leading-5 text-violet-100/85">
        {label}
      </p>
    </div>
  );
}

function StatCard({
  icon,
  iconClass,
  title,
  value,
  footer,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group min-w-0 rounded-2xl border border-slate-200/80 bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
        <ArrowUpRight
          size={17}
          className="text-slate-300 transition group-hover:text-violet-600"
        />
      </div>

      <p className="mt-5 text-sm font-medium text-slate-500">
        {title}
      </p>
      <p className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
        {value}
      </p>
      <p className="mt-2 truncate text-xs text-slate-500">
        {footer}
      </p>
    </button>
  );
}

function JobCard({ job }) {
  const company =
    job?.companyId?.name ||
    job?.company?.name ||
    "Company";

  const salary = job?.salary;

  const location = [
    job?.location?.city,
    job?.location?.country,
  ]
    .filter(Boolean)
    .join(", ");

  const formatAmount = (amount) =>
    Number(amount).toLocaleString("en-IN");

  const salaryText =
    salary?.min != null && salary?.max != null
      ? `₹${formatAmount(salary.min)} – ₹${formatAmount(salary.max)}`
      : salary?.min != null
        ? `From ₹${formatAmount(salary.min)}`
        : salary?.max != null
          ? `Up to ₹${formatAmount(salary.max)}`
          : "Salary not specified";

  const skills = Array.isArray(job?.skills)
    ? job.skills
        .map((skill) =>
          typeof skill === "string" ? skill : skill?.name
        )
        .filter(Boolean)
        .slice(0, 3)
    : [];

  return (
    <div className="group rounded-xl border border-slate-200 p-4 transition hover:border-violet-200 hover:bg-violet-50/30">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-lg font-bold text-violet-700">
          {company.charAt(0).toUpperCase()}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-slate-900">
            {job?.title || "Untitled position"}
          </h3>
          <p className="mt-1 truncate text-xs text-slate-500">
            {company}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-3 gap-y-2 text-xs text-slate-500">
        {location && (
          <span className="inline-flex items-center gap-1">
            <MapPin size={13} />
            {location}
          </span>
        )}

        {job?.employmentType && (
          <span className="inline-flex items-center gap-1">
            <BriefcaseBusiness size={13} />
            {String(job.employmentType).replace(/[_-]+/g, " ")}
          </span>
        )}
      </div>

      {skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {skills.map((skill, index) => (
            <span
              key={`${skill}-${index}`}
              className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
        <span className="truncate text-xs font-semibold text-slate-800">
          {salaryText}
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-violet-700">
          Explore
          <ArrowRight
            size={14}
            className="transition group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  message,
  action,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-200 px-5 py-8 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
        {icon}
      </div>

      <h3 className="mt-3 text-sm font-semibold text-slate-900">
        {title}
      </h3>
      <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">
        {message}
      </p>

      {action && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-violet-700 hover:text-violet-800"
        >
          {action}
          <ArrowRight size={14} />
        </button>
      )}
    </div>
  );
}

export default Overview;