import { SocketEvents } from "@/utils/socket";

export interface ChatMessage {
  id: string;
  chat: string;
  userId: number;
  username: string;
  timestamp: string;
  type: SocketEvents;
}

export interface User {
  id: number;
  username: string;
  avatar?: string;
}

export interface ChatState {
  messages: ChatMessage[];
  isConnected: boolean;
  onlineUsers: number;
  error: string | null;
}
