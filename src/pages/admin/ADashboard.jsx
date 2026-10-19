import React from 'react';
import Navbar from './../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import { useHome } from '../../hooks/Hook';
import AdminUsers from './AdminUsers';
import AdminCompanies from './AdminCompanies';
import AdminJobs from './AdminJobs';
import AdminReports from './AdminReports';
import AdminProfile from './AdminProfile';
import AdminSettings from './AdminSettings';
import AdminDashboardS from './AdminDashboardS';

function ADashboard() {
    const {adminActivePage, setAdminActivePage} = useHome();
    return (
        <div className="h-screen overflow-hidden flex">
            {/* Fixed Sidebar */}
            <Sidebar/>

            {/* Right side */}
            <div className="flex-1 min-w-0 flex flex-col h-screen">
                
                {/* Fixed Navbar */}
                <Navbar />

                {/* Only this area scrolls */}
                <main className="flex-1 min-h-0 overflow-y-auto">
                    {adminActivePage === "admin/dashboard" && <AdminDashboardS/>}
                    {adminActivePage === "users" && <AdminUsers/>}
                    {adminActivePage === "companies" && <AdminCompanies/>}
                    {adminActivePage === "admin/jobs" && <AdminJobs/>}
                    {adminActivePage === "reports" && <AdminReports/>}
                    {adminActivePage === "admin/profile" && <AdminProfile/>}
                    {adminActivePage === "admin/settings" && <AdminSettings/>}
                </main>

            </div>
        </div>
    );
}

export default ADashboard;