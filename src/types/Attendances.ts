import { Users } from "./Users";

export type Attendances = {
  kehadiran_id: string;
  user_uid: string;
  schedule_id: string;
  tanggal: string;
  time_in: string;
  time_out: string;
  photo: File;
  latitude: string;
  longitude: string;
  radius: number;

  user: Users;
};
