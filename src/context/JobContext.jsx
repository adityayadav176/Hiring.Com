import { createContext, useState } from "react";

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

    // Create Job
    const handleCreateJob = async ({ jobData }) => {
        try {
            const response = await fetch(`${API_URL}/job`, {
                credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(jobData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to Create Job");
            }

            setJobs((prev) => [data.data, ...prev]);
            setRecruiterJobs((prev) => [data.data, ...prev]);

            console.log("Job Created Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    };

    // Get All Jobs
    const handleGetAllJobs = async () => {
    try {
        const url = `${API_URL}/job`;

        console.log("API URL:", API_URL);
        console.log("Fetching:", url);

        const response = await fetch(url, {
            credentials: "include",
            method: "GET",
        });

        console.log("Status:", response.status);
        console.log("Response URL:", response.url);
        console.log("Content-Type:", response.headers.get("content-type"));

        const text = await response.text();

        console.log("Raw response:", text);

        if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
        }

        const data = JSON.parse(text);

        setJobs(data?.data?.jobs || []);
        setJobPagination(data?.data?.pagination || {});

        console.log("Jobs Fetched Successfully:", data);
    } catch (error) {
        console.log("Get All Jobs Error:", error);
    }
};

    // Get Recruiter Jobs
    const handleGetRecruiterJobs = async ({ query = "" } = {}) => {
        try {
            const response = await fetch(`${API_URL}/job/recruiter${query}`, {
                credentials: "include",
                method: "GET",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to Get Recruiter Jobs");
            }

            setRecruiterJobs(data.data.jobs);
            setRecruiterJobPagination(data.data.pagination);

            console.log("Recruiter Jobs Fetched Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    };

    // Get Deleted Jobs
    const handleGetDeletedJobs = async ({ query = "" } = {}) => {
        try {
            const response = await fetch(`${API_URL}/job/deleted${query}`, {
                credentials: "include",
                method: "GET",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to Get Deleted Jobs");
            }

            setDeletedJobs(data.data.jobs);
            setDeletedJobPagination(data.data.pagination);

            console.log("Deleted Jobs Fetched Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    };

    // Get Job By ID
    const handleGetJobById = async ({ jobId }) => {
        try {
            const response = await fetch(`${API_URL}/job/${jobId}`, {
                credentials: "include",
                method: "GET",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to Get Job");
            }

            setJob(data.data);

            console.log("Job Fetched Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    };

    // Update Job
    const handleUpdateJob = async ({ jobId, jobData }) => {
        try {
            const response = await fetch(`${API_URL}/job/${jobId}`, {
                credentials: "include",
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(jobData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to Update Job");
            }

            setJob(data.data);

            setJobs((prev) =>
                prev.map((item) =>
                    item._id === jobId ? data.data : item
                )
            );

            setRecruiterJobs((prev) =>
                prev.map((item) =>
                    item._id === jobId ? data.data : item
                )
            );

            console.log("Job Updated Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    };

    // Soft Delete Job
    const handleDeleteJob = async ({ jobId }) => {
        try {
            const response = await fetch(`${API_URL}/job/${jobId}/delete`, {
                credentials: "include",
                method: "PATCH",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to Delete Job");
            }

            setJobs((prev) =>
                prev.filter((item) => item._id !== jobId)
            );

            setRecruiterJobs((prev) =>
                prev.filter((item) => item._id !== jobId)
            );

            console.log("Job Deleted Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    };

    // Permanently Delete Job
    const handlePermanentDeleteJob = async ({ jobId }) => {
        try {
            const response = await fetch(`${API_URL}/job/${jobId}/permanent`, {
                credentials: "include",
                method: "DELETE",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to Permanently Delete Job"
                );
            }

            setDeletedJobs((prev) =>
                prev.filter((item) => item._id !== jobId)
            );

            console.log("Job Permanently Deleted Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    };

    // Change Job Status
    const handleChangeJobStatus = async ({ jobId, status }) => {
        try {
            const response = await fetch(`${API_URL}/job/${jobId}/status`, {
                credentials: "include",
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to Change Job Status");
            }

            setJob(data.data);

            setJobs((prev) =>
                prev.map((item) =>
                    item._id === jobId ? data.data : item
                )
            );

            setRecruiterJobs((prev) =>
                prev.map((item) =>
                    item._id === jobId ? data.data : item
                )
            );

            console.log("Job Status Updated Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    };

    // Restore Job
    const handleRestoreJob = async ({ jobId }) => {
        try {
            const response = await fetch(`${API_URL}/job/${jobId}/restore`, {
                credentials: "include",
                method: "PATCH",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to Restore Job");
            }

            setDeletedJobs((prev) =>
                prev.filter((item) => item._id !== jobId)
            );

            setRecruiterJobs((prev) => [data.data, ...prev]);

            console.log("Job Restored Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    };

   const getTimeAgo = (data) => {
    const now = new Date();
    const created = new Date(data);

    const seconds = Math.floor((now - created) / 1000);

    if (seconds < 60) {
        return "Just now";
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
        return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 30) {
        return `${days} day${days > 1 ? "s" : ""} ago`;
    }

    const months = Math.floor(days / 30);

    if (months < 12) {
        return `${months} month${months > 1 ? "s" : ""} ago`;
    }

    const years = Math.floor(months / 12);

    return `${years} year${years > 1 ? "s" : ""} ago`;
};

const FormatLocation = (location) => {
    if(!location) {
        return "Location Not Specified";
    }

    const {city, state, country} = location;

    return [city, state, country].filter(Boolean).join(", ") || "Location Not Specified";
}

const FormatEnumValue = (value) => {
    if(!value) {
        return;
    }

    return value.toLowerCase().split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

const formatDeadline = (date) => {
    const deadline = new Date();
    const now = new Date(date);

    const diff = deadline - now;

    if(diff < 0) return "Deadline Passed"

    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if(days === 0) return "Deadline Today";
    if(days === 1) return "1 day left";

    return `${days} days left`;
}

const formatApplicants = (applicants) => {
    if(applicants === undefined || applicants === null || applicants === 0) return "Yet No Applicants";

    return `${applicants} Applicant${applicants > 1 ? "s" : ""}`;
}

const formatSalary = (salary) => {
  if (salary === undefined || salary === null) return "";

  return new Intl.NumberFormat("en-IN").format(salary);
};
    

    return (
        <JobContext.Provider
            value={{
                job,
                jobs,
                recruiterJobs,
                deletedJobs,

                getTimeAgo,
                formatSalary,
                FormatEnumValue,
                FormatLocation,
                formatDeadline,
                formatApplicants,

                jobPagination,
                recruiterJobPagination,
                deletedJobPagination,
                selectedJobs,
                setSelectedJobs,

                handleCreateJob,
                handleGetAllJobs,
                handleGetRecruiterJobs,
                handleGetDeletedJobs,
                handleGetJobById,
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