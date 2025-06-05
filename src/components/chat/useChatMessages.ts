import { useState, useEffect, useCallback } from "react";
import type { ChatMessage } from "./types";
import { logger } from "@/utils/logger";
import { roomService } from "@/services/roomService";
import { SocketEvents } from "@/utils/socket";

interface User {
  id: number;
  username?: string;
}

// Generic socket interface that works with both Socket.IO and our WebSocket wrapper
interface GenericSocket {
  on: (event: SocketEvents, callback: (...args: any[]) => void) => void;
  off: (event: SocketEvents, callback?: (...args: any[]) => void) => void;
  emit: (event: SocketEvents, ...args: any[]) => void;
  connected: boolean;
}

export const useChatMessages = (
  socket: GenericSocket | null,
  user: User | null
) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!socket) return;

    // Handle connection status
    const handleConnect = () => {
      logger.info("Chat: Socket connected");
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      logger.info("Chat: Socket disconnected");
      setIsConnected(false);
    };

    // Handle incoming messages
    const handleMessageReceived = (message: any) => {
      logger.info("Chat: Message received:", message);
      logger.info("Chat: Message structure:", Object.keys(message));
      logger.info("Chat: Current messages count before:", messages.length);
      logger.info("Chat: Current logged-in user:", user);

      // Check if this is a payload from a send_message type (has content but no proper message id)
      if (message.chat && !message.id) {
        logger.info("Chat: Processing send_message payload format");
        logger.info(
          "Chat: Full payload received:",
          JSON.stringify(message, null, 2)
        );
        logger.info("Chat: Available payload fields:", Object.keys(message));
        logger.info("Chat: Checking for user fields:");
        logger.info("  - message.senderId:", message.senderId);
        logger.info("  - message.sender_id:", message.sender_id);
        logger.info("  - message.userId:", message.userId);
        logger.info("  - message.user_id:", message.user_id);
        logger.info("  - message.senderName:", message.senderName);
        logger.info("  - message.sender_name:", message.sender_name);
        logger.info("  - message.username:", message.username);
        logger.info("  - message.user_name:", message.user_name);

        const chatMessage: ChatMessage = {
          id: `msg-${Date.now()}-${Math.random()}`,
          chat: message.chat,
          // Use the sender info from backend if available, otherwise fall back to current user
          userId:
            message.senderId ||
            message.sender_id ||
            message.userId ||
            message.user_id ||
            user?.id ||
            1,
          username:
            message.senderName ||
            message.sender_name ||
            message.username ||
            message.user_name ||
            "Unknown User",
          timestamp: message.timestamp || new Date().toISOString(),
          type: SocketEvents.Message,
        };

        logger.info(
          "Chat: Converted payload to chat message:",
          JSON.stringify(chatMessage, null, 2)
        );
        logger.info("Chat: Current user ID:", user?.id);
        logger.info("Chat: Message user ID:", chatMessage.userId);
        logger.info(
          "Chat: Will show on right side?",
          chatMessage.userId === user?.id
        );

        setMessages((prev) => {
          const newMessages = [...prev, chatMessage];
          logger.info("Chat: Updated messages count:", newMessages.length);
          return newMessages;
        });
        return;
      }

      // Validate and convert to ChatMessage structure for other formats
      if (!message.id || !message.chat || message.userId === undefined) {
        logger.warn(
          "Chat: Invalid message structure, attempting to fix:",
          message
        );

        // Try to fix the message structure
        const fixedMessage: ChatMessage = {
          id: message.id || `msg-${Date.now()}`,
          chat: message.chat || message.message || String(message),
          userId: message.userId || 0,
          username: message.username || "Unknown User",
          timestamp: message.timestamp || new Date().toISOString(),
          type: message.type || SocketEvents.Message,
        };

        logger.info("Chat: Fixed message:", fixedMessage);
        setMessages((prev) => {
          const newMessages = [...prev, fixedMessage];
          logger.info("Chat: Updated messages count:", newMessages.length);
          return newMessages;
        });
      } else {
        // Message is already in correct format
        const validMessage: ChatMessage = message as ChatMessage;
        setMessages((prev) => {
          const newMessages = [...prev, validMessage];
          logger.info("Chat: Updated messages count:", newMessages.length);
          return newMessages;
        });
      }
    };

    // Handle message history (when joining room)
    const handleMessageHistory = async (roomId: string) => {
      const history = await roomService.getChatHistory(roomId);
      logger.info("Chat: Message history received:", history);
      setMessages(history);
    };

    // Handle system messages
    const handleSystemMessage = (data: { chat: string; type?: string }) => {
      const systemMessage: ChatMessage = {
        id: `system-${Date.now()}`,
        chat: data.chat,
        userId: 0,
        username: "System",
        timestamp: new Date().toISOString(),
        type: SocketEvents.SystemMessage,
      };
      setMessages((prev) => [...prev, systemMessage]);
    };

    // Register event listeners
    socket.on(SocketEvents.Connect, handleConnect);
    socket.on(SocketEvents.Disconnect, handleDisconnect);
    socket.on(SocketEvents.MessageReceived, handleMessageReceived);
    socket.on(SocketEvents.MessageHistory, handleMessageHistory);
    socket.on(SocketEvents.SystemMessage, handleSystemMessage);

    // Set initial connection status
    setIsConnected(socket.connected);

    // Cleanup
    return () => {
      socket.off(SocketEvents.Connect, handleConnect);
      socket.off(SocketEvents.Disconnect, handleDisconnect);
      socket.off(SocketEvents.MessageReceived, handleMessageReceived);
      socket.off(SocketEvents.MessageHistory, handleMessageHistory);
      socket.off(SocketEvents.SystemMessage, handleSystemMessage);
    };
  }, [socket]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!socket || !user || !isConnected || !content.trim()) {
        logger.warn("Chat: Cannot send message - missing requirements");
        return;
      }

      const messageData = {
        message_type: SocketEvents.SendMessage,
        data: {
          chat: content.trim(),
          timestamp: new Date().toISOString(),
        },
      };

      logger.info("Chat: Sending message:", messageData);
      socket.emit(SocketEvents.SendMessage, messageData);
    },
    [socket, user, isConnected]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const loadMessageHistory = useCallback(async (roomId: string) => {
    try {
      logger.info("Chat: Loading message history for room:", roomId);
      const history = await roomService.getChatHistory(roomId);
      logger.info("Chat: Message history loaded:", history);
      setMessages(history || []);
    } catch (error) {
      logger.error("Chat: Failed to load message history:", error);
    }
  }, []);

  return {
    messages,
    isConnected,
    sendMessage,
    clearMessages,
    loadMessageHistory,
  };
};
