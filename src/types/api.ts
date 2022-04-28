export interface CreateRoomBody {
  id?: string;
  src: string;
}

export type NewRoomQuerystring = Partial<CreateRoomBody>;
