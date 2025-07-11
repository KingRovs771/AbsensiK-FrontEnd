export type Attendances = {
  kehadiran_id: string;
  user_uid: string;
  schedule_id: string;
  tanggal: Date;
  time_in: Date;
  time_out: Date;
  photo: File;
  latitude: string;
  longitude: string;
  radius: number;
};
