import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/MainLayout";
import TableSchedule from "@/components/Tables/TableSchedule";
export const metadata: Metadata = {
  title: "",
  description: "",
};

const SchedulePage: React.FC = () => {
  return (
    <DefaultLayout>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Data Schedules
        </h2>
        <nav>
          <ol className="flex items-center gap-2">
            <li>
              <a className="font-medium" href="/">
                Master Data /
              </a>
            </li>
            <li className="font-medium text-primary">Data Schedules</li>
          </ol>
        </nav>
      </div>
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <TableSchedule></TableSchedule>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default SchedulePage;
