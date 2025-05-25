# Chat Component System

A robust, real-time chat system built with Socket.io and React, designed for easy extension with video chat and collaborative coding features.

## Architecture

The chat system is organized into modular components for maintainability and extensibility:

### Core Components

- **`Chat.tsx`** - Main chat component that orchestrates all functionality
- **`MessageList.tsx`** - Displays chat messages with different styling for current user vs others
- **`MessageInput.tsx`** - Input field with send functionality and keyboard shortcuts
- **`useSocketConnection.ts`** - Custom hook for Socket.io connection management
- **`useChatMessages.ts`** - Custom hook for message state management
- **`types.ts`** - TypeScript interfaces for type safety
- **`utils.ts`** - Utility functions for formatting and message handling

## Features

### Current Features

- ✅ Real-time messaging via Socket.io
- ✅ Authentication with Bearer token
- ✅ Auto-reconnection on disconnect
- ✅ Message history on room join
- ✅ User join/leave notifications
- ✅ Online user count
- ✅ Message timestamps with smart formatting
- ✅ User avatars with initials
- ✅ Auto-scroll to new messages
- ✅ Connection status indicators
- ✅ Message character limit (500 chars)
- ✅ Enter to send, Shift+Enter for new line
- ✅ Responsive design

### Future Extension Points

- 🔮 **Video Chat Integration** - Components structured to easily add video call UI
- 🔮 **Collaborative Coding** - Hooks designed to support real-time code synchronization
- 🔮 **Typing Indicators** - Infrastructure ready for typing status
- 🔮 **Message Reactions** - Message structure supports metadata extensions
- 🔮 **File Sharing** - Message types system supports different content types
- 🔮 **Message Threading** - ID system designed for reply relationships

## Usage

```tsx
import { Chat } from "@/components/chat";

function RoomPage() {
  const { roomId } = useParams();

  return (
    <div>
      <Chat roomId={roomId} className="w-full h-[600px]" />
    </div>
  );
}
```

## Socket Events

### Outgoing Events

- `join_room` - Join a specific room
- `leave_room` - Leave the current room
- `send_message` - Send a chat message

### Incoming Events

- `message_received` - New message received
- `message_history` - Historical messages on room join
- `user_joined` - Another user joined the room
- `user_left` - A user left the room
- `user_count` - Updated count of online users
- `system_message` - System notifications

## Authentication

The chat system automatically handles authentication by:

1. Getting the Bearer token from the `useAuth` hook
2. Passing it in Socket.io connection headers
3. Including it in the `auth` object for Socket.io
4. Automatically reconnecting with fresh tokens

## Extension Guidelines

### Adding Video Chat

1. Create new hooks in the chat directory (e.g., `useVideoCall.ts`)
2. Add video-related types to `types.ts`
3. Extend the main `Chat.tsx` component with video UI
4. Use existing Socket connection for video signaling

### Adding Collaborative Coding

1. Create `useCodeSync.ts` hook for real-time code updates
2. Add code-related message types
3. Extend Socket events for code operations
4. Integrate with existing message system for code chat

### Best Practices

- Keep components small and focused
- Use custom hooks for complex logic
- Extend types rather than modifying existing ones
- Follow the established Socket event patterns
- Maintain backward compatibility

## Dependencies

- `socket.io-client` - WebSocket communication
- `@/components/ui/*` - UI components (Button, Card, etc.)
- `@/hooks/useAuth` - Authentication state
- `lucide-react` - Icons
