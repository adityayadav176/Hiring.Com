
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Search,
  MapPin,
  SlidersHorizontal,
  BriefcaseBusiness,
  Clock3,
  ChevronDown,
  X,
  RotateCcw,
  Sparkles,
  Banknote,
  Tag,
  Laptop,
  GraduationCap,
  ListFilter,
  ArrowUpRight,
  Building2,
  Bookmark,
  LoaderCircle,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  LayoutGrid,
  CalendarDays,
} from "lucide-react";

import JobItem from "./JobItem";
import JobDetails from "./JobDetails";
import { useJob } from "../../hooks/Hook";

const initialFilters = {
  category: "",
  employmentType: [],
  workSpaceType: [],
  experienceLevel: "",
  skills: [],
  minSalary: "",
  maxSalary: "",
  postedWithin: "",
  sortBy: "relevance",
};

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 400;

const employmentOptions = [
  ["FULL_TIME", "Full-time"],
  ["PART_TIME", "Part-time"],
  ["INTERNSHIP", "Internship"],
  ["CONTRACT", "Contract"],
  ["FREELANCE", "Freelance"],
];

const workspaceOptions = [
  ["REMOTE", "Remote"],
  ["HYBRID", "Hybrid"],
  ["ONSITE", "On-site"],
];

const experienceOptions = [
  ["FRESHER", "Fresher"],
  ["JUNIOR", "Junior"],
  ["MID", "Mid-level"],
  ["SENIOR", "Senior"],
  ["LEAD", "Lead"],
];

const postedOptions = [
  ["", "Any time"],
  ["24h", "Last 24 hours"],
  ["3d", "Last 3 days"],
  ["7d", "Last 7 days"],
  ["30d", "Last 30 days"],
];

const sortOptions = [
  ["relevance", "Most relevant"],
  ["newest", "Newest first"],
  ["oldest", "Oldest first"],
  ["salaryHigh", "Salary: high to low"],
  ["salaryLow", "Salary: low to high"],
];

function FilterHeading({ icon: Icon, children }) {
  return (
    <h3 className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.13em] text-slate-500">
      <Icon size={15} className="text-violet-600" />
      {children}
    </h3>
  );
}

function FilterCheckbox({ value, label, checked, onChange }) {
  return (
    <label className="group flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm text-slate-600 transition hover:bg-violet-50 hover:text-slate-900">
      <input
        type="checkbox"
        value={value}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 cursor-pointer rounded accent-violet-600"
      />
      <span className="flex-1">{label}</span>
      {checked && (
        <CheckCircle2 size={15} className="text-violet-600" />
      )}
    </label>
  );
}

function MetricCard({ icon: Icon, label, value, caption, tone }) {
  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/40">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">
            {label}
          </p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            {value}
          </p>
        </div>
        <div className={`rounded-xl p-3 ${tone}`}>
          <Icon size={21} />
        </div>
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500">
        {caption}
      </p>
    </article>
  );
}

function getJobId(job) {
  return String(job?._id || job?.id || "");
}

function getJobTitle(job) {
  return (
    job?.title ||
    job?.jobTitle ||
    job?.position ||
    "Untitled position"
  );
}

function getCompanyName(job) {
  const company = job?.companyId || job?.company;

  if (typeof company === "string") {
    return job?.companyName || "Company";
  }

  return (
    company?.name ||
    company?.companyName ||
    job?.companyName ||
    "Company"
  );
}

function getLocation(job) {
  const location = job?.location;

  if (typeof location === "string") return location;

  if (location && typeof location === "object") {
    return [
      location.city,
      location.state,
      location.country,
    ]
      .filter(Boolean)
      .join(", ");
  }

  return job?.city || job?.workLocation || "Location not specified";
}

function getEmploymentLabel(value) {
  const labels = {
    FULL_TIME: "Full-time",
    PART_TIME: "Part-time",
    INTERNSHIP: "Internship",
    CONTRACT: "Contract",
    FREELANCE: "Freelance",
  };

  return labels[value] || value || "Employment type not specified";
}

