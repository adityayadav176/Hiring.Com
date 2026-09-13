import React, { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Sidebar from '../../components/layout/Sidebar'
import Navbar from '../../components/layout/Navbar'
import Profile from './Profile'
import JobLayout from '../../components/jobs/JobLayout'
import Settings from './Settings'
import Application from "./Application"
import { useHome } from '../../hooks/Hook'
import Overview from './../pubic/Overview';

function Dashboard() {
    const {activePage, setActivePage} = useHome();
    return (
        <DashboardLayout>

            {/* Sidebar */}
            <Sidebar
                activePage={activePage}
                setActivePage={setActivePage}
            />

            {/* Right side */}
            <div className="flex-1 min-w-0 flex flex-col min-h-0">

                {/* Navbar */}
                <Navbar activePage={activePage} setActivePage={setActivePage}/>

                {/* Content */}
                <main className="flex-1 min-h-0 overflow-y-auto">

                    {activePage === "profile" && <Profile />}

                    {activePage === "jobs" && <JobLayout/>}

                    {activePage === "settings" && <Settings/>}

                    {activePage === "applications" && <Application/>}

                    {activePage === "overview" && <Overview/>}

                </main>

            </div>

        </DashboardLayout>
    )
}

export default Dashboard