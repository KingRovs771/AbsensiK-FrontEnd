"use client";

import { useState } from "react";
import DefaultLayout from "@/components/Layouts/MainLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InsertTipePotongan = () => {
  const [namePotongan, setNamePotongan] = useState<string>("");
  const [nilaiPotongan, setNilaiPotongan] = useState<number>(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleInsertPotongan = async () => {
    if (!namePotongan || !nilaiPotongan) {
      setMessage("Harap isi semua data.");
      return;
    }

    console.log("Sending Data:", {
      namePotongan,
      nilaiPotongan,
    });
    try {
      const response = await fetch(
        "http://localhost:8080/v1/tipePotongan/insertTipePotongan",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name_potongan: namePotongan,
            nilai_potongan: nilaiPotongan,
          }),
        }
      );

      const data = await response.json();

      toast.success("Data berhasil disimpan!", { autoClose: 3000 });
      console.log("Response Data:", data);
    } catch (error) {
      toast.error("Gagal menyimpan data!", { autoClose: 3000 });
      setMessage("Gagal menghubungi server.");
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };

  return (
    <>
      <ToastContainer />
      <DefaultLayout>
        <Breadcrumb pageName="Form Departements" />
        <div className="rounded-sm border border-stroke bg-white px-12 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="mb-4.5">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Name Potongan <span className="text-meta-1">*</span>
            </label>
            <input
              type="text"
              id="namePotongan"
              value={namePotongan}
              onChange={(e) => setNamePotongan(e.target.value)}
              placeholder="Masukkan Name Potongan"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>
          <div className="mb-4.5">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Nilai Potongan <span className="text-meta-1">*</span>
            </label>
            <input
              type="number"
              placeholder="Nilai Potongan"
              value={nilaiPotongan}
              onChange={(e) => setNilaiPotongan(Number(e.target.value))}
              className="w-full border px-3 py-2 rounded-md  mb-3 mt-3"
            />
          </div>

          <button
            onClick={handleInsertPotongan}
            className="w-full bg-blue-500 text-white py-2 rounded-md  mb-3 mt-3"
          >
            Simpan Data
          </button>
          {message}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </DefaultLayout>
    </>
  );
};

export default InsertTipePotongan;
