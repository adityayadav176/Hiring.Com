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
    });

    socket.on("connect", () => {
        console.log("[Interview Socket] Connected:", socket.id);
    });

    socket.on("connect_error", (error) => {
        console.error(
            "[Interview Socket] Connection failed:",
            error.message
        );
    });

    socket.on("disconnect", (reason) => {
        console.warn("[Interview Socket] Disconnected:", reason);
    });

    return socket;
}