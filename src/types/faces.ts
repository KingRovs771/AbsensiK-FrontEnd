import { Users } from "./Users";

export type Faces = {
  face_id: string;
  user_uid: string;
  face_data: string;
  full_name: string;

  user: Users;
};
