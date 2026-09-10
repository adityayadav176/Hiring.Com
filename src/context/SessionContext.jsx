import { createContext, useState } from "react";

export const SessionContext = createContext();

const SessionProvider = ({children}) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [sessions, setSessions] = useState([]);

    const handleGetAllSession = async() => {
        try {
            const response = await fetch(`${API_URL}/session`, {
                credentials: "include",
                method: "GET"
            });
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Failed To Fetch All Sessions");
            }
    
            setSessions(data.data);
    
            console.log("Session Fetched Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

    const handleLogoutAllDevices = async() => {
        try {
            const response = await fetch(`${API_URL}/session/logoutAllDevice`, {
                credentials: "include",
                method: "DELETE"
            });
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Failed To Logout All Sessions");
            }

            setSessions([]);
    
            console.log("Sessions Logout Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

    const handleLogoutADevice = async({sessionId}) => {

        if(!sessionId) {
            throw new Error("SessionId Is Required");
        }
        try {
            const response = await fetch(`${API_URL}/session/logoutSpecificDevice/${sessionId}`, {
                credentials: "include",
                method: "DELETE"
            });
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Failed To Logout A Session");
            }
            
            setSessions((prev) => prev.filter((item) => item._id !== sessionId));
            
            console.log("Session Logout Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }
    return (
        <SessionContext.Provider value={{handleGetAllSession, handleLogoutADevice, handleLogoutAllDevices, sessions}}>
            {children}
        </SessionContext.Provider>
    )
}

export default SessionProvider;