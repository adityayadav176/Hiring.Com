import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import MobileDrawer from "../../components/layout/MobileDrawer";
import BottomNavigation from "../../components/layout/BottomNavigation";

import { useHome } from "../../hooks/Hook";
import Overview from './../pubic/Overview';
import JobLayout from './../../components/jobs/JobLayout';
import Profile from './Profile';
import Applications from './Application';
import InterviewPage from './InterviewPage';
import ResumePage from './ResumePage';
import ChatPage from './../../components/chat/ChatPage';
import Settings from './Settings';

function Dashboard() {
    const { activePage, setActivePage } = useHome();

    const [isMobileMenuOpen, setIsMobileMenuOpen] =
        useState(false);

    return (
        <DashboardLayout>
            <div className="flex min-h-0 w-full flex-1">

                {/* Desktop Sidebar */}
                <Sidebar
                    activePage={activePage}
                    setActivePage={setActivePage}
                />

                <div className="flex min-h-0 min-w-0 flex-1 flex-col">

                    {/* Navbar */}
                    <Navbar
                        activePage={activePage}
                        setActivePage={setActivePage}
                        isMobileMenuOpen={isMobileMenuOpen}
                        setIsMobileMenuOpen={setIsMobileMenuOpen}
                    />

                    {/* Mobile Drawer */}
                    <MobileDrawer
                        isOpen={isMobileMenuOpen}
                        onClose={() => setIsMobileMenuOpen(false)}
                    />

                    {/* Content */}
                    <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-y-contain pb-16 lg:pb-0">
                        {activePage === "profile" && <Profile />}
                        {activePage === "jobs" && <JobLayout />}
                        {activePage === "settings" && <Settings />}
                        {activePage === "applications" && <Applications />}
                        {activePage === "overview" && <Overview />}
                        {activePage === "interviews" && <InterviewPage />}
                        {activePage === "resume" && <ResumePage />}
                        {activePage === "chats" && <ChatPage />}
                    </main>

                    {/* Mobile Bottom Navigation */}
                    <BottomNavigation />
                </div>
            </div>
        </DashboardLayout>
    );
}

export default Dashboard;