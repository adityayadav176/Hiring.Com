import { createContext, useCallback, useState } from "react";

export const MessageContext = createContext();

const MessageProvider = ({ children }) => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [messages, setMessages] = useState([]);
  const [messagesPagination, setMessagesPagination] = useState({});

  const handleGetMessages = useCallback(
    async ({ conversationId }) => {
      if (!conversationId) {
        throw new Error("Conversation ID required");
      }

      try {
        const response = await fetch(
          `${API_URL}/messages/${conversationId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to fetch messages"
          );
        }

        setMessages(data?.data?.messages ?? []);
        setMessagesPagination(data?.data?.pagination ?? {});

        console.log("Messages fetched successfully");

        return data.data;
      } catch (error) {
        console.error("Failed to fetch messages:", error);
        alert(error.message);
        throw error;
      }
    },
    [API_URL]
  );

  const handleEditMessage = useCallback(
    async ({ messageId, content }) => {
      if (!messageId) {
        throw new Error("Message ID required");
      }

      if (typeof content !== "string" || !content.trim()) {
        throw new Error("Message content is required");
      }

      try {
        const response = await fetch(
          `${API_URL}/messages/${messageId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            method: "PATCH",
            body: JSON.stringify({ content }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to update message"
          );
        }

        const updatedMessage = data.data;

        setMessages((prev) =>
          prev.map((message) =>
            message._id === messageId ? updatedMessage : message
          )
        );

        console.log("Message updated successfully");

        return updatedMessage;
      } catch (error) {
        console.error("Failed to update message:", error);
        alert(error.message);
        throw error;
      }
    },
    [API_URL]
  );

  const handleDeleteMessage = useCallback(
    async ({ messageId }) => {
      if (!messageId) {
        throw new Error("Message ID required");
      }

      try {
        const response = await fetch(
          `${API_URL}/messages/${messageId}`,
          {
            credentials: "include",
            method: "DELETE",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to delete message"
          );
        }

        setMessages((prev) =>
          prev.filter((message) => message._id !== messageId)
        );

        console.log("Message deleted successfully");

        return data.data;
      } catch (error) {
        console.error("Failed to delete message:", error);
        alert(error.message);
        throw error;
      }
    },
    [API_URL]
  );

  const handleMarkMessageAsRead = useCallback(
    async ({ messageId }) => {
      if (!messageId) {
        throw new Error("Message ID required");
      }

      try {
        const response = await fetch(
          `${API_URL}/messages/${messageId}/read`,
          {
            credentials: "include",
            method: "PATCH",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to mark message as read"
          );
        }

        const updatedMessage = data.data;

        setMessages((prev) =>
          prev.map((message) =>
            message._id === messageId ? updatedMessage : message
          )
        );

        console.log("Message marked as read successfully");

        return updatedMessage;
      } catch (error) {
        console.error("Failed to mark message as read:", error);
        alert(error.message);
        throw error;
      }
    },
    [API_URL]
  );

  const handleMarkAsDelivered = useCallback(
    async ({ messageId }) => {
      if (!messageId) {
        throw new Error("Message ID required");
      }

      try {
        const response = await fetch(
          `${API_URL}/messages/${messageId}/delivered`,
          {
            credentials: "include",
            method: "PATCH",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to mark message as delivered"
          );
        }

        const updatedMessage = data.data;

        setMessages((prev) =>
          prev.map((message) =>
            message._id === messageId ? updatedMessage : message
          )
        );

        console.log("Message marked as delivered successfully");

        return updatedMessage;
      } catch (error) {
        console.error("Failed to mark message as delivered:", error);
        alert(error.message);
        throw error;
      }
    },
    [API_URL]
  );

  const value = {
    messages,
    messagesPagination,
    setMessages,
    setMessagesPagination,
    handleGetMessages,
    handleEditMessage,
    handleDeleteMessage,
    handleMarkMessageAsRead,
    handleMarkAsDelivered,
  };

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
};

export default MessageProvider;