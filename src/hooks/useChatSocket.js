
import { useCallback, useEffect, useRef, useState } from "react";
import { socket } from "../socket/socket";

const getId = (value) => {
  if(!value) return "";
  if(typeof value === "object") {
    return String(value._id ?? value.id ?? "");
  }
  return String(value);
};

export function useChatSocket({conversationId, onNewMessage, onMessageError = {}}) {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [joinedConversationId, setJoinedConversationId] = useState("");

  const callbacksRef = useRef({});

  callbacksRef.current = {
    conversationId: getId(conversationId),
    onNewMessage,
    onMessageError
  }

  useEffect(() => {
    const handleConnect = () => {
      console.log("Socket connected:", socket.id);
      setIsConnected(true);
    };

    const handleConnectError = (error) => {
      console.error("Socket connection error:", error.message);
    };

    const handleDisconnect = (error) => {
      console.log("Socket disconnected:", error.message);
      setIsConnected(false);
      setJoinedConversationId("");
    };
    
    const handleConversationJoined = (payload) => {
      if(!payload?.success) return;

      const joinedId = getId(payload.conversationId);

      if(joinedId === callbacksRef.current.conversationId) {
        setJoinedConversationId(joinedId);
        console.log("Joined conversation:", joinedId);
      }
    }

    const handleNewMessage = (payload) => {
      if(!payload.success || !payload.message) return;

      const messageConverationId = getId(payload.message.conversation);

      if(messageConverationId && messageConverationId !== callbacksRef.current.conversationId) {
        return;
      }

      callbacksRef.current.onNewMessage?.(payload.message);
    }

    const handleMessageError = (payload) => {
      console.error("Message error:", payload?.message);
      callbacksRef.current.onMessageError?.(payload)
    }

    const handleSocketError = () => {
      console.error("Socket event error:", payload?.event, payload?.message);
    }   

    if(socket.connected) {
      setIsConnected(true);
    } else {
      socket.connect();
    }
    
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("conversation_joined", handleConversationJoined);
    socket.on("new_message", handleNewMessage);
    socket.on("message_error", handleMessageError);
    socket.on("socket_error", handleSocketError);

    socket.connect();

    return () => {
    socket.off("connect", handleConnect);
    socket.off("disconnect", handleDisconnect);
    socket.off("connect_error", handleConnectError);
    socket.off("conversation_joined", handleConversationJoined);
    socket.off("new_message", handleNewMessage);
    socket.off("message_error", handleMessageError);
    socket.off("socket_error", handleSocketError);
    };
  }, []);

  useEffect(() => {
    const id = getId(conversationId);

    if(!isConnected || !id || joinedConversationId === id) {
      return;
    }

    setJoinedConversationId("");

    socket.emit("join_conversation", {
      conversationId: id,
    })
  },[conversationId, isConnected, joinedConversationId]);

  const sendMessage = useCallback(({conversationId, content}) => {
    const id = getId(conversationId);
    const text = typeof content === "string" ? content?.trim() : "";

    if(!socket.connected || !id || !text) {
      return false;
    }

    socket.emit("send_message", {
      conversationId: id,
      content: text,
      messageType: "text",
    });

    return true;
  }, [])

  return {
    isConnected,
    joinedConversationId,
    sendMessage,
  }
}
