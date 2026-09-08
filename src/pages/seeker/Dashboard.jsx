import React from 'react'

import DashboardLayout from '../../components/layout/DashboardLayout'
import Sidebar from '../../components/layout/Sidebar'
import Navbar from './../../components/layout/Navbar'
import Home from './../pubic/Home'

function Dashboard() {

  return (
    <DashboardLayout>

      <Sidebar />

      <div className="flex-1 min-w-0">

        <Navbar />

        <Home />

      </div>

    </DashboardLayout>
  )
}

export default Dashboard