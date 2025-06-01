"use client";

import { ApiResponse } from "@/types/ApiResponse";
import { Potongan } from "@/types/Potongan";
import { useState, useEffect, useCallback } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TablePotongan = () => {
  const [dataPotongan, setPotongan] = useState<Potongan[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const fetchPotongan = useCallback(
    async (month: string) => {
      try {
        const potonganResponse = await fetch(
          `http://localhost:8080/v1/potongan/allPotongan?month=${month}`
        );

        console.log("Selected Month:", selectedMonth);

        if (!potonganResponse.ok) {
          throw new Error("Http Error! Status : ${response.status}");
        }

        const apiResponse: ApiResponse<Potongan[]> =
          await potonganResponse.json();
        setPotongan(apiResponse.Data);
        setRefreshTrigger((prev) => !prev);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An Unknown error eccurred"
        );
        console.log(error);
      }
    },
    [selectedMonth]
  );

  const handleTipePotonganDelete = async (potongan_id: number) => {
    try {
      const TipePotonganResponse = await fetch(
        `http://localhost:8080/v1/roles/deleteRole/${potongan_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!TipePotonganResponse.ok) {
        throw new Error(`HTTP Error! Status : ${TipePotonganResponse.status}`);
      }
      const result = await TipePotonganResponse.json();
      setSuccessMessage(result.message);
      setPotongan(
        dataPotongan?.filter(
          (dataPotongan) => dataPotongan.potongan_id !== potongan_id
        )
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMonth = e.target.value;
    setSelectedMonth(selectedMonth);

    console.log("Selected Month:", selectedMonth); // 🔹 Debugging frontend

    toast.success(`Menampilkan Potongan Bulan ${selectedMonth}`, {
      position: "top-right",
      autoClose: 3000,
    });

    fetchPotongan(selectedMonth); // 🔹 Kirim hanya `month`
  };
  useEffect(() => {
    if (selectedMonth) {
      console.log("Fetching Data - Selected Month:", selectedMonth);
      fetchPotongan(selectedMonth);
    }
  }, [selectedMonth, refreshTrigger, fetchPotongan]);
  return (
    <div className="rounded-sm border border-stroke bg-white px-12 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Data Potongan
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
        href="/masterdata/potongan/formInput"
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
        <span>Insert Potongan</span>
      </a>
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex flex-col">
        <div className="grid max-screen grid-cols-5 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-7 text-center">
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">No</h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Nama Karyawan
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Tipe Potongan
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
        {dataPotongan.length > 0 ? (
          dataPotongan.map((Potongan, index) => {
            console.log("Rendering row:", Potongan);
            return (
              <div
                key={Potongan.potongan_id}
                className="grid grid-cols-3 sm:grid-cols-7"
              >
                <div className="flex-shrink-0 text-center">
                  <p className="text-black text-center dark:text-white">
                    {index + 1}
                  </p>
                </div>
                <div className="flex items-center gap-3 p-2.5 xl:p-5">
                  <div className="flex-shrink-0 text-center ">
                    <p className="text-black dark:text-white">
                      {Potongan.full_name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-2">
                  <p className="text-black dark:text-white">
                    {Potongan.name_potongan}
                  </p>
                </div>
                <div className="flex items-center justify-center p-2.5 xl:p-2">
                  <p className="text-black dark:text-white">{Potongan.month}</p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-2">
                  <p className="text-black dark:text-white">{Potongan.year}</p>
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
                    onClick={() =>
                      handleTipePotonganDelete(Potongan.potongan_id)
                    }
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
            );
          })
        ) : (
          <p className="text-center mt-4">
            Tidak ada data gaji untuk bulan ini.
          </p>
        )}
      </div>
    </div>
  );
};

export default TablePotongan;
