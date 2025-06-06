import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { MessageCircle, Users, Wifi, WifiOff } from 'lucide-react';
// import { useSocketConnection } from './useSocketConnection';
import { SocketLikeWebSocket } from './useWebSocketConnection';
import { useChatMessages } from './useChatMessages';
import { ScrollArea } from '../ui/scroll-area';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Badge } from '../ui/badge';
import { SocketEvents } from '@/utils/socket';

interface ChatProps {
  roomId: string;
  className?: string;
  webSocketConnection: SocketLikeWebSocket | null;
  useNativeWebSocket?: boolean; // Option to switch between Socket.IO and native WebSocket
  changeUserCount: (data: { userCount: number, users: any[] }) => void;
}

export const Chat: React.FC<ChatProps> = ({
  roomId,
  className = '',
  webSocketConnection,
  useNativeWebSocket = true, // Default to native WebSocket since your backend uses raw WebSocket,
  changeUserCount
}) => {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<number>(0);

  // Choose connection type based on prop
  // const socketIOConnection = useSocketConnection(roomId, token);
  // Use the appropriate connection
  const socket = webSocketConnection;
  const { messages, sendMessage, isConnected, loadMessageHistory } = useChatMessages(socket, user);

  useEffect(() => {
    if (socket) {
      loadMessageHistory(roomId);
    }
  }, [socket, roomId]);

  // Handle real-time events
  useEffect(() => {
    if (!socket) return;

    // Listen for user count updates
    socket.on(SocketEvents.UserCount, (data: { userCount: number, users: any[] }) => {
      setOnlineUsers(data?.userCount);
      changeUserCount(data);
    });

    // Listen for user join/leave events
    socket.on(SocketEvents.UserJoined, (data: { userId: string; username: string }) => {
      console.log(`${data.username} joined the room`);
    });

    socket.on(SocketEvents.UserLeft, (data: { userId: string; username: string }) => {
      console.log(`${data.username} left the room`);
    });

    // Cleanup listeners
    return () => {
      socket.off(SocketEvents.UserCount);
      socket.off(SocketEvents.UserJoined);
      socket.off(SocketEvents.UserLeft);
    };
  }, [socket]);

  const handleSendMessage = (content: string) => {
    if (!content.trim() || !isConnected) return;
    sendMessage(content);
  };

  return (
    <Card className={`w-full h-[600px] flex flex-col ${className}`}>
      <CardHeader className="flex-shrink-0 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageCircle className="w-5 h-5" />
            Room Chat
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{onlineUsers} online</span>
            <Badge variant={isConnected ? "default" : "destructive"} className="flex items-center gap-1">
              {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {useNativeWebSocket ? "WebSocket" : "Socket.IO"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 p-4 gap-4 min-h-0">
        {/* Debug Info */}
        <div className="text-xs text-muted-foreground">
          Messages: {messages.length} | Connected: {isConnected ? 'Yes' : 'No'}
        </div>

        {/* Messages Area */}
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <MessageList
              messages={messages}
              currentUserId={user?.id}
              isConnected={isConnected}
            />
          </ScrollArea>
        </div>

        {/* Message Input */}
        <div className="flex-shrink-0">
          <MessageInput
            onSendMessage={handleSendMessage}
            disabled={!isConnected}
            placeholder={isConnected ? "Type a message..." : "Connecting..."}
          />
        </div>
      </CardContent>
    </Card>
  );
};