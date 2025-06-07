"use client";

import { useState, useEffect } from "react";
import EmployeeSearch from "../../../../components/SearchKaryawan/SearchKaryawan";
import DefaultLayout from "@/components/Layouts/MainLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Tipe_potongan } from "@/types/Tipe_potongan";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const pageInputPotongan = () => {
  const [userUID, setUserUID] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [tipePotonganList, setTipePotonganList] = useState<Tipe_potongan[]>([]);
  const [tipePotongan, setTipePotongan] = useState<string>("");

  const handleInsertPotongan = async () => {
    if (!userUID || !month || !year) {
      setMessage("Harap isi semua data.");
      return;
    }

    console.log("Sending Data:", {
      user_uid: userUID,
      month,
      year: parseInt(year, 10),
    });
    try {
      const response = await fetch(
        "http://localhost:8080/v1/potongan/insertPotongan",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_uid: userUID,
            month,
            year: parseInt(year),
            tipe_potongan: tipePotongan,
          }),
        }
      );

      const data = await response.json();
      console.log("Response Data:", data);
      toast.success("Berhasil Memasukkan Data Potongan Gaji");
    } catch (error) {
      toast.error("Gagal Memasukkan Data Potongan Gaji" + error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };

  useEffect(() => {
    const fetchTipePotongan = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/v1/tipePotongan/allTipePotongan"
        );
        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        const apiData = await response.json();
        console.log("Tipe Potongan Data:", apiData.Data);
        setTipePotonganList(apiData.Data); // 🔹 Simpan ke state
      } catch (error) {
        console.error("Error fetching tipe potongan:", error);
      }
    };

    fetchTipePotongan();
  }, []);

  return (
    <>
      <ToastContainer />
      <DefaultLayout>
        <Breadcrumb pageName="Form Departements" />
        <div className="rounded-sm border border-stroke bg-white px-12 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
            Generate Potonga Gaji Karyawan
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
            placeholder="User ID (Otomatis)"
            value={userUID}
            readOnly
            className="w-full border mb-3 mt-3 px-3 py-2 rounded-md bg-gray-200"
          />
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full border px-3 py-2 rounded-md mb-3 mt-3"
          >
            <option value="" disabled>
              Pilih bulan
            </option>
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
          <select
            value={tipePotongan}
            onChange={(e) => setTipePotongan(e.target.value)}
            className="w-full border px-3 py-2 rounded-md mb-3 mt-3"
          >
            <option value="" disabled>
              Pilih Tipe Potongan
            </option>
            {tipePotonganList.map((potongan) => (
              <option
                key={potongan.tipe_potongan_id}
                value={potongan.tipe_potongan_id}
              >
                {potongan.name_potongan} -{" "}
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(potongan.nilai_potongan)}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Tahun"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full border px-3 py-2 rounded-md  mb-3 mt-3"
          />
          <button
            onClick={handleInsertPotongan}
            className="w-full bg-blue-500 text-white py-2 rounded-md  mb-3 mt-3"
          >
            Simpan Data Potongan
          </button>

          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </DefaultLayout>
    </>
  );
};

export default pageInputPotongan;
