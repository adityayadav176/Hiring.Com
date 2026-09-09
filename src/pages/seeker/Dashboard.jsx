import React, { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Sidebar from '../../components/layout/Sidebar'
import Navbar from '../../components/layout/Navbar'
import Profile from './Profile'
import Home from './../pubic/Home';

function Dashboard() {
    const [activePage, setActivePage] = useState("home")

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

                    {activePage === "home" && <Home />}

                    {activePage === "profile" && <Profile />}

                </main>

            </div>

        </DashboardLayout>
    )
}

export default Dashboard