"use client";

import { useState, useEffect, useRef } from "react"; // 1. Import useRef
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Faces } from "@/types/Faces";

const TableFoto = () => {
  const [faces, setFaces] = useState<Faces[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 2. Buat sebuah ref sebagai flag
  const fetchCalled = useRef(false);

  useEffect(() => {
    // 3. Hanya jalankan fetch jika flag-nya false
    if (fetchCalled.current === false) {
      const fetchFaces = async () => {
        try {
          const response = await fetch(
            "http://localhost:8080/v1/face/getAllFoto"
          );
          if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
          }

          const data = await response.json();
          setFaces(data);

          toast.success("Berhasil Mengambil Data Foto Pegawai");
        } catch (error) {
          console.error("Error fetching faces:", error);
          toast.error("Gagal mengambil data wajah");
        }
      };

      fetchFaces();

      // 4. Setelah fetch dipanggil, set flag menjadi true
      fetchCalled.current = true;
    }
  }, []); // Dependensi tetap kosong

  const handlerFotoDelete = async (UserUID: string) => {
    try {
      const FotoResponse = await fetch(
        `http://localhost:8080/v1/face/deleteFoto/${UserUID}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}), // Menambahkan body kosong jika backend memerlukan
        }
      );
      if (!FotoResponse.ok) {
        throw new Error(`HTTP Error! Status : ${FotoResponse.status}`);
      }
      const result = await FotoResponse.json();

      toast.success("Sukses Menghapus Data!", { autoClose: 3000 });
      setSuccessMessage(result.message);
      setFaces(faces?.filter((face) => face.user_uid !== UserUID));
    } catch (error) {
      toast.error("Gagal Menghapus Data!", { autoClose: 3000 });
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="rounded-sm border border-stroke bg-white px-12 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
          Data Foto Pegawai
        </h4>
        <a
          className="rounded-sm mb-2 inline-flex items-center justify-center bg-primary px-2 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-2"
          href="/masterdata/foto/formInput"
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
          <span>Insert Foto</span>
        </a>
        <div className="flex flex-col">
          <div className="grid grid-cols-4 rounded-sm bg-gray-2 dark:bg-meta-4 text-center">
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Foto
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Nama Lengkap
              </h5>
            </div>
            <div className="hidden p-2.5 text-center sm:block xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Edit
              </h5>
            </div>
            <div className="hidden p-2.5 text-center sm:block xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Delete
              </h5>
            </div>
          </div>

          {faces && faces.length > 0 ? (
            faces.map((face, index) => (
              <div
                className={`grid grid-cols-4 ${index === faces.length - 1 ? "" : "border-b border-stroke dark:border-strokedark"}`}
                key={face.face_id || index}
              >
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <Image
                    src={`data:image/jpeg;base64,${face.face_data}`}
                    alt={face.user?.full_name || "Foto Pegawai"}
                    width={100}
                    height={100}
                    className="rounded-md"
                  />
                </div>
                <div className="flex items-center justify-center p-2.5 xl:p-2">
                  <p className="text-black dark:text-white">
                    {face.user?.full_name || "N/A"}
                  </p>
                </div>
                <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                  <a
                    className="rounded-sm inline-flex items-center justify-center bg-warning px-2 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-2"
                    href={`/masterdata/foto/formUpdate/${face.face_id}`}
                  >
                    <span>Update</span>
                  </a>
                </div>
                <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                  <button
                    onClick={() => handlerFotoDelete(face.user_uid)}
                    className="rounded-sm inline-flex items-center justify-center bg-danger px-2 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-2"
                  >
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="p-5 text-center">Loading atau tidak ada data...</p>
          )}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {successMessage && <p className="text-green-500">{successMessage}</p>}
        </div>
      </div>
    </>
  );
};

export default TableFoto;
