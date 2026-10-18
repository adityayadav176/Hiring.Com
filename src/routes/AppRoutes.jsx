import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ForgetPassword from "../pages/auth/ForgetPassword";
import SendPasswordResetOtp from "../pages/auth/SendPasswordResetOtp";
import Dashboard from "../pages/seeker/Dashboard";
import ADashboard from "../pages/admin/ADashboard";
import ProtectedRoutes from "./ProtectedRoutes";
import RecruiterLayout from "../recruiter/components/RecruiterLayout";
import RecruiterJobs from "../recruiter/pages/RecruiterJobs";
import RecruiterJobsLayout from "../recruiter/pages/RecruiterJobsLayout";
import NotFound from "../pages/NotFound";
const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/sendPasswordResetOpt" element={<SendPasswordResetOtp/>}/>
            <Route path="/forgetPassword" element={<ForgetPassword/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<Signup/>}/>

            <Route path="/recruiter" element={<RecruiterLayout/>}/>
            <Route path="/recruiter/jobs" element={<RecruiterJobs />}/>
            <Route path="/recruiter/jobsLayout" element={<RecruiterJobsLayout />}/>


            <Route element={<ProtectedRoutes allowedType="admin" />}>
            <Route path="/admin" element={<ADashboard/>}/>
            </Route>

            <Route element={<ProtectedRoutes allowedType="recruiter"/>}>
            <Route path="/recruiter" element={<Dashboard/>}/>
            </Route>

            <Route element={<ProtectedRoutes allowedType="user"/>}>
            <Route path="/" element={<Dashboard/>}/>
            </Route>

            <Route path="*" element={<NotFound/>}/>
        </Routes>
    );
};

export default AppRoutes;