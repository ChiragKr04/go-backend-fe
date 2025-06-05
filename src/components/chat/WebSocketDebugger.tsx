import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWebSocketConnection } from './useWebSocketConnection';
import { useAuth } from '@/hooks/useAuth';
import { Wifi, WifiOff, Send, Bug } from 'lucide-react';
import { WS_BASE_URL } from '@/constants/api';
import { SocketEvents } from '@/utils/socket';

interface WebSocketDebuggerProps {
  roomId: string;
}

export const WebSocketDebugger: React.FC<WebSocketDebuggerProps> = ({ roomId }) => {
  const { token } = useAuth();
  const socket = useWebSocketConnection(roomId, token);
  const [connectionLogs, setConnectionLogs] = useState<string[]>([]);
  const [testMessage, setTestMessage] = useState('Hello from frontend!');

  useEffect(() => {
    if (!socket) return;

    const addLog = (message: string) => {
      setConnectionLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    socket.on(SocketEvents.Connect, () => {
      addLog('✅ Connected to WebSocket server');
    });

    socket.on(SocketEvents.Disconnect, (reason) => {
      addLog(`❌ Disconnected: ${reason}`);
    });

    socket.on(SocketEvents.ConnectError, (error) => {
      addLog(`🚫 Connection error: ${error}`);
    });

    socket.on(SocketEvents.MessageReceived, (data) => {
      addLog(`📨 Message received: ${JSON.stringify(data)}`);
    });

    socket.on(SocketEvents.UserJoined, (data) => {
      addLog(`👤 User joined: ${JSON.stringify(data)}`);
    });

    socket.on(SocketEvents.UserLeft, (data) => {
      addLog(`👤 User left: ${JSON.stringify(data)}`);
    });

    socket.on(SocketEvents.UserCount, (count) => {
      addLog(`👥 User count: ${count}`);
    });

    // Generic message handler
    socket.on(SocketEvents.Message, (data) => {
      addLog(`📧 Generic message: ${JSON.stringify(data)}`);
    });

    return () => {
      socket.off(SocketEvents.Connect);
      socket.off(SocketEvents.Disconnect);
      socket.off(SocketEvents.ConnectError);
      socket.off(SocketEvents.MessageReceived);
      socket.off(SocketEvents.UserJoined);
      socket.off(SocketEvents.UserLeft);
      socket.off(SocketEvents.UserCount);
      socket.off(SocketEvents.Message);
    };
  }, [socket]);

  const sendTestMessage = () => {
    if (socket && socket.connected) {
      socket.emit(SocketEvents.SendMessage, { content: testMessage });
      setConnectionLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: 📤 Sent: ${testMessage}`]);
    }
  };

  const clearLogs = () => {
    setConnectionLogs([]);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bug className="w-5 h-5" />
            WebSocket Debugger
          </CardTitle>
          <Badge variant={socket?.connected ? "default" : "destructive"} className="flex items-center gap-1">
            {socket?.connected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {socket?.connected ? "Connected" : "Disconnected"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Connection Info */}
        <div className="text-sm space-y-1">
          <p><strong>Room ID:</strong> {roomId}</p>
          <p><strong>Token:</strong> {token ? '***' + token.slice(-8) : 'None'}</p>
          <p><strong>WebSocket URL:</strong> {WS_BASE_URL}/{roomId}?token=...</p>
        </div>

        {/* Test Message */}
        <div className="flex gap-2">
          <input
            type="text"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            placeholder="Test message..."
          />
          <Button
            onClick={sendTestMessage}
            disabled={!socket?.connected}
            size="sm"
            className="flex items-center gap-1"
          >
            <Send className="w-4 h-4" />
            Send
          </Button>
        </div>

        {/* Logs */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Connection Logs</h4>
            <Button onClick={clearLogs} variant="outline" size="sm">
              Clear
            </Button>
          </div>

          <div className="bg-black p-3 rounded-md h-40 overflow-y-auto text-xs font-mono">
            {connectionLogs.length === 0 ? (
              <p className="text-gray-500">No logs yet...</p>
            ) : (
              connectionLogs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 