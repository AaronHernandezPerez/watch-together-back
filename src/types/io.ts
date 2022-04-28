export interface RoomData {
  src?: string;
  playing?: boolean | string;
  lastSeeking?: number | string;
  seeker?: string;
  time?: number;
}

export interface RedisRoomData {
  src?: string;
  playing?: string;
  lastSeeking?: string;
  seeker?: string;
}
