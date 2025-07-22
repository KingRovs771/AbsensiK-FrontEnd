import { Users } from "./Users";

export type Izin = {
  izin_id: string;
  user_id: string;
  izin_tipe: string;
  start_date: string;
  end_date: string;
  alasan: string;
  status: number;
  foto: string;
  approve_by: string;
  approve_at: string;
  users: Users;
};
