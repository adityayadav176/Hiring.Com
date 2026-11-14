
import {
  createContext,
  useCallback,
  useRef,
  useState,
} from "react";

import { apiRequest } from "../utils/apiRequest";

export const ApplicationContext = createContext(null);

const DEFAULT_PAGINATION = null;
const GET_CACHE_TTL = 1500;

const setStateIfChanged = (setter, nextValue) => {
  setter((previousValue) => {
    const next =
      typeof nextValue === "function"
        ? nextValue(previousValue)
        : nextValue;

    if (Object.is(previousValue, next)) {
      return previousValue;
    }

    try {
      if (JSON.stringify(previousValue) === JSON.stringify(next)) {
        return previousValue;
      }
    } catch {
      // Ignore serialization errors.
    }

    return next;
  });
};

const ApplicationProvider = ({ children }) => {
  const API_URL = (
    import.meta.env.VITE_API_URL || ""
  ).replace(/\/+$/, "");

  const APPLICATIONS_URL = `${API_URL}/applications`;

  const [application, setApplication] = useState(null);
  const [applications, setApplications] = useState([]);
  const [deletedApplications, setDeletedApplications] = useState([]);

  const [myApplicationPagination, setMyApplicationPagination] =
    useState(DEFAULT_PAGINATION);

  const [deletedApplicationPagination, setDeletedApplicationPagination] =
    useState(DEFAULT_PAGINATION);

  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const [jobApplications, setJobApplications] = useState([]);
  const [jobApplicationPagination, setJobApplicationPagination] =
    useState(DEFAULT_PAGINATION);

  const inFlightRequestsRef = useRef(new Map());
  const getCacheRef = useRef(new Map());

  const invalidateApplicationCache = useCallback(() => {
    const cache = getCacheRef.current;

    for (const key of cache.keys()) {
      if (key.startsWith(APPLICATIONS_URL)) {
        cache.delete(key);
      }
    }
  }, [APPLICATIONS_URL]);

  const request = useCallback(
    async (url, options = {}) => {
      const {
        cacheTtl = GET_CACHE_TTL,
        skipCache = false,
        ...fetchOptions
      } = options;

      const method = (
        fetchOptions.method || "GET"
      ).toUpperCase();

      const isGet = method === "GET";

      if (!API_URL) {
        throw new Error(
          "VITE_API_URL is missing. Check your environment configuration."
        );
      }

      const cacheKey = url;

      if (isGet && !skipCache && cacheTtl > 0) {
        const cached = getCacheRef.current.get(cacheKey);

        if (cached && cached.expiresAt > Date.now()) {
          return cached.data;
        }

        if (cached) {
          getCacheRef.current.delete(cacheKey);
        }
      }

      if (isGet && !skipCache) {
        const existingRequest =
          inFlightRequestsRef.current.get(cacheKey);

        if (existingRequest) {
          return existingRequest;
        }
      }

      const executeRequest = async () => {
        const response = await apiRequest(url, {
          ...fetchOptions,
          headers: {
            ...(fetchOptions.body &&
            !(fetchOptions.body instanceof FormData)
              ? { "Content-Type": "application/json" }
              : {}),
            ...fetchOptions.headers,
          },
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data?.message ||
              `Request failed with status ${response.status}`
          );
        }

        if (!isGet) {
          invalidateApplicationCache();
        } else if (!skipCache && cacheTtl > 0) {
          getCacheRef.current.set(cacheKey, {
            data,
            expiresAt: Date.now() + cacheTtl,
          });
        }

        return data;
      };

      if (!isGet || skipCache) {
        return executeRequest();
      }

      const pendingRequest = executeRequest();

      inFlightRequestsRef.current.set(
        cacheKey,
        pendingRequest
      );

      try {
        return await pendingRequest;
      } finally {
        if (
          inFlightRequestsRef.current.get(cacheKey) ===
          pendingRequest
        ) {
          inFlightRequestsRef.current.delete(cacheKey);
        }
      }
    },
    [API_URL, invalidateApplicationCache]
  );

  const handleApplyForAJob = useCallback(
    async ({ jobId, resumeId, messageToRecruiter = "" }) => {
      try {
        const data = await request(
          `${APPLICATIONS_URL}/${jobId}`,
          {
            method: "POST",
            body: JSON.stringify({
              resumeId,
              messageToRecruiter,
            }),
          }
        );

        const newApplication = data?.data;

        if (newApplication) {
          setApplications((previous) => {
            const exists = previous.some(
              (item) => item._id === newApplication._id
            );

            if (exists) {
              return previous.map((item) =>
                item._id === newApplication._id
                  ? newApplication
                  : item
              );
            }

            return [newApplication, ...previous];
          });
        }

        return newApplication;
      } catch (error) {
        console.error("Apply for job error:", error);
        throw error;
      }
    },
    [APPLICATIONS_URL, request]
  );

  const handleGetMyApplications = useCallback(
    async ({ page = 1, limit = 10, forceRefresh = false } = {}) => {
      try {
        const query = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });

        const data = await request(
          `${APPLICATIONS_URL}?${query.toString()}`,
          {
            skipCache: forceRefresh,
          }
        );

        const result = data?.data;
        const items = result?.applications ?? [];
        const pagination = result?.pagination ?? null;

        setStateIfChanged(setApplications, items);
        setStateIfChanged(setMyApplicationPagination, pagination);

        return items;
      } catch (error) {
        console.error("Get my applications error:", error);
        throw error;
      }
    },
    [APPLICATIONS_URL, request]
  );

  const handleGetDeletedApplications = useCallback(
    async ({
      page = 1,
      limit = 10,
      forceRefresh = false,
    } = {}) => {
      try {
        const query = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });

        const data = await request(
          `${APPLICATIONS_URL}/deleted?${query.toString()}`,
          {
            skipCache: forceRefresh,
          }
        );

        const result = data?.data;
        const items = result?.applications ?? [];
        const pagination = result?.pagination ?? null;

        setStateIfChanged(setDeletedApplications, items);
        setStateIfChanged(
          setDeletedApplicationPagination,
          pagination
        );

        return items;
      } catch (error) {
        console.error("Get deleted applications error:", error);
        throw error;
      }
    },
    [APPLICATIONS_URL, request]
  );

  const handleGetMyApplicationById = useCallback(
    async ({ applicationId }) => {
      try {
        const data = await request(
          `${APPLICATIONS_URL}/my/${applicationId}`
        );

        const result = data?.data ?? null;

        setStateIfChanged(setApplication, result);

        return result;
      } catch (error) {
        console.error("Get my application details error:", error);
        throw error;
      }
    },
    [APPLICATIONS_URL, request]
  );

  const handleGetApplicationById = useCallback(
    async ({ applicationId }) => {
      try {
        const data = await request(
          `${APPLICATIONS_URL}/${applicationId}`
        );

        const result = data?.data ?? null;

        setStateIfChanged(setApplication, result);

        return result;
      } catch (error) {
        console.error("Get recruiter application details error:", error);
        throw error;
      }
    },
    [APPLICATIONS_URL, request]
  );

  const handleGetJobApplications = useCallback(
    async ({
      jobId,
      page = 1,
      limit = 10,
      status = "",
      forceRefresh = false,
    } = {}) => {
      try {
        if (!jobId) {
          throw new Error("A job ID is required.");
        }

        const query = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });

        if (status) {
          query.set("status", status);
        }

        const data = await request(
          `${APPLICATIONS_URL}/jobs/${jobId}?${query.toString()}`,
          {
            skipCache: forceRefresh,
          }
        );

        const result = data?.data;
        const items = result?.applications ?? [];
        const pagination = result?.pagination ?? null;

        setStateIfChanged(setJobApplications, items);
        setStateIfChanged(setJobApplicationPagination, pagination);

        return items;
      } catch (error) {
        console.error("Get job applications error:", error);
        throw error;
      }
    },
    [APPLICATIONS_URL, request]
  );

  const handleGetRecruiterApplications = useCallback(
    async (filters = {}) => {
      try {
        const {
          page = 1,
          limit = 10,
          search = "",
          status = "",
          atsStatus = "",
          minAtsScore,
          maxAtsScore,
          jobId = "",
          candidateId = "",
          resumeId = "",
          interview = "all",
          from = "",
          to = "",
          sortBy = "newest",
          includeDeleted = false,
          forceRefresh = false,
        } = filters;

        const query = new URLSearchParams();

        query.set("page", String(page));
        query.set("limit", String(limit));

        const normalizedSearch = String(search || "").trim();

        if (normalizedSearch) {
          query.set("search", normalizedSearch);
        }

        if (status) query.set("status", status);
        if (atsStatus) query.set("atsStatus", atsStatus);

        if (minAtsScore !== undefined && minAtsScore !== "") {
          query.set("minAtsScore", String(minAtsScore));
        }

        if (maxAtsScore !== undefined && maxAtsScore !== "") {
          query.set("maxAtsScore", String(maxAtsScore));
        }

        if (jobId) query.set("jobId", jobId);
        if (candidateId) query.set("candidateId", candidateId);
        if (resumeId) query.set("resumeId", resumeId);

        if (interview && interview !== "all") {
          query.set("interview", interview);
        }

        if (from) query.set("from", from);
        if (to) query.set("to", to);

        query.set("sortBy", sortBy);

        if (includeDeleted) {
          query.set("includeDeleted", "true");
        }

        const data = await request(
          `${APPLICATIONS_URL}/recruiter?${query.toString()}`,
          {
            skipCache: forceRefresh,
          }
        );

        const result = data?.data;
        const items = result?.applications ?? [];
        const pagination = result?.pagination ?? null;

        setStateIfChanged(setApplications, items);
        setStateIfChanged(setMyApplicationPagination, pagination);

        return result;
      } catch (error) {
        console.error("Get recruiter applications error:", error);
        throw error;
      }
    },
    [APPLICATIONS_URL, request]
  );

  const handleUpdateRecruiterNotes = useCallback(
    async ({ applicationId, recruiterNotes }) => {
      try {
        const data = await request(
          `${APPLICATIONS_URL}/${applicationId}/recruiter-notes`,
          {
            method: "PATCH",
            body: JSON.stringify({ recruiterNotes }),
          }
        );

        const updated = data?.data;

        const updateNotes = (item) => {
          if (
            item._id !== applicationId &&
            item.applicationId !== applicationId
          ) {
            return item;
          }

          return {
            ...item,
            recruiterNotes:
              updated?.recruiterNotes ?? recruiterNotes,
            updatedAt: updated?.updatedAt ?? item.updatedAt,
          };
        };

        setApplications((previous) => previous.map(updateNotes));
        setJobApplications((previous) => previous.map(updateNotes));

        setApplication((previous) => {
          if (previous?._id !== applicationId) {
            return previous;
          }

          return {
            ...previous,
            recruiterNotes:
              updated?.recruiterNotes ?? recruiterNotes,
            updatedAt: updated?.updatedAt ?? previous.updatedAt,
          };
        });

        return updated;
      } catch (error) {
        console.error("Update recruiter notes error:", error);
        throw error;
      }
    },
    [APPLICATIONS_URL, request]
  );

  const handleDeleteApplication = useCallback(
    async ({ applicationId }) => {
      try {
        const existingApplication = applications.find(
          (item) => item._id === applicationId
        );

        await request(
          `${APPLICATIONS_URL}/${applicationId}`,
          {
            method: "PATCH",
          }
        );

        setApplications((previous) =>
          previous.filter((item) => item._id !== applicationId)
        );

        if (existingApplication) {
          setDeletedApplications((previous) => {
            const alreadyDeleted = previous.some(
              (item) => item._id === applicationId
            );

            if (alreadyDeleted) {
              return previous;
            }

            return [
              {
                ...existingApplication,
                isDeleted: true,
                deletedAt: new Date().toISOString(),
              },
              ...previous,
            ];
          });
        }

        setApplication((previous) =>
          previous?._id === applicationId ? null : previous
        );

        return true;
      } catch (error) {
        console.error("Delete application error:", error);
        throw error;
      }
    },
    [APPLICATIONS_URL, applications, request]
  );

  const handleUpdateApplicationStatus = useCallback(
    async ({ applicationId, status }) => {
      try {
        const data = await request(
          `${APPLICATIONS_URL}/${applicationId}/status`,
          {
            method: "PATCH",
            body: JSON.stringify({ status }),
          }
        );

        const updated = data?.data;

        const updateStatus = (item) =>
          item._id === applicationId
            ? { ...item, ...updated }
            : item;

        setApplications((previous) => previous.map(updateStatus));
        setJobApplications((previous) => previous.map(updateStatus));

        setApplication((previous) =>
          previous?._id === applicationId
            ? { ...previous, ...updated }
            : previous
        );

        return updated;
      } catch (error) {
        console.error("Update application status error:", error);
        throw error;
      }
    },
    [APPLICATIONS_URL, request]
  );

  const handleWithdrawApplication = useCallback(
    async ({ applicationId }) => {
      try {
        const data = await request(
          `${APPLICATIONS_URL}/${applicationId}/withdraw`,
          {
            method: "PATCH",
          }
        );

        const updated = data?.data;

        const updateStatus = (item) =>
          item._id === applicationId
            ? { ...item, ...updated }
            : item;

        setApplications((previous) => previous.map(updateStatus));

        setApplication((previous) =>
          previous?._id === applicationId
            ? { ...previous, ...updated }
            : previous
        );

        return updated;
      } catch (error) {
        console.error("Withdraw application error:", error);
        throw error;
      }
    },
    [APPLICATIONS_URL, request]
  );

  return (
    <ApplicationContext.Provider
      value={{
        application,
        applications,
        deletedApplications,
        myApplicationPagination,
        deletedApplicationPagination,
        jobApplications,
        jobApplicationPagination,
        handleApplyForAJob,
        handleGetMyApplications,
        handleGetDeletedApplications,
        handleGetMyApplicationById,
        handleGetApplicationById,
        handleGetJobApplications,
        handleGetRecruiterApplications,
        handleUpdateRecruiterNotes,
        handleDeleteApplication,
        handleUpdateApplicationStatus,
        handleWithdrawApplication,
        selectedCandidate,
        setSelectedCandidate,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};

export default ApplicationProvider;
