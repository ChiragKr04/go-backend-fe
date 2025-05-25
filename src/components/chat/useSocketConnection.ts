import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { logger } from "@/utils/logger";

export const useSocketConnection = (roomId: string, token: string | null) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Don't connect if we don't have a token or roomId
    if (!token || !roomId) {
      logger.warn("Socket connection attempted without token or roomId");
      return;
    }

    // Clean up existing connection
    if (socketRef.current) {
      logger.info("Cleaning up existing socket connection");
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    // Since your backend uses raw WebSocket, let's try to make Socket.IO work with it
    // This attempts to connect to the WebSocket endpoint directly
    logger.info(
      "Attempting to connect to raw WebSocket backend with Socket.IO client"
    );
    logger.info(
      "Backend WebSocket URL pattern: ws://localhost:3000/api/v1/ws/room_id"
    );

    // Method 1: Try to use Socket.IO with custom configuration for raw WebSocket
    const serverUrl = "http://localhost:3000";

    const newSocket = io(serverUrl, {
      transports: ["websocket"], // Only use WebSocket, no polling
      upgrade: false, // Don't try to upgrade
      rememberUpgrade: false,
      auth: {
        token: token,
        roomId: roomId,
      },
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
      query: {
        roomId: roomId,
        token: token,
      },
      // Try custom path that matches your backend
      path: `/api/v1/ws/`,
      reconnection: false, // Disable auto-reconnection for now to avoid spam
      timeout: 5000,
    });

    // Connection event handlers
    newSocket.on("connect", () => {
      logger.info("✅ Connected to backend via Socket.IO!");
      logger.info("Socket ID:", newSocket.id);

      // Try to join room
      newSocket.emit("join_room", { roomId });
      logger.info("📨 Attempting to join room:", roomId);
    });

    newSocket.on("disconnect", (reason) => {
      logger.warn("❌ Socket disconnected:", reason);
    });

    newSocket.on("connect_error", (error) => {
      logger.error(
        "🚫 Socket.IO connection to raw WebSocket failed:",
        error.message
      );
      logger.info(
        "💡 This is expected - your backend uses raw WebSocket, not Socket.IO"
      );
      logger.info("🔧 Recommendation: Either:");
      logger.info("   1. Update backend to use Socket.IO server library");
      logger.info("   2. Use native WebSocket API in frontend");
      logger.info(
        "   3. Create a Socket.IO wrapper for your WebSocket backend"
      );

      // Clean up failed socket
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setSocket(null);
    });

    // Store the socket
    socketRef.current = newSocket;
    setSocket(newSocket);

    // Cleanup function
    return () => {
      logger.info("🧹 Cleaning up socket connection");
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setSocket(null);
    };
  }, [roomId, token]);

  return socket;
};
