import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/Hook";
import { useEffect } from "react";

export const HomeRedirect = () => {
  const { user, recruiter, getUser } = useAuth();

  useEffect(() => {
    getUser();
  }, [getUser]);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  if (recruiter) {
    return <Navigate to="/recruiter" replace />;
  }

  return <Navigate to="/login" replace />;
};