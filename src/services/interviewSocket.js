import { io } from "socket.io-client";

const SOCKET_URL =
    import.meta.env.VITE_SOCKET_URL || "http://localhost:9000";

export function createInterviewSocket() {
    const socket = io(SOCKET_URL, {
        withCredentials: true,
        autoConnect: false,
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
        forceNew: true,
    });

    socket.on("connect", () => {
        console.log("[Interview Socket] Connected:", {
            socketId: socket.id,
            transport: socket.io.engine.transport.name,
        });
    });

    socket.on("connect_error", (error) => {
        console.error("[Interview Socket] Connection failed:", {
            message: error.message,
            description: error.description,
            context: error.context,
        });
    });

    socket.on("disconnect", (reason) => {
        console.warn("[Interview Socket] Disconnected:", reason);
    });

    socket.on("socket_error", (error) => {
        console.error("[Interview Socket] Server error:", error);
    });

    socket.on("interview_error", (error) => {
        console.error("[Interview Socket] Interview error:", error);
    });

    return socket;
}