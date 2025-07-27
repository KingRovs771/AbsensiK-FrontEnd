"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DefaultLayout from "@/components/Layouts/MainLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ApiResponse } from "@/types/ApiResponse";
import { Tipe_potongan } from "@/types/Tipe_potongan"; // Pastikan tipe ini ada dan sesuai
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FormUpdateTipePotongan = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { id } = params;

  // State ini akan menyimpan nilai form yang bisa berubah
  const [formData, setFormData] = useState<Partial<Tipe_potongan>>({
    name_potongan: "",
    nilai_potongan: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect untuk mengambil data awal
  useEffect(() => {
    if (!id) return;

    const fetchTipePotonganData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8080/v1/tipePotongan/getTipeById/${id}`
        );
        if (!response.ok) {
          throw new Error("Gagal mengambil data Tipe Potongan");
        }
        const apiResponse: ApiResponse<Tipe_potongan> = await response.json();
        if (apiResponse.Status === "Success" && apiResponse.Data) {
          // Set data awal ke dalam form state
          setFormData(apiResponse.Data);
        } else {
          throw new Error(apiResponse.Message || "Gagal memuat data");
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan tidak diketahui";
        setError(message);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTipePotonganData();
  }, [id]);

  // Fungsi ini akan memperbarui state setiap kali user mengetik
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      // [PERUBAHAN] Menggunakan parseInt untuk mendapatkan bilangan bulat (integer)
      [name]: name === "nilai_potongan" ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    setError(null);

    // Data yang dikirim sekarang diambil langsung dari state `formData` yang selalu ter-update
    const updatedData = {
      name_potongan: formData.name_potongan,
      nilai_potongan: formData.nilai_potongan,
    };

    try {
      const response = await fetch(
        `http://localhost:8080/v1/tipePotongan/updateTipePotongan/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }
      );

      const result: ApiResponse<null> = await response.json();

      if (!response.ok || result.Status !== "Success") {
        throw new Error(result.Message || "Gagal memperbarui data");
      }

      toast.success(result.Message || "Data berhasil diperbarui!");

      setTimeout(() => {
        router.push("/masterdata/tipePotongan");
      }, 2000);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan tidak diketahui";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <DefaultLayout>
        <Breadcrumb pageName="Form Update Tipe Potongan" />
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Update Tipe Potongan: {formData.name_potongan}
            </h3>
          </div>
          {isLoading ? (
            <div className="p-6.5 text-center">Loading data...</div>
          ) : (
            <div className="p-6.5">
              {error && (
                <div className="mb-4 rounded bg-danger/10 p-3 text-center text-danger">
                  {error}
                </div>
              )}
              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Nama Potongan
                </label>
                <input
                  type="text"
                  name="name_potongan"
                  value={formData.name_potongan || ""}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3"
                />
              </div>

              <div className="mb-6">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Nilai Potongan (Rp)
                </label>
                <input
                  type="number"
                  name="nilai_potongan"
                  value={formData.nilai_potongan || 0}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3"
                />
              </div>

              <button
                onClick={handleUpdate}
                disabled={isLoading}
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
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

export default FormUpdateTipePotongan;
