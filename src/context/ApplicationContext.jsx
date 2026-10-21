import {
  createContext,
  useCallback,
  useState,
} from "react";

export const ApplicationContext = createContext(null);

const ApplicationProvider = ({ children }) => {
  const API_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");
  const APPLICATIONS_URL = `${API_URL}/applications`;

  const [application, setApplication] = useState(null);
  const [applications, setApplications] = useState([]);
  const [deletedApplications, setDeletedApplications] = useState([]);
  const [myApplicationPagination, setMyApplicationPagination] =
    useState(null);

  const [jobApplications, setJobApplications] = useState([]);
  const [jobApplicationPagination, setJobApplicationPagination] =
    useState(null);
  const [deletedApplicationPagination, setDeletedApplicationPagination] =
    useState(null);

  // Shared API helper
  const request = async (url, options = {}) => {
    const response = await fetch(url, {
      credentials: "include",
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data?.message || "Request failed");
    }

    return data;
  };

  // Apply for a job
  const handleApplyForAJob = async ({
    jobId,
    resumeId,
    messageToRecruiter = "",
  }) => {
    try {
      const data = await request(`${APPLICATIONS_URL}/${jobId}`, {
        method: "POST",
        body: JSON.stringify({
          resumeId,
          messageToRecruiter,
        }),
      });

      const newApplication = data?.data;

      if (newApplication) {
        setApplications((prev) => [
          newApplication,
          ...prev.filter(
            (item) => item._id !== newApplication._id
          ),
        ]);
      }

      return newApplication;
    } catch (error) {
      console.error("Apply for job error:", error);
      throw error;
    }
  };

  // Get candidate's applications
  const handleGetMyApplications = useCallback(
    async ({ page = 1, limit = 10 } = {}) => {
      try {
        const query = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });

        const data = await request(
          `${APPLICATIONS_URL}?${query.toString()}`
        );

        const result = data?.data;
        const items = result?.applications ?? [];

        setApplications(items);
        setMyApplicationPagination(result?.pagination ?? null);

        return items;
      } catch (error) {
        console.error("Get my applications error:", error);
        throw error;
      }
    },
    [APPLICATIONS_URL]
  );

  // Get candidate's deleted applications
  const handleGetDeletedApplications = async ({
    page = 1,
    limit = 10,
  } = {}) => {
    try {
      const query = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      const data = await request(
        `${APPLICATIONS_URL}/deleted?${query.toString()}`
      );

      const result = data?.data;

      setDeletedApplications(result?.applications ?? []);
      setDeletedApplicationPagination(result?.pagination ?? null);

      return result?.applications ?? [];
    } catch (error) {
      console.error("Get deleted applications error:", error);
      throw error;
    }
  };

  // Get one candidate-owned application
  const handleGetMyApplicationById = async ({ applicationId }) => {
    try {
      const data = await request(
        `${APPLICATIONS_URL}/my/${applicationId}`
      );

      setApplication(data?.data ?? null);
      return data?.data;
    } catch (error) {
      console.error("Get my application details error:", error);
      throw error;
    }
  };

  // Get one recruiter-owned application
  const handleGetApplicationById = async ({ applicationId }) => {
    try {
      const data = await request(
        `${APPLICATIONS_URL}/${applicationId}`
      );

      setApplication(data?.data ?? null);
      return data?.data;
    } catch (error) {
      console.error("Get recruiter application details error:", error);
      throw error;
    }
  };

  // Get applicants for a recruiter's job
  const handleGetJobApplications = async ({
    jobId,
    page = 1,
    limit = 10,
    status = "",
  }) => {
    try {
      const query = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (status) {
        query.set("status", status);
      }

      const data = await request(
        `${APPLICATIONS_URL}/jobs/${jobId}?${query.toString()}`
      );

      const result = data?.data;

      setJobApplications(result?.applications ?? []);
      setJobApplicationPagination(result?.pagination ?? null);

      return result?.applications ?? [];
    } catch (error) {
      console.error("Get job applications error:", error);
      throw error;
    }
  };

  // Update recruiter notes
  const handleUpdateRecruiterNotes = async ({
    applicationId,
    recruiterNotes,
  }) => {
    try {
      const data = await request(
        `${APPLICATIONS_URL}/${applicationId}/recruiter-notes`,
        {
          method: "PATCH",
          body: JSON.stringify({ recruiterNotes }),
        }
      );

      const updated = data?.data;

      const updateNotes = (item) =>
        item._id === applicationId ||
        item.applicationId === applicationId
          ? {
              ...item,
              recruiterNotes: updated?.recruiterNotes ?? recruiterNotes,
              updatedAt: updated?.updatedAt ?? item.updatedAt,
            }
          : item;

      setApplications((prev) => prev.map(updateNotes));
      setJobApplications((prev) => prev.map(updateNotes));

      setApplication((prev) =>
        prev?._id === applicationId
          ? {
              ...prev,
              recruiterNotes: updated?.recruiterNotes ?? recruiterNotes,
              updatedAt: updated?.updatedAt ?? prev.updatedAt,
            }
          : prev
      );

      return updated;
    } catch (error) {
      console.error("Update recruiter notes error:", error);
      throw error;
    }
  };

  // Soft-delete a candidate's application
  const handleDeleteApplication = async ({ applicationId }) => {
    try {
      const existingApplication = applications.find(
        (item) => item._id === applicationId
      );

      await request(`${APPLICATIONS_URL}/${applicationId}`, {
        method: "PATCH",
      });

      setApplications((prev) =>
        prev.filter((item) => item._id !== applicationId)
      );

      if (existingApplication) {
        setDeletedApplications((prev) => [
          {
            ...existingApplication,
            isDeleted: true,
            deletedAt: new Date().toISOString(),
          },
          ...prev,
        ]);
      }

      setApplication((prev) =>
        prev?._id === applicationId ? null : prev
      );

      return true;
    } catch (error) {
      console.error("Delete application error:", error);
      throw error;
    }
  };

  // Update application status (recruiter)
  const handleUpdateApplicationStatus = async ({
    applicationId,
    status,
  }) => {
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

      setApplications((prev) => prev.map(updateStatus));
      setJobApplications((prev) => prev.map(updateStatus));

      setApplication((prev) =>
        prev?._id === applicationId
          ? { ...prev, ...updated }
          : prev
      );

      return updated;
    } catch (error) {
      console.error("Update application status error:", error);
      throw error;
    }
  };

