"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DefaultLayout from "@/components/Layouts/MainLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ApiResponse } from "@/types/ApiResponse";
import { Potongan } from "@/types/Potongan";
import { Users } from "@/types/Users";
import { Tipe_potongan } from "@/types/Tipe_potongan";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EmployeeSearch from "@/components/SearchKaryawan/SearchKaryawan";

const FormUpdatePotongan = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { id } = params;

  // State untuk data form
  const [formData, setFormData] = useState<Partial<Potongan>>({
    user_uid: "",
    tipe_potongan: 0,
    month: "",
    year: new Date().getFullYear(),
  });

  // State untuk dropdown tipe potongan
  const [tipePotonganList, setTipePotonganList] = useState<Tipe_potongan[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  // Mengambil data potongan spesifik berdasarkan ID
  useEffect(() => {
    if (!id) return;

    const fetchPotonganData = async () => {
      setIsLoading(true);
      try {
        const potonganRes = await fetch(
          `http://localhost:8080/v1/potongan/getPotonganById/${id}`
        );
        const potonganResult: ApiResponse<Potongan> = await potonganRes.json();
        if (potonganResult.Status === "Success" && potonganResult.Data) {
          setFormData(potonganResult.Data);
        } else {
          throw new Error(
            potonganResult.Message || "Data potongan tidak ditemukan"
          );
        }
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Gagal memuat data potongan"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPotonganData();
  }, [id]);

  // Mengambil daftar semua tipe potongan untuk dropdown
  useEffect(() => {
    const fetchTipePotonganList = async () => {
      try {
        const tipePotonganRes = await fetch(
          "http://localhost:8080/v1/tipePotongan/allTipePotongan"
        );
        const tipePotonganResult: ApiResponse<Tipe_potongan[]> =
          await tipePotonganRes.json();
        if (tipePotonganResult.Status === "Success")
          setTipePotonganList(tipePotonganResult.Data);
      } catch (err) {
        // Tidak menampilkan toast error di sini agar tidak duplikat
        console.error("Gagal memuat daftar tipe potongan:", err);
      }
    };

    fetchTipePotonganList();
  }, []); // Dependensi kosong agar hanya berjalan sekali

  // Handlers untuk perubahan form
  const handleEmployeeSelect = (employee: Users) => {
    if (employee) {
      setFormData((prev) => ({ ...prev, user_uid: employee.user_uid }));
    }
  };

  // Handler umum yang sekarang menangani semua input dan select
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const processedValue = name === "year" ? parseInt(value, 10) || 0 : value;

    setFormData((prev) => ({ ...prev, [name]: processedValue }));
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/v1/potongan/updatePotongan/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const result = await response.json();
      if (!response.ok || result.Status !== "Success") {
        throw new Error(result.Message || "Gagal memperbarui data");
      }
      toast.success("Data potongan berhasil diperbarui!");
      setTimeout(() => router.push("/masterdata/potongan"), 2000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan");
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <DefaultLayout>
        <Breadcrumb pageName="Form Update Potongan" />
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Update Data Potongan
            </h3>
          </div>
          {isLoading ? (
            <div className="p-6.5 text-center">Loading...</div>
          ) : (
            <div className="p-6.5">
              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Nama Karyawan (UID: {formData.user_uid})
                </label>
                <EmployeeSearch onSelect={handleEmployeeSelect} />
              </div>
              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Tipe Potongan
                </label>
                {/* [PERUBAHAN] Menggunakan <select> standar */}
                <select
                  name="tipe_potongan"
                  value={formData.tipe_potongan}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3"
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
              </div>
              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Bulan
                </label>
                <select
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3"
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
              </div>
              <div className="mb-6">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Tahun
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3"
                />
              </div>
              <button
                onClick={handleUpdate}
                disabled={isLoading}
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:cursor-not-allowed"
              >
                {isLoading ? "Menyimpan..." : "Update Data"}
              </button>
            </div>
          )}
        </div>
      </DefaultLayout>
    </>
  );
};

export default FormUpdatePotongan;
