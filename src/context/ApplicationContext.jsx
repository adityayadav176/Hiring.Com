import { createContext, useState } from "react";

export const ApplicationContext = createContext();

const ApplicationProvider = ({children}) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [application, setApplication] = useState(null);
    const [applications, setApplications] = useState([]);
    const [deletedApplications, setDeletedApplication] = useState([]);
    const [myApplicationPagination, setMyApplicationPagination] = useState({}); 
    const [jobApplications, setJobApplications] = useState([]);
    const [jobApplicationPagination, setJobApplicationPagination] = useState({});

    const handleApplyForAJob = async({jobId}) => {
        try {
            const response = await fetch(`${API_URL}/application/${jobId}`, {
                credentials: "include",
                method: "POST"
            });
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Failed To Apply For A Job");
            }
            
            setApplications((prev) => [data.data, ...prev]);
            console.log("Apply for Job Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

    const handleGetMyApplications = async() => {
        try {
            const response = await fetch(`${API_URL}/application`, {
                credentials: "include",
                method: "GET"
            })

            const data = await response.json();

            if(!response.ok) {
                throw new Error(data.message || "Failed to GetApplications");
            }

            setApplications(data.data.applications);
            setMyApplicationPagination(data.data.pagination);

            console.log("Application Fetched Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

    const handleGetDeletedApplications = async() => {
        try {
            const response = await fetch(`${API_URL}/application/deleted`, {
                credentials: "include",
                method: "GET"
            })

            const data = await response.json();

            if(!response.ok) {
                throw new Error(data.message || "Failed to GetApplications");
            }

            setDeletedApplication(data.data);
            console.log("Application Fetched Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }
    const handleUpdateRecruiterNotes = async({applicationId, recruiterNotes}) => {
        try {
            const response = await fetch(`${API_URL}/application/${applicationId}/recruiter-notes`, {
                credentials: "include",
                method: "PATCH",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({recruiterNotes})
            });

            const data = await response.json();

            if(!response.ok) {
                throw new Error(data.message || "Failed to UpdateRecruiterNotes");
            }

            setApplications((prev) => prev.map((item) => item._id === applicationId ? data.data : item));
            console.log("RecruiterNotes Updated Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

    const handleDeleteApplication = async({applicationId}) => {
        try {
            const response = await fetch(`${API_URL}/application/${applicationId}`, {
                credentials: "include",
                method: "PATCH"
            })

            const data = await response.json();

            if(!response.ok) {
                throw new Error(data.message || "Failed to Delete Application");
            }
            setDeletedApplication((prev) => [data.data, ...prev]);
            setApplications((prev) => prev.filter((item) => item._id !== applicationId));
            console.log("Application Deleted Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

    const handleUpdateApplicationStatus = async({applicationId, status}) => {
         try {
            const response = await fetch(`${API_URL}/application/${applicationId}/status`, {
                credentials: "include",
                method: "PATCH",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({status})
            })

            const data = await response.json();

            if(!response.ok) {
                throw new Error(data.message || "Failed to Updated Application");
            }

            setApplications((prev) => prev.map((item) => item._id === applicationId ? data.data : item));
            console.log("Application Updated Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

    const handleGetApplicationById = async({applicationId}) => {
        try {
            const response = await fetch(`${API_URL}/application/${applicationId}`, {
                credentials: "include",
                method: "GET",
            })

            const data = await response.json();

            if(!response.ok) {
                throw new Error(data.message || "Failed to GET Application");
            }

            setApplication(data.data);
            console.log("Application Fetched Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

    const handleWithdrawnApplication = async({applicationId}) => {
        try {
            const response = await fetch(`${API_URL}/application/${applicationId}/withdraw`, {
                credentials: "include",
                method: "PATCH",
            })

            const data = await response.json();

            if(!response.ok) {
                throw new Error(data.message || "Failed to Withdrawn Application");
            }

            setApplications((prev) => prev.map((item) => item._id === applicationId ? data.data : item));
            console.log("Application Withdrawn Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

    const handleGetJobApplication = async({jobId}) => {
        try {
            const response = await fetch(`${API_URL}/application/jobs/${jobId}`, {
                credentials: "include",
                method: "GET",
            })

            const data = await response.json();

            if(!response.ok) {
                throw new Error(data.message || "Failed to Fetch Application");
            }

            setJobApplications(data.data.applications);
            setJobApplicationPagination(data.data.pagination);
            console.log("Application Fetched Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

    
    return (
        <ApplicationContext.Provider value={{jobApplicationPagination, application, applications, deletedApplications, jobApplications, myApplicationPagination, handleApplyForAJob, handleGetMyApplications, handleGetDeletedApplications, handleUpdateRecruiterNotes, handleDeleteApplication, handleUpdateApplicationStatus, handleGetApplicationById, handleWithdrawnApplication, handleGetJobApplication}}>
            {children}
        </ApplicationContext.Provider>
    )
}

export default ApplicationProvider;
