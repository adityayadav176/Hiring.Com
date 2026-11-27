import { Routes, Route } from "react-router-dom";
import SendPasswordResetOtp from "../pages/auth/SendPasswordResetOtp";
import ForgetPassword from "../pages/auth/ForgetPassword";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import NotFound from "../pages/NotFound";
import ProtectedRoutes from "./ProtectedRoutes";
import Dashboard from "../pages/seeker/Dashboard" 
import RecruiterLayout from "../pages/recruiter/RecruiterLayout"
import ADashboard from "../pages/admin/ADashboard"
import InterviewRoom from "../pages/interview/InterviewRoom"
import DocumentTitle from '../documentTitle';

const AppRoutes = () => {
    return (
        <>
        <DocumentTitle/>
            <Routes>
                <Route path="/sendPasswordResetOpt" element={<SendPasswordResetOtp />} />
                <Route path="/forgetPassword" element={<ForgetPassword />} />
                <Route path="/" element={<Login/>} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                <Route element={<ProtectedRoutes allowedType="both" />}>
                    <Route path="/interview/:interviewId" element={<InterviewRoom />} />
                </Route>

                <Route element={<ProtectedRoutes allowedType="admin" />}>
                        <Route path="/admin" element={ <ADashboard />} />
                </Route>

                <Route element={<ProtectedRoutes allowedType="recruiter" />}>
                        <Route path="/recruiter" element={<RecruiterLayout />} />
                </Route>

                <Route element={<ProtectedRoutes allowedType="user" />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
            </>
    );
};

export default AppRoutes;