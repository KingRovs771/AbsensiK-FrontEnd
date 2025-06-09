/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { useState } from "react";
import EmployeeSearch from "../../../../components/SearchKaryawan/SearchKaryawan";
import DefaultLayout from "@/components/Layouts/MainLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const formUpload = () => {
  const [userUID, setUserUID] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [message] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };
  const handleFormUpload = async () => {
    if (!userUID || !file) {
      toast.error("Harap Pilih Karyawan dan Upload Foto");
      return;
    }

    const formData = new FormData();
    formData.append("user_uid", userUID);
    formData.append("face_data", file);
    try {
      const response = await fetch("http://localhost:8080/v1/face/uploadFoto", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Response Data:", data);
      toast.success("Berhasil Memasukkan Data Foto");
    } catch (error) {
      toast.error("Gagal Memasukkan Data Foto" + error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };

  return (
    <>
      <ToastContainer />
      <DefaultLayout>
        <Breadcrumb pageName="Form Upload Foto" />
        <div className="rounded-sm border border-stroke bg-white px-12 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
            Upload Foto Karyawan
          </h2>
          {message && <p className="text-red-500">{message}</p>}
          <EmployeeSearch
            onSelect={(employee) => {
              console.log("Employee Selct :", employee.user_uid);
              setUserUID(employee.user_uid);
            }}
          />
          <input
            type="text"
            id="user_uid"
            placeholder="User ID (Otomatis)"
            value={userUID}
            readOnly
            className="w-full border mb-3 mt-3 px-3 py-2 rounded-md bg-gray-200"
          />
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full border px-3 py-2 rounded-md mb-3"
          />
          <button
            onClick={handleFormUpload}
            className="w-full bg-blue-500 text-white py-2 rounded-md  mb-3 mt-3"
          >
            Simpan Data Foto
          </button>

          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </DefaultLayout>
    </>
  );
};

export default formUpload;
