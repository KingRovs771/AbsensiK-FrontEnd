"use client";

import { Departement } from "@/types/Departement";
import { ApiResponse } from "@/types/ApiResponse";
import { useState, useEffect } from "react";

const TableAbsensi = () => {
  const [dataDepartements, setDepartements] = useState<Departement[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAbsensi = async () => {
      try {
        const departementsResponse = await fetch(
          "http://localhost:8080/v1/departements/AllDepartements"
        );
        if (!departementsResponse.ok) {
          throw new Error("Http Error! Status : ${response.status}");
        }
        const apiResponse: ApiResponse<Departement[]> =
          await departementsResponse.json();
        if (apiResponse.Status === "Success") {
          setDepartements(apiResponse.Data);
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
    fetchAbsensi();
  }, []);
  return (
    <div className="rounded-sm border border-stroke bg-white px-12 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Data Absensi
      </h4>
      <div className="flex flex-col">
        <div className="grid max-screen grid-cols-5 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5 text-center">
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">No</h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Nama Pegawai
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Check In
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Check Out
            </h5>
          </div>
          <div className="hidden max p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Detail
            </h5>
          </div>
        </div>
        {dataDepartements && dataDepartements.length > 0 ? (
          dataDepartements.map((departements, index) => (
            <div
              className={`grid grid-cols-3 sm:grid-cols-5 ${
                index === dataDepartements.length - 1
                  ? ""
                  : "border-b border-stroke dark:border-strokedark"
              }`}
              key={departements.departments_id}
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
                  <p className="text-black dark:text-white">
                    {departements.name_departments}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center p-2.5 xl:p-2">
                <p className="text-black dark:text-white text-center">
                  {departements.description}
                </p>
              </div>

              <div className="flex items-center justify-center p-2.5 xl:p-2">
                <p className="text-black dark:text-white text-center">
                  {departements.description}
                </p>
              </div>

              <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                <a
                  className="rounded-sm inline-flex items-center justify-center bg-success px-2 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-2"
                  href="#"
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
                  <span>Detail</span>
                </a>
              </div>
            </div>
          ))
        ) : (
          <p>Loading.....</p>
        )}
        ;{error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
};

export default TableAbsensi;
