import { Departement } from "./Departement";
import { Role } from "./Role";

export type Users = {
  user_id: string;
  user_uid: string;
  username: string;
  email: string;
  full_name: string;
  gender: string;
  phone: string;
  address: Text;
  dailyrate: number;
  departements_id: string;
  department: Departement;
  role_id: string;
  role: Role;
};
