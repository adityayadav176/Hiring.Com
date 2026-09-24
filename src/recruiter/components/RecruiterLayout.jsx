import React from "react";
import RecruiterNavbar from "./RecruiterNavbar";
import { Outlet } from "react-router-dom";
import RecruiterSidebar from "./RecruiterSide";

function RecruiterLayout() {
  return (
    <div className="h-screen overflow-hidden bg-[#F7F8FC]">

      {/* Navbar */}
      <RecruiterNavbar />

      {/* Area below navbar */}
      <div className="flex h-[calc(100vh-92px)] overflow-hidden">

        {/* Sidebar */}
        <div className="h-full shrink-0 overflow-hidden">
          <RecruiterSidebar />
        </div>

        {/* Main */}
        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="px-4 py-5 md:px-6 lg:px-6">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}

export default RecruiterLayout;