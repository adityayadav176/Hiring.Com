
import {
  createContext,
  useCallback,
  useState,
} from "react";

export const ReportContext = createContext(null);

const ReportProvider = ({ children }) => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [reports, setReports] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reportsPagination, setReportsPagination] = useState({
    totalReports: 0,
    currentPage: 1,
    totalPages: 0,
    limit: 10,
  });

  const request = useCallback(
    async (url, options = {}) => {
      if (!API_URL) {
        throw new Error("VITE_API_URL is not configured");
      }

      const response = await fetch(`${API_URL}${url}`, {
        credentials: "include",
        ...options,
        headers: {
          ...(options.body ? { "Content-Type": "application/json" } : {}),
          ...options.headers,
        },
      });

      let data;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(
          data?.message || `Request failed (${response.status})`
        );
      }

      return data;
    },
    [API_URL]
  );

  // Get reports with pagination and optional filters.
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
  } = {}) => {
    const params = new URLSearchParams();

    params.set("page", String(page));
    params.set("limit", String(limit));
    params.set("sortBy", sortBy);
    params.set("order", sortOrder);

    if (status) params.set("status", status);
    if (reason) params.set("reason", reason);
    if (search) params.set("search", search);
    if (targetType) params.set("targetType", targetType);

    const data = await request(`/reports?${params.toString()}`);

    const fetchedReports = data?.data?.reports ?? [];
    const pagination = data?.data?.pagination ?? {};

    setReports(fetchedReports);
    setReportsPagination((prev) => ({
      ...prev,
      ...pagination,
    }));

    return fetchedReports;
  },
  [request]
);

  // Get one report.
  const handleGetReportById = useCallback(
    async ({ reportId }) => {
      if (!reportId) {
        throw new Error("Report ID is required");
      }

      const data = await request(
        `/reports/${encodeURIComponent(reportId)}`
      );

      const report = data?.data;

      if (!report) {
        throw new Error("Report data was not returned by the server");
      }

      setSelected(report);
      return report;
    },
    [request]
  );

  // Shared implementation for resolving and rejecting.
  const updateReportStatus = useCallback(
    async ({ reportId, action, adminNote = "" }) => {
      if (!reportId) {
        throw new Error("Report ID is required");
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
        throw new Error("Updated report was not returned by the server");
      }

      const updatedId = String(updatedReport._id);

      setReports((prev) =>
        prev.map((item) =>
          String(item._id) === updatedId ? updatedReport : item
        )
      );

      setSelected((prev) =>
        prev && String(prev._id) === updatedId
          ? updatedReport
          : prev
      );

      return updatedReport;
    },
    [request]
  );

  const handleResolveReport = useCallback(
    ({ reportId, adminNote = "" }) =>
      updateReportStatus({
        reportId,
        action: "resolve",
        adminNote,
      }),
    [updateReportStatus]
  );

  const handleRejectReport = useCallback(
    ({ reportId, adminNote = "" }) =>
      updateReportStatus({
        reportId,
        action: "reject",
        adminNote,
      }),
    [updateReportStatus]
  );

  // Create a report as a signed-in user.
  
const handleCreateReport = useCallback(
  async ({
    reportedUser = null,
    reportedJob = null,
    reason,
    description = "",
  }) => {
    if (!reason?.trim()) {
      throw new Error("Reason is required.");
    }

    if (!reportedUser && !reportedJob) {
      throw new Error("A reported user or job is required.");
    }

    if (reportedUser && reportedJob) {
      throw new Error("Report a user or a job, not both.");
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
      console.error("Unexpected create-report response:", response);
      throw new Error(
        "The server did not return the created report. Check the backend response."
      );
    }

    setSelected(report);
    return report;
  },
  [request, setSelected]
);


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
