import { createContext, useState } from "react";

export const InterviewContext = createContext();

const InterviewProvider = ({children}) => {
    const [Interview, setInterview] = useState(null);
    const [Interviews, setInterviews] = useState([]);
    const [InterviewPagination, setInterviewPagination] = useState({});

    const API_URL = import.meta.env.VITE_API_URL;

    const handleScheduleInterview = async({details}) => {
        try {
            const {application, company, candidate, job, round, interviewType, location, scheduledAt, duration, timezone} = details;
    
            const response = await fetch(`${API_URL}/interview`, {
                credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({application, company, candidate, job, round, interviewType, location, scheduledAt, duration, timezone})
            })
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error("Failed To Schedule A Interview");
            }
    
            setInterviews((prev) => [data.data, ...prev]);
            console.log("Interview Scheduled Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }
    const handleGetInterviewById = async({interviewId}) => {

        if(!interviewId) {
            throw new Error("Interview Id Is Required");
        }
        try {
            const response = await fetch(`${API_URL}/interview/${interviewId}`, {
                credentials: "include",
                method: "GET",
            })
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error("Failed To Get Interview");
            }
    
            setInterview(data.data);
            console.log("Interview Fetched Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }
    const handleGetMyInterviews = async() => {
        try {
            const response = await fetch(`${API_URL}/interview/me`, {
                credentials: "include",
                method: "GET",
            })
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error("Failed To Get Interviews");
            }
    
            setInterviews(data.data.interviews);
            setInterviewPagination(data.data.pagination);
            console.log("Interviews Fetched Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }
    const handleGetUpcomingInterviews = async() => {
        try {
            const response = await fetch(`${API_URL}/interview/upcoming`, {
                credentials: "include",
                method: "GET",
            })
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error("Failed To Get Upcoming Interviews");
            }
    
            setInterviews(data.data.interviews);
            setInterviewPagination(data.data.pagination);
            console.log("Upcoming Interviews Fetched Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }
    const handleGetTodayInterviews = async() => {
        try {
            const response = await fetch(`${API_URL}/interview/today`, {
                credentials: "include",
                method: "GET",
            })
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error("Failed To Get Interview");
            }
    
            setInterviews(data.data.interviews);
            setInterviewPagination(data.data.pagination);
            console.log("Interview Fetched Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }
    const handleRescheduleInterview = async({interviewId, scheduledAt}) => {
        if(!interviewId) {
            throw new Error("Interview Id Is Required");
        }

        if(!scheduledAt) {
            throw new Error("New Date Is Required For RescheduledInterview")
        }
        try {
            const response = await fetch(`${API_URL}/interview/${interviewId}/reschedule`, {
                credentials: "include",
                method: "PATCH",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({scheduledAt})
            })
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error("Failed To Reschedule Interview");
            }
    
            setInterviews((prev) => prev.map((item) => item._id === interviewId ? data.data : item));
            setInterview((prev) =>prev?._id === interviewId ? data.data : prev);
            console.log("Interview Resheduled Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }
    const handleChangeInterviewStatus = async({interviewId, status}) => {
        if(!interviewId) {
            throw new Error("Interview Id Is Required");
        }
        if (!status) {
            throw new Error("Interview Status Is Required");
        }
        try {
            const response = await fetch(`${API_URL}/interview/${interviewId}/status`, {
                credentials: "include",
                method: "PATCH",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({status})
            })
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Failed To Change Status Interview");
            }
    
            setInterviews((prev) => prev.map((item) => item._id === interviewId ? data.data : item));
            setInterview((prev) => prev?._id === interviewId ? data.data : prev);
            console.log("Interview Status Updated Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }
    const handleGetInterviewsByJob = async({jobId}) => {
        if(!jobId) {
            throw new Error("Job Id Is Required");
        }
        try {
            const response = await fetch(`${API_URL}/interview/job/${jobId}`, {
                credentials: "include",
                method: "GET",
            })
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error("Failed To Get InterviewsBYJob");
            }
    
            setInterviews(data.data.interviews);
            setInterviewPagination(data.data.pagination)
            console.log("Job Interviews Fetched Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

    const handleGetInterviewsByApplication = async({applicationId}) => {
        if(!applicationId) {
            throw new Error("applicationId Is Required");
        }
        try {
            const response = await fetch(`${API_URL}/interview/application/${applicationId}`, {
                credentials: "include",
                method: "GET",
            })
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Failed To Get InterviewsBYApplication");
            }
    
            setInterviews(data.data.interviews);
            setInterviewPagination(data.data.pagination);
            console.log("Application Interviews Fetched Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }
    
    return (
        <InterviewContext.Provider value={{handleGetInterviewById, handleGetInterviewsByApplication, handleGetInterviewsByJob, handleGetMyInterviews, handleGetTodayInterviews, handleGetUpcomingInterviews, handleRescheduleInterview, handleScheduleInterview, handleChangeInterviewStatus, Interview, Interviews, InterviewPagination}}>
            {children}
        </InterviewContext.Provider>
    )
}

export default InterviewProvider;