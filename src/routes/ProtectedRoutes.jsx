import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/Hook";

const ProtectedRoutes = ({ allowedType }) => {

    const {
        user,
        admin,
        recruiter,
    } = useAuth();



    // =========================================
    // ADMIN ROUTES
    // =========================================

    if (allowedType === "admin") {

        // Not logged in as admin
        if (!admin) {

            // If another account is logged in,
            // don't logout them — just redirect them.
            if (user || recruiter) {
                return <Navigate to="/" replace />;
            }

            // Nobody is logged in
            return <Navigate to="/login" replace />;
        }

        // Logged-in admin
        if (admin.type !== "admin") {
            return <Navigate to="/" replace />;
        }

        return <Outlet />;
    }


    // =========================================
    // USER ROUTES
    // =========================================

    if (allowedType === "user") {

        // No user logged in
        if (!user) {

            // Admin is logged in
            if (admin) {
                return <Navigate to="/admin" replace />;
            }

            // Recruiter is logged in
            if (recruiter) {
                return <Navigate to="/recruiter" replace />;
            }

            // Nobody logged in
            return <Navigate to="/login" replace />;
        }

        if (user.role !== "User") {
            return <Navigate to="/" replace />;
        }

        return <Outlet />;
    }


    // =========================================
    // RECRUITER ROUTES
    // =========================================

    if (allowedType === "recruiter") {

        if (!recruiter) {

            // Admin is logged in
            if (admin) {
                return <Navigate to="/admin" replace />;
            }

            // Normal user is logged in
            if (user) {
                return <Navigate to="/" replace />;
            }

            // Nobody logged in
            return <Navigate to="/login" replace />;
        }

        if (recruiter.role !== "recruiter") {
            return <Navigate to="/" replace />;
        }

        return <Outlet />;
    }


    return <Navigate to="/login" replace />;
};

export default ProtectedRoutes;