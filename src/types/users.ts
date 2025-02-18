import { Departement } from "./Departement";
import { Role } from "./Role";

export type Users = {
  user_uid: string;
  username: string;
  password: string;
  email: string;
  full_name: string;
  gender: string;
  phone: string;
  address: string;
  dailyrate: number;
  departments_id: string;
  department: Departement;
  role_id: string;
  role: Role;
};
