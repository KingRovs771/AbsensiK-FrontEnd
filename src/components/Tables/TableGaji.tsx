"use client";

import { ApiResponse } from "@/types/ApiResponse";
import { Salary } from "@/types/Salary";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TableGaji = () => {
  const [dataSalary, setSalary] = useState<Salary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  useEffect(() => {
    if (!selectedMonth) {
      setSalary([]);
      return;
    }

    const fetchSalary = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const salaryResponse = await fetch(
          `http://localhost:8080/v1/salary/allSalaryAndName?month=${selectedMonth}`
        );

        if (!salaryResponse.ok) {
          throw new Error(`Http Error! Status: ${salaryResponse.status}`);
        }

        const apiResponse: ApiResponse<Salary[]> = await salaryResponse.json();
        setSalary(apiResponse.Data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An Unknown error occurred"
        );
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalary();
  }, [selectedMonth]);

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = e.target.value;
    setSelectedMonth(newMonth);

    if (newMonth) {
      toast.info(`Menampilkan Gaji Bulan ${newMonth}`);
    }
  };

  // [PENAMBAHAN] Fungsi untuk format mata uang
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <>
      <ToastContainer autoClose={3000} />
      <div className="rounded-sm border border-stroke bg-white px-12 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Data Gaji
          </h4>
          <div className="flex items-center gap-4">
            <select
              onChange={handleMonthChange}
              value={selectedMonth}
              className="rounded border border-stroke bg-transparent px-4 py-2 text-black outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
            >
              <option value="">Pilih Bulan</option>
              <option value="January">Januari</option>
              <option value="February">Februari</option>
              <option value="March">Maret</option>
              <option value="April">April</option>
              <option value="May">Mei</option>
              <option value="June">Juni</option>
              <option value="July">Juli</option>
              <option value="August">Agustus</option>
              <option value="September">September</option>
              <option value="October">Oktober</option>
              <option value="November">November</option>
              <option value="December">Desember</option>
            </select>
            <a
              className="rounded-sm inline-flex items-center justify-center bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
              href="/gaji/formInput"
            >
              <span>Insert Gaji</span>
            </a>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="grid grid-cols-6 rounded-sm bg-gray-2 dark:bg-meta-4 text-center">
            {/* Header */}
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase">No</h5>
            </div>
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase">Nama Pegawai</h5>
            </div>
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase">Bulan</h5>
            </div>
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase">Tahun</h5>
            </div>
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase">Total Kehadiran</h5>
            </div>
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase">Total Gaji</h5>
            </div>
          </div>
          {/* Body */}
          {isLoading ? (
            <p className="text-center p-4">Loading...</p>
          ) : error ? (
            <p className="text-center p-4 text-danger">{error}</p>
          ) : dataSalary.length && dataSalary.length > 0 ? (
            dataSalary.map((salary, index) => (
              <div
                key={salary.salary_id || index}
                className="grid grid-cols-6 border-b border-stroke dark:border-strokedark text-center"
              >
                <div className="flex items-center justify-center p-2.5">
                  <p className="text-black dark:text-white">{index + 1}</p>
                </div>
                <div className="flex items-center justify-center p-2.5">
                  <p className="text-black dark:text-white">
                    {salary.full_name || "N/A"}
                  </p>
                </div>
                <div className="flex items-center justify-center p-2.5">
                  <p className="text-black dark:text-white">
                    {salary.month || "N/A"}
                  </p>
                </div>
                <div className="flex items-center justify-center p-2.5">
                  <p className="text-black dark:text-white">
                    {salary.year || "N/A"}
                  </p>
                </div>
                <div className="flex items-center justify-center p-2.5">
                  <p className="text-black dark:text-white">
                    {salary.total_kehadiran ?? 0}
                  </p>
                </div>
                <div className="flex items-center justify-center p-2.5">
                  <p className="text-black dark:text-white">
                    {formatCurrency(salary.total_gaji || 0)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center p-4">
              Silakan pilih bulan untuk menampilkan data gaji.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default TableGaji;
