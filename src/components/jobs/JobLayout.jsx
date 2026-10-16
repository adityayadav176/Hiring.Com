import {
  Bookmark,
  MapPin,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import JobItem from "./JobItem";
import JobDetails from "./JobDetails";
import { useJob } from "../../hooks/Hook";

const initialFilters = {
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
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const sentinelRef = useRef(null);
  const requestIdRef = useRef(0);
  const loadingRef = useRef(false);
  const pageRef = useRef(1);

  const fetchJobs = useCallback(
    async (pageNumber = 1, append = false) => {
      if (loadingRef.current) return;

      loadingRef.current = true;
      setIsLoadingMore(true);

      const requestId = ++requestIdRef.current;

      try {
        const response = await handleGetAllJobs({
          search: search.trim(),
          location: location.trim(),
          ...filters,
          page: pageNumber,
          limit: PAGE_SIZE,
        });

        if (requestId !== requestIdRef.current) return;

        const responseData = response?.data ?? response;
        const pagination = responseData?.pagination ?? {};

        const returnedJobs = Array.isArray(responseData?.jobs)
          ? responseData.jobs
          : [];

        const nextPageExists =
          pagination.hasNextPage ??
          (pagination.totalPages != null
            ? pageNumber < pagination.totalPages
            : returnedJobs.length === PAGE_SIZE);

        setHasMore(Boolean(nextPageExists));
        setPage(pageNumber);
        pageRef.current = pageNumber;
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
        setHasMore(false);
      } finally {
        if (requestId === requestIdRef.current) {
          loadingRef.current = false;
          setIsLoadingMore(false);
        }
      }
    },
    [handleGetAllJobs, search, location, filters]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      pageRef.current = 1;
      setPage(1);
      setHasMore(true);
      fetchJobs(1, false);
    }, 400);

    return () => {
      clearTimeout(timer);
      requestIdRef.current += 1;
      loadingRef.current = false;
    };
  }, [fetchJobs]);

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel || !hasMore || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        if (loadingRef.current || !hasMore) return;

        fetchJobs(pageRef.current + 1, true);
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0,
      }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [fetchJobs, hasMore, isLoadingMore]);

  const handleFilterChange = (key, value) => {
    setFilters((previous) => {
      const currentValue = previous[key];

      if (Array.isArray(currentValue)) {
        return {
          ...previous,
          [key]: currentValue.includes(value)
            ? currentValue.filter((item) => item !== value)
            : [...currentValue, value],
        };
      }

      return {
        ...previous,
        [key]: currentValue === value ? "" : value,
      };
    });
  };

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setFilters({ ...initialFilters });
    setPage(1);
    pageRef.current = 1;
    setHasMore(true);
  };

  const handleSearch = () => {
    setPage(1);
    pageRef.current = 1;
    setHasMore(true);
    fetchJobs(1, false);
  };

  return (
    <div className="min-h-full bg-[#F4F4F8] px-4 py-6 sm:px-6">
      <div className="flex flex-col justify-between gap-4 p-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
            Find your next opportunity
          </h1>
          <p className="mt-1.5 text-sm text-[#64748B]">
            Discover jobs that match your skills, experience and career goals.
          </p>
        </div>

        <button
          type="button"
          className="flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
        >
          <Bookmark size={17} />
          Saved Jobs
        </button>
      </div>

      {/* Search */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleSearch();
        }}
        className="mb-8 mt-3 flex flex-col gap-3 rounded-2xl bg-white px-3 py-3 shadow-sm lg:flex-row lg:gap-4"
      >
        <div className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-[#F8F8FC] px-3 transition focus-within:border-violet-300 focus-within:ring-2 focus-within:ring-violet-100">
          <Search
            size={19}
            strokeWidth={1.8}
            className="shrink-0 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
            placeholder="Search jobs, skills or companies..."
          />
        </div>

        <div className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-[#F8F8FC] px-3 transition focus-within:border-violet-300 focus-within:ring-2 focus-within:ring-violet-100">
          <MapPin
            size={19}
            strokeWidth={1.8}
            className="shrink-0 text-slate-400"
          />

          <input
            type="text"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
            placeholder="Location"
          />
        </div>

        <button
          type="submit"
          className="flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#6D28D9] px-5 text-sm font-semibold text-white shadow-sm shadow-violet-200 transition-all hover:bg-[#5B21B6] hover:shadow-md active:scale-[0.98] lg:w-[180px]"
        >
          <Search size={18} />
          Search Jobs
        </button>
      </form>

      <div className="flex flex-col items-start gap-6 lg:flex-row">
        {/* Filter sidebar */}
        <aside className="h-fit w-full shrink-0 rounded-2xl border border-slate-100 bg-white px-6 py-6 shadow-sm lg:sticky lg:top-4 lg:w-[235px]">
          <div className="mb-5 flex justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={17} className="text-violet-700" />
              <span className="text-sm font-medium">Filter</span>
            </div>

            <button
              type="button"
              onClick={clearFilters}
              className="cursor-pointer text-sm font-medium text-violet-700 hover:underline"
            >
              Clear
            </button>
          </div>

          {/* Job type */}
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Job Type
          </h3>

          <div>
            {[
              ["FULL_TIME", "Full-time"],
              ["PART_TIME", "Part-time"],
              ["INTERNSHIP", "Internship"],
              ["CONTRACT", "Contract"],
              ["FREELANCE", "Freelance"],
            ].map(([value, label]) => (
              <label
                key={value}
                className="mb-3 flex cursor-pointer items-center gap-3 text-sm text-slate-600"
              >
                <input
                  type="checkbox"
                  checked={filters.employmentType.includes(value)}
                  onChange={() => handleFilterChange("employmentType", value)}
                  className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-[#6D28D9]"
                />
                {label}
              </label>
            ))}
          </div>

          {/* Work mode */}
          <h3 className="mb-3 mt-8 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Work Mode
          </h3>

          <div>
            {[
              ["REMOTE", "Remote"],
              ["HYBRID", "Hybrid"],
              ["ONSITE", "On-site"],
            ].map(([value, label]) => (
              <label
                key={value}
                className="mb-3 flex cursor-pointer items-center gap-3 text-sm text-slate-600"
              >
                <input
                  type="checkbox"
                  checked={filters.workSpaceType.includes(value)}
                  onChange={() => handleFilterChange("workSpaceType", value)}
                  className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-[#6D28D9]"
                />
                {label}
              </label>
            ))}
          </div>

          {/* Experience */}
          <h3 className="mb-3 mt-8 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Experience
          </h3>

          <div>
            {[
              ["FRESHER", "Entry Level"],
              ["JUNIOR", "1–3 Years"],
              ["MID", "3–5 Years"],
              ["SENIOR", "5+ Years"],
            ].map(([value, label]) => (
              <label
                key={value}
                className="mb-3 flex cursor-pointer items-center gap-3 text-sm text-slate-600"
              >
                <input
                  type="radio"
                  name="experience"
                  checked={filters.experienceLevel === value}
                  onChange={() => handleFilterChange("experienceLevel", value)}
                  className="cursor-pointer accent-[#6D28D9]"
                />
                {label}
              </label>
            ))}
          </div>
        </aside>

        {/* Jobs section */}
        <main className="min-w-0 w-full flex-1">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-800">
                {jobPagination?.totalJobs ?? jobs.length}
              </span>{" "}
              jobs
            </p>

            <select
              value={filters.sortBy}
              onChange={(event) =>
                setFilters((previous) => ({
                  ...previous,
                  sortBy: event.target.value,
                }))
              }
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-300"
            >
              <option value="relevance">Relevance</option>
              <option value="newest">Newest first</option>
              <option value="salaryHigh">Salary: high to low</option>
              <option value="salaryLow">Salary: low to high</option>
            </select>
          </div>

          <div className="space-y-4">
            {jobs.length > 0 ? (
              jobs.map((item) => (
                <JobItem key={item._id} job={item} />
              ))
            ) : !isLoadingMore ? (
              <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center">
                <Search className="mx-auto mb-3 text-slate-400" size={30} />
                <h3 className="font-semibold text-slate-800">
                  No jobs found
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Try changing your search or filters.
                </p>
              </div>
            ) : null}
          </div>

          <div ref={sentinelRef} className="h-8" />

          {isLoadingMore && (
            <p className="py-4 text-center text-sm text-slate-500">
              Loading jobs...
            </p>
          )}

          {!hasMore && jobs.length > 0 && !isLoadingMore && (
            <p className="py-4 text-center text-sm text-slate-500">
              You've reached the end of the results.
            </p>
          )}

          {selectedJobs && (
            <JobDetails
              job={selectedJobs}
              onClose={() => setSelectedJobs(null)}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default JobLayout;