import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ForgetPassword from "../pages/auth/ForgetPassword";
import SendPasswordResetOtp from "../pages/auth/SendPasswordResetOtp";
import Dashboard from "../pages/seeker/Dashboard";
import ADashboard from "../pages/admin/ADashboard";
import ProtectedRoutes from "./ProtectedRoutes";
import NotFound from "../pages/NotFound";
import RecruiterLayout from '../pages/recruiter/RecruiterLayout';
import RecruiterApplication from "../components/RecruiterApplication";
import RecruiterInterviews from "../components/RecruiterInterviews";
import CandidateProfile from "../components/CandidateProfile";
import RecruiterProfile from "../components/RecruiterProfile";
import RecruiterDashboard from "../components/RecruiterDashboard";
const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/sendPasswordResetOpt" element={<SendPasswordResetOtp/>}/>
            <Route path="/forgetPassword" element={<ForgetPassword/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/application" element={<RecruiterApplication/>}/>
            <Route path="/interviews" element={<RecruiterInterviews/>}/>
            <Route path="/profile" element={<CandidateProfile/>}/>
            <Route path="rp" element={<RecruiterProfile/>}/>
            <Route path="/dashboard" element={<RecruiterDashboard/>}/>

            <Route element={<ProtectedRoutes allowedType="admin" />}>
            <Route path="/admin" element={<ADashboard/>}/>
            </Route>

            <Route element={<ProtectedRoutes allowedType="recruiter"/>}>
            <Route path="/recruiter" element={<RecruiterLayout/>}/>
            </Route>

            <Route element={<ProtectedRoutes allowedType="user"/>}>
            <Route path="/" element={<Dashboard/>}/>
            </Route>

            <Route path="*" element={<NotFound/>}/>
        </Routes>
    );
};

export default AppRoutes;