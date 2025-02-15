import { Users } from "./Users";

export type Schedules = {
  schedule_id: string;
  user_uid: string;
  start_time: Date;
  end_time: Date;
  day: string;
  is_active: number;
  full_name: string;
  user: Users;
};
