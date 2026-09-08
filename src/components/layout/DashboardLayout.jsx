import React from 'react'

function DashboardLayout({ children }) {

  return (
    <div className="min-h-screen flex bg-slate-50">
      {children}
    </div>
  )
}

export default DashboardLayout