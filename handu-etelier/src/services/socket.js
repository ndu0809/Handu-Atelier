// src/services/socket.js

import { io } from "socket.io-client";

// ======================================================
// SOCKET URL
// ======================================================

const getSocketUrl = () => {

    if (
        import.meta.env.VITE_SOCKET_URL
    ) {
        return (
            import.meta.env.VITE_SOCKET_URL
        );
    }

    if (
        window.location.hostname ===
            "localhost" ||
        window.location.hostname ===
            "127.0.0.1"
    ) {
        return "http://localhost:3001";
    }

    return window.location.origin;
};

// ======================================================
// CREATE SOCKET
// ======================================================

export const createChatSocket = () => {

    return io(
        getSocketUrl(),
        {
            transports: [
                "websocket",
                "polling"
            ],

            reconnection: true,

            reconnectionAttempts:
                Infinity,

            reconnectionDelay:
                1000,

            reconnectionDelayMax:
                5000,

            timeout:
                10000
        }
    );
};