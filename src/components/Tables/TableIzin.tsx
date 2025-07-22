/* eslint-disable @next/next/no-img-element */
"use client";

import { Izin } from "@/types/Izin";
import { ApiResponse } from "@/types/ApiResponse";
import React, { useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ===================================================================
// Komponen Modal untuk Menampilkan Detail Izin
// ===================================================================
interface ModalDetailProps {
  izin: Izin;
  onClose: () => void;
}

const ModalDetailIzin: React.FC<ModalDetailProps> = ({ izin, onClose }) => {
  const handleContentClick = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={onClose}
    >
      {/* Konten Modal */}
      <div
        className="relative w-full max-w-2xl transform rounded-lg bg-white p-6 shadow-default transition-all dark:bg-boxdark"
        onClick={handleContentClick}
      >
        {/* Header Modal dengan Tombol Close */}
        <div className="flex items-start justify-between border-b border-stroke pb-4 dark:border-strokedark">
          <h3 className="text-xl font-semibold text-black dark:text-white">
            Detail Pengajuan Izin
          </h3>
          <button
            onClick={onClose}
            className="text-2xl font-bold leading-none text-black hover:text-danger dark:text-white"
          >
            &times;
          </button>
        </div>

        {/* Body Modal */}
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="font-medium text-black dark:text-white">
              Nama Pegawai:
            </p>
            <p>{izin.users?.full_name || "Tidak ada data"}</p>
          </div>
          <div>
            <p className="font-medium text-black dark:text-white">Alasan:</p>
            <p>{izin.alasan}</p>
          </div>
          <div>
            <p className="font-medium text-black dark:text-white">
              Tanggal Mulai:
            </p>
            <p>{new Date(izin.start_date).toLocaleDateString("id-ID")}</p>
          </div>
          <div>
            <p className="font-medium text-black dark:text-white">
              Tanggal Selesai:
            </p>
            <p>{new Date(izin.end_date).toLocaleDateString("id-ID")}</p>
          </div>
          <div>
            <p className="font-medium text-black dark:text-white">Status:</p>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-sm font-medium text-white ${
                izin.status === 1
                  ? "bg-green-500" // Status 1: Disetujui (Hijau)
                  : izin.status === 2
                    ? "bg-red-500" // Status 2: Ditolak (Merah)
                    : "bg-yellow-500" // Status 0 atau lainnya: Menunggu (Kuning)
              }`}
            >
              {izin.status === 1
                ? "Disetujui"
                : izin.status === 2
                  ? "Ditolak"
                  : "Menunggu Persetujuan"}
            </span>
          </div>
          {izin.status === 1 && (
            <>
              <div>
                <p className="font-medium text-black dark:text-white">
                  Disetujui Oleh:
                </p>
                <p>{izin.approve_by}</p>
              </div>
              <div>
                <p className="font-medium text-black dark:text-white">
                  Tanggal Disetujui:
                </p>
                <p>{new Date(izin.approve_at).toLocaleDateString("id-ID")}</p>
              </div>
            </>
          )}
        </div>

        {/* Bagian untuk menampilkan foto bukti dari Base64 */}
        {izin.alasan.toLowerCase() === "sakit" && izin.foto && (
          <div className="mt-4 border-t border-stroke pt-4 dark:border-strokedark">
            <h4 className="mb-2 font-semibold text-black dark:text-white">
              Bukti Foto Sakit:
            </h4>
            <img
              src={`data:image/jpeg;base64,${izin.foto}`}
              alt={`Bukti sakit ${izin.users?.full_name}`}
              className="w-full max-w-sm rounded-md object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
};

// ===================================================================
// Komponen Utama Tabel Izin
// ===================================================================
const TableIzin: React.FC = () => {
  const [dataIzin, setDataIzin] = useState<Izin[]>([]);
  const [error, setError] = useState<string | null>(null);
  const authInfo = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  // State untuk mengelola modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIzin, setSelectedIzin] = useState<Izin | null>(null);

  const fetchIzin = async () => {
    try {
      const IzinResponse = await fetch("http://localhost:8080/v1/izin/allIzin");
      if (!IzinResponse.ok) {
        throw new Error(`Http Error! Status : ${IzinResponse.status}`);
      }
      const apiResponse: ApiResponse<Izin[]> = await IzinResponse.json();
      if (apiResponse.Status === "Success") {
        setDataIzin(apiResponse.Data);
      } else {
        throw new Error(apiResponse.Message || "Unknown error from server");
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An Unknown error occurred"
      );
      console.log(error);
    }
  };

  const approveizin = async (izinId: number) => {
    if (!authInfo) {
      toast.error("Informasi user tidak ditemukan, silahkan login ulang.");
      return;
    }
    try {
      const approveResponse = await fetch(
        `http://localhost:8080/v1/izin/${izinId}/approve`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "X-Full-Name": authInfo.full_name,
          },
        }
      );
      if (!approveResponse.ok) {
        throw new Error(`HTTP Error! Status : ${approveResponse.status}`);
      }
      const apiResponse: ApiResponse<Izin> = await approveResponse.json();
      if (apiResponse.Status !== "Success") {
        throw new Error(apiResponse.Message || "Gagal melakukan approval");
      }

      toast.success("Izin berhasil di-approve!");
      setRefreshTrigger((prev) => !prev); // Memicu re-fetch data
    } catch (error) {
      setError(error instanceof Error ? error.message : "An Unknown error");
      toast.error(
        error instanceof Error ? error.message : "Gagal melakukan approval"
      );
      console.log(error);
    }
  };

  const rejectedizin = async (izinId: number) => {
    if (!authInfo) {
      toast.error("Informasi user tidak ditemukan, silahkan login ulang.");
      return;
    }
    try {
      const approveResponse = await fetch(
        `http://localhost:8080/v1/izin/${izinId}/reject`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "X-Full-Name": authInfo.full_name,
          },
        }
      );
      if (!approveResponse.ok) {
        throw new Error(`HTTP Error! Status : ${approveResponse.status}`);
      }
      const apiResponse: ApiResponse<Izin> = await approveResponse.json();
      if (apiResponse.Status !== "Success") {
        throw new Error(apiResponse.Message || "Gagal melakukan approval");
      }

      toast.success("Izin berhasil di-Recjected!");
      setRefreshTrigger((prev) => !prev);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An Unknown error");
      toast.error(
        error instanceof Error ? error.message : "Gagal melakukan approval"
      );
      console.log(error);
    }
  };

  //Parsing Tanggal
  const formatDate = (datetimeString: string | number | Date) => {
    const date = new Date(datetimeString);
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    fetchIzin();
  }, [refreshTrigger]);

  // Fungsi untuk membuka dan menutup modal
  const handleOpenModal = (izin: Izin) => {
    setSelectedIzin(izin);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedIzin(null);
  };

  return (
    <>
      <ToastContainer />
      <div className="rounded-sm border border-stroke bg-white px-12 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
          Data Izin Karyawan
        </h4>
        <div className="flex flex-col">
          <div className="grid grid-cols-9 rounded-sm bg-gray-2 dark:bg-meta-4 text-center">
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                No
              </h5>
            </div>
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Nama Pegawai
              </h5>
            </div>
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Start Date
              </h5>
            </div>
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                End Date
              </h5>
            </div>
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Alasan
              </h5>
            </div>
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Status
              </h5>
            </div>
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Approve
              </h5>
            </div>
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Rejected
              </h5>
            </div>
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Detail
              </h5>
            </div>
          </div>
          {dataIzin && dataIzin.length > 0 ? (
            dataIzin.map((izin, index) => (
              <div
                className={`grid grid-cols-9 ${index === dataIzin.length - 1 ? "" : "border-b border-stroke dark:border-strokedark"}`}
                key={izin.izin_id}
              >
                <div className="flex items-center justify-center p-2.5">
                  <p className="text-black dark:text-white">{index + 1}</p>
                </div>
                <div className="flex items-center justify-center p-2.5">
                  <p className="text-black dark:text-white">
                    {izin.users?.full_name || "unknown"}
                  </p>
                </div>
                <div className="flex items-center justify-center p-2.5">
                  <p className="text-black dark:text-white">
                    {formatDate(izin.start_date)}
                  </p>
                </div>
                <div className="flex items-center justify-center p-2.5">
                  <p className="text-black dark:text-white">
                    {formatDate(izin.end_date)}
                  </p>
                </div>
                <div className="flex items-center justify-center p-2.5">
                  <p className="text-black dark:text-white">{izin.alasan}</p>
                </div>
                <div className="flex items-center justify-center p-2.5">
                  <p
                    className={`inline-flex rounded-full bg-opacity-90 px-3 py-1 text-sm font-medium text-white ${
                      izin.status === 1
                        ? "bg-success" // Status 1: Disetujui (Hijau)
                        : izin.status === 2
                          ? "bg-danger" // Status 2: Ditolak (Merah)
                          : "bg-warning" // Status 0 atau lainnya: Menunggu (Kuning)
                    }`}
                  >
                    {izin.status === 1
                      ? "Disetujui"
                      : izin.status === 2
                        ? "Ditolak"
                        : "Menunggu"}
                  </p>
                </div>
                <div className="flex items-center justify-center p-2.5">
                  <button
                    onClick={() => approveizin(parseInt(izin.izin_id))}
                    disabled={izin.status === 1}
                    className={`rounded-sm px-4 py-2 font-medium text-white ${izin.status === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-warning hover:bg-opacity-90"}`}
                  >
                    Approve
                  </button>
                </div>
                <div className="flex items-center justify-center p-2.5">
                  <button
                    onClick={() => rejectedizin(parseInt(izin.izin_id))}
                    disabled={izin.status === 2}
                    className={`rounded-sm px-4 py-2 font-medium text-white ${izin.status === 2 ? "bg-gray-400 cursor-not-allowed" : "bg-danger hover:bg-opacity-90"}`}
                  >
                    Rejected
                  </button>
                </div>
                <div className="flex items-center justify-center p-2.5">
                  <button
                    onClick={() => handleOpenModal(izin)}
                    className="rounded-sm bg-primary px-4 py-2 font-medium text-white hover:bg-opacity-90"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="p-5 text-center">
              Loading data atau data tidak ditemukan...
            </p>
          )}
          {error && <p className="p-5 text-center text-red-500">{error}</p>}
        </div>
      </div>

      {/* Render Modal secara kondisional */}
      {isModalOpen && selectedIzin && (
        <ModalDetailIzin izin={selectedIzin} onClose={handleCloseModal} />
      )}
    </>
  );
};

export default TableIzin;
