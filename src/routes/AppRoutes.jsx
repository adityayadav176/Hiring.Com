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
import CandidateProfile from "../components/CandidateProfile";
import RecruiterProfileS from "../components/RecruiterProfile";
import RecruiterProfile from "../components/RecruiterProfile";
const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/sendPasswordResetOpt" element={<SendPasswordResetOtp/>}/>
            <Route path="/forgetPassword" element={<ForgetPassword/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/profile" element={<CandidateProfile/>}/>
            <Route path="rp" element={<RecruiterProfileS/>}/>
            <Route path="/recruiterP" element={<RecruiterProfile/>}/>

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