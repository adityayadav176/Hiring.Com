
import {
  createContext,
  useCallback,
  useRef,
  useState,
} from "react";

export const ReportContext = createContext(null);

const INITIAL_PAGINATION = {
  totalReports: 0,
  currentPage: 1,
  totalPages: 0,
  limit: 10,
};

const GET_CACHE_TTL = 1500;

// Avoid unnecessary state updates when JSON data is equivalent.
const setStateIfChanged = (setter, nextValue) => {
  setter((previous) => {
    const next =
      typeof nextValue === "function"
        ? nextValue(previous)
        : nextValue;

    if (Object.is(previous, next)) return previous;

    try {
      if (JSON.stringify(previous) === JSON.stringify(next)) {
        return previous;
      }
    } catch {
      // Apply the update normally if comparison is not possible.
    }

    return next;
  });
};

const ReportProvider = ({ children }) => {
  const API_URL = (
    import.meta.env.VITE_API_URL || ""
  ).replace(/\/+$/, "");

  const [reports, setReports] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reportsPagination, setReportsPagination] =
    useState(INITIAL_PAGINATION);

  // Deduplicate concurrent GET requests and cache brief responses.
  const inFlightRef = useRef(new Map());
  const cacheRef = useRef(new Map());

  const invalidateReportCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  // --------------------------------------------------
  // SHARED REQUEST HELPER
  // --------------------------------------------------

  const request = useCallback(
    async (path, options = {}) => {
      const {
        skipCache = false,
        cacheTtl = GET_CACHE_TTL,
        ...fetchOptions
      } = options;

      if (!API_URL) {
        throw new Error(
          "VITE_API_URL is not configured."
        );
      }

      const method = (
        fetchOptions.method || "GET"
      ).toUpperCase();

      const isGet = method === "GET";

      const normalizedPath = path.startsWith("/")
        ? path
        : `/${path}`;

      const url = `${API_URL}${normalizedPath}`;
      const cacheKey = url;

      if (isGet && !skipCache && cacheTtl > 0) {
        const cached = cacheRef.current.get(cacheKey);

        if (cached && cached.expiresAt > Date.now()) {
          return cached.data;
        }

        if (cached) {
          cacheRef.current.delete(cacheKey);
        }
      }

      if (isGet && !skipCache) {
        const pending = inFlightRef.current.get(cacheKey);

        if (pending) return pending;
      }

      const execute = async () => {
        const response = await fetch(url, {
          credentials: "include",
          ...fetchOptions,
          headers: {
            ...(fetchOptions.body
              ? { "Content-Type": "application/json" }
              : {}),
            ...fetchOptions.headers,
          },
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            data?.message ||
              `Request failed (${response.status})`
          );
        }

        if (!isGet) {
          invalidateReportCache();
        } else if (!skipCache && cacheTtl > 0) {
          cacheRef.current.set(cacheKey, {
            data,
            expiresAt: Date.now() + cacheTtl,
          });
        }

        return data;
      };

      if (!isGet || skipCache) {
        return execute();
      }

      const pending = execute();
      inFlightRef.current.set(cacheKey, pending);

      try {
        return await pending;
      } finally {
        if (inFlightRef.current.get(cacheKey) === pending) {
          inFlightRef.current.delete(cacheKey);
        }
      }
    },
    [API_URL, invalidateReportCache]
  );

  // --------------------------------------------------
  // GET REPORTS
  // --------------------------------------------------

  const handleGetReports = useCallback(
    async ({
      page = 1,
      limit = 10,
      status = "",
      reason = "",
      search = "",
      targetType = "",
      sortBy = "createdAt",
      sortOrder = "desc",
      forceRefresh = false,
    } = {}) => {
      const params = new URLSearchParams();

      params.set("page", String(page));
      params.set("limit", String(limit));
      params.set("sortBy", sortBy);
      params.set("order", sortOrder);

      if (status) params.set("status", status);
      if (reason) params.set("reason", reason);

      const normalizedSearch = String(search || "").trim();
      if (normalizedSearch) {
        params.set("search", normalizedSearch);
      }

      if (targetType) {
        params.set("targetType", targetType);
      }

      const data = await request(
        `/reports?${params.toString()}`,
        { skipCache: forceRefresh }
      );

      const fetchedReports = data?.data?.reports ?? [];
      const pagination = data?.data?.pagination ?? {};

      setStateIfChanged(setReports, fetchedReports);

      setStateIfChanged(setReportsPagination, (previous) => ({
        ...previous,
        ...pagination,
      }));

      return fetchedReports;
    },
    [request]
  );

  // --------------------------------------------------
  // GET ONE REPORT
  // --------------------------------------------------

  const handleGetReportById = useCallback(
    async ({ reportId, forceRefresh = false } = {}) => {
      if (!reportId) {
        throw new Error("Report ID is required.");
      }

      const data = await request(
        `/reports/${encodeURIComponent(reportId)}`,
        { skipCache: forceRefresh }
      );

      const report = data?.data;

      if (!report) {
        throw new Error(
          "Report data was not returned by the server."
        );
      }

      setStateIfChanged(setSelected, report);

      return report;
    },
    [request]
  );

  // --------------------------------------------------
  // RESOLVE / REJECT REPORT
  // --------------------------------------------------

  const updateReportStatus = useCallback(
    async ({ reportId, action, adminNote = "" } = {}) => {
      if (!reportId) {
        throw new Error("Report ID is required.");
      }

      if (!["resolve", "reject"].includes(action)) {
        throw new Error("Invalid report action.");
      }

      const data = await request(
        `/reports/${encodeURIComponent(reportId)}/${action}`,
        {
          method: "PATCH",
          body: JSON.stringify({ adminNote }),
        }
      );

      const updatedReport = data?.data;

      if (!updatedReport?._id) {
        throw new Error(
          "The updated report was not returned by the server."
        );
      }

      const updatedId = String(updatedReport._id);

      setStateIfChanged(setReports, (previous) =>
        previous.map((item) =>
          String(item._id) === updatedId
            ? updatedReport
            : item
        )
      );

      setStateIfChanged(setSelected, (previous) =>
        previous && String(previous._id) === updatedId
          ? updatedReport
          : previous
      );

      return updatedReport;
    },
    [request]
  );

  const handleResolveReport = useCallback(
    ({ reportId, adminNote = "" } = {}) =>
      updateReportStatus({
        reportId,
        action: "resolve",
        adminNote,
      }),
    [updateReportStatus]
  );

  const handleRejectReport = useCallback(
    ({ reportId, adminNote = "" } = {}) =>
      updateReportStatus({
        reportId,
        action: "reject",
        adminNote,
      }),
    [updateReportStatus]
  );

  // --------------------------------------------------
  // CREATE REPORT
  // --------------------------------------------------

  const handleCreateReport = useCallback(
    async ({
      reportedUser = null,
      reportedJob = null,
      reason,
      description = "",
    } = {}) => {
      if (!reason?.trim()) {
        throw new Error("Reason is required.");
      }

      if (!reportedUser && !reportedJob) {
        throw new Error(
          "A reported user or job is required."
        );
      }

      if (reportedUser && reportedJob) {
        throw new Error(
          "Report a user or a job, not both."
        );
      }

      const payload = {
        reason: reason.trim(),
        description: description.trim(),
        ...(reportedUser ? { reportedUser } : {}),
        ...(reportedJob ? { reportedJob } : {}),
      };

      const response = await request("/reports/create", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const report =
        response?.data?.report ??
        response?.data ??
        response?.report;

      if (!report?._id) {
        console.error(
          "Unexpected create-report response:",
          response
        );

        throw new Error(
          "The server did not return the created report. Check the backend response."
        );
      }

      setStateIfChanged(setSelected, report);

      return report;
    },
    [request]
  );

  // --------------------------------------------------
  // CONTEXT VALUE
  // --------------------------------------------------

  return (
    <ReportContext.Provider
      value={{
        reports,
        selected,
        reportsPagination,

        setReports,
        setSelected,
        setReportsPagination,

        handleGetReports,
        handleGetReportById,
        handleResolveReport,
        handleRejectReport,
        handleCreateReport,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export default ReportProvider;
