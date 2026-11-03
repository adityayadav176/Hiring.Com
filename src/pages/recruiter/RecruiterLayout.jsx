import { useState } from "react";
import { useHome } from "../../hooks/Hook";
import Navbar from "../../components/layout/Navbar";
import MobileDrawer from "../../components/layout/MobileDrawer";
import RecruiterDashboard from './RecruiterDashboard';
import RecruiterJobs from './RecruiterJobs';
import RecruiterApplication from './RecruiterApplication';
import RecruiterInterviews from './RecruiterInterviews';
import RecruiterProfile from './../../components/RecruiterProfile';
import RecruiterCompanies from './RecruiterCompanies';
import CandidateProfile from './../../components/CandidateProfile';
import BottomNavigation from "../../components/layout/BottomNavigation";
import Settings from "../seeker/Settings";
import Sidebar from "../../components/layout/Sidebar";
import ChatPage from "../../components/chat/ChatPage";

export default function RecruiterLayout() {
  const { recruiterActivePage } = useHome();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Full-screen chat, without dashboard navigation
  if (recruiterActivePage === "/recruiter/chat") {
    return (
      <div className="h-[100dvh] w-full overflow-hidden">
        <ChatPage />
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] min-h-0 overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Dashboard */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
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

        {/* Page Content */}
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-y-contain pb-16 lg:pb-0">
          {recruiterActivePage === "recruiter/dashboard" && <RecruiterDashboard />}
          {recruiterActivePage === "recruiter/jobs" && <RecruiterJobs />}
          {recruiterActivePage === "recruiter/application" && <RecruiterApplication />}
          {recruiterActivePage === "recruiter/interviews" && <RecruiterInterviews />}
          {recruiterActivePage === "recruiter/settings" && <Settings />}
          {recruiterActivePage === "recruiter/profile" && <RecruiterProfile />}
          {recruiterActivePage === "recruiter/company" && <RecruiterCompanies />}
          {recruiterActivePage === "/recruiter/candidate/profile" && <CandidateProfile />}
        </main>

        <BottomNavigation />
      </div>
    </div>
  );
}