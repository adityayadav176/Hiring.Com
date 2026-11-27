import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { useHome } from './hooks/Hook';


function DocumentTitle() {
    const {activePage, recruiterActivePage, adminActivePage} = useHome();
    const location = useLocation();
    useEffect(() => {
        const path = location.pathname;
        let title = "Peer.Hiring";

    if(["/", "/login"].includes(path)) {
        title = "Login"
    } else if(["/forgetPassword", "/sendPasswordResetOpt"].includes(path)) {
        title = "Password Reset";
    } else if(path === "/signup") {
        title = "Create Account";
    } else if(path.startsWith("/interview/")) {
        title = "Interview";
    } else if (path === "/admin") {
        const pages = {
            "admin/dashboard": "Admin Dashboard",
            "users": "Admin Users",
            "companies": "Admin Company",
            "admin/jobs": "Admin Jobs",
            "reports": "Admin Reports",
            "admin/profile":"Admin Profile",
            "admin/settings":"Admin Setting",
        }
        title =  pages[adminActivePage] || "Admin";
    } else if(path == "recruiter") {
        const pages = {
            "recruiter/dashboard": "Recruiter Dashboard",
            "recruiter/jobs": "Recruiter Jobs",
            "recruiter/application": "Recruiter Applications",
            "recruiter/interviews": "Recruiter Interviews",
            "recruiter/settings": "Recruiter Settings",
            "recruiter/profile": "Recruiter Profile",
            "recruiter/company": "Recruiter Company",
            "/recruiter/candidate/profile": "Candidate Profile",
            "/recruiter/chat":"Recruiter Chats"
        };
        
        title = pages[recruiterActivePage] || "Recruiter";
    } else if(path === "/dashboard") {
        const pages = {
            "profile": "Profile",
            "jobs": "Jobs",
            "settings": "Settings",
            "applications": "Applications",
            "overview": "Dashboard",
            "interviews": "Interviews",
            "resume": "Resume",
            "chats":"Chats"
        };

        title = pages[activePage] || "User";
    }
    document.title = `Peer.Hiring -  ${title}`;

    }, [location.pathname, activePage, recruiterActivePage, adminActivePage]);
    return null;
}

export default DocumentTitle;
