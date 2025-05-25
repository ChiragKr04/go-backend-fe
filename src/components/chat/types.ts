export interface ChatMessage {
  id: string;
  content: string;
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

export interface SocketEvents {
  // Outgoing events
  send_message: (data: { content: string; roomId: string }) => void;
  join_room: (data: { roomId: string }) => void;
  leave_room: (data: { roomId: string }) => void;

  // Incoming events
  message_received: (message: ChatMessage) => void;
  user_joined: (data: { userId: string; username: string }) => void;
  user_left: (data: { userId: string; username: string }) => void;
  user_count: (count: number) => void;
  connect: () => void;
  disconnect: () => void;
  error: (error: Error | string) => void;
}

export interface ChatState {
  messages: ChatMessage[];
  isConnected: boolean;
  onlineUsers: number;
  error: string | null;
}
