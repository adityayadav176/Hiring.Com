import { lazy, Suspense } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { useHome } from "../../hooks/Hook";

const Profile = lazy(() => import("./Profile"));
const JobLayout = lazy(() => import("../../components/jobs/JobLayout"));
const Settings = lazy(() => import("./Settings"));
const Application = lazy(() => import("./Application"));
const Overview = lazy(() => import("./../pubic/Overview"));
const ADashboard = lazy(() => import("./../admin/ADashboard"));
const InterviewPage = lazy(() => import("./InterviewPage"));
const ResumePage = lazy(() => import("./ResumePage"));
const ChatPage = lazy(() => import("../../components/chat/ChatPage"));

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
            <Suspense fallback={
              <div className="flex min-h-[300px] items-center justify-center">
                Loading page...
              </div>
            }>
            {activePage === "profile" && <Profile />}
            {activePage === "jobs" && <JobLayout />}
            {activePage === "settings" && <Settings />}
            {activePage === "applications" && <Application />}
            {activePage === "overview" && <Overview />}
            {activePage === "interviews" && <InterviewPage />}
            {activePage === "resume" && <ResumePage />}
            {activePage === "chats" && <ChatPage/>}
            </Suspense>
          </main>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
