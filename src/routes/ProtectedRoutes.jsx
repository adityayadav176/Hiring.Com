import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { useAdmin, useAuth } from "../hooks/Hook";
import Loading from './../components/loading/loading';

function ProtectedRoutes({ allowedType }) {
  const {
    user,
    recruiter,
    getUser,
  } = useAuth();

  const {getAdmin, admin} = useAdmin();

  const location = useLocation();

  const [checking, setChecking] = useState(true);

  const getUserRef = useRef(getUser);
  const getAdminRef = useRef(getAdmin);

  useEffect(() => {
    getUserRef.current = getUser;
  }, [getUser]);

  useEffect(() => {
    getAdminRef.current = getAdmin;
  }, [getAdmin]);

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
          "Protected route session restoration failed:",
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
      <Loading/>
    );
  }

  // Admin route
  if (allowedType === "admin") {
    if (admin) {
      return <Outlet />;
    }

    if (recruiter) {
      return <Navigate to="/recruiter" replace />;
    }

    if (user) {
      return <Navigate to="/" replace />;
    }

    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Recruiter route
  if (allowedType === "recruiter") {
    if (recruiter) {
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
        replace
        state={{ from: location }}
      />
    );
  }

  // User route
  if (allowedType === "user") {
    if (user?.role === "User") {
      return <Outlet />;
    }

    if (admin) {
      return <Navigate to="/admin" replace />;
    }

    if (recruiter) {
      return <Navigate to="/recruiter" replace />;
    }

    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // User or recruiter
  if (allowedType === "both") {
    if (user || recruiter) {
      return <Outlet />;
    }

    if (admin) {
      return <Navigate to="/admin" replace />;
    }

    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Navigate to="/login" replace />;
}

export default ProtectedRoutes;