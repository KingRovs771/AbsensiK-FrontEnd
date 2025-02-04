"use client";

import { Role } from "@/types/Role";
import { ApiResponse } from "@/types/ApiResponse";
import { useState, useEffect } from "react";

const TableRole = () => {
  const [dataRole, setRole] = useState<Role[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  const handleDepartmentDelete = async (RoleId: string) => {
    try {
      const DepartmentsResponse = await fetch(
        `http://localhost:8080/v1/roles/deleteRole/${RoleId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!DepartmentsResponse.ok) {
        throw new Error(`HTTP Error! Status : ${DepartmentsResponse.status}`);
      }
      const result = await DepartmentsResponse.json();
      setSuccessMessage(result.message);
      setRole(dataRole?.filter((role) => role.role_id !== RoleId));
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };
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
        <div className="grid max-screen grid-cols-5 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5 text-center">
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
          <div className="hidden max p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Edit
            </h5>
          </div>
          <div className="hidden max p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Delete
            </h5>
          </div>
        </div>
        {dataRole && dataRole.length > 0 ? (
          dataRole.map((role, index) => (
            <div
              className={`grid grid-cols-3 sm:grid-cols-5 ${
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

              <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                <a
                  className="rounded-sm inline-flex items-center justify-center bg-warning px-2 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-2"
                  href="#"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    className="fill-current mr-2"
                    viewBox="0 0 512 512"
                  >
                    <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1 0 32c0 8.8 7.2 16 16 16l32 0zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" />
                  </svg>
                  <span>Update </span>
                </a>
              </div>

              <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                <button
                  className="rounded-sm inline-flex items-center justify-center bg-danger px-2 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-2"
                  onClick={() => handleDepartmentDelete(role.role_id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    width="18"
                    height="18"
                    className="fill-current mr-2"
                  >
                    <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
                  </svg>
                  <span>Delete</span>
                </button>
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
