import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import SignupForm from "../components/auth/SignupForm";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/Login" element={<Login/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/dashboard" element={<h1>Dashboad</h1>}/>
            <Route path="/recruiter" element={<h1 className="text-3xl text-white items-center justify-center flex">Recruiter</h1>}/>
            <Route path="/seeker" element={<h1 className="text-3xl text-white items-center justify-center flex">Seekar</h1>}/>
            <Route path="*" element={<h1 className="text-3xl text-white items-center justify-center flex">404 - Page Not Found</h1>}/>
        </Routes>
    );
};

export default AppRoutes;