const handleGetRecruiterApplications = useCallback(async (filters = {}) => {
  try {
    const query = new URLSearchParams();

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
    } = filters;

    query.set("page", String(page));
    query.set("limit", String(limit));

    if (search.trim()) query.set("search", search.trim());
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

    const response = await fetch(
      `${APPLICATIONS_URL}/recruiter?${query.toString()}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "Failed to fetch recruiter applications"
      );
    }

    setApplications(result.data?.applications || []);
    setMyApplicationPagination(result.data?.pagination || {});

    return result.data;
  } catch (error) {
    console.error("handleGetRecruiterApplications:", error);
    throw error;
  }
},
[]
)

  // Withdraw a candidate's application
  const handleWithdrawApplication = async ({ applicationId }) => {
    try {
      const data = await request(
        `${APPLICATIONS_URL}/${applicationId}/withdraw`,
        { method: "PATCH" }
      );

      const updated = data?.data;

      const updateStatus = (item) =>
        item._id === applicationId
          ? { ...item, ...updated }
          : item;

      setApplications((prev) => prev.map(updateStatus));

      setApplication((prev) =>
        prev?._id === applicationId
          ? { ...prev, ...updated }
          : prev
      );

      return updated;
    } catch (error) {
      console.error("Withdraw application error:", error);
      throw error;
    }
  };

  

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
        handleUpdateRecruiterNotes,
        handleDeleteApplication,
        handleUpdateApplicationStatus,
        handleWithdrawApplication,
        handleGetRecruiterApplications,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};

export default ApplicationProvider;