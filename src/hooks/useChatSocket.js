import { useCallback, useEffect, useRef, useState } from "react";
import { socket } from "../socket/socket";

const getId = (value) => {
  if (!value) return "";

  if (typeof value === "object") {
    return String(value._id ?? value.id ?? "");
  }

  return String(value);
};

export function useChatSocket({
  conversationId,
  onNewMessage,
  onMessageError,
  onUserTyping,
  onMessageDeleted,
  onMessageEdited,
  onMessageDelivered,
  onMessageRead,
}) {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [joinedConversationId, setJoinedConversationId] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);

  // Presence state
  const [onlineUserIds, setOnlineUserIds] = useState([]);
  const [lastSeenByUserId, setLastSeenByUserId] = useState({});

  const callbacksRef = useRef({});
  const joinedConversationRef = useRef("");
  const typingConversationRef = useRef("");

  const currentConversationId = getId(conversationId);

  callbacksRef.current = {
    conversationId: currentConversationId,
    onNewMessage,
    onMessageError,
    onUserTyping,
    onMessageDeleted,
    onMessageEdited,
    onMessageDelivered,
    onMessageRead,
  };

  const clearTypingUsers = useCallback(() => {
    setTypingUsers([]);
  }, []);

  const leaveConversation = useCallback((targetConversationId) => {
    const id = getId(targetConversationId);

    if (!id || !socket.connected) return false;

    socket.emit("leave_conversation", {
      conversationId: id,
    });

    if (joinedConversationRef.current === id) {
      joinedConversationRef.current = "";
      setJoinedConversationId("");
    }

    return true;
  }, []);

  const startTyping = useCallback(() => {
    const id = getId(conversationId);

    if (
      !socket.connected ||
      !id ||
      joinedConversationRef.current !== id
    ) {
      return false;
    }

    typingConversationRef.current = id;

    socket.emit("typing_start", {
      conversationId: id,
    });

    return true;
  }, [conversationId]);

  const stopTyping = useCallback(() => {
    const id = getId(conversationId);

    if (!id || !socket.connected) return false;
    if (typingConversationRef.current !== id) return false;

    socket.emit("typing_stop", {
      conversationId: id,
    });

    typingConversationRef.current = "";

    return true;
  }, [conversationId]);

  const sendMessage = useCallback(
    ({ content }) => {
      const id = getId(conversationId);
      const text = typeof content === "string" ? content.trim() : "";

      if (
        !socket.connected ||
        !id ||
        !text ||
        joinedConversationRef.current !== id
      ) {
        return false;
      }

      socket.emit("send_message", {
        conversationId: id,
        content: text,
        messageType: "text",
      });

      return true;
    },
    [conversationId]
  );

  const sendFileMessage = useCallback(
    ({ attachment }) => {
      const id = getId(conversationId);

      if (
        !socket.connected ||
        !id ||
        !attachment?.url ||
        joinedConversationRef.current !== id
      ) {
        return false;
      }

      socket.emit("send_file_message", {
        conversationId: id,
        attachment,
      });

      return true;
    },
    [conversationId]
  );

  const deleteMessage = useCallback(
    ({ messageId }) => {
      const id = getId(conversationId);
      const targetMessageId = getId(messageId);

      if (
        !socket.connected ||
        !id ||
        !targetMessageId ||
        joinedConversationRef.current !== id
      ) {
        return false;
      }

      socket.emit("delete_message", {
        conversationId: id,
        messageId: targetMessageId,
      });

      return true;
    },
    [conversationId]
  );

  const editMessage = useCallback(
    ({ messageId, content }) => {
      const id = getId(conversationId);
      const targetMessageId = getId(messageId);
      const text = typeof content === "string" ? content.trim() : "";

      if (
        !socket.connected ||
        !id ||
        !targetMessageId ||
        !text ||
        joinedConversationRef.current !== id
      ) {
        return false;
      }

      socket.emit("edit_message", {
        conversationId: id,
        messageId: targetMessageId,
        content: text,
      });

      return true;
    },
    [conversationId]
  );

  const markMessageDelivered = useCallback(
    ({ messageId }) => {
      const id = getId(conversationId);
      const targetMessageId = getId(messageId);

      if (
        !socket.connected ||
        !id ||
        !targetMessageId ||
        joinedConversationRef.current !== id
      ) {
        return false;
      }

      socket.emit("message_delivered", {
        messageId: targetMessageId,
      });

      return true;
    },
    [conversationId]
  );

  const markMessageRead = useCallback(
    ({ messageId }) => {
      const id = getId(conversationId);
      const targetMessageId = getId(messageId);

      if (
        !socket.connected ||
        !id ||
        !targetMessageId ||
        joinedConversationRef.current !== id
      ) {
        return false;
      }

      socket.emit("message_read", {
        messageId: targetMessageId,
      });

      return true;
    },
    [conversationId]
  );

  // Register socket listeners once.
  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      joinedConversationRef.current = "";
      typingConversationRef.current = "";

      setJoinedConversationId("");
      setOnlineUserIds([]);
      clearTypingUsers();
    };

    const handleConnectError = (error) => {
      console.error("Socket connection error:", error?.message || error);
    };

    const handleConversationJoined = (payload) => {
      if (!payload?.success) return;

      const joinedId = getId(payload.conversationId);
      const currentId = callbacksRef.current.conversationId;

      if (!joinedId || joinedId !== currentId) return;

      joinedConversationRef.current = joinedId;
      setJoinedConversationId(joinedId);
    };

    // Initial presence list received when the socket connects.
    const handleOnlineUsers = (payload) => {
      const userIds = Array.isArray(payload?.userIds)
        ? payload.userIds.map(getId).filter(Boolean)
        : [];

      setOnlineUserIds([...new Set(userIds)]);
    };

    // A user connects.
    const handleUserOnline = (payload) => {
      const userId = getId(payload?.userId);

      if (!userId) return;

      setOnlineUserIds((previous) =>
        previous.includes(userId)
          ? previous
          : [...previous, userId]
      );
    };

    // A user disconnects.
    const handleUserOffline = (payload) => {
      const userId = getId(payload?.userId);

      if (!userId) return;

      setOnlineUserIds((previous) =>
        previous.filter((id) => id !== userId)
      );

      if (payload.lastSeen) {
        setLastSeenByUserId((previous) => ({
          ...previous,
          [userId]: payload.lastSeen,
        }));
      }
    };

    const handleNewMessage = (payload) => {
      if (!payload?.success || !payload?.message) return;

      const messageConversationId = getId(
        payload.message.conversation
      );

      if (
        messageConversationId !==
        callbacksRef.current.conversationId
      ) {
        return;
      }

      callbacksRef.current.onNewMessage?.(payload.message);
    };

    const handleMessageDeleted = (payload) => {
      if (!payload?.messageId || !payload?.conversationId) return;

      if (
        getId(payload.conversationId) !==
        callbacksRef.current.conversationId
      ) {
        return;
      }

      callbacksRef.current.onMessageDeleted?.(payload);
    };

    const handleMessageEdited = (payload) => {
      if (!payload?.messageId || !payload?.conversationId) return;

      if (
        getId(payload.conversationId) !==
        callbacksRef.current.conversationId
      ) {
        return;
      }

      callbacksRef.current.onMessageEdited?.(payload);
    };

    const handleMessageDelivered = (payload) => {
      if (!payload?.messageId || !payload?.conversationId) return;

      if (
        getId(payload.conversationId) !==
        callbacksRef.current.conversationId
      ) {
        return;
      }

      callbacksRef.current.onMessageDelivered?.(payload);
    };

    const handleMessageRead = (payload) => {
      if (!payload?.messageId || !payload?.conversationId) return;

      if (
        getId(payload.conversationId) !==
        callbacksRef.current.conversationId
      ) {
        return;
      }

      callbacksRef.current.onMessageRead?.(payload);
    };

    const handleUserTyping = (payload) => {
      if (!payload?.conversationId || !payload?.userId) return;

      if (
        getId(payload.conversationId) !==
        callbacksRef.current.conversationId
      ) {
        return;
      }

      setTypingUsers((previous) => {
        const withoutUser = previous.filter(
          (item) => getId(item.userId) !== getId(payload.userId)
        );

        if (!payload.isTyping) return withoutUser;

        return [
          ...withoutUser,
          {
            userId: payload.userId,
            userName: payload.userName || "Someone",
          },
        ];
      });

      callbacksRef.current.onUserTyping?.(payload);
    };

    const handleMessageError = (payload) => {
      console.error("Message error:", payload?.message);
      callbacksRef.current.onMessageError?.(payload);
    };

    const handleSocketError = (payload) => {
      console.error(
        "Socket event error:",
        payload?.event,
        payload?.message
      );
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    socket.on("conversation_joined", handleConversationJoined);

    // Presence listeners
    socket.on("online_users", handleOnlineUsers);
    socket.on("user_online", handleUserOnline);
    socket.on("user_offline", handleUserOffline);

    socket.on("new_message", handleNewMessage);
    socket.on("message_error", handleMessageError);
    socket.on("socket_error", handleSocketError);
    socket.on("user_typing", handleUserTyping);
    socket.on("message_deleted", handleMessageDeleted);
    socket.on("message_edited", handleMessageEdited);
    socket.on("message_delivered", handleMessageDelivered);
    socket.on("message_read", handleMessageRead);

    if (!socket.connected) {
      socket.connect();
    } else {
      setIsConnected(true);
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);

      socket.off("conversation_joined", handleConversationJoined);

      // Presence cleanup
      socket.off("online_users", handleOnlineUsers);
      socket.off("user_online", handleUserOnline);
      socket.off("user_offline", handleUserOffline);

      socket.off("new_message", handleNewMessage);
      socket.off("message_error", handleMessageError);
      socket.off("socket_error", handleSocketError);
      socket.off("user_typing", handleUserTyping);
      socket.off("message_deleted", handleMessageDeleted);
      socket.off("message_edited", handleMessageEdited);
      socket.off("message_delivered", handleMessageDelivered);
      socket.off("message_read", handleMessageRead);
    };
  }, [clearTypingUsers]);

  // Join the selected conversation and leave the previous one.
  useEffect(() => {
    if (!isConnected) return;

    const nextId = getId(conversationId);
    const previousId = joinedConversationRef.current;

    if (previousId && previousId !== nextId) {
      if (typingConversationRef.current === previousId) {
        socket.emit("typing_stop", {
          conversationId: previousId,
        });

        typingConversationRef.current = "";
      }

      leaveConversation(previousId);
      clearTypingUsers();
    }

    if (!nextId) return;
    if (previousId === nextId) return;

    socket.emit("join_conversation", {
      conversationId: nextId,
    });
  }, [
    conversationId,
    isConnected,
    leaveConversation,
    clearTypingUsers,
  ]);

  return {
    isConnected,
    joinedConversationId,
    typingUsers,

    // Presence values
    onlineUserIds,
    lastSeenByUserId,

    sendMessage,
    sendFileMessage,
    startTyping,
    stopTyping,
    deleteMessage,
    editMessage,
    markMessageDelivered,
    markMessageRead,
    leaveConversation,
  };
}