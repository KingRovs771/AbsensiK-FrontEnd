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
          `http://localhost:8080/v1/users/getUsers/search?name=${searchTerm}`
        );

        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data: ApiResponse<Employee[]> = await response.json();
        if (data.Status === "Success") {
          const employeesArray = Object.values(data.Data).map((employee) => ({
            user_uid: employee.user_uid,
            full_name: employee.full_name,
          })) as Employee[];

          setEmployees(employeesArray);
        } else {
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

  return (
    <div>
      <input
        type="text"
        placeholder="Cari nama karyawan..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full border px-3 py-2 rounded-md md-2"
      />
      {error && <p className="text-red-500">{error}</p>}
      {employees.length > 0 && (
        <ul className="mt-2 border rounded-md bg-white">
          {employees.map((employee) => (
            <li
              key={employee.user_uid}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => onSelect(employee)}
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
