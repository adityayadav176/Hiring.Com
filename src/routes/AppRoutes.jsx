import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

const Login = lazy(() => import("../pages/auth/Login"));
const Signup = lazy(() => import("../pages/auth/Signup"));
const ForgetPassword = lazy(() => import("../pages/auth/ForgetPassword"));
const SendPasswordResetOtp = lazy(() => import("../pages/auth/SendPasswordResetOtp"));
const Dashboard = lazy(() => import("../pages/seeker/Dashboard"));
const ADashboard = lazy(() => import("../pages/admin/ADashboard"));
const ProtectedRoutes = lazy(() => import("./ProtectedRoutes"));
const NotFound = lazy(() => import("../pages/NotFound"));
const RecruiterLayout = lazy(() => import("../pages/recruiter/RecruiterLayout"));
const InterviewRoom = lazy(() => import("../pages/interview/InterviewRoom"));

const AppRoutes = () => {
    return (
        <Suspense fallback={<div className="flex min-h-[300px] items-center justify-center">Loading...</div>}>
            <Routes>
                <Route path="/sendPasswordResetOpt" element={<SendPasswordResetOtp />}/>
                <Route path="/forgetPassword" element={<ForgetPassword />}/>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                <Route element={<ProtectedRoutes allowedType="both" />}>
                    <Route path="/interview/:interviewId" element={<InterviewRoom />}/>
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