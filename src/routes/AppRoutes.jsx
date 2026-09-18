import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ForgetPassword from "../pages/auth/ForgetPassword";
import SendPasswordResetOtp from "../pages/auth/SendPasswordResetOtp";
import Sidebar from "../components/layout/Sidebar";
import Dashboard from "../pages/seeker/Dashboard";
import Navbar from "../components/layout/Navbar";
import Profile from "../pages/seeker/Profile";
import JobLayout from "../components/jobs/JobLayout";
import Settings from "../pages/seeker/Settings";
import ApplyJobModal from "../components/applications/ApplyForJob";
import Overview from "../pages/pubic/Overview";
import AdminDashboard from "../components/AdminDashboard";
import AdminDashboardS from "../components/Admin/AdminDashboardS";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Dashboard/>}/>
            <Route path="/admin" element={<AdminDashboard/>}/>
            <Route path="/admins" element={<AdminDashboardS/>}/>
            <Route path="/overview" element={<Overview/>}/>
            <Route path="/apply" element={<ApplyJobModal/>}/>
            <Route path="/settings" element={<Settings/>}/>
            <Route path="/settingsPage" element={<Settings/>}/>
            <Route path="/jobLayout" element={<JobLayout/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/navbar" element={<Navbar/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/dashboard" element={<h1>Dashboad</h1>}/>
            <Route path="/sendPasswordResetOpt" element={<SendPasswordResetOtp/>}/>
            <Route path="/forgetPassword" element={<ForgetPassword/>}/>
            <Route path="/sidebar" element={<Sidebar/>}/>
            <Route path="*" element={<h1 className="text-3xl text-white items-center justify-center flex">404 - Page Not Found</h1>}/>
        </Routes>
    );
};

export default AppRoutes;