import { createContext, useState } from "react";

export const SessionContext = createContext();

const SessionProvider = ({ children }) => {
    const API_URL = import.meta.env.VITE_API_URL;

    const [sessions, setSessions] = useState([]);
    const [sessionsLoading, setSessionsLoading] = useState(false);

    const handleGetAllSession = async () => {
        setSessionsLoading(true);

        try {
            const response = await fetch(
                `${API_URL}/session`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            if (response.status === 401) {
                setSessions([]);

                window.location.replace("/login");

                return [];
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    "Failed to fetch all sessions"
                );
            }

            const sessionData = Array.isArray(data?.data)
                ? data.data
                : [];

            setSessions(sessionData);

            console.log(
                "Sessions fetched successfully:",
                sessionData
            );

            return sessionData;
        } catch (error) {
            console.error(
                "Get all sessions error:",
                error
            );

            setSessions([]);

            throw error;
        } finally {
            setSessionsLoading(false);
        }
    };

    const handleLogoutADevice = async ({ sessionId }) => {
        if (!sessionId) {
            throw new Error("Session ID is required");
        }

        try {
            const response = await fetch(
                `${API_URL}/session/logoutSpecificDevice/${sessionId}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            /*
             * Current session expired.
             * Redirect instead of showing an alert.
             */
            if (response.status === 401) {
                setSessions([]);

                window.location.replace("/login");

                return;
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    "Failed to logout this device"
                );
            }

            setSessions((prev) =>
                prev.filter(
                    (session) =>
                        session.sessionId !== sessionId
                )
            );

            console.log(
                "Specific device logged out successfully"
            );

            return data;
        } catch (error) {
            console.error(
                "Logout specific device error:",
                error
            );

            throw error;
        }
    };

    const handleLogoutAllDevices = async () => {
        try {
            const response = await fetch(
                `${API_URL}/session/logoutAllDevice`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );
            
            if (response.status === 401) {
                setSessions([]);

                window.location.replace("/login");

                return;
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    "Failed to logout all devices"
                );
            }

            setSessions([]);

            console.log(
                "Logged out from all devices successfully"
            );

            window.location.replace("/login");

            return data;
        } catch (error) {
            console.error(
                "Logout all devices error:",
                error
            );

            throw error;
        }
    };

    return (
        <SessionContext.Provider
            value={{
                sessions,
                sessionsLoading,
                handleGetAllSession,
                handleLogoutADevice,
                handleLogoutAllDevices,
            }}
        >
            {children}
        </SessionContext.Provider>
    );
};

export default SessionProvider;