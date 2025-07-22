"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/MainLayout";
import { Users } from "@/types/users";
import { ApiResponse } from "@/types/ApiResponse";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Schedules } from "@/types/Schedules";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";

// Definisikan tipe untuk opsi dropdown
interface SelectOption {
  value: string;
  label: string;
}

// Definisikan tipe untuk respons getSchedulesById
interface ScheduleApiResponse {
  Status: string;
  Message: string;
  Schedules: Schedules; // Nama properti adalah 'Schedules' (plural)
}

const FormUpdateSchedulePage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const router = useRouter();

  const [dataUsers, setDataUsers] = useState<Users[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [schedule, setSchedule] = useState<Partial<Schedules>>({
    user_uid: "",
    start_time: "",
    end_time: "",
    day: "",
    is_active: 1,
  });

  useEffect(() => {
    if (!id) return;
    const fetchInitialData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [usersResponse, scheduleResponse] = await Promise.all([
          fetch("http://localhost:8080/v1/users/allUsers"),
          fetch(`http://localhost:8080/v1/schdules/getSchedulesById/${id}`),
        ]);

        if (!usersResponse.ok) throw new Error("Gagal mengambil data pegawai");
        const usersResult: ApiResponse<Users[]> = await usersResponse.json();
        if (usersResult.Status === "Success") setDataUsers(usersResult.Data);
        else
          throw new Error(usersResult.Message || "Gagal memuat daftar pegawai");

        if (!scheduleResponse.ok)
          throw new Error("Gagal mengambil data jadwal");

        // 👇 PERBAIKAN 1: Ambil data dari 'Schedules' bukan 'Data'
        const scheduleResult: ScheduleApiResponse =
          await scheduleResponse.json();
        if (scheduleResult.Status === "Success") {
          setSchedule(scheduleResult.Schedules);
        } else {
          throw new Error(scheduleResult.Message || "Jadwal tidak ditemukan");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
        toast.error(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [id]);

  const userOptions: SelectOption[] = dataUsers.map((user) => ({
    value: user.user_uid,
    label: user.full_name,
  }));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSchedule((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserChange = (selectedOption: SelectOption | null) => {
    setSchedule((prev) => ({
      ...prev,
      user_uid: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleUpdateSchedule = async () => {
    setIsLoading(true);
    setError(null);
    if (
      !schedule.user_uid ||
      !schedule.start_time ||
      !schedule.end_time ||
      !schedule.day
    ) {
      toast.error("Semua field wajib diisi.");
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8080/v1/schdules/updateSchedules/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(schedule),
        }
      );
      const result: ApiResponse<null> = await response.json();
      if (!response.ok || result.Status !== "Success") {
        throw new Error(result.Message || "Gagal memperbarui data");
      }
      toast.success("Data jadwal berhasil diperbarui!");
      setTimeout(() => {
        router.push("/schedules/table");
      }, 2000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan");
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <DefaultLayout>
        <Breadcrumb pageName="Form Update Jadwal" />
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Update Jadwal Form
            </h3>
          </div>
          {isLoading ? (
            <div className="p-6.5 text-center">Loading data...</div>
          ) : error ? (
            <div className="p-6.5 text-center text-red-500">{error}</div>
          ) : (
            <div className="p-6.5">
              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Pilih Pegawai
                </label>
                <Select
                  options={userOptions}
                  // 👇 PERBAIKAN 2: Cocokkan dengan 'schedule.user_uid'
                  value={userOptions.find(
                    (option) => option.value === schedule.user_uid
                  )}
                  onChange={handleUserChange}
                  isClearable
                  isSearchable
                  placeholder="--- Cari dan Pilih Pegawai ---"
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: "transparent",
                      borderColor: "#E2E8F0",
                    }),
                    singleValue: (base) => ({ ...base, color: "inherit" }),
                    input: (base) => ({ ...base, color: "inherit" }),
                  }}
                />
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Start Time <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="time"
                    name="start_time"
                    value={schedule.start_time || ""}
                    onChange={handleChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3"
                  />
                </div>
                <div className="w-full xl:w-1/2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    End Time <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="time"
                    name="end_time"
                    value={schedule.end_time || ""}
                    onChange={handleChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Day
                </label>
                <select
                  name="day"
                  value={schedule.day || ""}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3"
                >
                  <option value="">--- Pilih Hari ---</option>
                  <option value="Monday">Senin</option>
                  <option value="Tuesday">Selasa</option>
                  <option value="Wednesday">Rabu</option>
                  <option value="Thursday">Kamis</option>
                  <option value="Friday">Jumat</option>
                  <option value="Saturday">Sabtu</option>
                  <option value="Sunday">Minggu</option>
                </select>
              </div>
              <button
                type="button"
                onClick={handleUpdateSchedule}
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

export default FormUpdateSchedulePage;
