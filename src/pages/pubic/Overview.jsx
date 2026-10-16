
import React, { useEffect, useMemo } from "react";
import {
  ArrowUpRight,
  Bookmark,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  MapPin,
  MoreHorizontal,
  Paperclip,
  Search,
  User,
  Sparkles,
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

const formatDate = (date) => {
  if (!date) return "Date unavailable";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "Date unavailable";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
};

const formatTime = (date) => {
  if (!date) return "Time unavailable";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "Time unavailable";

  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(parsed);
};

const getInterviewDate = (interview) =>
  interview?.scheduledAt ||
  interview?.interviewDate ||
  interview?.date ||
  interview?.time ||
  null;

function Overview() {
  const { jobs, handleGetAllJobs } = useJob();
  const { profileCompletion, handleProfileCompletion, profile, handleGetMyProfile } = useProfile();
  const { applications, handleGetMyApplications } = useApplication();
  const {handleGetAllResumes, resumes} = useResume();
  const {user, getUser} = useAuth();

  const { setActivePage } = useHome();

  const {
    upcomingInterview,
    handleGetUpcomingInterviews,
    todayInterviews,
    handleGetTodayInterviews,
  } = useInterview();

  useEffect(() => {
    handleGetMyApplications();
    handleGetUpcomingInterviews();
    handleProfileCompletion();
    handleGetAllJobs();
    handleGetTodayInterviews();
    handleGetMyProfile();
    getUser();
    handleGetAllResumes();
  }, []);

  const applicationList = Array.isArray(applications)
    ? applications
    : [];

  const jobList = Array.isArray(jobs) ? jobs : [];

  const upcomingInterviewList = Array.isArray(upcomingInterview)
    ? upcomingInterview
    : upcomingInterview
      ? [upcomingInterview]
      : [];

  const todayInterviewList = Array.isArray(todayInterviews)
    ? todayInterviews
    : todayInterviews
      ? [todayInterviews]
      : [];

  const completion =
    profileCompletion?.score ??
    profile?.profileCompletion ??
    0;

  const savedJobs = useMemo(
    () =>
      jobList.filter(
        (job) =>
          job?.isSaved === true ||
          job?.saved === true
      ),
    [jobList]
  );

  const nextInterviews = useMemo(
    () =>
      [...upcomingInterviewList]
        .filter((interview) => {
          const date = getInterviewDate(interview);

          return date && !Number.isNaN(new Date(date).getTime());
        })
        .sort(
          (a, b) =>
            new Date(getInterviewDate(a)) -
            new Date(getInterviewDate(b))
        )
        .slice(0, 2),
    [upcomingInterviewList]
  );

  const firstInterview = nextInterviews[0];
  const firstInterviewDate = firstInterview
    ? getInterviewDate(firstInterview)
    : null;

  const profileSteps = [
    {
      title: "Add a profile photo",
      done: Boolean(profile?.userId?.avatar?.url || profile?.userId?.avatar?.public_id || user?.avatar?.public_id || user?.avatar?.url),
    },
    {
      title: "Write your professional headline",
      done: Boolean(profile?.headline),
    },
    {
      title: "Add your work experience",
      done: Boolean(profile?.experience?.length),
    },
    {
      title: "Add your resume",
      done: Boolean(profile?.resumeId || resumes?.length > 0),
    },
  ];

  return (
    <div className="w-full bg-[#f7f8fc] px-4 py-5 sm:px-6 lg:px-8">
      <section className="mb-7">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-indigo-600">
              <Sparkles size={14} />
              Your career space
            </div>

            <h1 className="text-[34px] font-semibold leading-[1.1] tracking-[-0.035em] text-slate-950">
              Good morning
              <span className="ml-1.5 text-[29px] text-amber-400">
                ✦
              </span>
            </h1>

            <p className="mt-2 text-[13px] text-slate-500">
              Here&apos;s what&apos;s happening with your job search today.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActivePage("jobs")}
            className="flex h-10 shrink-0 items-center gap-2 rounded-[10px] border border-violet-400 bg-indigo-600 px-4 py-2 text-[12px] font-semibold text-white shadow-[0_5px_14px_rgba(79,70,229,0.22)] transition hover:bg-indigo-700"
          >
            <Search size={16} />
            <span>Explore jobs</span>
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<Paperclip size={18} />}
          iconClass="bg-indigo-50 text-indigo-600"
          title="Applications sent"
          value={applicationList.length}
          footer="Total applications submitted"
        />

        <StatCard
          icon={<User size={18} />}
          iconClass="bg-violet-50 text-violet-600"
          title="Profile completion"
          value={`${completion}%`}
          footer={
            completion >= 100
              ? "Your profile is complete"
              : "Keep going — almost there"
          }
        />

        <StatCard
          icon={<Bookmark size={18} />}
          iconClass="bg-amber-50 text-amber-600"
          title="Saved jobs"
          value={savedJobs.length}
          footer="Saved opportunities"
        />

        <StatCard
          icon={<CalendarDays size={18} />}
          iconClass="bg-emerald-50 text-emerald-600"
          title="Upcoming interviews"
          value={upcomingInterviewList.length}
          footer={
            firstInterviewDate
              ? `Next: ${formatDate(firstInterviewDate)}`
              : "No upcoming interviews"
          }
        />
      </section>

      <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.65fr_1fr]">
        <div className="rounded-[14px] border border-slate-200 bg-white p-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[16px] font-semibold tracking-[0.01em] text-slate-950">
                Recommended for you
              </h2>
              <p className="mt-1.5 text-[12px] text-slate-500">
                Explore available job opportunities
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActivePage("jobs")}
              className="flex items-center justify-center gap-1 text-[12px] font-semibold text-indigo-600 hover:text-indigo-700"
            >
              View All
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
            {jobList.length > 0 ? (
              jobList.slice(0, 4).map((item) => (
                <JobCard
                  key={item?._id}
                  logo={
                    item?.companyId?.name?.charAt(0)?.toUpperCase() ||
                    "C"
                  }
                  title={item?.title || "Untitled job"}
                  company={item?.companyId?.name || "Company"}
                  type={
                    item?.employmentType?.replaceAll("_", " ") ||
                    "Not specified"
                  }
                  location={
                    [
                      item?.location?.city,
                      item?.location?.country,
                    ]
                      .filter(Boolean)
                      .join(" · ") || "Location not specified"
                  }
                  salary={formatSalary(item?.salary)}
                  logoClass="bg-violet-100 text-violet-600"
                  skills={
                    Array.isArray(item?.skills)
                      ? item.skills
                          .map((skill) =>
                            typeof skill === "string"
                              ? skill
                              : skill?.name
                          )
                          .filter(Boolean)
                          .slice(0, 3)
                      : []
                  }
                />
              ))
            ) : (
              <EmptyState message="No job opportunities available right now." />
            )}
          </div>
        </div>

        <div className="rounded-[14px] border border-slate-200 bg-white p-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-[16px] font-semibold text-slate-950">
                Complete your profile
              </h3>
              <p className="mt-1.5 text-[12px] text-slate-500">
                Stand out to the right employers
              </p>
            </div>

            <span className="text-[12px] font-semibold text-indigo-600">
              {completion}%
            </span>
          </div>

          <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all duration-500"
              style={{ width: `${completion}%` }}
            />
          </div>

          <div className="mt-5 space-y-3.5">
            {profileSteps.map((step, index) => (
              <ProfileStep
                key={step.title}
                title={step.title}
                done={step.done}
                number={index + 1}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.65fr_1fr]">
        <div className="rounded-[14px] border border-slate-200 bg-white p-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[16px] font-semibold text-slate-950">
                Application activity
              </h2>
              <p className="mt-1.5 text-[12px] text-slate-500">
                Your job application overview
              </p>
            </div>

            <span className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-[10px] text-slate-500">
              Last 30 days
              <ChevronDown size={13} />
            </span>
          </div>

          <ActivityChart applications={applicationList} />
        </div>

        <div className="rounded-[14px] border border-slate-200 bg-white p-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[16px] font-semibold text-slate-950">
                Next interviews
              </h2>
              <p className="mt-1.5 text-[12px] text-slate-500">
                Prepare for your conversations
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActivePage("interviews")}
              className="flex items-center gap-1 text-[12px] font-semibold text-indigo-600"
            >
              View all
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="mt-5 divide-y divide-slate-100">
            {nextInterviews.length > 0 ? (
              nextInterviews.map((interview) => {
                const date = getInterviewDate(interview);
                const interviewDate = new Date(date);

                return (
                  <InterviewCard
                    key={interview?._id || date}
                    day={interviewDate.getDate()}
                    month={interviewDate
                      .toLocaleString("en-IN", { month: "short" })
                      .toUpperCase()}
                    title={
                      interview?.title ||
                      interview?.interviewType ||
                      "Interview"
                    }
                    company={
                      interview?.companyId?.name ||
                      interview?.jobId?.companyId?.name ||
                      interview?.jobId?.title ||
                      "Company details unavailable"
                    }
                    time={`${formatDate(date)} · ${formatTime(date)}`}
                  />
                );
              })
            ) : (
              <EmptyState message="You have no upcoming interviews scheduled." />
            )}
          </div>

          {todayInterviewList.length > 0 && (
            <p className="mt-3 text-[11px] text-slate-500">
              You have {todayInterviewList.length} interview
              {todayInterviewList.length === 1 ? "" : "s"} scheduled today.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function formatSalary(salary) {
  const min = salary?.min;
  const max = salary?.max;

  if (min == null && max == null) return "Salary not specified";

  const formatAmount = (amount) =>
    Number(amount).toLocaleString("en-IN");

  if (min != null && max != null) {
    return `₹${formatAmount(min)} – ₹${formatAmount(max)}`;
  }

  if (min != null) return `From ₹${formatAmount(min)}`;

  return `Up to ₹${formatAmount(max)}`;
}

const InterviewCard = ({
  day,
  month,
  title,
  company,
  time,
}) => (
  <div className="flex gap-3 py-4 first:pt-0">
    <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-[10px] bg-violet-50">
      <span className="text-[16px] font-semibold leading-none text-indigo-600">
        {day}
      </span>
      <span className="mt-1 text-[7px] font-bold tracking-wider text-indigo-500">
        {month}
      </span>
    </div>

    <div className="min-w-0 flex-1">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[12px] font-semibold text-slate-900">
          {title}
        </h3>
        <MoreHorizontal size={15} className="shrink-0 text-slate-400" />
      </div>

      <p className="mt-1 text-[10px] text-slate-500">{company}</p>

      <div className="mt-2 flex items-center gap-1 text-[10px] font-medium text-indigo-600">
        <Clock3 size={11} />
        {time}
      </div>
    </div>
  </div>
);

const ActivityChart = ({ applications = [] }) => {
  const chartData = useMemo(() => {
    const now = new Date();

    const days = Array.from({ length: 30 }, (_, index) => {
      const date = new Date(now);
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (29 - index));

      return {
        date,
        count: 0,
      };
    });

    applications.forEach((application) => {
      const createdAt = application?.createdAt;
      if (!createdAt) return;

      const date = new Date(createdAt);
      if (Number.isNaN(date.getTime())) return;

      date.setHours(0, 0, 0, 0);

      const index = days.findIndex(
        (day) => day.date.getTime() === date.getTime()
      );

      if (index !== -1) days[index].count += 1;
    });

    return days;
  }, [applications]);

  const maxCount = Math.max(
    4,
    ...chartData.map((item) => item.count)
  );

  const points = chartData
    .map((item, index) => {
      const x = (index / Math.max(chartData.length - 1, 1)) * 700;
      const y = 180 - (item.count / maxCount) * 165;

      return { x, y, ...item };
    });

  const path = points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
    )
    .join(" ");

  const areaPath = points.length
    ? `${path} L 700 190 L 0 190 Z`
    : "";

  return (
    <div className="relative mt-5 h-[205px]">
      <div className="absolute inset-0 flex flex-col justify-between">
        {[maxCount, Math.round(maxCount * 0.66), Math.round(maxCount * 0.33), 0].map(
          (value, index) => (
            <div key={`${value}-${index}`} className="flex items-center gap-2">
              <span className="w-4 text-[9px] text-slate-400">{value}</span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>
          )
        )}
      </div>

      <div className="absolute bottom-5 left-6 right-0 top-1">
        <svg
          viewBox="0 0 700 190"
          className="h-full w-full"
          preserveAspectRatio="none"
          role="img"
          aria-label="Job applications submitted over the last 30 days"
        >
          <defs>
            <linearGradient
              id="homeChartGradient"
              x1="0"
              x2="0"
              y1="0"
              y2="1"
            >
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
            </linearGradient>
          </defs>

          {points.length > 0 && (
            <>
              <path d={areaPath} fill="url(#homeChartGradient)" />
              <path
                d={path}
                fill="none"
                stroke="#4f46e5"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}
        </svg>
      </div>
    </div>
  );
};

const ProfileStep = ({ title, done = false, number = 1 }) => (
  <div className="flex items-start justify-between gap-2">
    <div className="flex items-start gap-2.5">
      {done ? (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
          <Check size={12} strokeWidth={2.5} />
        </span>
      ) : (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-slate-200 text-[9px] text-slate-500">
          {number}
        </span>
      )}
      <span className="text-[10px] text-slate-600">{title}</span>
    </div>

    <span
      className={`shrink-0 text-[10px] ${
        done ? "text-emerald-500" : "text-indigo-600"
      }`}
    >
      {done ? "Done" : "Add now"}
    </span>
  </div>
);

const JobCard = ({
  logo,
  title,
  company,
  type,
  skills = [],
  salary,
  logoClass,
  location,
}) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-indigo-200 hover:shadow-sm">
    <div className="flex items-start justify-between">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-[10px] p-2 text-[13px] font-semibold ${logoClass}`}
      >
        {logo}
      </div>

      <Bookmark size={16} className="text-slate-400" />
    </div>

    <h3 className="mt-4 text-[13px] font-semibold text-slate-950">
      {title}
    </h3>

    <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-500">
      {company}
      <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
        <Check size={8} strokeWidth={3} />
      </span>
    </div>

    <div className="my-3 border-t border-slate-100" />

    <div className="flex flex-wrap gap-3 text-[10px] text-slate-500">
      <span className="flex items-center gap-1">
        <MapPin size={12} />
        {location}
      </span>

      <span className="flex items-center gap-1">
        <BriefcaseBusiness size={12} />
        {type}
      </span>
    </div>

    <div className="my-3 border-t border-slate-100" />

    <div className="flex flex-wrap items-center justify-between gap-2">
      <span className="text-[12px] font-semibold text-slate-900">
        {salary}
      </span>

      <div className="flex flex-wrap gap-1">
        {skills.map((skill) => (
          <span
            key={skill}
            className="rounded bg-slate-100 px-1.5 py-1 text-[8px] text-slate-600"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const StatCard = ({ icon, iconClass, title, value, footer }) => (
  <div className="min-h-[112px] rounded-[13px] border border-slate-200 bg-white px-4 py-4">
    <div className="flex items-start gap-3">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] ${iconClass}`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[11px] leading-4 text-slate-500">{title}</p>
        <p className="mt-1 text-[25px] font-semibold leading-none tracking-[-0.02em] text-slate-900">
          {value}
        </p>
      </div>
    </div>

    <div className="mt-4 text-[10px] text-slate-500">{footer}</div>
  </div>
);

const EmptyState = ({ message }) => (
  <div className="col-span-full rounded-lg border border-dashed border-slate-200 px-4 py-8 text-center text-[12px] text-slate-500">
    {message}
  </div>
);

export default Overview;
