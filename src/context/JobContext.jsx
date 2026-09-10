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
    const handleGetAllJobs = async ({ query = "" } = {}) => {
        try {
            const response = await fetch(`${API_URL}/job${query}`, {
                credentials: "include",
                method: "GET",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to Get Jobs");
            }

            setJobs(data.data.jobs);
            setJobPagination(data.data.pagination);

            console.log("Jobs Fetched Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
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

    return (
        <JobContext.Provider
            value={{
                job,
                jobs,
                recruiterJobs,
                deletedJobs,

                jobPagination,
                recruiterJobPagination,
                deletedJobPagination,

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