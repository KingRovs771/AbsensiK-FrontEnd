"use client";

import { useState } from "react";
import { ApiResponse } from "@/types/ApiResponse";

interface Employee {
  user_uid: string;
  full_name: string;
}

const EmployeeSearch = ({
  onSelect,
}: {
  onSelect: (employee: Employee) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState("");

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);

    if (event.target.value.length > 2) {
      try {
        const response = await fetch(
          `http://localhost:8080/v1/users/getUsers/search?name=${searchTerm}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const rawData: ApiResponse<Employee[]> = await response.json();
        console.log("Full API Response:", JSON.stringify(rawData, null, 2));

        // Debugging tipe data
        console.log(
          "Apakah Data berbentuk array?",
          Array.isArray(rawData.Data)
        );
        console.log("Tipe Data:", typeof rawData.Data);

        // Pastikan Data berbentuk array
        let employeesArray: Employee[] = [];

        if (Array.isArray(rawData.Data)) {
          employeesArray = rawData.Data;
        } else if (typeof rawData.Data === "object") {
          employeesArray = Object.values(rawData.Data); // Konversi objek ke array
        }

        // Cek apakah array tidak kosong sebelum menampilkan hasil
        if (employeesArray.length > 0) {
          setEmployees(employeesArray);
          setError(""); // Reset error jika data ditemukan
        } else {
          setEmployees([]);
          setError("Data tidak ditemukan.");
        }
      } catch (error) {
        console.error("Error saat fetch API:", error);
      }
    } else {
      setEmployees([]);
      setError("");
    }
  };

  const handleSelect = (employee: Employee) => {
    onSelect(employee);
    setEmployees([]); // Hapus daftar setelah memilih
    setSearchTerm(""); // Kosongkan input pencarian
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Cari nama karyawan..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full border px-3 py-2 rounded-md md-5"
      />
      {error && <p className="text-red-500">{error}</p>}
      {employees.length > 0 && (
        <ul className="mt-2 mb-3 border rounded-md bg-white">
          {employees.map((employee) => (
            <li
              key={employee.user_uid}
              className="p-2 mb-4 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSelect(employee)}
            >
              {employee.full_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmployeeSearch;
