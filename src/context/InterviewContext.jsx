
import { createContext, useCallback, useState } from "react";

export const InterviewContext = createContext(null);

const InterviewProvider = ({ children }) => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [interview, setInterview] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [interviewPagination, setInterviewPagination] = useState(null);

  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [upcomingInterviewPagination, setUpcomingInterviewPagination] = useState(null);

  const [todayInterviews, setTodayInterviews] = useState([]);
  const [todayInterviewsPagination, setTodayInterviewsPagination] = useState(null);

  const [recruiterInterviews, setRecruiterInterviews] = useState([]);
  const [recruiterInterviewPagination, setRecruiterInterviewPagination] = useState(null);
  const [recruiterInterviewStats, setRecruiterInterviewStats] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(
    async (path, options = {}) => {
      const response = await fetch(`${API_URL}/interview${path}`, {
        credentials: "include",
        ...options,
        headers: {
          ...(options.body ? { "Content-Type": "application/json" } : {}),
          ...options.headers,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || "Something went wrong");
      }

      return data;
    },
    [API_URL]
  );

  const getListData = (data) => ({
    interviews: data?.data?.interviews ?? [],
    pagination: data?.data?.pagination ?? null,
  });

  const handleScheduleInterview = useCallback(
    async ({ details }) => {
      setLoading(true);
      setError(null);

      try {
        const data = await request("/recruiter", {
          method: "POST",
          body: JSON.stringify(details),
        });

        const createdInterview = data?.data?.interview ?? data?.data;

        if (createdInterview?._id) {
          setInterviews((prev) => [
            createdInterview,
            ...prev.filter((item) => item._id !== createdInterview._id),
          ]);

          setRecruiterInterviews((prev) => [
            createdInterview,
            ...prev.filter((item) => item._id !== createdInterview._id),
          ]);

          setInterview(createdInterview);
        }

        return createdInterview;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [request]
  );

  const handleGetInterviewById = useCallback(
    async ({ interviewId }) => {
      if (!interviewId) throw new Error("Interview ID is required");

      setLoading(true);
      setError(null);

      try {
        const data = await request(`/${interviewId}`);
        const result = data?.data?.interview ?? data?.data;

        setInterview(result);
        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [request]
  );

  const handleGetMyInterviews = useCallback(
    async (params = {}) => {
      setLoading(true);
      setError(null);

      try {
        const query = new URLSearchParams(params).toString();
        const data = await request(`/my${query ? `?${query}` : ""}`);
        const result = getListData(data);

        setInterviews(result.interviews);
        setInterviewPagination(result.pagination);

        return result;
      } catch (err) {
        setError(err.message);
        setInterviews([]);
        setInterviewPagination(null);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [request]
  );

  const handleGetUpcomingInterviews = useCallback(
    async (params = {}) => {
      setLoading(true);
      setError(null);

      try {
        const query = new URLSearchParams(params).toString();
        const data = await request(`/upcoming${query ? `?${query}` : ""}`);
        const result = getListData(data);

        setUpcomingInterviews(result.interviews);
        setUpcomingInterviewPagination(result.pagination);

        return result;
      } catch (err) {
        setError(err.message);
        setUpcomingInterviews([]);
        setUpcomingInterviewPagination(null);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [request]
  );

  const handleGetTodayInterviews = useCallback(
    async (params = {}) => {
      setLoading(true);
      setError(null);

      try {
        const query = new URLSearchParams(params).toString();
        const data = await request(`/today${query ? `?${query}` : ""}`);
        const result = getListData(data);

        setTodayInterviews(result.interviews);
        setTodayInterviewsPagination(result.pagination);

        return result;
      } catch (err) {
        setError(err.message);
        setTodayInterviews([]);
        setTodayInterviewsPagination(null);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [request]
  );

  const handleRescheduleInterview = useCallback(
    async ({ interviewId, scheduledAt, rescheduleReason = "" }) => {
      if (!interviewId) throw new Error("Interview ID is required");
      if (!scheduledAt) throw new Error("New scheduled date is required");

      setLoading(true);
      setError(null);

      try {
        const data = await request(
          `/recruiter/${interviewId}/reschedule`,
          {
            method: "PATCH",
            body: JSON.stringify({ scheduledAt, rescheduleReason }),
          }
        );

        const updated = data?.data?.interview ?? data?.data;
        handleUpdateInterviewState(updated);

        return updated;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [request]
  );

  const handleChangeInterviewStatus = useCallback(
    async ({
      interviewId,
      status,
      cancellationReason = "",
      notes,
      recommendation,
      feedback,
    }) => {
      if (!interviewId) throw new Error("Interview ID is required");
      if (!status) throw new Error("Interview status is required");

      setLoading(true);
      setError(null);

      try {
        const body = {
          status,
          ...(cancellationReason ? { cancellationReason } : {}),
          ...(notes !== undefined ? { notes } : {}),
          ...(recommendation !== undefined ? { recommendation } : {}),
          ...(feedback !== undefined ? { feedback } : {}),
        };

        const data = await request(
          `/recruiter/${interviewId}/status`,
          {
            method: "PATCH",
            body: JSON.stringify(body),
          }
        );

        const updated = data?.data?.interview ?? data?.data;
        handleUpdateInterviewState(updated);

        return updated;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [request]
  );

  const handleUpdateInterviewState = useCallback((updated) => {
    if (!updated?._id) return;

    setInterview((prev) =>
      prev?._id === updated._id ? updated : prev
    );

    setInterviews((prev) =>
      prev.map((item) => item._id === updated._id ? updated : item)
    );

    setUpcomingInterviews((prev) =>
      prev.map((item) => item._id === updated._id ? updated : item)
    );

    setTodayInterviews((prev) =>
      prev.map((item) => item._id === updated._id ? updated : item)
    );

    setRecruiterInterviews((prev) =>
      prev.map((item) => item._id === updated._id ? updated : item)
    );
  }, []);

  const handleGetInterviewsByJob = useCallback(
    async ({ jobId, ...params }) => {
      if (!jobId) throw new Error("Job ID is required");

      setLoading(true);
      setError(null);

      try {
        const query = new URLSearchParams(params).toString();
        const data = await request(
          `/recruiter/job/${jobId}${query ? `?${query}` : ""}`
        );

        const result = getListData(data);
        setRecruiterInterviews(result.interviews);
        setRecruiterInterviewPagination(result.pagination);

        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [request]
  );

  const handleGetInterviewsByApplication = useCallback(
    async ({ applicationId, ...params }) => {
      if (!applicationId) throw new Error("Application ID is required");

      setLoading(true);
      setError(null);

      try {
        const query = new URLSearchParams(params).toString();
        const data = await request(
          `/application/${applicationId}${query ? `?${query}` : ""}`
        );

        const result = getListData(data);
        setInterviews(result.interviews);
        setInterviewPagination(result.pagination);

        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [request]
  );

  const handleGetRecruiterInterviews = useCallback(
    async (params = {}) => {
      setLoading(true);
      setError(null);

      try {
        const query = new URLSearchParams(params).toString();
        const data = await request(`/recruiter${query ? `?${query}` : ""}`);
        const result = getListData(data);

        setRecruiterInterviews(result.interviews);
        setRecruiterInterviewPagination(result.pagination);

        return result;
      } catch (err) {
        setError(err.message);
        setRecruiterInterviews([]);
        setRecruiterInterviewPagination(null);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [request]
  );

  const handleGetRecruiterInterviewById = useCallback(
    async ({ interviewId }) => {
      if (!interviewId) throw new Error("Interview ID is required");

      setLoading(true);
      setError(null);

      try {
        const data = await request(`/recruiter/${interviewId}`);
        const result = data?.data?.interview ?? data?.data;

        setInterview(result);
        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [request]
  );

  const handleGetRecruiterInterviewsByCandidate = useCallback(
    async ({ candidateId, ...params }) => {
      if (!candidateId) throw new Error("Candidate ID is required");

      setLoading(true);
      setError(null);

      try {
        const query = new URLSearchParams(params).toString();
        const data = await request(
          `/recruiter/candidate/${candidateId}${query ? `?${query}` : ""}`
        );

        const result = getListData(data);
        setRecruiterInterviews(result.interviews);
        setRecruiterInterviewPagination(result.pagination);

        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [request]
  );

  const handleGetRecruiterInterviewStats = useCallback(
    async (params = {}) => {
      setLoading(true);
      setError(null);

      try {
        const query = new URLSearchParams(params).toString();
        const data = await request(
          `/recruiter/stats${query ? `?${query}` : ""}`
        );

        setRecruiterInterviewStats(data?.data ?? null);
        return data?.data;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [request]
  );

  const handleCancelRecruiterInterview = useCallback(
    async ({ interviewId, cancellationReason = "" }) => {
      if (!interviewId) throw new Error("Interview ID is required");

      setLoading(true);
      setError(null);

      try {
        const data = await request(
          `/recruiter/${interviewId}/cancel`,
          {
            method: "PATCH",
            body: JSON.stringify({ cancellationReason }),
          }
        );

        const updated = data?.data?.interview ?? data?.data;
        handleUpdateInterviewState(updated);

        return updated;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [request, handleUpdateInterviewState]
  );

  const clearInterviewState = useCallback(() => {
    setInterview(null);
    setInterviews([]);
    setInterviewPagination(null);
    setUpcomingInterviews([]);
    setUpcomingInterviewPagination(null);
    setTodayInterviews([]);
    setTodayInterviewsPagination(null);
    setRecruiterInterviews([]);
    setRecruiterInterviewPagination(null);
    setRecruiterInterviewStats(null);
    setError(null);
  }, []);

  const value = {
    interview,
    setInterview,
    interviews,
    setInterviews,
    interviewPagination,
    setInterviewPagination,
    upcomingInterviews,
    setUpcomingInterviews,
    upcomingInterviewPagination,
    setUpcomingInterviewPagination,
    todayInterviews,
    setTodayInterviews,
    todayInterviewsPagination,
    setTodayInterviewsPagination,
    recruiterInterviews,
    setRecruiterInterviews,
    recruiterInterviewPagination,
    setRecruiterInterviewPagination,
    recruiterInterviewStats,
    setRecruiterInterviewStats,
    loading,
    error,
    handleScheduleInterview,
    handleGetInterviewById,
    handleGetMyInterviews,
    handleGetUpcomingInterviews,
    handleGetTodayInterviews,
    handleRescheduleInterview,
    handleChangeInterviewStatus,
    handleGetInterviewsByJob,
    handleGetInterviewsByApplication,
    handleGetRecruiterInterviews,
    handleGetRecruiterInterviewById,
    handleGetRecruiterInterviewsByCandidate,
    handleGetRecruiterInterviewStats,
    handleCancelRecruiterInterview,
    clearInterviewState,
  };

  return (
    <InterviewContext.Provider value={value}>
      {children}
    </InterviewContext.Provider>
  );
};

export default InterviewProvider;
