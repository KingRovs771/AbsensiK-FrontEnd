"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import DefaultLayout from "@/components/Layouts/MainLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ApiResponse } from "@/types/ApiResponse";
import { Faces } from "@/types/Faces";
import { Users } from "@/types/Users";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EmployeeSearch from "@/components/SearchKaryawan/SearchKaryawan";

const FormUpdateFoto = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { id } = params; // face_id from URL

  const [currentFace, setCurrentFace] = useState<Partial<Faces>>({});
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentEmployeeName, setCurrentEmployeeName] = useState<string>("");
  const [newUserUID, setNewUserUID] = useState<string>("");

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const [faceRes, usersRes] = await Promise.all([
          fetch(`http://localhost:8080/v1/face/getFacesById/${id}`),
          fetch("http://localhost:8080/v1/users/allUsers"),
        ]);

        const faceResult: ApiResponse<Faces> = await faceRes.json();
        const usersResult: ApiResponse<Users[]> = await usersRes.json();

        if (faceResult.Status === "Success" && faceResult.Data) {
          const faceData = faceResult.Data;
          setCurrentFace(faceData);
          setNewUserUID(faceData.user_uid); // Set initial user UID

          if (usersResult.Status === "Success" && usersResult.Data) {
            const currentUser = usersResult.Data.find(
              (u) => u.user_uid === faceData.user_uid
            );
            setCurrentEmployeeName(currentUser ? currentUser.full_name : "N/A");
          }
        } else {
          throw new Error(faceResult.Message || "Gagal memuat data foto");
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Gagal memuat data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleEmployeeSelect = (employee: Users) => {
    if (employee) {
      setNewUserUID(employee.user_uid);
      setCurrentEmployeeName(employee.full_name);
    }
  };

  const handleUpdate = async () => {
    if (!newImageFile && newUserUID === currentFace.user_uid) {
      toast.warn("Tidak ada perubahan data untuk disimpan.");
      return;
    }
    setIsLoading(true);

    const formData = new FormData();
    formData.append("user_uid", newUserUID);
    if (newImageFile) {
      formData.append("face_data", newImageFile);
    }

    try {
      const response = await fetch(
        `http://localhost:8080/v1/face/updateFoto/${id}`,
        {
          method: "PUT",
          body: formData, // Browser akan otomatis set Content-Type ke multipart/form-data
        }
      );

      const result = await response.json();
      if (!response.ok || result.Status !== "Success") {
        throw new Error(result.Message || "Gagal memperbarui data");
      }

      toast.success("Data foto berhasil diperbarui!");
      setTimeout(() => router.push("/masterdata/foto"), 2000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan");
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <DefaultLayout>
        <Breadcrumb pageName="Form Update Foto" />
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Update Foto Pegawai
            </h3>
          </div>
          {isLoading ? (
            <div className="p-6.5 text-center">Loading...</div>
          ) : (
            <div className="p-6.5">
              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Pegawai Saat Ini
                </label>
                <input
                  type="text"
                  value={
                    currentEmployeeName
                      ? `${currentEmployeeName} (${newUserUID})`
                      : "Memuat..."
                  }
                  disabled
                  className="w-full rounded border-[1.5px] border-stroke bg-gray-200 px-5 py-3 mb-2"
                />
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Ubah Pegawai (Opsional)
                </label>
                <EmployeeSearch onSelect={handleEmployeeSelect} />
              </div>

              <div className="mb-6">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Upload Foto Baru (Opsional)
                </label>
                <input
                  type="file"
                  accept="image/jpeg, image/png"
                  onChange={handleImageChange}
                  className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white"
                />
              </div>

              <div className="mb-6 flex items-center justify-center gap-8">
                <div>
                  <h5 className="font-medium mb-2">Foto Lama</h5>
                  <Image
                    src={`data:image/jpeg;base64,${currentFace.face_data}`}
                    alt="Foto Lama"
                    width={150}
                    height={150}
                    className="rounded-md"
                  />
                </div>
                {previewUrl && (
                  <div>
                    <h5 className="font-medium mb-2">Preview Foto Baru</h5>
                    <Image
                      src={previewUrl}
                      alt="Preview Foto Baru"
                      width={150}
                      height={150}
                      className="rounded-md"
                    />
                  </div>
                )}
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

export default FormUpdateFoto;
