import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import SendPasswordResetOtp from "../pages/auth/SendPasswordResetOtp";
import ForgetPassword from "../pages/auth/ForgetPassword";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import NotFound from "../pages/NotFound";
import ProtectedRoutes from "./ProtectedRoutes";
import Loading from "../components/loading/loading";

const Dashboard = lazy(() => import("../pages/seeker/Dashboard"));
const ADashboard = lazy(() => import("../pages/admin/ADashboard"));
const RecruiterLayout = lazy(() => import("../pages/recruiter/RecruiterLayout"));
const InterviewRoom = lazy(() => import("../pages/interview/InterviewRoom"));

const AppRoutes = () => {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route path="/sendPasswordResetOpt" element={<SendPasswordResetOtp />} />
                <Route path="/forgetPassword" element={<ForgetPassword />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                <Route element={<ProtectedRoutes allowedType="both" />}>
                    <Route path="/interview/:interviewId" element={<InterviewRoom />} />
                </Route>

                <Route element={<ProtectedRoutes allowedType="admin" />}>
                    <Route path="/admin" element={<ADashboard />} />
                </Route>

                <Route element={<ProtectedRoutes allowedType="recruiter" />}>
                    <Route path="/recruiter" element={<RecruiterLayout />} />
                </Route>

                <Route element={<ProtectedRoutes allowedType="user" />}>
                    <Route path="/" element={<Dashboard />} />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;