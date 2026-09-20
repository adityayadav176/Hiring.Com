import React from 'react';
import Navbar from './../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import AdminDashboardS from '../../components/Admin/AdminDashboardS';

function ADashboard() {
    return (
        <div className="h-screen overflow-hidden flex">
            {/* Fixed Sidebar */}
            <Sidebar />

            {/* Right side */}
            <div className="flex-1 min-w-0 flex flex-col h-screen">
                
                {/* Fixed Navbar */}
                <Navbar />

                {/* Only this area scrolls */}
                <main className="flex-1 min-h-0 overflow-y-auto">
                    <AdminDashboardS />
                </main>

            </div>
        </div>
    );
}

export default ADashboard;