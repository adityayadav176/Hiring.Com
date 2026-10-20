import { createContext, useCallback, useState } from "react";

export const JobContext = createContext();

const JobProvider = ({ children }) => {
    const API_URL = import.meta.env.VITE_API_URL;

    const [job, setJob] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [recruiterJobs, setRecruiterJobs] = useState([]);
    const [deletedJobs, setDeletedJobs] = useState([]);

    const [jobPagination, setJobPagination] = useState({});
    const [recruiterJobPagination, setRecruiterJobPagination] = useState({});
    const [deletedJobPagination, setDeletedJobPagination] = useState({});

    const [selectedJobs, setSelectedJobs] = useState(null);

    const getErrorMessage = (data, fallback) =>
        data?.message || fallback;

    // Create Job
    const handleCreateJob = async ({ jobData }) => {
        try {
            const response = await fetch(`${API_URL}/job`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(jobData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    getErrorMessage(data, "Failed to Create Job")
                );
            }

            const createdJob = data.data;

            setRecruiterJobs((prev) => [
                createdJob,
                ...prev.filter((item) => item._id !== createdJob._id),
            ]);

            return createdJob;
        } catch (error) {
            console.error("Create Job Error:", error);
            throw error;
        }
    };

    // Get All Public Jobs
    const handleGetAllJobs = async (params = {}) => {
        const {
            append = false,
            page = 1,
            limit = 20,
            search = "",
            location = "",
            employmentType = [],
            workSpaceType = [],
            experienceLevel = [],
            skills = [],
            minSalary = "",
            maxSalary = "",
            postedWithin = "",
            sortBy = "relevance",
        } = params;

        try {
            const query = new URLSearchParams();

            query.set("page", String(page));
            query.set("limit", String(limit));

            if (search.trim()) {
                query.set("search", search.trim());
            }

            if (location.trim()) {
                query.set("location", location.trim());
            }

            const addFilter = (key, value) => {
                if (Array.isArray(value)) {
                    value.forEach((item) => {
                        if (item !== "" && item != null) {
                            query.append(key, String(item));
                        }
                    });
                } else if (value !== "" && value != null) {
                    query.set(key, String(value));
                }
            };

            addFilter("employmentType", employmentType);
            addFilter("workSpaceType", workSpaceType);
            addFilter("experienceLevel", experienceLevel);
            addFilter("skills", skills);
            addFilter("minSalary", minSalary);
            addFilter("maxSalary", maxSalary);
            addFilter("postedWithin", postedWithin);
            addFilter("sortBy", sortBy);

            const response = await fetch(
                `${API_URL}/job?${query.toString()}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    getErrorMessage(
                        data,
                        `Request failed: ${response.status}`
                    )
                );
            }

            const incomingJobs = data?.data?.jobs || [];

            setJobs((previousJobs) => {
                if (!append) {
                    return incomingJobs;
                }

                const existingIds = new Set(
                    previousJobs.map((item) => item._id)
                );

                return [
                    ...previousJobs,
                    ...incomingJobs.filter(
                        (item) => !existingIds.has(item._id)
                    ),
                ];
            });

            setJobPagination(data?.data?.pagination || {});

            return data;
        } catch (error) {
            console.error("Get All Jobs Error:", error);
            throw error;
        }
    };

    // Get Recruiter Jobs
const handleGetRecruiterJobs = useCallback(
  async ({ query = "" } = {}) => {
    try {
      const response = await fetch(
        `${API_URL}/job/recruiter${query}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch recruiter jobs");
      }

      setRecruiterJobs(data?.data?.jobs || []);
      setRecruiterJobPagination(data?.data?.pagination || {});

      return data?.data;
    } catch (error) {
      console.error("Get recruiter jobs error:", error);
      throw error;
    }
  },
  []
);

    // Get Deleted Jobs
    const handleGetDeletedJobs = async ({ query = "" } = {}) => {
        try {
            const response = await fetch(
                `${API_URL}/job/deleted${query}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    getErrorMessage(data, "Failed to Get Deleted Jobs")
                );
            }

            setDeletedJobs(data?.data?.jobs || []);
            setDeletedJobPagination(data?.data?.pagination || {});

            return data;
        } catch (error) {
            console.error("Get Deleted Jobs Error:", error);
            throw error;
        }
    };

    // Get Recruiter Job By ID
const handleGetJobById = useCallback(
  async ({ JobId, jobId } = {}) => {
    try {
      const id = String(JobId ?? jobId ?? "").trim();

      if (!/^[a-fA-F0-9]{24}$/.test(id)) {
        console.error("Invalid Job ID received:", {
          JobId,
          jobId,
        });

        throw new Error(`Invalid Job ID: ${id || "missing ID"}`);
      }

      const response = await fetch(
        `${API_URL}/job/recruiter/${encodeURIComponent(id)}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to get recruiter job"
        );
      }

      const fetchedJob = data?.data?.job ?? data?.data;

      if (!fetchedJob?._id) {
        throw new Error("Job was not found in the API response.");
      }

      setJob(fetchedJob);
      return fetchedJob;
    } catch (error) {
      console.error("Get Recruiter Job Error:", error);
      throw error;
    }
  },
  [API_URL]
);

    // Get User Job By ID
    const handleGetUserJobById = async ({ JobId }) => {
        try {
            if (!JobId) {
                throw new Error("Job ID is required");
            }

            const response = await fetch(
                `${API_URL}/job/user/${JobId}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    getErrorMessage(data, "Failed to Get Job")
                );
            }

            setJob(data.data);

            return data.data;
        } catch (error) {
            console.error("Get User Job Error:", error);
            throw error;
        }
    };

    // Update Job
    const handleUpdateJob = async ({ JobId, jobData }) => {
        try {
            const response = await fetch(`${API_URL}/job/${JobId}`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(jobData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    getErrorMessage(data, "Failed to Update Job")
                );
            }

            const updatedJob = data.data;

            setJob((prev) =>
                prev?._id === JobId ? updatedJob : prev
            );

            setJobs((prev) =>
                prev.map((item) =>
                    item._id === JobId ? updatedJob : item
                )
            );

            setRecruiterJobs((prev) =>
                prev.map((item) =>
                    item._id === JobId ? updatedJob : item
                )
            );

            return updatedJob;
        } catch (error) {
            console.error("Update Job Error:", error);
            throw error;
        }
    };

    // Soft Delete Job
    const handleDeleteJob = async ({ JobId }) => {
        try {
            const response = await fetch(
                `${API_URL}/job/${JobId}/delete`,
                {
                    method: "PATCH",
                    credentials: "include",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    getErrorMessage(data, "Failed to Delete Job")
                );
            }

            setJobs((prev) =>
                prev.filter((item) => item._id !== JobId)
            );

            setRecruiterJobs((prev) =>
                prev.filter((item) => item._id !== JobId)
            );

            setJob((prev) =>
                prev?._id === JobId ? null : prev
            );

            setSelectedJobs((prev) =>
                prev?._id === JobId ? null : prev
            );

            return data;
        } catch (error) {
            console.error("Delete Job Error:", error);
            throw error;
        }
    };

    // Permanently Delete Job
    const handlePermanentDeleteJob = async ({ JobId }) => {
        try {
            const response = await fetch(
                `${API_URL}/job/${JobId}/permanent`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    getErrorMessage(
                        data,
                        "Failed to Permanently Delete Job"
                    )
                );
            }

            setDeletedJobs((prev) =>
                prev.filter((item) => item._id !== JobId)
            );

            setJob((prev) =>
                prev?._id === JobId ? null : prev
            );

            setSelectedJobs((prev) =>
                prev?._id === JobId ? null : prev
            );

            return data;
        } catch (error) {
            console.error("Permanent Delete Job Error:", error);
            throw error;
        }
    };

    // Change Job Status
    const handleChangeJobStatus = async ({ JobId, status }) => {
        try {
            const response = await fetch(
                `${API_URL}/job/${JobId}/status`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    getErrorMessage(data, "Failed to Change Job Status")
                );
            }

            const updatedJob = data.data;

            setJob((prev) =>
                prev?._id === JobId ? updatedJob : prev
            );

            setJobs((prev) =>
                prev.map((item) =>
                    item._id === JobId ? updatedJob : item
                )
            );

            setRecruiterJobs((prev) =>
                prev.map((item) =>
                    item._id === JobId ? updatedJob : item
                )
            );

            return updatedJob;
        } catch (error) {
            console.error("Change Job Status Error:", error);
            throw error;
        }
    };

    // Restore Job
    const handleRestoreJob = async ({ JobId }) => {
        try {
            const response = await fetch(
                `${API_URL}/job/${JobId}/restore`,
                {
                    method: "PATCH",
                    credentials: "include",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    getErrorMessage(data, "Failed to Restore Job")
                );
            }

            const restoredJob = data.data;

            setDeletedJobs((prev) =>
                prev.filter((item) => item._id !== JobId)
            );

            setRecruiterJobs((prev) => [
                restoredJob,
                ...prev.filter((item) => item._id !== JobId),
            ]);

            return restoredJob;
        } catch (error) {
            console.error("Restore Job Error:", error);
            throw error;
        }
    };

    // Time Ago
    const getTimeAgo = (date) => {
        if (!date) return "";

        const created = new Date(date);

        if (Number.isNaN(created.getTime())) {
            return "";
        }

        const seconds = Math.floor(
            (Date.now() - created.getTime()) / 1000
        );

        if (seconds < 0) return "Just now";
        if (seconds < 60) return "Just now";

        const minutes = Math.floor(seconds / 60);

        if (minutes < 60) {
            return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
        }

        const hours = Math.floor(minutes / 60);

        if (hours < 24) {
            return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
        }

        const days = Math.floor(hours / 24);

        if (days < 30) {
            return `${days} day${days !== 1 ? "s" : ""} ago`;
        }

        const months = Math.floor(days / 30);

        if (months < 12) {
            return `${months} month${months !== 1 ? "s" : ""} ago`;
        }

        const years = Math.floor(months / 12);

        return `${years} year${years !== 1 ? "s" : ""} ago`;
    };

    // Format Location
    const FormatLocation = (location) => {
        if (!location) {
            return "Location Not Specified";
        }

        const { city, state, country } = location;

        return (
            [city, state, country].filter(Boolean).join(", ") ||
            "Location Not Specified"
        );
    };

    // Format Enum Value
    const FormatEnumValue = (value) => {
        if (!value) return "";

        return value
            .toLowerCase()
            .split("_")
            .map(
                (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1)
            )
            .join(" ");
    };

    // Format Application Deadline
    const formatDeadline = (date) => {
        if (!date) return "No Deadline";

        const deadline = new Date(date);

        if (Number.isNaN(deadline.getTime())) {
            return "Invalid Deadline";
        }

        const diff = deadline.getTime() - Date.now();

        if (diff < 0) return "Deadline Passed";

        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

        if (days <= 1) return "Deadline Today";
        if (days === 2) return "1 day left";

        return `${days - 1} days left`;
    };

    // Format Applicants Count
    const formatApplicants = (applicants) => {
        if (
            applicants === undefined ||
            applicants === null ||
            applicants === 0
        ) {
            return "Yet No Applicants";
        }

        return `${applicants} Applicant${applicants !== 1 ? "s" : ""}`;
    };

    // Format Salary
    const formatSalary = (salary) => {
        if (salary === undefined || salary === null || salary === "") {
            return "";
        }

        return new Intl.NumberFormat("en-IN").format(salary);
    };

    return (
        <JobContext.Provider
            value={{
                job,
                setJob,
                jobs,
                recruiterJobs,
                deletedJobs,

                jobPagination,
                recruiterJobPagination,
                deletedJobPagination,

                selectedJobs,
                setSelectedJobs,

                getTimeAgo,
                formatSalary,
                FormatEnumValue,
                FormatLocation,
                formatDeadline,
                formatApplicants,

                handleCreateJob,
                handleGetAllJobs,
                handleGetRecruiterJobs,
                handleGetDeletedJobs,
                handleGetJobById,
                handleGetUserJobById,
                handleUpdateJob,
                handleDeleteJob,
                handlePermanentDeleteJob,
                handleChangeJobStatus,
                handleRestoreJob,
            }}
        >
            {children}
        </JobContext.Provider>
    );
};

export default JobProvider;