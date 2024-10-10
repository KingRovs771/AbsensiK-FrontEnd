import ECommerce from "../components/Dashboard/Dashboard";
import { Metadata } from "next";
import MainLayout from "../components/Layouts/MainLayout";

export const metadata: Metadata = {
  title: "Aplikasi Absensi & Gaji Karyawan",
  description: "Aplikasi Absensi & Gaji Karyawan",
};

export default function Home() {
  return (
    <>
      <MainLayout>
        <ECommerce />
      </MainLayout>
    </>
  );
}
