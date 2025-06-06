import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Users, Hash, User } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import type { Room } from "../../types/room";
import { Badge } from "../ui/badge";
import { logger } from "../../utils/logger";
import { roomService } from "../../services/roomService";
import { ROUTES } from "@/routes";
import { Chat, useWebSocketConnection } from "../chat";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { generateRandomVibrantColor } from "../../utils/helper-functions";
// import { WebSocketDebugger } from "../chat/WebSocketDebugger";

const enum CopyFeedbackType {
  Button1 = "Button1",
  Button2 = "Button2",
}

const RoomPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ roomId: string }>();
  const { user, token } = useAuth();
  const [room, setRoom] = useState<Room | null>(null);
  const [_, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [copyFeedback2, setCopyFeedback2] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<{ userCount: number, users: any[] }>({ userCount: 0, users: [] });

  const webSocketConnection = useWebSocketConnection(params.roomId!, token);

  // Debug component mount
  useEffect(() => {
    logger.info("🎯 Room component mounted with URL:", window.location.href);
    logger.info("🎯 Initial params:", params);
    logger.info("🎯 Initial location:", location);
  }, []);

  // Get room data from state or fetch from API using URL params
  useEffect(() => {
    const loadRoomData = async () => {
      logger.info("=== Room Page Debug Info ===");
      logger.info("Room page - location state:", location.state);
      logger.info("Room page - params:", params);
      logger.info("Room page - params.roomId:", params.roomId);

      const roomData = location.state?.room;
      logger.info("Room page - extracted room data from state:", roomData);

      // Check if this is a page reload by checking if the navigation state's room_id matches URL
      const isPageReload = roomData && params.roomId &&
        (roomData.room_id === params.roomId || roomData.short_room_id === params.roomId);

      logger.info("Is page reload detected:", isPageReload);

      // Always fetch fresh data if we have a room ID in URL, regardless of state
      // This ensures we get the latest room data
      const roomId = params.roomId;
      logger.info("Attempting to fetch fresh room data with roomId:", roomId);

      if (!roomId) {
        logger.error("No room ID provided in URL params");
        setError("No room ID provided");
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        logger.info("🚀 Starting API call to fetch room data for ID:", roomId);

        const fetchedRoom = await roomService.getRoomById(roomId);
        logger.info("✅ Room fetched successfully:", fetchedRoom);

        setRoom(fetchedRoom);
      } catch (error) {
        logger.error("❌ Failed to fetch room:", error);
        setError(error instanceof Error ? error.message : 'Failed to load room');
      } finally {
        setIsLoading(false);
        logger.info("🏁 API call completed");
      }
    };

    logger.info("Room page useEffect triggered");
    loadRoomData();
  }, [location.state, params.roomId]);

  const copyRoomCode = async (copyFeedbackType: CopyFeedbackType) => {
    if (!room?.short_room_id) return;

    try {
      await navigator.clipboard.writeText(room.short_room_id);
      if (copyFeedbackType === CopyFeedbackType.Button1) {
        setCopyFeedback("Copied!");
      } else {
        setCopyFeedback2("Copied!");
      }
      logger.info("Room code copied to clipboard:", room.short_room_id);

      // Clear feedback after 2 seconds
      setTimeout(() => {
        if (copyFeedbackType === CopyFeedbackType.Button1) {
          setCopyFeedback(null);
        } else {
          setCopyFeedback2(null);
        }
      }, 2000);
    } catch (error) {
      logger.error("Failed to copy to clipboard:", error);
      if (copyFeedbackType === CopyFeedbackType.Button1) {
        setCopyFeedback("Copy failed");
      } else {
        setCopyFeedback2("Copy failed");
      }

      // Clear feedback after 2 seconds
      setTimeout(() => {
        if (copyFeedbackType === CopyFeedbackType.Button1) {
          setCopyFeedback(null);
        } else {
          setCopyFeedback2(null);
        }
      }, 2000);
    }
  };

  const handleBackToDashboard = () => {
    navigate(ROUTES.DASHBOARD);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-500">{error}</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => window.location.reload()}>Refresh Page</Button>
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToDashboard}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-3">
                <div className="w-6 h-6">
                  <img src="/src/assets/logo.svg" alt="CodeHall Logo" className="w-full h-full" />
                </div>
                <span className="text-xl font-bold">CodeHall</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge
                variant="secondary"
                className="flex items-center gap-1 cursor-pointer hover:bg-secondary/80 transition-colors relative"
                onClick={() => copyRoomCode(CopyFeedbackType.Button1)}
                title="Click to copy room code"
              >
                <Hash className="w-3 h-3" />
                {room?.short_room_id}
                {copyFeedback && (
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {copyFeedback}
                  </span>
                )}
              </Badge>
              <Badge variant={room?.is_private ? "destructive" : "default"}>
                {room?.is_private ? "Private" : "Public"}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-8 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Room Info Card */}
          <Card className="w-full">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-3xl">{room?.room_name}</CardTitle>
                  <p className="text-muted-foreground text-lg">
                    {room?.room_description}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Room Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Hash className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Room ID</p>
                    <p className="text-xs text-muted-foreground">{room?.short_room_id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <User className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Created By</p>
                    <p className="text-xs text-muted-foreground">
                      {room?.created_by === user?.id ? "You" : `User ${room?.created_by}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 p-3 bg-muted/50 rounded-lg">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Participants</p>
                    <p className="text-xs text-muted-foreground">{onlineUsers.userCount} online</p>
                  </div>
                  <div className="flex items-center -space-x-3">
                    {onlineUsers.users.slice(0, 4).map((user, index) => (
                      <Avatar key={user.userId} className="w-10 h-10 border-2 border-background  relative z-10" style={{ zIndex: onlineUsers.users.length - index }}>
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback
                          className="text-sm font-bold text-black"
                          style={{ backgroundColor: generateRandomVibrantColor() }}
                        >
                          {user.username?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {onlineUsers.users.length > 4 && (
                      <div className="w-10 h-10 bg-muted border-2 border-background rounded-full flex items-center justify-center text-sm font-medium relative z-0">
                        +{onlineUsers.users.length - 4}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Room Actions */}
              <div className="flex flex-wrap gap-3 pt-4">
                <Button className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Invite Others
                </Button>
                <Button variant="outline" className="flex items-center gap-2 relative" onClick={() => copyRoomCode(CopyFeedbackType.Button2)}>
                  <Hash className="w-4 h-4" />
                  Copy Room ID
                  {copyFeedback2 && (
                    <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {copyFeedback2}
                    </span>
                  )}
                </Button>
                <Button variant="outline">
                  Room Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Debug WebSocket Connection */}
          {/* <WebSocketDebugger roomId={params.roomId!} /> */}

          {/* Chat Component */}
          <Chat roomId={params.roomId!} className="w-full" webSocketConnection={webSocketConnection} changeUserCount={(data) => {
            setOnlineUsers(data);
          }} />
        </div>
      </main>
    </div>
  );
};

export default RoomPage; 