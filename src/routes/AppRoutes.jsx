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
            <Routes>
                <Route path="/sendPasswordResetOpt" element={<SendPasswordResetOtp />} />
                <Route path="/forgetPassword" element={<ForgetPassword />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                <Route element={<ProtectedRoutes allowedType="both" />}>
                    <Route path="/interview/:interviewId" element={
                        <Suspense fallback={<Loading />}>
                            <InterviewRoom />
                        </Suspense>
                    } />
                </Route>

                <Route element={<ProtectedRoutes allowedType="admin" />}>
                        <Route path="/admin" element={
                            <Suspense fallback={<Loading />}>
                                <ADashboard />
                            </Suspense>
                        } />
                </Route>

                <Route element={<ProtectedRoutes allowedType="recruiter" />}>
                        <Route path="/recruiter" element={
                            <Suspense fallback={<Loading />}>
                                <RecruiterLayout />
                            </Suspense>
                        } />
                </Route>

                <Route element={<ProtectedRoutes allowedType="user" />}>
                        <Route path="/" element={
                            <Suspense fallback={<Loading />}>
                                <Dashboard />
                            </Suspense>
                        } />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
    );
};

export default AppRoutes;