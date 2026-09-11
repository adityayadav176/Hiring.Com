import { createContext, useState } from "react";

export const ConversationContext = createContext();

const ConversationProvider = ({children}) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [conversation, setConversation] = useState(null);
    const [myConversations, setMyConversations] = useState([]);

    const handleCreateAndGetConversation = async({participantId, conversationType, groupName, participants}) => {
        try {
            const response = await fetch(`${API_URL}/conversation`, {
                credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({participantId, conversationType, groupName, participants})
            })
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Failed to Create Conversation");
            }

            setConversation(data.data);
            setMyConversations((prev) => [data.data, ...prev]);
            console.log("Create Conversation Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

    const handleGetMyConversations = async() => {
        try {
            const response = await fetch(`${API_URL}/conversation/me`, {
                credentials: "include",
                method: "GET"
            });
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Failed To Fatch Conversation");
            }
    
            setMyConversations(data.data);
            console.log("Conversation Fatched Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

    const handleGetConversationById = async({conversationId}) => {
        if(!conversationId) {
            throw new Error("ConversationId Required");
        }
        try {
            const response = await fetch(`${API_URL}/conversation/${conversationId}`, {
                credentials: "include",
                method: "GET"
            });
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Failed To Fetch Conversation");
            }
    
            setConversation(data.data);
            console.log("Conversation Fetched Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

    const handlePermanentlyDeleteConversation = async({conversationId}) => {
        if(!conversationId) {
            throw new Error("ConversationId Required");
        }
        try {
            const response = await fetch(`${API_URL}/conversation/${conversationId}/permanent`, {
                credentials: "include",
                method: "DELETE"
            });
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Failed To Delete Conversation");
            }
    
            setMyConversations((prev) => prev.filter((item) => item._id !== conversationId));
    
            console.log("Delete Conversation Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

    const handleDeleteConversation = async({conversationId}) => {
        if(!conversationId) {
            throw new Error("ConversationId Required");
        }
        try {
            const response = await fetch(`${API_URL}/conversation/${conversationId}/delete`, {
                credentials: "include",
                method: "PATCH"
            });
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Failed To Delete Conversation");
            }
    
            setMyConversations((prev) => prev.filter((item) => item._id !== conversationId));
    
            console.log("Delete Conversation Successfullly");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

    const handleRestoreConversation = async({conversationId}) => {

        if(!conversationId) {
            throw new Error("ConversationId Required");
        }
        try {
            const response = await fetch(`${API_URL}/conversation/${conversationId}/restore`, {
                credentials: "include",
                method: "PATCH"
            });
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.message || "Restore Conversation Successfully");
            }
    
            setMyConversations  ((prev) => [data.data, ...prev]);
            console.log("Conversation Restore Successfully");
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    } 
    return (
        <ConversationContext.Provider value={{handleCreateAndGetConversation, handleDeleteConversation, handleGetConversationById, handleGetMyConversations, handlePermanentlyDeleteConversation, handleRestoreConversation, conversation, myConversations}}>
            {children}
        </ConversationContext.Provider>
    )
}

export default ConversationProvider;