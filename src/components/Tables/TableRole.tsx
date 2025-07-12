"use client";

import { Role } from "@/types/Role";
import { ApiResponse } from "@/types/ApiResponse";
import { useState, useEffect } from "react";

const TableRole = () => {
  const [dataRole, setRole] = useState<Role[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const roleResponse = await fetch(
          "http://localhost:8080/v1/roles/AllRoles"
        );
        if (!roleResponse.ok) {
          throw new Error("Http Error! Status : ${response.status}");
        }
        const apiResponse: ApiResponse<Role[]> = await roleResponse.json();
        if (apiResponse.Status === "Success") {
          setRole(apiResponse.Data);
        } else {
          throw new Error(apiResponse.Message || "Unknown error from server");
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An Unknown error eccurred"
        );
        console.log(error);
      }
    };
    fetchRoles();
  }, []);

  return (
    <div className="rounded-sm border border-stroke bg-white px-12 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Data Role
      </h4>
      <a
        className="rounded-sm mb-2 inline-flex items-center justify-center bg-primary px-2 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-2"
        href="/masterdata/role/formInput"
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
        <span>Insert Role</span>
      </a>
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex flex-col">
        <div className="grid max-screen grid-cols-5 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-3 text-center">
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">No</h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Nama Role
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Description
            </h5>
          </div>
        </div>
        {dataRole && dataRole.length > 0 ? (
          dataRole.map((role, index) => (
            <div
              className={`grid grid-cols-3 sm:grid-cols-3 ${
                index === dataRole.length - 1
                  ? ""
                  : "border-b border-stroke dark:border-strokedark"
              }`}
              key={role.role_id}
            >
              <div className="flex items-center gap-3 p-2.5 xl:p-5">
                <div className="flex-shrink-0 text-center">
                  <p className="text-black text-center dark:text-white">
                    {index + 1}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2.5 xl:p-5">
                <div className="flex-shrink-0 text-center ">
                  <p className="text-black dark:text-white">{role.name_role}</p>
                </div>
              </div>

              <div className="flex items-center justify-center p-2.5 xl:p-2">
                <p className="text-black dark:text-white">{role.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p>Loading.....</p>
        )}
      </div>
    </div>
  );
};

export default TableRole;
