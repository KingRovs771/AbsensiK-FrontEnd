"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DefaultLayout from "@/components/Layouts/MainLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ApiResponse } from "@/types/ApiResponse";
import { Users } from "@/types/Users";
import { Departement } from "@/types/Departement";
import { Role } from "@/types/Role";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FormUpdateUser = ({
  params,
}: {
  params: { user_uid: string; id: string };
}) => {
  const router = useRouter();

  // [PERBAIKAN] Mengambil ID dari params secara lebih robust.
  // Ini akan berfungsi baik jika file Anda bernama [user_uid].tsx atau [id].tsx
  const id = params.user_uid || params.id;

  const [formData, setFormData] = useState<Partial<Users>>({});
  const [departments, setDepartments] = useState<Departement[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Guard clause sekarang menggunakan `id` yang sudah divalidasi
    if (!id) {
      toast.error("User ID tidak ditemukan di URL.");
      setIsLoading(false);
      return;
    }

    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const [userRes, deptsRes, rolesRes] = await Promise.all([
          fetch(`http://localhost:8080/v1/users/getUsersByIdUpdate/${id}`),
          fetch("http://localhost:8080/v1/departements/AllDepartements"),
          fetch("http://localhost:8080/v1/roles/AllRoles"),
        ]);

        const userResult: ApiResponse<Users> = await userRes.json();
        if (userResult.Status === "Success" && userResult.Data) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, ...userData } = userResult.Data;
          setFormData(userData);
        } else {
          throw new Error(userResult.Message || "User tidak ditemukan");
        }

        const deptsResult: ApiResponse<Departement[]> = await deptsRes.json();
        if (deptsResult.Status === "Success") setDepartments(deptsResult.Data);

        const rolesResult: ApiResponse<Role[]> = await rolesRes.json();
        if (rolesResult.Status === "Success") setRoles(rolesResult.Data);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Gagal memuat data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [id]); // Dependensi diubah menjadi `id`

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    const processedValue =
      name === "dailyrate" ? parseFloat(value) || 0 : value;
    setFormData((prev) => ({ ...prev, [name]: processedValue }));
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/v1/users/updateUser/${id}`,
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
      toast.success("Data pengguna berhasil diperbarui!");
      setTimeout(() => router.push("/masterdata/users"), 2000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan");
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <DefaultLayout>
        <Breadcrumb pageName="Form Update Pengguna" />
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Update Data Pengguna
            </h3>
          </div>
          {isLoading ? (
            <div className="p-6.5 text-center">Loading data...</div>
          ) : (
            <div className="p-6.5">
              <div className="mb-4.5">
                <label className="mb-2.5 block">
                  User UID (Tidak dapat diubah)
                </label>
                <input
                  type="text"
                  value={formData.user_uid || ""}
                  disabled
                  className="w-full rounded border-[1.5px] border-stroke bg-gray-200 px-5 py-3"
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block">Nama Lengkap</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name || ""}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3"
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username || ""}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3"
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3"
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block">Telepon</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3"
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block">Alamat</label>
                <textarea
                  name="address"
                  rows={3}
                  value={formData.address || ""}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3"
                ></textarea>
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block">Jenis Kelamin</label>
                <select
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3"
                >
                  <option value="">Pilih...</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block">Divisi</label>
                <select
                  name="departments_id"
                  value={formData.departments_id || ""}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3"
                >
                  <option value="">Pilih Divisi...</option>
                  {departments.map((d) => (
                    <option key={d.departments_id} value={d.departments_id}>
                      {d.name_departments}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block">Jabatan (Role)</label>
                <select
                  name="role_id"
                  value={formData.role_id || ""}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3"
                >
                  <option value="">Pilih Jabatan...</option>
                  {roles.map((r) => (
                    <option key={r.role_id} value={r.role_id}>
                      {r.name_role}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <label className="mb-2.5 block">Gaji Harian</label>
                <input
                  type="number"
                  name="dailyrate"
                  value={formData.dailyrate || 0}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3"
                />
              </div>
              <button
                onClick={handleUpdate}
                disabled={isLoading}
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
              >
                Update Data
              </button>
            </div>
          )}
        </div>
      </DefaultLayout>
    </>
  );
};

export default FormUpdateUser;
