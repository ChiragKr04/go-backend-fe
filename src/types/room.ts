export interface Room {
  id: number;
  room_id: string;
  short_room_id: string;
  created_at: string;
  created_by: number;
  is_private: boolean;
  invitations: any[];
  room_name: string;
  room_description: string;
}

export interface CreateRoomRequest {
  room_name: string;
  room_description: string;
}

export interface CreateRoomResponse {
  id: number;
  room_id: string;
  short_room_id: string;
  created_at: string;
  created_by: number;
  is_private: boolean;
  invitations: any[];
  room_name: string;
  room_description: string;
}
