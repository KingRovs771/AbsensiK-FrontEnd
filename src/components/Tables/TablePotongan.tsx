"use client";

import { ApiResponse } from "@/types/ApiResponse";
import { Potongan } from "@/types/Potongan";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TablePotongan = () => {
  const [dataPotongan, setPotongan] = useState<Potongan[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  // [PERBAIKAN] useEffect sekarang hanya bergantung pada `selectedMonth`
  useEffect(() => {
    // Jangan lakukan fetch jika belum ada bulan yang dipilih
    if (!selectedMonth) {
      setPotongan([]); // Kosongkan data jika tidak ada bulan terpilih
      return;
    }

    const fetchPotongan = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const potonganResponse = await fetch(
          `http://localhost:8080/v1/potongan/allPotongan?month=${selectedMonth}`
        );

        if (!potonganResponse.ok) {
          throw new Error(`Http Error! Status: ${potonganResponse.status}`);
        }

        const apiResponse: ApiResponse<Potongan[]> =
          await potonganResponse.json();

        if (apiResponse.Status === "Success" && apiResponse.Data) {
          setPotongan(apiResponse.Data);
        } else {
          setPotongan([]);
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPotongan();
  }, [selectedMonth]); // Dependency hanya `selectedMonth`

  const handlePotonganDelete = async (potongan_id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data potongan ini?")) {
      return;
    }
    try {
      const deleteResponse = await fetch(
        `http://localhost:8080/v1/potongan/deletePotongan/${potongan_id}`,
        {
          method: "DELETE",
        }
      );

      const result = await deleteResponse.json();

      if (!deleteResponse.ok || result.Status !== "Success") {
        throw new Error(result.Message || "Gagal menghapus data");
      }

      toast.success("Berhasil Menghapus data Potongan");
      setPotongan(
        dataPotongan.filter((potongan) => potongan.potongan_id !== potongan_id)
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menghapus data"
      );
    }
  };

  // [PERBAIKAN] Handler ini sekarang hanya bertugas mengubah state bulan
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = e.target.value;
    setSelectedMonth(newMonth);
    if (newMonth) {
      toast.info(`Menampilkan Potongan Bulan ${newMonth}`);
    }
  };

  return (
    <>
      <ToastContainer autoClose={3000} />
      <div className="rounded-sm border border-stroke bg-white px-12 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Data Potongan
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
              href="/masterdata/potongan/formInput"
            >
              <span>Insert Potongan</span>
            </a>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="grid grid-cols-7 rounded-sm bg-gray-2 dark:bg-meta-4 text-center">
            {/* Header */}
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase">No</h5>
            </div>
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase">Nama Karyawan</h5>
            </div>
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase">Tipe Potongan</h5>
            </div>
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase">Bulan</h5>
            </div>
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase">Tahun</h5>
            </div>
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase">Edit</h5>
            </div>
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase">Delete</h5>
            </div>
          </div>
          {/* Body */}
          {isLoading ? (
            <p className="text-center p-4">Loading...</p>
          ) : error ? (
            <p className="text-center p-4 text-danger">{error}</p>
          ) : dataPotongan.length > 0 ? (
            dataPotongan.map((potongan, index) => (
              <div
                key={potongan.potongan_id}
                className="grid grid-cols-7 border-b border-stroke dark:border-strokedark text-center"
              >
                <div className="flex items-center justify-center p-2.5">
                  <p className="text-black dark:text-white">{index + 1}</p>
                </div>
                <div className="flex items-center justify-center p-2.5">
                  <p className="text-black dark:text-white">
                    {potongan.full_name}
                  </p>
                </div>
                <div className="flex items-center justify-center p-2.5">
                  <p className="text-black dark:text-white">
                    {potongan.name_potongan}
                  </p>
                </div>
                <div className="flex items-center justify-center p-2.5">
                  <p className="text-black dark:text-white">{potongan.month}</p>
                </div>
                <div className="flex items-center justify-center p-2.5">
                  <p className="text-black dark:text-white">{potongan.year}</p>
                </div>
                <div className="flex items-center justify-center p-2.5">
                  <a
                    href={`/masterdata/potongan/formUpdate/${potongan.potongan_id}`}
                    className="text-warning hover:text-opacity-80"
                  >
                    Update
                  </a>
                </div>
                <div className="flex items-center justify-center p-2.5">
                  <button
                    onClick={() => handlePotonganDelete(potongan.potongan_id)}
                    className="text-danger hover:text-opacity-80"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center p-4">
              Silakan pilih bulan untuk menampilkan data potongan.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default TablePotongan;
