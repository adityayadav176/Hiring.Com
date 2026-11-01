
import { lazy, Suspense } from "react";

import Navbar from "../../components/layout/Navbar";
import { useHome } from "../../hooks/Hook";
import Sidebar from "../../components/layout/Sidebar";

const RecruiterJobs = lazy(() => import("./RecruiterJobs"));
const RecruiterApplication = lazy(() => import("./RecruiterApplication"));
const RecruiterInterviews = lazy(() => import("./RecruiterInterviews"));
const RecruiterDashboard = lazy(() => import("./RecruiterDashboard"));
const Settings = lazy(() => import("../seeker/Settings"));
const RecruiterProfile = lazy(() => import("./RecruiterProfile"));
const RecruiterCompanies = lazy(() => import("./RecruiterCompanies"));
const CandidateProfile = lazy(() => import("./CandidateProfile"));
const ChatPage = lazy(() => import("../../components/chat/ChatPage"));

export default function RecruiterLayout() {
    const { recruiterActivePage } = useHome();

    return (
        <Suspense
            fallback={
                <div className="flex min-h-[300px] items-center justify-center">
                    Loading recruiter page...
                </div>
            }
        >
            {recruiterActivePage === "/recruiter/chat" ? (
                <div className="h-screen w-screen overflow-hidden">
                    <ChatPage />
                </div>
            ) : (
                <div className="h-screen overflow-hidden flex">
                    <Sidebar />

                    <div className="flex-1 min-w-0 flex flex-col h-screen">
                        <Navbar />

                        <main className="flex-1 min-h-0 overflow-y-auto">
                            {recruiterActivePage === "recruiter/dashboard" && <RecruiterDashboard />}
                            {recruiterActivePage === "recruiter/jobs" && <RecruiterJobs />}
                            {recruiterActivePage === "recruiter/application" && <RecruiterApplication />}
                            {recruiterActivePage === "recruiter/interviews" && <RecruiterInterviews />}
                            {recruiterActivePage === "recruiter/settings" && <Settings />}
                            {recruiterActivePage === "recruiter/profile" && <RecruiterProfile />}
                            {recruiterActivePage === "recruiter/company" && <RecruiterCompanies />}
                            {recruiterActivePage === "/recruiter/candidate/profile" && <CandidateProfile />}
                        </main>
                    </div>
                </div>
            )}
        </Suspense>
    );
}
