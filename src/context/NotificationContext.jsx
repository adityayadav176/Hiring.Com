import { createContext, useState } from "react";

export const NotificationContext = createContext();

const NotificationProvider = ({children}) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [notifications, setNotifications] = useState([]);
    const [notification, setNotification] = useState(null);
    const [notificationPagination, setNotificationPagination] = useState({});
    const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

    const handleGetMyNotification = async() => {
        try {
            const response = await fetch(`${API_URL}/notification`, {
                method: "GET",
                credentials: "include"
            })
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Failed To Fetch Notifications");
            }
            
            setNotifications(data.data.notifications);
            setNotificationPagination(data.data.pagination);
            console.log("Notification Fetched Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

    const handleGetUnreadNotificationCount = async() => {
        try {
            const response = await fetch(`${API_URL}/notification/unread-count`, {
                method: "GET",
                credentials: "include"
            })
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Failed To Fetch NotificationCount");
            }
            
            setUnreadNotificationCount(data.data);
            console.log("NotificationCount Fetched Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

    const handleMarkNotificationAsRead = async({notificationId}) => {
        if (!notificationId) {
            throw new Error("Notification ID Is Required");
        }
        
        try {
            const response = await fetch(`${API_URL}/notification/${notificationId}/read`, {
                method: "PATCH",
                credentials: "include"
            })
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Failed To Mark Notification As Read");
            }

            const updatedNotification = data.data;

            setNotifications((prev) => prev.map((item) => item._id === notificationId ? updatedNotification : item));
            setNotification((prev) => prev?._id === notificationId ? updatedNotification : prev);
            setUnreadNotificationCount((prev) => Math.max(prev - 1, 0));
        
            console.log("Mark Notification As Read Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }
    const handleDeleteNotification = async({notificationId}) => {
        if (!notificationId) {
            throw new Error("Notification ID Is Required");
        }

        try {
            const response = await fetch(`${API_URL}/notification/${notificationId}/delete`, {
                method: "DELETE",
                credentials: "include"
            })
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Failed To Delete Notification");
            }

            const deletedNotification = notifications.find((item) => item._id === notificationId);

            setNotifications((prev) => prev.filter((item) => item._id !== notificationId));
            setNotification((prev) => prev?._id === notificationId ? null : prev);
            
            if(deletedNotification && !deletedNotification.isRead) {
                setUnreadNotificationCount((prev) => Math.max(prev - 1, 0));
            }

            setNotificationPagination((prev) => ({...prev, total: Math.max((prev.total || 0) - 1, 0)}))
            console.log("Notification Deleted Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

    const handleMarkAllNotificationAsRead = async () => {
    try {
        const response = await fetch(`${API_URL}/notification/read-all`, {
            method: "PATCH",
            credentials: "include"
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed To Mark AsRead Notifications"
            );
        }

        const readAt = new Date();

        setNotifications((prev) =>
            prev.map((item) => ({
                ...item,
                isRead: true,
                readAt
            }))
        );

        setNotification((prev) =>
            prev
                ? {
                      ...prev,
                      isRead: true,
                      readAt
                  }
                : prev
        );

        setUnreadNotificationCount(0);

        console.log("All Notifications Marked As Read Successfully");
    } catch (error) {
        console.log(error);
        alert(error.message);
    }
};

    return (
        <NotificationContext.Provider value={{handleDeleteNotification, handleGetMyNotification, handleGetUnreadNotificationCount, handleMarkAllNotificationAsRead, handleMarkNotificationAsRead, notification, notifications, notificationPagination, unreadNotificationCount}}>
            {children}
        </NotificationContext.Provider>
    )
}

export default NotificationProvider;