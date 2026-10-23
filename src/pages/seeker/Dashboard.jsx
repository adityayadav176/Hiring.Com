import DashboardLayout from "../../components/layout/DashboardLayout";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import Profile from "./Profile";
import JobLayout from "../../components/jobs/JobLayout";
import Settings from "./Settings";
import Application from "./Application";
import { useHome } from "../../hooks/Hook";
import Overview from "./../pubic/Overview";
import ADashboard from "./../admin/ADashboard";
import InterviewPage from "./InterviewPage";
import ResumePage from "./ResumePage";

function Dashboard() {
  const { activePage, setActivePage } = useHome();

  return (
    <DashboardLayout>
      <div className="flex min-h-0 w-full flex-1">
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
        />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <Navbar
            activePage={activePage}
            setActivePage={setActivePage}
          />

          <main
            className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-y-contain"
          >
            {activePage === "profile" && <Profile />}
            {activePage === "jobs" && <JobLayout />}
            {activePage === "settings" && <Settings />}
            {activePage === "applications" && <Application />}
            {activePage === "overview" && <Overview />}
            {activePage === "admin/dashboard" && <ADashboard />}
            {activePage === "interviews" && <InterviewPage />}
            {activePage === "resume" && <ResumePage />}
          </main>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
