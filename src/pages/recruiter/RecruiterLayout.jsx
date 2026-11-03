import { useState } from "react";

import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import MobileDrawer from "../../components/layout/MobileDrawer";
import BottomNavigation from "../../components/layout/BottomNavigation";

import { useHome } from "../../hooks/Hook";

import RecruiterJobs from "./RecruiterJobs";
import RecruiterApplication from "./RecruiterApplication";
import RecruiterInterviews from "./RecruiterInterviews";
import RecruiterDashboard from "./RecruiterDashboard";
import Settings from "../seeker/Settings";
import RecruiterProfile from "./RecruiterProfile";
import RecruiterCompanies from "./RecruiterCompanies";
import CandidateProfile from "./CandidateProfile";

import ChatPage from "../../components/chat/ChatPage";

export default function RecruiterLayout() {
    const { recruiterActivePage } = useHome();

    const [isMobileMenuOpen, setIsMobileMenuOpen] =
        useState(false);

    // Keep chat completely separate from dashboard navigation
    if (recruiterActivePage === "/recruiter/chat") {
        return (
            <div className="h-screen w-screen overflow-hidden">
                <ChatPage />
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden">

            {/* Desktop Sidebar */}
            <Sidebar />

            {/* Main Dashboard */}
            <div className="flex h-screen min-w-0 flex-1 flex-col">

                {/* Navbar */}
                <Navbar
                    isMobileMenuOpen={isMobileMenuOpen}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                />

                {/* Mobile Drawer */}
                <MobileDrawer
                    isOpen={isMobileMenuOpen}
                    onClose={() => setIsMobileMenuOpen(false)}
                />

                {/* Page Content */}
                <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-y-contain pb-16 lg:pb-0">

                    {recruiterActivePage === "recruiter/dashboard" && (
                        <RecruiterDashboard />
                    )}

                    {recruiterActivePage === "recruiter/jobs" && (
                        <RecruiterJobs />
                    )}

                    {recruiterActivePage === "recruiter/application" && (
                        <RecruiterApplication />
                    )}

                    {recruiterActivePage === "recruiter/interviews" && (
                        <RecruiterInterviews />
                    )}

                    {recruiterActivePage === "recruiter/settings" && (
                        <Settings />
                    )}

                    {recruiterActivePage === "recruiter/profile" && (
                        <RecruiterProfile />
                    )}

                    {recruiterActivePage === "recruiter/company" && (
                        <RecruiterCompanies />
                    )}

                    {recruiterActivePage === "/recruiter/candidate/profile" && (
                        <CandidateProfile />
                    )}

                </main>

                {/* Mobile Bottom Navigation */}
                <BottomNavigation />
            </div>
        </div>
    );
}