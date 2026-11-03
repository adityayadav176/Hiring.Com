import { useState } from "react";

import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import MobileDrawer from "../../components/layout/MobileDrawer";
import BottomNavigation from "../../components/layout/BottomNavigation";

import { useHome } from "../../hooks/Hook";

import AdminUsers from "./AdminUsers";
import AdminCompanies from "./AdminCompanies";
import AdminJobs from "./AdminJobs";
import AdminReports from "./AdminReports";
import AdminProfile from "./AdminProfile";
import AdminSettings from "./AdminSettings";
import AdminDashboardS from "./AdminDashboardS";

function ADashboard() {
    const { adminActivePage } = useHome();

    const [isMobileMenuOpen, setIsMobileMenuOpen] =
        useState(false);

    return (
        <div className="flex h-screen overflow-hidden">

            {/* Desktop Sidebar */}
            <Sidebar />

            {/* Right Side */}
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

                {/* Main Content */}
                <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-y-contain pb-16 lg:pb-0">

                    {adminActivePage === "admin/dashboard" && (
                        <AdminDashboardS />
                    )}

                    {adminActivePage === "users" && (
                        <AdminUsers />
                    )}

                    {adminActivePage === "companies" && (
                        <AdminCompanies />
                    )}

                    {adminActivePage === "admin/jobs" && (
                        <AdminJobs />
                    )}

                    {adminActivePage === "reports" && (
                        <AdminReports />
                    )}

                    {adminActivePage === "admin/profile" && (
                        <AdminProfile />
                    )}

                    {adminActivePage === "admin/settings" && (
                        <AdminSettings />
                    )}

                </main>

                {/* Mobile Bottom Navigation */}
                <BottomNavigation />

            </div>
        </div>
    );
}

export default ADashboard;