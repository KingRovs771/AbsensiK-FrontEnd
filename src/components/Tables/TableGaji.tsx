"use client";

import { ApiResponse } from "@/types/ApiResponse";
import { Salary } from "@/types/Salary";
import { useCallback, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TableGaji = () => {
  const [dataSalary, setSalary] = useState<Salary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const fetchSalary = useCallback(
    async (month: string) => {
      try {
        console.log("Sending Selected Month to API:", month);
        const salaryResponse = await fetch(
          `http://localhost:8080/v1/salary/allSalaryAndName?month=${month}`
        );

        console.log("Selected Month:", selectedMonth);
        const apiResponse: ApiResponse<Salary[]> = await salaryResponse.json();
        setSalary(apiResponse.Data);
        setRefreshTrigger((prev) => !prev);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An Unknown error occurred"
        );
        console.log(error);
      }
    },
    [selectedMonth]
  );

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMonth = e.target.value;
    setSelectedMonth(selectedMonth);

    console.log("Selected Month:", selectedMonth); // 🔹 Debugging frontend

    toast.success(`Menampilkan Gaji Bulan ${selectedMonth}`, {
      position: "top-right",
      autoClose: 3000,
    });

    fetchSalary(selectedMonth); // 🔹 Kirim hanya `month`
  };
  useEffect(() => {
    if (selectedMonth) {
      console.log("Fetching Data - Selected Month:", selectedMonth);
      fetchSalary(selectedMonth);
    }
  }, [refreshTrigger, selectedMonth, fetchSalary]);
  return (
    <>
      <ToastContainer />
      <div className="rounded-sm border border-stroke bg-white px-12 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
          Data Gaji
        </h4>
        <select onChange={handleMonthChange} value={selectedMonth}>
          <option value="">Select Month</option>
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          <option value="April">April</option>
          <option value="May">May</option>
          <option value="June">June</option>
          <option value="July">July</option>
          <option value="August">August</option>
          <option value="September">September</option>
          <option value="October">October</option>
          <option value="November">November</option>
          <option value="December">December</option>
        </select>
        <a
          className="rounded-sm mb-2 inline-flex items-center justify-center bg-primary px-2 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-2"
          href="/gaji/formInput"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            width="18"
            height="18"
            className="fill-current mr-2"
          >
            <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" />
          </svg>
          <span>Insert Gaji</span>
        </a>
        <div className="flex flex-col">
          <div className="grid max-screen grid-cols-5 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-6 text-center">
            {/* 🔹 Header */}
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                No
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Nama Pegawai
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Bulan
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Tahun
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Total Kehadiran
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Total Gaji
              </h5>
            </div>
          </div>
          {dataSalary.length > 0 ? (
            dataSalary.map((salary, index) => {
              console.log("Rendering row:", salary);
              return (
                <div
                  key={salary.salary_id}
                  className="grid grid-cols-3 sm:grid-cols-6"
                >
                  <div className="flex items-center justify-center p-2.5 xl:p-2">
                    <p className="text-black dark:text-white text-center">
                      {index + 1}
                    </p>
                  </div>
                  <div className="flex items-center justify-center p-2.5 xl:p-2">
                    <p className="text-black dark:text-white text-center">
                      {salary.full_name}
                    </p>
                  </div>
                  <div className="flex items-center justify-center p-2.5 xl:p-2">
                    <p className="text-black dark:text-white text-center">
                      {salary.month}
                    </p>
                  </div>
                  <div className="flex items-center justify-center p-2.5 xl:p-2">
                    <p className="text-black dark:text-white text-center">
                      {salary.year}
                    </p>
                  </div>
                  <div className="flex items-center justify-center p-2.5 xl:p-2">
                    <p className="text-black dark:text-white text-center">
                      {salary.total_kehadiran}
                    </p>
                  </div>
                  <div className="flex items-center justify-center p-2.5 xl:p-2">
                    <p className="text-black dark:text-white text-center">
                      {salary.total_gaji}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center mt-4">
              Tidak ada data gaji untuk bulan ini.
            </p>
          )}

          {error && <p style={{ color: "red" }}>{error}</p>}
          {successMessage && <p className="text-green-500">{successMessage}</p>}
        </div>
      </div>
    </>
  );
};

export default TableGaji;
