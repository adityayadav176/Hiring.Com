import { createContext, useCallback, useState } from "react";

export const ConversationContext = createContext();

const ConversationProvider = ({ children }) => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [conversation, setConversation] = useState(null);
  const [myConversations, setMyConversations] = useState([]);

  const handleCreateAndGetConversation = useCallback(
    async ({ participantId, conversationType, groupName, participants }) => {
      try {
        const response = await fetch(`${API_URL}/conversation`, {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            participantId,
            conversationType,
            groupName,
            participants,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to create conversation"
          );
        }

        const newConversation = data.data;

        setConversation(newConversation);

        setMyConversations((prev) => {
          const exists = prev.some(
            (item) => item._id === newConversation._id
          );

          return exists
            ? prev.map((item) =>
                item._id === newConversation._id
                  ? newConversation
                  : item
              )
            : [newConversation, ...prev];
        });

        console.log("Create conversation successfully");

        return newConversation;
      } catch (error) {
        console.error("Failed to create conversation:", error);
        alert(error.message);
        throw error;
      }
    },
    [API_URL]
  );

  const handleGetMyConversations = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/conversation/me`, {
        credentials: "include",
        method: "GET",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to fetch conversations"
        );
      }

      const conversations = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.data?.conversations)
          ? data.data.conversations
          : [];

      setMyConversations(conversations);

      console.log("Conversations fetched:", conversations);

      return conversations;
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
      throw error;
    }
  }, [API_URL]);

  const handleGetConversationById = useCallback(
    async ({ conversationId }) => {
      if (!conversationId) {
        throw new Error("Conversation ID required");
      }

      try {
        const response = await fetch(
          `${API_URL}/conversation/${conversationId}`,
          {
            credentials: "include",
            method: "GET",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to fetch conversation"
          );
        }

        const fetchedConversation = data.data;

        setConversation(fetchedConversation);

        setMyConversations((prev) => {
          const exists = prev.some(
            (item) => item._id === fetchedConversation._id
          );

          return exists
            ? prev.map((item) =>
                item._id === fetchedConversation._id
                  ? fetchedConversation
                  : item
              )
            : [fetchedConversation, ...prev];
        });

        console.log("Conversation fetched successfully");

        return fetchedConversation;
      } catch (error) {
        console.error("Failed to fetch conversation:", error);
        throw error;
      }
    },
    [API_URL]
  );

  const handlePermanentlyDeleteConversation = useCallback(
    async ({ conversationId }) => {
      if (!conversationId) {
        throw new Error("Conversation ID required");
      }

      try {
        const response = await fetch(
          `${API_URL}/conversation/${conversationId}/permanent`,
          {
            credentials: "include",
            method: "DELETE",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to permanently delete conversation"
          );
        }

        setMyConversations((prev) =>
          prev.filter((item) => item._id !== conversationId)
        );

        setConversation((prev) =>
          prev?._id === conversationId ? null : prev
        );

        console.log("Conversation permanently deleted successfully");

        return data.data;
      } catch (error) {
        console.error("Failed to permanently delete conversation:", error);
        alert(error.message);
        throw error;
      }
    },
    [API_URL]
  );

  const handleDeleteConversation = useCallback(
    async ({ conversationId }) => {
      if (!conversationId) {
        throw new Error("Conversation ID required");
      }

      try {
        const response = await fetch(
          `${API_URL}/conversation/${conversationId}/delete`,
          {
            credentials: "include",
            method: "PATCH",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to delete conversation"
          );
        }

        setMyConversations((prev) =>
          prev.filter((item) => item._id !== conversationId)
        );

        setConversation((prev) =>
          prev?._id === conversationId ? null : prev
        );

        console.log("Conversation moved to recycle bin successfully");

        return data.data;
      } catch (error) {
        console.error("Failed to delete conversation:", error);
        alert(error.message);
        throw error;
      }
    },
    [API_URL]
  );

  const handleRestoreConversation = useCallback(
    async ({ conversationId }) => {
      if (!conversationId) {
        throw new Error("Conversation ID required");
      }

      try {
        const response = await fetch(
          `${API_URL}/conversation/${conversationId}/restore`,
          {
            credentials: "include",
            method: "PATCH",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to restore conversation"
          );
        }

        const restoredConversation = data.data;

        setMyConversations((prev) => {
          const exists = prev.some(
            (item) => item._id === restoredConversation._id
          );

          return exists
            ? prev.map((item) =>
                item._id === restoredConversation._id
                  ? restoredConversation
                  : item
              )
            : [restoredConversation, ...prev];
        });

        console.log("Conversation restored successfully");

        return restoredConversation;
      } catch (error) {
        console.error("Failed to restore conversation:", error);
        alert(error.message);
        throw error;
      }
    },
    [API_URL]
  );

  const value = {
    conversation,
    myConversations,
    setConversation,
    setMyConversations,
    handleCreateAndGetConversation,
    handleGetMyConversations,
    handleGetConversationById,
    handlePermanentlyDeleteConversation,
    handleDeleteConversation,
    handleRestoreConversation,
  };

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
};

export default ConversationProvider;