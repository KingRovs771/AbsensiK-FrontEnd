import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/MainLayout";
import TableIzin from "@/components/Tables/TableIzin";
import TableData from "@/components/Tables/TableData";
export const metadata: Metadata = {
  title: "",
  description: "",
};

const IzinPage: React.FC = () => {
  return (
    <DefaultLayout>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Data Absensi
        </h2>
        <nav>
          <ol className="flex items-center gap-2">
            <li>
              <a className="font-medium" href="/">
                Master Data /
              </a>
            </li>
            <li className="font-medium text-primary">Data Absensi</li>
          </ol>
        </nav>
      </div>
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <TableIzin></TableIzin>
            <TableData></TableData>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default IzinPage;
