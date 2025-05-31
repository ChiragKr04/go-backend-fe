export interface ChatMessage {
  id: string;
  chat: string;
  userId: number;
  username: string;
  timestamp: string;
  type: "message" | "system" | "notification";
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
