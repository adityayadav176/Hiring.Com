import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<h1 className="text-3xl text-white items-center justify-center flex">Home</h1>}/>
            <Route path="/Login" element={<Login/>}/>
            <Route path="/signup" element={<h1 className="text-3xl text-white items-center justify-center flex">Signup</h1>}/>
            <Route path="/admin/dashboard" element={<h1 className="text-3xl text-white items-center justify-center flex">Admin</h1>}/>
            <Route path="/recruiter" element={<h1 className="text-3xl text-white items-center justify-center flex">Recruiter</h1>}/>
            <Route path="/seeker" element={<h1 className="text-3xl text-white items-center justify-center flex">Seekar</h1>}/>
            <Route path="*" element={<h1 className="text-3xl text-white items-center justify-center flex">404 - Page Not Found</h1>}/>
        </Routes>
    );
};

export default AppRoutes;