import React from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Sidebar from '../../components/layout/Sidebar'
import Navbar from './../../components/layout/Navbar';

function Dashboard() {
  return (
    <DashboardLayout>
      <Navbar/>
      <Sidebar/>
    </DashboardLayout>
  )
}

export default Dashboard
