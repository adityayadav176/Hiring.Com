import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ForgetPassword from "../pages/auth/ForgetPassword";
import SendPasswordResetOtp from "../pages/auth/SendPasswordResetOtp";
import Sidebar from "../components/layout/Sidebar";
import Dashboard from "../pages/seeker/Dashboard";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Dashboard/>}/>
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