import { createContext, useState } from "react";

export const ReportContext = createContext();

const ReportProvider = ({children}) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [reports, setReports] = useState([]);
    const [report, setReport] = useState(null);
    const [reportsPagination, setReportsPagination] = useState({});

    const handleGetReports = async() => {
        try {
            const response = await fetch(`${API_URL}/reports`, {
                method: "GET",
                credentials: "include"
            });
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Failed To Fetch Reports");
            }
            
            setReports(data.data.reports);
            setReportsPagination(data.data.pagination);
            console.log("Reports Fetched Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

    const handleGetReportById = async({reportId}) => {
        if(!reportId) {
            throw new Error("Report ID Is Required");
        }

        try {
            const response = await fetch(`${API_URL}/reports/${reportId}`, {
                method: "GET",
                credentials: "include"
            });
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Failed To Fetch Report");
            }
            
            setReport(data.data);
            console.log("Report Fetched Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

    const handleResolveReport = async({reportId}) => {
        if(!reportId) {
            throw new Error("Report ID Is Required");
        }

        try {
            const response = await fetch(`${API_URL}/reports/${reportId}/resolve`, {
                method: "PATCH",
                credentials: "include"
            });
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Failed To Resolve Report");
            }
            
            setReports((prev) => prev.map((item => item._id === reportId ? data.data : item)));
            console.log("Report Resolve Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }
    const handleRejectReport = async({reportId}) => {
        if(!reportId) {
            throw new Error("Report ID Is Required");
        }

        try {
            const response = await fetch(`${API_URL}/reports/${reportId}/reject`, {
                method: "PATCH",
                credentials: "include"
            });
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Failed To Reject Report");
            }
            
            setReports((prev) => prev.filter((item) => item._id !== reportId))
            console.log("Report Reject Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }


    const handleCreateReport = async({reportedUser, reportedJob, reason, description}) => {
        try {
            const response = await fetch(`${API_URL}/reports/create`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({reportedUser, reportedJob, reason, description})
            });
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Failed To Reject Report");
            }
            setReports((prev) => [data.data, ...prev]);
            setReportsPagination((prev) => ({...prev, totalReports: prev.totalReports + 1}));
            setReport(data.data);
            console.log("Report Reject Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }
    return (
        <ReportContext.Provider value={{handleGetReports, handleGetReportById, handleResolveReport, handleRejectReport, handleCreateReport, report, reports, reportsPagination}}>
            {children}
        </ReportContext.Provider>
    )
}

export default ReportProvider;