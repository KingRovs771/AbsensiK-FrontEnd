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
    if (!userUID || !month || !year) {
      setMessage("Harap isi semua data.");
      return;
    }

    console.log("Sending Data:", {
      user_uid: userUID, // HARUS menggunakan "user_uid" agar sesuai dengan backend
      month,
      year: parseInt(year, 10),
    });
    try {
      const response = await fetch(
        "http://localhost:8080/v1/salary/insertSalary",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_uid: userUID,
            month,
            year: parseInt(year),
          }),
        }
      );

      const data = await response.json();
      console.log("Response Data:", data);
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
          onSelect={(employee) => {
            console.log("Employee Selct :", employee.user_uid);
            setUserUID(employee.user_uid);
          }}
        />
        <input
          type="text"
          placeholder="User ID (Otomatis)"
          value={userUID}
          readOnly
          className="w-full border mb-3 mt-3 px-3 py-2 rounded-md bg-gray-200"
        />
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-full border px-3 py-2 rounded-md mb-3 mt-3"
        >
          <option value="" disabled>
            Pilih bulan
          </option>
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
        <input
          type="number"
          placeholder="Tahun"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full border px-3 py-2 rounded-md  mb-3 mt-3"
        />
        <button
          onClick={handleInsertSalary}
          className="w-full bg-blue-500 text-white py-2 rounded-md  mb-3 mt-3"
        >
          Generate Gaji
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </DefaultLayout>
  );
};

export default InsertSalary;
