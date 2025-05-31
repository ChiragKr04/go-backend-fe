import { API_ENDPOINTS } from "../constants/api";
import { authStorage } from "../utils/storage";
import { logger } from "../utils/logger";
import type {
  CreateRoomRequest,
  CreateRoomResponse,
  Room,
} from "../types/room";
import type { ChatMessage } from "@/components/chat/types";

export const roomService = {
  createRoom: async (
    roomData: CreateRoomRequest
  ): Promise<CreateRoomResponse> => {
    const token = authStorage.getToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    logger.info("🏠 Creating room:", roomData);

    try {
      const response = await fetch(API_ENDPOINTS.ROOM.CREATE_ROOM, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(roomData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Failed to create room: ${response.status}`
        );
      }

      const data = await response.json();
      logger.info("✅ Room created successfully:", data);

      return data;
    } catch (error) {
      logger.error("❌ Failed to create room:", error);
      throw error;
    }
  },

  getRoomById: async (roomId: string): Promise<Room> => {
    const token = authStorage.getToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    logger.info("🔍 Getting room by ID:", roomId);

    try {
      const response = await fetch(API_ENDPOINTS.ROOM.GET_ROOM_BY_ID(roomId), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(
            "Room not found. Please check the room ID and try again."
          );
        }

        const errorData = await response.json();
        throw new Error(
          errorData.message || `Failed to get room: ${response.status}`
        );
      }

      const data = await response.json();
      logger.info("✅ Room fetched successfully:", data);

      return data;
    } catch (error) {
      logger.error("❌ Failed to get room:", error);
      throw error;
    }
  },

  getChatHistory: async (roomId: string): Promise<ChatMessage[]> => {
    const token = authStorage.getToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    logger.info("🔍 Getting chat history for room:", roomId);

    try {
      const response = await fetch(
        API_ENDPOINTS.ROOM.GET_CHAT_HISTORY(roomId),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to get chat history: ${response.status}`);
      }

      const data = await response.json();
      logger.info("✅ Chat history fetched successfully:", data);

      return data?.chats || [];
    } catch (error) {
      logger.error("❌ Failed to get chat history:", error);
      throw error;
    }
  },
};
