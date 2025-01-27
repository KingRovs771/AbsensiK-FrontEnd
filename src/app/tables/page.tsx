import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableUsers from "@/components/Tables/TableUsers";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/MainLayout";

export const metadata: Metadata = {
  title: "Next.js Tables | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Tables" />

      <div className="flex flex-col gap-10">
        <TableUsers />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
