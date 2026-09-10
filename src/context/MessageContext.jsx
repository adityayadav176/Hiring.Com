import { createContext, useState } from "react";

export const MessageContext = createContext();

const MessageProvider = ({children}) => {
    const API_URL = import.meta.env.VITE_API_URL;

    const [messages, setMessages] = useState([]);
    const [messagesPagination, setMessagesPagination] = useState({});

    const handleGetMessages = async({conversationId}) => {
        if(!conversationId) {
            throw new Error("ConversationId Required");
        }
        try {
            const response = await fetch(`${API_URL}/messages/${conversationId}`, {
                method: "GET",
                credentials: "include"
            })
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Failed To Fetch Messages");
            }
    
            setMessages(data.data.messages);
            setMessagesPagination(data.data.pagination);
    
            console.log("Messages Fetched Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

    const handleEditMessage = async({messageId, content}) => {
        if(!messageId) {
            throw new Error("messageId Required");
        }

        try {
            const response = await fetch(`${API_URL}/messages/${messageId}`, {
                headers: {
                    "Content-Type":"application/json"
                },
                credentials: "include",
                method: "PATCH",
                body: JSON.stringify({content})
            });
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Failed To Update Messages")
            }
    
            console.log("Messages Updated Successfully");
            setMessages((prev) => prev.map((message) => message._id === messageId ? data.data : message));
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

    const handleDeleteMessage = async({messageId}) => {
        if(!messageId) {
            throw new Error("messageId Required");
        }
        try {
            const response = await fetch(`${API_URL}/messages/${messageId}`, {
                credentials: "include",
                method: "DELETE"
            });
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Failed To Delete Messages")
            }
    
            console.log("Messages Delete Successfully");
            setMessages((prev) => prev.filter((message) => message._id !== messageId));
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

    const handleMarkMessageAsRead = async({messageId}) => {
        if(!messageId) {
            throw new Error("messageId Required");
        }
        try {
            const response = await fetch(`${API_URL}/messages/${messageId}/read`, {
                credentials: "include",
                method: "PATCH"
            });
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Failed To Mark As Read Message")
            }   
    
            console.log("Mark As Read Message Successfully");
            setMessages((prev) => prev.map((message) => message._id === messageId ? data.data : message));
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

    const handleMarkAsDelivered = async({messageId}) => {
        if(!messageId) {
            throw new Error("messageId Required");
        }
        try {
            const response = await fetch(`${API_URL}/messages/${messageId}/delivered`, {
                credentials: "include",
                method: "PATCH"
            });
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Failed To Mark As delivered Message")
            }   
    
            console.log("Mark As delivered Message Successfully");
            setMessages((prev) => prev.map((message) => message._id === messageId ? data.data : message));
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }
    return (
        <MessageContext.Provider value={{handleMarkAsDelivered, handleDeleteMessage, handleEditMessage, handleGetMessages, handleMarkMessageAsRead, messages, messagesPagination}}>
            {children}
        </MessageContext.Provider>
    )
}

export default MessageProvider;