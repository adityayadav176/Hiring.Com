import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ForgetPassword from "../pages/auth/ForgetPassword";
import SendPasswordResetOtp from "../pages/auth/SendPasswordResetOtp";
import Dashboard from "../pages/seeker/Dashboard";
import JobLayout from "../components/jobs/JobLayout";
import AdminDashboardS from "../components/Admin/AdminDashboardS";
import ADashboard from "../pages/admin/ADashboard";
import ProtectedRoutes from "./ProtectedRoutes";
import AdminUsers from "../pages/admin/AdminUsers";
import Userss from "../pages/admin/Userss";
import Companies from "../pages/admin/Companies";
import Settings from "../pages/seeker/Settings";
import RecruiterLayout from "../recruiter/components/RecruiterLayout";
import RecruiterJobs from "../recruiter/pages/RecruiterJobs";
import RecruiterJobsLayout from "../recruiter/pages/RecruiterJobsLayout";
import InterviewDashboard from "../pages/seeker/InterviewDashboard";
import InterviewPage from "../pages/seeker/InterviewPage";
// import TwoFactorModal from "../pages/seeker/2FA";
import TwoFactorModal from './../pages/seeker/TwoFactorModal';
import GoogleButton from "../components/auth/GoogleButton";
// import ResumePage from "../pages/seeker/Resume";
import Resume from "../pages/seeker/Resume";
import ResumePage from "../pages/seeker/ResumePage";
const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/sendPasswordResetOpt" element={<SendPasswordResetOtp/>}/>
            <Route path="/forgetPassword" element={<ForgetPassword/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/admin/users" element={<AdminUsers/>}/>
            <Route path="/users" element={<Userss/>}/>
            <Route path="/companies" element={<Companies/>}/>
            <Route path="/settings" element={<Settings/>}/>
            <Route path="/interview" element={<InterviewDashboard/>}/>
            <Route path="/resume" element={<Resume/>}/>
            <Route path="/cv" element={<ResumePage/>}/>

            <Route path="/recruiter" element={<RecruiterLayout/>}/>
            <Route path="/recruiter/jobs" element={<RecruiterJobs />}/>
            <Route path="/recruiter/jobsLayout" element={<RecruiterJobsLayout />}/>


            <Route element={<ProtectedRoutes allowedType="admin" />}>
            <Route path="/admin" element={<ADashboard/>}/>
            <Route path="/admins" element={<AdminDashboardS/>}/>
            
            </Route>

            <Route element={<ProtectedRoutes allowedType="recruiter"/>}>
            <Route path="/recruiter" element={<Dashboard/>}/>
            </Route>

            <Route element={<ProtectedRoutes allowedType="user"/>}>
            <Route path="/jobLayout" element={<JobLayout/>}/>
            <Route path="/" element={<Dashboard/>}/>
            </Route>

            <Route path="*" element={<h1 className="text-3xl text-white items-center justify-center flex">404 - Page Not Found</h1>}/>
        </Routes>
    );
};

export default AppRoutes;