function getWorkspaceLabel(value) {
  const labels = {
    REMOTE: "Remote",
    HYBRID: "Hybrid",
    ONSITE: "On-site",
  };

  return labels[value] || value || "";
}

function getExperienceLabel(value) {
  const labels = {
    FRESHER: "Fresher",
    JUNIOR: "Junior",
    MID: "Mid-level",
    SENIOR: "Senior",
    LEAD: "Lead",
  };

  return labels[value] || value || "";
}

function getPostedLabel(job) {
  const date = job?.createdAt || job?.postedAt;

  if (!date) return "Recently posted";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Recently posted";
  }

  const days = Math.max(
    0,
    Math.floor((Date.now() - parsed.getTime()) / 86400000)
  );

  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

function JobLayout() {
  const {
    jobs = [],
    jobPagination,
    handleGetAllJobs,
    selectedJobs,
    setSelectedJobs,
  } = useJob();

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [filters, setFilters] = useState(() => ({
    ...initialFilters,
    employmentType: [],
    workSpaceType: [],
    skills: [],
  }));

  const [skillsInput, setSkillsInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const sentinelRef = useRef(null);
  const requestIdRef = useRef(0);
  const activeRequestRef = useRef(null);
  const loadingRef = useRef(false);
  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);

  const filterCount = useMemo(
    () =>
      Number(Boolean(filters.category.trim())) +
      filters.employmentType.length +
      filters.workSpaceType.length +
      Number(Boolean(filters.experienceLevel)) +
      filters.skills.length +
      Number(filters.minSalary !== "") +
      Number(filters.maxSalary !== "") +
      Number(Boolean(filters.postedWithin)),
    [filters]
  );

  const activeFilterCount =
    filterCount + Number(Boolean(search.trim())) +
    Number(Boolean(location.trim()));

  const updateHasMore = useCallback((value) => {
    hasMoreRef.current = value;
    setHasMore(value);
  }, []);

  const abortActiveRequest = useCallback(() => {
    requestIdRef.current += 1;

    if (activeRequestRef.current) {
      activeRequestRef.current.abort();
      activeRequestRef.current = null;
    }

    loadingRef.current = false;
    setIsLoading(false);
  }, []);

  const fetchJobs = useCallback(
    async (pageNumber = 1, append = false) => {
      if (loadingRef.current || activeRequestRef.current) return;
      if (append && !hasMoreRef.current) return;

      const controller = new AbortController();
      const requestId = ++requestIdRef.current;

      activeRequestRef.current = controller;
      loadingRef.current = true;
      setIsLoading(true);
      setRequestError("");

      try {
        const response = await handleGetAllJobs({
          search: search.trim(),
          location: location.trim(),
          ...filters,
          skills: filters.skills,
          page: pageNumber,
          limit: PAGE_SIZE,
          append,
          signal: controller.signal,
        });

        if (
          controller.signal.aborted ||
          requestId !== requestIdRef.current
        ) {
          return;
        }

        if (response?.success === false) {
          throw new Error(response.message || "Unable to fetch jobs.");
        }

        const responseData = response?.data ?? response ?? {};
        const pagination = responseData?.pagination ?? {};

        const returnedJobs = Array.isArray(responseData?.jobs)
          ? responseData.jobs
          : Array.isArray(responseData?.data?.jobs)
            ? responseData.data.jobs
            : null;

        const moreAvailable =
          pagination.hasNextPage ??
          pagination.hasNext ??
          (pagination.totalPages != null
            ? pageNumber < Number(pagination.totalPages)
            : returnedJobs
              ? returnedJobs.length === PAGE_SIZE
              : Boolean(jobPagination?.hasNextPage));

        pageRef.current = pageNumber;
        updateHasMore(Boolean(moreAvailable));
      } catch (error) {
        if (
          error?.name !== "AbortError" &&
          !controller.signal.aborted &&
          requestId === requestIdRef.current
        ) {
          console.error("Failed to fetch jobs:", error);
          setRequestError(
            error?.message || "Something went wrong while loading jobs."
          );
          updateHasMore(false);
        }
      } finally {
        if (activeRequestRef.current === controller) {
          activeRequestRef.current = null;
          loadingRef.current = false;

          if (requestId === requestIdRef.current) {
            setIsLoading(false);
          }
        }
      }
    },
    [
      handleGetAllJobs,
      search,
      location,
      filters,
      updateHasMore,
      jobPagination?.hasNextPage,
    ]
  );

  // Debounced search and filter requests.
  useEffect(() => {
    const timer = setTimeout(() => {
      abortActiveRequest();
      pageRef.current = 1;
      updateHasMore(true);
      fetchJobs(1, false);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [
    search,
    location,
    filters,
    refreshKey,
    abortActiveRequest,
    updateHasMore,
    fetchJobs,
  ]);

  // Infinite scrolling.
  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel || isLoading || !hasMore || requestError) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        if (loadingRef.current || activeRequestRef.current) return;
        if (!hasMoreRef.current) return;

        fetchJobs(pageRef.current + 1, true);
      },
      {
        rootMargin: "300px",
        threshold: 0,
      }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [fetchJobs, isLoading, hasMore, requestError]);

  useEffect(() => {
    return () => {
      requestIdRef.current += 1;
      activeRequestRef.current?.abort();
      activeRequestRef.current = null;
      loadingRef.current = false;
    };
  }, []);

  const updateFilter = useCallback((key, value) => {
    setFilters((previous) => ({
      ...previous,
      [key]: value,
    }));
  }, []);

  const toggleArrayFilter = useCallback((key, value) => {
    setFilters((previous) => {
      const current = previous[key];

      return {
        ...previous,
        [key]: current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });
  }, []);

  const handleSkillsChange = (value) => {
    setSkillsInput(value);

    updateFilter(
      "skills",
      [...new Set(
        value
          .split(",")
          .map((skill) => skill.trim().toLowerCase())
          .filter(Boolean)
      )]
    );
  };

  const clearFilters = () => {
    setFilters({
      ...initialFilters,
      employmentType: [],
      workSpaceType: [],
      skills: [],
    });

    setSkillsInput("");
    setSearch("");
    setLocation("");
  };

  const handleSearch = (event) => {
    event.preventDefault();
  };

  const retryFetch = () => {
    abortActiveRequest();
    pageRef.current = 1;
    updateHasMore(true);
    setRefreshKey((value) => value + 1);
  };

  const totalJobs = jobPagination?.totalJobs ?? jobs.length;

  const onlineCount = jobs.filter((job) => {
    const type = String(
      job?.workSpaceType || job?.workMode || ""
    ).toUpperCase();

    return type === "REMOTE";
  }).length;

  const internshipCount = jobs.filter((job) => {
    const type = String(
      job?.employmentType || ""
    ).toUpperCase();

    return type === "INTERNSHIP";
  }).length;

  const newJobCount = jobs.filter((job) => {
    const date = new Date(job?.createdAt || job?.postedAt || 0);

    return (
      !Number.isNaN(date.getTime()) &&
      date.getTime() >= Date.now() - 7 * 86400000
    );
  }).length;

  const resetSingleFilter = (key, value) => {
    if (key === "search") {
      setSearch("");
    } else if (key === "location") {
      setLocation("");
    } else if (
      key === "employmentType" ||
      key === "workSpaceType"
    ) {
      toggleArrayFilter(key, value);
    } else if (key === "skills") {
      updateFilter(
        "skills",
        filters.skills.filter((skill) => skill !== value)
      );

      setSkillsInput((current) =>
        current
          .split(",")
          .map((skill) => skill.trim())
          .filter(
            (skill) => skill && skill.toLowerCase() !== value
          )
          .join(", ")
      );
    } else {
      updateFilter(key, initialFilters[key]);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC] px-4 py-5 text-slate-900 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1500px] space-y-7">

        {/* Page header */}
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-violet-700">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-600" />
              Peer.Hiring · Career workspace
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Find your next
              <span className="text-violet-600"> opportunity.</span>
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Explore meaningful opportunities, discover great teams,
              and find a role that moves your career forward.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={retryFetch}
              disabled={isLoading}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={isLoading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <div className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700">
              <BriefcaseBusiness size={17} className="text-violet-600" />
              {totalJobs.toLocaleString("en-IN")} opportunities
            </div>
          </div>
        </header>

        {/* Hero banner */}
        <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-[#24104F] via-[#5125A5] to-[#7C3AED] p-6 text-white shadow-xl shadow-violet-200/50 sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-12 -top-24 -z-10 h-72 w-72 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-24 right-1/3 -z-10 h-56 w-56 rounded-full bg-fuchsia-400/20 blur-3xl" />
          <div className="pointer-events-none absolute right-12 top-8 -z-10 h-36 w-36 rounded-full bg-violet-300/10 blur-2xl" />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-violet-100">
                <Sparkles size={14} />
                Your next chapter starts here
              </div>

              <h2 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                Great careers begin
                <br className="hidden sm:block" />
                with the right opportunity.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-violet-100/90">
                Find roles that match your strengths, explore different
                work styles, and take the next step with confidence.
              </p>

              <button
                type="button"
                onClick={() => {
                  setFilters((previous) => ({
                    ...previous,
                    workSpaceType: previous.workSpaceType.includes("REMOTE")
                      ? previous.workSpaceType
                      : [...previous.workSpaceType, "REMOTE"],
                  }));

                  document
                    .getElementById("job-results")
                    ?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                <Laptop size={17} />
                Explore remote jobs
                <ArrowUpRight size={15} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-[310px]">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-violet-100">
                  <BriefcaseBusiness size={20} />
                </div>
                <p className="mt-4 text-3xl font-bold">
                  {totalJobs.toLocaleString("en-IN")}
                </p>
                <p className="mt-1 text-xs font-medium text-violet-100">
                  Matching opportunities
                </p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-violet-100">
                  <Clock3 size={20} />
                </div>
                <p className="mt-4 text-3xl font-bold">
                  {newJobCount}
                </p>
                <p className="mt-1 text-xs font-medium text-violet-100">
                  New in the last 7 days
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Metrics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={BriefcaseBusiness}
            label="Available opportunities"
            value={totalJobs.toLocaleString("en-IN")}
            caption="Total matching jobs from your search"
            tone="bg-violet-50 text-violet-700"
          />

          <MetricCard
            icon={Laptop}
            label="Remote opportunities"
            value={onlineCount}
            caption="Remote jobs in the currently loaded results"
            tone="bg-blue-50 text-blue-700"
          />

          <MetricCard
            icon={GraduationCap}
            label="Internships"
            value={internshipCount}
            caption="Internship listings in the loaded results"
            tone="bg-emerald-50 text-emerald-700"
          />

          <MetricCard
            icon={TrendingUp}
            label="Recently posted"
            value={newJobCount}
            caption="Jobs posted within the last seven days"
            tone="bg-amber-50 text-amber-700"
          />
        </section>

        {/* Search panel */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900">
              Discover your next role
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Search by title, skill, company, or location.
            </p>
          </div>

          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_0.75fr_auto]">
              <label className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-violet-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-violet-100">
                <Search size={19} className="shrink-0 text-slate-400" />

                <span className="sr-only">Search jobs and skills</span>

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Job title, skills, or keywords"
                  className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="text-slate-400 hover:text-slate-700"
                  >
                    <X size={16} />
                  </button>
                )}
              </label>

              <label className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-violet-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-violet-100">
                <MapPin size={19} className="shrink-0 text-slate-400" />

                <span className="sr-only">Filter by location</span>

                <input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="City, state, or country"
                  className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
                />

                {location && (
                  <button
                    type="button"
                    onClick={() => setLocation("")}
                    aria-label="Clear location"
                    className="text-slate-400 hover:text-slate-700"
                  >
                    <X size={16} />
                  </button>
                )}
              </label>

              <button
                type="submit"
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-violet-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-800 active:scale-[0.98]"
              >
                <Search size={17} />
                Search jobs
              </button>
            </div>
          </form>
        </section>

        {/* Results and filter layout */}
        <section
          id="job-results"
          className="scroll-mt-5 space-y-5"
        >
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-700">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-600" />
                Job discovery
              </div>

              <h2 className="text-xl font-bold tracking-tight text-slate-950">
                Explore opportunities
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Find your fit, one opportunity at a time.
              </p>
            </div>

            <button
              type="button"
              onClick={clearFilters}
              disabled={activeFilterCount === 0}
              className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-40 sm:self-auto"
            >
              <RotateCcw size={14} />
              Reset all filters
            </button>
          </div>

          {/* Mobile filter toolbar */}
          <div className="flex items-center justify-between gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => setFiltersOpen((open) => !open)}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm"
            >
              <SlidersHorizontal size={16} />
              Filters
              {filterCount > 0 && (
                <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs text-violet-700">
                  {filterCount}
                </span>
              )}
              <ChevronDown
                size={15}
                className={`transition ${filtersOpen ? "rotate-180" : ""}`}
              />
            </button>

            <span className="text-xs text-slate-500">
              {jobs.length} loaded
            </span>
          </div>

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[270px_minmax(0,1fr)] xl:grid-cols-[285px_minmax(0,1fr)]">

            {/* Filter sidebar */}
            <aside
              className={`${
                filtersOpen ? "block" : "hidden"
              } rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm lg:sticky lg:top-5 lg:block`}
            >
              <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-xl bg-violet-50 p-2.5 text-violet-700">
                    <SlidersHorizontal size={17} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Refine results
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {filterCount} active filters
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1 text-xs font-bold text-violet-700 hover:text-violet-900"
                >
                  <RotateCcw size={12} />
                  Reset
                </button>
              </div>

              {/* Category */}
              <section className="mb-5">
                <FilterHeading icon={Tag}>Category</FilterHeading>
                <input
                  value={filters.category}
                  onChange={(event) =>
                    updateFilter("category", event.target.value)
                  }
                  placeholder="e.g. Engineering"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-50"
                />
              </section>

              <div className="mb-5 border-t border-slate-100" />

              {/* Employment */}
              <section className="mb-5">
                <FilterHeading icon={BriefcaseBusiness}>
                  Employment type
                </FilterHeading>

                {employmentOptions.map(([value, label]) => (
                  <FilterCheckbox
                    key={value}
                    value={value}
                    label={label}
                    checked={filters.employmentType.includes(value)}
                    onChange={() =>
                      toggleArrayFilter("employmentType", value)
                    }
                  />
                ))}
              </section>

              <div className="mb-5 border-t border-slate-100" />

              {/* Workspace */}
              <section className="mb-5">
                <FilterHeading icon={Laptop}>Work mode</FilterHeading>

                {workspaceOptions.map(([value, label]) => (
                  <FilterCheckbox
                    key={value}
                    value={value}
                    label={label}
                    checked={filters.workSpaceType.includes(value)}
                    onChange={() =>
                      toggleArrayFilter("workSpaceType", value)
                    }
                  />
                ))}
              </section>

              <div className="mb-5 border-t border-slate-100" />

              {/* Experience */}
              <section className="mb-5">
                <FilterHeading icon={GraduationCap}>
                  Experience level
                </FilterHeading>

                <select
                  value={filters.experienceLevel}
                  onChange={(event) =>
                    updateFilter("experienceLevel", event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-50"
                >
                  <option value="">All experience levels</option>
                  {experienceOptions.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </section>

              <div className="mb-5 border-t border-slate-100" />

              {/* Skills */}
              <section className="mb-5">
                <FilterHeading icon={Sparkles}>Skills</FilterHeading>

                <input
                  value={skillsInput}
                  onChange={(event) =>
                    handleSkillsChange(event.target.value)
                  }
                  placeholder="React, Node.js, SQL"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-50"
                />

                <p className="mt-2 text-[11px] leading-4 text-slate-400">
                  Separate skills with commas.
                </p>
              </section>

              <div className="mb-5 border-t border-slate-100" />

              {/* Salary */}
              <section className="mb-5">
                <FilterHeading icon={Banknote}>
                  Salary range (₹)
                </FilterHeading>

                <div className="grid grid-cols-2 gap-2">
                  <label className="min-w-0">
                    <span className="mb-1.5 block text-xs text-slate-500">
                      Minimum
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={filters.minSalary}
                      onChange={(event) =>
                        updateFilter("minSalary", event.target.value)
                      }
                      placeholder="0"
                      className="w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2.5 text-sm outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-50"
                    />
                  </label>

                  <label className="min-w-0">
                    <span className="mb-1.5 block text-xs text-slate-500">
                      Maximum
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={filters.maxSalary}
                      onChange={(event) =>
                        updateFilter("maxSalary", event.target.value)
                      }
                      placeholder="Any"
                      className="w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2.5 text-sm outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-50"
                    />
                  </label>
                </div>

                {filters.minSalary !== "" &&
                  filters.maxSalary !== "" &&
                  Number(filters.minSalary) > Number(filters.maxSalary) && (
                    <p className="mt-2 text-xs text-rose-600">
                      Minimum salary cannot exceed maximum salary.
                    </p>
                  )}

                <p className="mt-2 text-[11px] leading-4 text-slate-400">
                  Use the same salary units as your database.
                </p>
              </section>

              <div className="mb-5 border-t border-slate-100" />

              {/* Posted date */}
              <section>
                <FilterHeading icon={CalendarDays}>
                  Date posted
                </FilterHeading>

                <select
                  value={filters.postedWithin}
                  onChange={(event) =>
                    updateFilter("postedWithin", event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-50"
                >
                  {postedOptions.map(([value, label]) => (
                    <option key={value || "all"} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </section>

              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="mt-6 w-full rounded-xl bg-violet-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-violet-800 lg:hidden"
              >
                Show results
              </button>
            </aside>

            {/* Results */}
            <div className="min-w-0 space-y-4">
              {/* Results toolbar */}
              <div className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      Job opportunities
                    </h3>
                    <span className="rounded-lg bg-violet-50 px-2 py-1 text-[11px] font-bold text-violet-700">
                      {jobs.length} loaded
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    {totalJobs.toLocaleString("en-IN")} matching jobs
                    {filterCount > 0
                      ? ` · ${filterCount} active filters`
                      : ""}
                  </p>
                </div>

                <label className="flex items-center gap-2 text-xs text-slate-500">
                  <ListFilter size={15} />
                  Sort by

                  <select
                    value={filters.sortBy}
                    onChange={(event) =>
                      updateFilter("sortBy", event.target.value)
                    }
                    className="max-w-[190px] rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-violet-300"
                  >
                    {sortOptions.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {/* Active filter chips */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200/70 bg-white p-3">
                  {search && (
                    <button
                      type="button"
                      onClick={() => resetSingleFilter("search")}
                      className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-800"
                    >
                      <span className="truncate">
                        Search: {search}
                      </span>
                      <X size={12} />
                    </button>
                  )}

                  {location && (
                    <button
                      type="button"
                      onClick={() => resetSingleFilter("location")}
                      className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-800"
                    >
                      <span className="truncate">
                        Location: {location}
                      </span>
                      <X size={12} />
                    </button>
                  )}

                  {filters.category && (
                    <button
                      type="button"
                      onClick={() => resetSingleFilter("category")}
                      className="inline-flex items-center gap-1.5 rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-800"
                    >
                      {filters.category}
                      <X size={12} />
                    </button>
                  )}

                  {filters.employmentType.map((value) => (
                    <button
                      type="button"
                      key={value}
                      onClick={() =>
                        resetSingleFilter("employmentType", value)
                      }
                      className="inline-flex items-center gap-1.5 rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-800"
                    >
                      {value.replaceAll("_", " ")}
                      <X size={12} />
                    </button>
                  ))}

                  {filters.workSpaceType.map((value) => (
                    <button
                      type="button"
                      key={value}
                      onClick={() =>
                        resetSingleFilter("workSpaceType", value)
                      }
                      className="inline-flex items-center gap-1.5 rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-800"
                    >
                      {getWorkspaceLabel(value)}
                      <X size={12} />
                    </button>
                  ))}

                  {filters.skills.map((value) => (
                    <button
                      type="button"
                      key={value}
                      onClick={() => resetSingleFilter("skills", value)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-800"
                    >
                      {value}
                      <X size={12} />
                    </button>
                  ))}

                  {filters.experienceLevel && (
                    <button
                      type="button"
                      onClick={() =>
                        resetSingleFilter("experienceLevel")
                      }
                      className="inline-flex items-center gap-1.5 rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-800"
                    >
                      {getExperienceLabel(filters.experienceLevel)}
                      <X size={12} />
                    </button>
                  )}

                  {(filters.minSalary !== "" ||
                    filters.maxSalary !== "") && (
                    <button
                      type="button"
                      onClick={() => {
                        updateFilter("minSalary", "");
                        updateFilter("maxSalary", "");
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-800"
                    >
                      Salary range
                      <X size={12} />
                    </button>
                  )}

                  {filters.postedWithin && (
                    <button
                      type="button"
                      onClick={() => resetSingleFilter("postedWithin")}
                      className="inline-flex items-center gap-1.5 rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-800"
                    >
                      {postedOptions.find(
                        ([value]) => value === filters.postedWithin
                      )?.[1] || filters.postedWithin}
                      <X size={12} />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="px-2 py-1.5 text-xs font-bold text-slate-500 hover:text-violet-700"
                  >
                    Clear all
                  </button>
                </div>
              )}

              {/* Error */}
              {requestError && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
                >
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />

                  <div className="flex-1">
                    <p className="font-bold">
                      We couldn't load the opportunities.
                    </p>
                    <p className="mt-1 leading-5">
                      {requestError}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={retryFetch}
                    className="shrink-0 rounded-lg bg-white px-3 py-2 text-xs font-bold text-rose-700 shadow-sm hover:bg-rose-100"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Job cards */}
              <div className="space-y-4">
                {jobs.map((job) => (
                  <JobItem key={getJobId(job)} job={job} />
                ))}
              </div>

              {/* Loading */}
              {isLoading && (
                <div className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white py-10 text-sm text-slate-500">
                  <LoaderCircle
                    className="animate-spin text-violet-600"
                    size={21}
                  />
                  Finding the right opportunities...
                </div>
              )}

              {/* Empty state */}
              {!isLoading &&
                !requestError &&
                jobs.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                      <Search size={26} />
                    </div>

                    <h3 className="mt-5 text-lg font-bold text-slate-900">
                      No matching opportunities
                    </h3>

                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                      Try another keyword, broaden your location,
                      or remove some filters to discover more roles.
                    </p>

                    <button
                      type="button"
                      onClick={clearFilters}
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-800"
                    >
                      <RotateCcw size={15} />
                      Clear all filters
                    </button>
                  </div>
                )}

              {/* Infinite scroll sentinel */}
              <div ref={sentinelRef} className="h-5" />

              {!isLoading && !requestError && !hasMore && jobs.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-6 text-center">
                  <CheckCircle2
                    size={19}
                    className="mx-auto text-violet-600"
                  />
                  <p className="mt-2 text-sm font-semibold text-slate-700">
                    You've reached the end
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    You're all caught up with the current results.
                  </p>
                </div>
              )}

              {/* Selected job details */}
              {selectedJobs && (
                <JobDetails
                  job={selectedJobs}
                  onClose={() => setSelectedJobs(null)}
                />
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default JobLayout;
