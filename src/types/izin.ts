export type Izin = {
  izin_id: string;
  user_id: string;
  izin_tipe: string;
  start_date: Date;
  end_date: Date;
  alasan: Text;
  status: string;
  approve_by: string;
  approve_at: Date;
};
