"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/MainLayout";
import { Users } from "@/types/Users";
import { ApiResponse } from "@/types/ApiResponse";
import { useEffect, useState } from "react";
import { Schedules } from "@/types/Schedules";

// Definisikan tipe untuk respons sukses dari backend
interface SuccessResponse {
  Status: string;
  Message: string;
  Data: Schedules;
}

const ScheduleFormPage: React.FC = () => {
  // --- State Management ---
  const [dataUsers, setDataUsers] = useState<Users[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // --- Form State ---
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [day, setDay] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>("");

  const isActive = 1;

  // --- Data Fetching ---
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersFetchResponse = await fetch(
          "http://localhost:8080/v1/users/allUsers"
        );
        if (!usersFetchResponse.ok) {
          throw new Error(`HTTP Error! Status: ${usersFetchResponse.status}`);
        }
        const usersResponse: ApiResponse<Users[]> =
          await usersFetchResponse.json();
        if (usersResponse.Status === "Success") {
          setDataUsers(usersResponse.Data);
        } else {
          throw new Error(usersResponse.Message || "Unknown error from server");
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An Unknown Error Occurred"
        );
      }
    };
    fetchUsers();
  }, []);

  // --- Form Submission ---
  const handleSaveSchedules = async () => {
    setSuccessMessage(null);
    setError(null);
    setIsLoading(true);

    if (!selectedUser || !startTime || !endTime || !day) {
      setError("Semua field wajib diisi.");
      setIsLoading(false);
      return;
    }

    // === PERBAIKAN UTAMA ADA DI SINI ===
    // Ubah nama kunci agar sesuai dengan tag `json:"..."` di model Go.
    const scheduleData = {
      user_uid: selectedUser, // Sebelumnya: UserUID
      start_time: startTime, // Sebelumnya: StartTime
      end_time: endTime, // Sebelumnya: EndTime
      day: day, // Sebelumnya: Day
      is_active: isActive, // Sebelumnya: IsActive
    };

    try {
      const schedulesResponse = await fetch(
        "http://localhost:8080/v1/schdules/insertSchedules",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(scheduleData),
        }
      );

      const result: SuccessResponse = await schedulesResponse.json();

      if (!schedulesResponse.ok || result.Status !== "Success") {
        throw new Error(
          result.Message || `HTTP Error! Status: ${schedulesResponse.status}`
        );
      }

      setSuccessMessage(result.Message);

      // Reset form setelah berhasil
      setSelectedUser("");
      setStartTime("");
      setEndTime("");
      setDay("");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An Unknown Error Occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Form Schedule" />
      <div className="grid grid-cols-1 gap-9 sm:grid-cols">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Schedules Form
              </h3>
            </div>

            {/* --- Form --- */}
            <div className="p-6.5">
              {/* Pesan Sukses dan Error */}
              {successMessage && (
                <div className="mb-4 rounded-md bg-green-100 p-3 text-green-700">
                  {successMessage}
                </div>
              )}
              {error && (
                <div className="mb-4 rounded-md bg-red-100 p-3 text-red-700">
                  {error}
                </div>
              )}

              {/* Select Pegawai */}
              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Pilih Pegawai
                </label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                >
                  <option value="">--- Pilih Pegawai ---</option>
                  {dataUsers.length > 0 ? (
                    dataUsers.map((user) => (
                      <option key={user.user_uid} value={user.user_uid}>
                        {user.full_name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      Loading.....
                    </option>
                  )}
                </select>
              </div>

              {/* Input StartTime dan EndTime */}
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Start Time <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  />
                </div>
                <div className="w-full xl:w-1/2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    End Time <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  />
                </div>
              </div>

              {/* Select Hari */}
              <div className="mb-6">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Day
                </label>
                <select
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
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

              {/* Tombol Simpan */}
              <button
                type="button" // Mencegah form submit default
                onClick={handleSaveSchedules}
                disabled={isLoading} // Tombol dinonaktifkan saat loading
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:cursor-not-allowed disabled:bg-opacity-50"
              >
                {isLoading ? "Menyimpan..." : "Save Data"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ScheduleFormPage;
