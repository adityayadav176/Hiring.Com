import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ForgetPassword from "../pages/auth/ForgetPassword";
import SendPasswordResetOtp from "../pages/auth/SendPasswordResetOtp";
import Dashboard from "../pages/seeker/Dashboard";

import Profile from "../pages/seeker/Profile";
import JobLayout from "../components/jobs/JobLayout";

import AdminDashboardS from "../components/Admin/AdminDashboardS";
import ADashboard from "../pages/admin/ADashboard";
import ProtectedRoutes from "./ProtectedRoutes";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/sendPasswordResetOpt" element={<SendPasswordResetOtp/>}/>
            <Route path="/forgetPassword" element={<ForgetPassword/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<Signup/>}/>

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