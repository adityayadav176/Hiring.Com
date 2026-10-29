import { useEffect, useRef, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth, useAdmin } from "../hooks/Hook";

const ProtectedRoutes = ({ allowedType }) => {
    const { user, recruiter, getUser } = useAuth();
    const { admin, getAdmin } = useAdmin();
    const [checking, setChecking] = useState(true);
    const location = useLocation();

    const getUserRef = useRef(getUser);
    const getAdminRef = useRef(getAdmin);

    getUserRef.current = getUser;
    getAdminRef.current = getAdmin;

    useEffect(() => {
        let active = true;

        const restoreSession = async () => {
            setChecking(true);

            try {
                if (allowedType === "admin") {
                    await getAdminRef.current();
                } else {
                    await getUserRef.current();
                }
            } catch (error) {
                console.error(
                    `Failed to restore ${allowedType} session:`,
                    error
                );
            } finally {
                if (active) {
                    setChecking(false);
                }
            }
        };

        restoreSession();

        return () => {
            active = false;
        };
    }, [allowedType]);

    if (checking) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p>Restoring your session...</p>
            </div>
        );
    }

    if (allowedType === "admin") {
        if (admin) {
            return <Outlet />;
        }

        if (recruiter?.role === "recruiter") {
            return <Navigate to="/recruiter" replace />;
        }

        if (user) {
            return <Navigate to="/" replace />;
        }

        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace
            />
        );
    }

    if (allowedType === "recruiter") {
        if (recruiter?.role === "recruiter") {
            return <Outlet />;
        }

        if (admin) {
            return <Navigate to="/admin" replace />;
        }

        if (user) {
            return <Navigate to="/" replace />;
        }

        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace
            />
        );
    }

    if (allowedType === "user") {
        if (user?.role === "User") {
            return <Outlet />;
        }

        if (admin) {
            return <Navigate to="/admin" replace />;
        }

        if (recruiter?.role === "recruiter") {
            return <Navigate to="/recruiter" replace />;
        }

        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace
            />
        );
    }

    if (allowedType === "both") {
        if (user?.role === "User" || recruiter?.role === "recruiter") {
            return <Outlet />;
        }

        if (admin) {
            return <Navigate to="/admin" replace />;
        }

        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace
            />
        );
    }

    return <Navigate to="/login" replace />;
};

export default ProtectedRoutes;