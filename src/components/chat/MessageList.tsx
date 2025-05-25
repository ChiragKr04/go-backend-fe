import React, { useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import type { ChatMessage } from './types';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { formatMessageTime } from './utils';

interface MessageListProps {
  messages: ChatMessage[];
  currentUserId?: number;
  isConnected: boolean;
}

interface MessageItemProps {
  message: ChatMessage;
  isCurrentUser: boolean;
  showAvatar?: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isCurrentUser,
  showAvatar = true
}) => {
  const getMessageStyles = () => {
    switch (message.type) {
      case 'system':
        return 'bg-muted text-muted-foreground text-center text-sm py-2 px-4 rounded-lg mx-8';
      default:
        return isCurrentUser
          ? 'bg-primary text-primary-foreground rounded-lg rounded-br-sm'
          : 'bg-muted text-foreground rounded-lg rounded-bl-sm';
    }
  };

  const getUserInitials = (username: string) => {
    return username
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (message.type === 'system') {
    return (
      <div className="flex justify-center my-2">
        <div className={getMessageStyles()}>
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-3 mb-4 ${isCurrentUser ? 'flex-row-reverse justify-start' : 'flex-row justify-start'}`}>
      {showAvatar && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarFallback className="text-xs bg-primary/10 text-primary">
            {getUserInitials(message.username)}
          </AvatarFallback>
        </Avatar>
      )}

      <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} max-w-[70%] min-w-0`}>
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-sm font-medium ${isCurrentUser ? 'text-primary' : 'text-foreground'}`}>
            {isCurrentUser ? 'You' : message.username}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatMessageTime(message.timestamp)}
          </span>
        </div>

        <div className={`p-3 break-words shadow-sm ${getMessageStyles()}`}>
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
      </div>
    </div>
  );
};

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  isConnected
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isConnected && messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-muted-foreground">Connecting to chat...</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="text-6xl mb-4">💬</div>
        <p className="text-muted-foreground text-lg mb-2">No messages yet</p>
        <p className="text-muted-foreground text-sm">Be the first to say hello!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-1 p-4">
      {!isConnected && (
        <div className="sticky top-0 z-10 mb-4">
          <Badge variant="destructive" className="w-full justify-center">
            Disconnected - Trying to reconnect...
          </Badge>
        </div>
      )}

      {messages.map((message, index) => {
        const isCurrentUser = message.userId === currentUserId;
        const prevMessage = messages[index - 1];
        const showAvatar = !prevMessage ||
          prevMessage.userId !== message.userId ||
          prevMessage.type !== message.type;

        // Debug logging
        console.log(`Message ${index}:`, {
          messageUserId: message.userId,
          currentUserId: currentUserId,
          isCurrentUser: isCurrentUser,
          username: message.username,
          content: message.content.substring(0, 20) + '...'
        });

        return (
          <MessageItem
            key={message.id}
            message={message}
            isCurrentUser={isCurrentUser}
            showAvatar={showAvatar}
          />
        );
      })}

      <div ref={messagesEndRef} />
    </div>
  );
}; 