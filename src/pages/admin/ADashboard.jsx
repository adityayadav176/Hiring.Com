import React, { lazy, Suspense } from 'react';
import Navbar from './../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import { useHome } from '../../hooks/Hook';

const AdminUsers = lazy(() => import('./AdminUsers'));
const AdminCompanies = lazy(() => import('./AdminCompanies'));
const AdminJobs = lazy(() => import('./AdminJobs'));
const AdminReports = lazy(() => import('./AdminReports'));
const AdminProfile = lazy(() => import('./AdminProfile'));
const AdminSettings = lazy(() => import('./AdminSettings'));
const AdminDashboardS = lazy(() => import('./AdminDashboardS'));

function ADashboard() {
    const {adminActivePage} = useHome();
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
                    <Suspense fallback={
                        <div className='flex min-h-[300px] items-center justify-center'>
                            Loading admin page...
                        </div>
                    }>
                    {adminActivePage === "admin/dashboard" && <AdminDashboardS/>}
                    {adminActivePage === "users" && <AdminUsers/>}
                    {adminActivePage === "companies" && <AdminCompanies/>}
                    {adminActivePage === "admin/jobs" && <AdminJobs/>}
                    {adminActivePage === "reports" && <AdminReports/>}
                    {adminActivePage === "admin/profile" && <AdminProfile/>}
                    {adminActivePage === "admin/settings" && <AdminSettings/>}
                    </Suspense>
                </main>

            </div>
        </div>
    );
}

export default ADashboard;