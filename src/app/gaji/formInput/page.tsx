"use client";

import { useState } from "react";
import EmployeeSearch from "../../../components/SearchKaryawan/SearchKaryawan";
import DefaultLayout from "@/components/Layouts/MainLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

const InsertSalary = () => {
  const [userUID, setUserUID] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleInsertSalary = async () => {
    setMessage("");
    try {
      const response = await fetch(
        "http://localhost:8080/api/salary/generate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userUID: userUID,
            month,
            year: parseInt(year),
          }),
        }
      );

      const data = await response.json();
      setMessage(
        data.Status === "Success"
          ? "Gaji berhasil dihitung!"
          : `Gagal: ${data.Message}`
      );
    } catch (error) {
      setMessage("Gagal menghubungi server.");
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Form Departements" />
      <div className="rounded-sm border border-stroke bg-white px-12 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
          Generate Gaji Karyawan
        </h2>
        {message && <p className="text-red-500">{message}</p>}
        <EmployeeSearch
          onSelect={(employee) => setUserUID(employee.user_uid)}
        />
        <input
          type="text"
          placeholder="User ID (Otomatis)"
          value={userUID}
          readOnly
          className="w-full border px-3 py-2 rounded-md bg-gray-200"
        />
        <input
          type="text"
          placeholder="Bulan (January, etc.)"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-full border px-3 py-2 rounded-md"
        />
        <input
          type="number"
          placeholder="Tahun"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full border px-3 py-2 rounded-md"
        />
        <button
          onClick={handleInsertSalary}
          className="w-full bg-blue-500 text-white py-2 rounded-md"
        >
          Generate Gaji
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </DefaultLayout>
  );
};

export default InsertSalary;
