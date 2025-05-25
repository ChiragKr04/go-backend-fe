import { useEffect, useState, useRef } from "react";
import { logger } from "@/utils/logger";

// Create a Socket.IO-like interface for native WebSocket
interface WebSocketEvents {
  [key: string]: (...args: any[]) => void;
}

class SocketLikeWebSocket {
  private ws: WebSocket | null = null;
  private events: WebSocketEvents = {};
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private url: string;
  private protocols?: string | string[];

  constructor(url: string, protocols?: string | string[]) {
    this.url = url;
    this.protocols = protocols;
  }

  connect() {
    try {
      this.ws = new WebSocket(this.url, this.protocols);
      this.setupEventHandlers();
    } catch (error) {
      logger.error("WebSocket connection failed:", error);
      this.emit("connect_error", error);
    }
  }

  private setupEventHandlers() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      logger.info("✅ WebSocket connected successfully");
      this.reconnectAttempts = 0;
      this.emit("connect");
    };

    this.ws.onclose = (event) => {
      logger.warn("❌ WebSocket disconnected:", event.reason);
      this.emit("disconnect", event.reason);
      this.attemptReconnect();
    };

    this.ws.onerror = (error) => {
      logger.error("🚫 WebSocket error:", error);
      this.emit("connect_error", error);
    };

    this.ws.onmessage = (event) => {
      try {
        logger.info("📨 Raw WebSocket message received:", event.data);

        // Handle multiple JSON messages separated by newlines
        const messages = event.data
          .trim()
          .split("\n")
          .filter((msg: string) => msg.trim());

        for (const messageStr of messages) {
          try {
            const data = JSON.parse(messageStr);
            logger.info("📨 Parsed individual message:", data);

            // Handle different message formats that your backend might send

            // Format 1: Structured with type and payload
            if (data.type && data.payload) {
              logger.info(
                "📋 Handling structured message with type:",
                data.type
              );

              // Special handling for send_message type to avoid infinite loop
              if (data.type === "send_message") {
                logger.info(
                  "📋 Converting send_message to message_received to avoid loop"
                );
                logger.info(
                  "📋 Original payload:",
                  JSON.stringify(data.payload, null, 2)
                );
                logger.info("📋 Checking for user info in outer message:");
                logger.info("  - data.userId:", data.userId);
                logger.info("  - data.user_id:", data.user_id);
                logger.info("  - data.senderId:", data.senderId);
                logger.info("  - data.sender_id:", data.sender_id);
                logger.info("  - data.username:", data.username);
                logger.info("  - data.user_name:", data.user_name);

                // Try to include user info from outer message if available
                const enrichedPayload = {
                  ...data.payload,
                  userId:
                    data.userId ||
                    data.user_id ||
                    data.senderId ||
                    data.sender_id,
                  username:
                    data.username ||
                    data.user_name ||
                    data.senderName ||
                    data.sender_name,
                };

                logger.info(
                  "📋 Enriched payload:",
                  JSON.stringify(enrichedPayload, null, 2)
                );
                this.emit("message_received", enrichedPayload);
              } else {
                this.emit(data.type, data.payload);
              }
              continue;
            }

            // Format 2: Direct message object (common format)
            if (data.id && data.content && data.userId !== undefined) {
              logger.info("📋 Handling direct message object");
              this.emit("message_received", data);
              continue;
            }

            // Format 3: Check for specific message types without payload wrapper
            if (
              data.type === "message_received" ||
              data.type === "new_message"
            ) {
              logger.info("📋 Handling message_received type");
              this.emit("message_received", data);
              continue;
            }

            if (data.type === "user_joined") {
              logger.info("📋 Handling user_joined type");
              this.emit("user_joined", data);
              continue;
            }

            if (data.type === "user_left") {
              logger.info("📋 Handling user_left type");
              this.emit("user_left", data);
              continue;
            }

            if (data.type === "user_count") {
              logger.info("📋 Handling user_count type");
              this.emit("user_count", data.count || data.payload || data);
              continue;
            }

            // Format 4: Raw message data (fallback)
            logger.info("📋 Handling as generic message - unknown format");
            logger.info("📋 Message structure:", Object.keys(data));
            this.emit("message", data);

            // Also try to emit as message_received if it looks like a chat message
            if (data.content || data.message) {
              logger.info("📋 Also emitting as message_received (fallback)");
              this.emit("message_received", data);
            }
          } catch (parseError) {
            logger.error("Failed to parse individual message:", parseError);
            logger.info("Individual message data:", messageStr);
          }
        }
      } catch (error) {
        logger.error("Failed to process WebSocket message:", error);
        logger.info("Raw message data:", event.data);
        this.emit("message", event.data);
      }
    };
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      logger.info(
        `🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
      );

      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      logger.error("💥 Max reconnection attempts reached");
      this.emit("reconnect_failed");
    }
  }

  emit(eventName: string, ...args: any[]) {
    if (
      eventName === "send_message" ||
      eventName === "join_room" ||
      eventName === "leave_room"
    ) {
      // Send to server
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        const message = {
          type: eventName,
          payload: args[0],
          timestamp: new Date().toISOString(),
          userId: args[0].userId,
          username: args[0].username,
        };
        this.ws.send(JSON.stringify(message));
        logger.info("📤 Sent message to server:", message);
      } else {
        logger.warn("Cannot send message - WebSocket not connected");
      }
    } else {
      // Emit to local listeners
      if (this.events[eventName]) {
        this.events[eventName](...args);
      }
    }
  }

  on(eventName: string, callback: (...args: any[]) => void) {
    this.events[eventName] = callback;
  }

  off(eventName: string) {
    delete this.events[eventName];
  }

  disconnect() {
    this.reconnectAttempts = this.maxReconnectAttempts; // Prevent reconnection
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  get connected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  get id() {
    return this.ws ? `ws-${Date.now()}` : null;
  }
}

export const useWebSocketConnection = (
  roomId: string,
  token: string | null
) => {
  const [socket, setSocket] = useState<SocketLikeWebSocket | null>(null);
  const socketRef = useRef<SocketLikeWebSocket | null>(null);

  useEffect(() => {
    // Don't connect if we don't have a token or roomId
    if (!token || !roomId) {
      logger.warn("WebSocket connection attempted without token or roomId");
      return;
    }

    // Clean up existing connection
    if (socketRef.current) {
      logger.info("Cleaning up existing WebSocket connection");
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    // Create WebSocket connection with your backend URL pattern
    const wsUrl = `ws://localhost:3000/api/v1/ws/${roomId}?token=${encodeURIComponent(
      token
    )}`;
    logger.info("Connecting to WebSocket:", wsUrl);

    const newSocket = new SocketLikeWebSocket(wsUrl);

    // Handle authentication and room joining after connection
    newSocket.on("connect", () => {
      logger.info(
        "✅ WebSocket connected, sending authentication and joining room"
      );

      // Send authentication message
      newSocket.emit("authenticate", {
        token: token,
        roomId: roomId,
      });

      // Join the room
      newSocket.emit("join_room", { roomId });
    });

    newSocket.connect();

    // Store the socket
    socketRef.current = newSocket;
    setSocket(newSocket);

    // Cleanup function
    return () => {
      logger.info("🧹 Cleaning up WebSocket connection");
      if (socketRef.current) {
        socketRef.current.emit("leave_room", { roomId });
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setSocket(null);
    };
  }, [roomId, token]);

  return socket;
};
