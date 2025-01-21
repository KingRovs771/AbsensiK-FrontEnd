import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/MainLayout";

export const metadata: Metadata = {
  title: "Form New User",
  description: "Halaman untuk Tambahkan Data Pegawai Baru",
};

const FormUserPage: React.FC = () => {
  return (
    <DefaultLayout>
      <div className=""></div>
    </DefaultLayout>
  );
};

export default FormUserPage;
