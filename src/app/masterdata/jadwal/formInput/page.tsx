"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/MainLayout";
import { Users } from "@/types/Users";
import { ApiResponse } from "@/types/ApiResponse";
import { useEffect, useState } from "react";
import { Schedules } from "@/types/Schedules";

const ScheduleFormPage: React.FC = () => {
  const [dataUsers, SetDataUsers] = useState<Users[]>([]);
  const [dataSchedules, SetDataSchdules] = useState<Schedules[] | undefined>(
    undefined
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, SetError] = useState<string | null>(null);
  const [ScheduleId, SetScheduleId] = useState<number>();
  const [StartTime, SetStartTime] = useState<string>("");
  const [EndTime, SetEndTime] = useState<string>("");
  const [Day, SetDay] = useState<string>("");
  const [IsActive, SetIsActive] = useState<number>(0);
  const [selectedUsers, setSelectedUsers] = useState<string>("");
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const UsersFetchResponse = await fetch(
          "http://localhost:8080/v1/users/allUsers"
        );
        if (!UsersFetchResponse.ok) {
          throw new Error(`HTTP Error! Status :${UsersFetchResponse.status}`);
        }
        const UsersResponse: ApiResponse<Users[]> =
          await UsersFetchResponse.json();
        if (UsersResponse.Status === "Success") {
          SetDataUsers(UsersResponse.Data);
        } else {
          throw new Error(UsersResponse.Message || "Unknown error from server");
        }
      } catch (error) {
        SetError(
          error instanceof Error ? error.message : "An Unknown Error Occuraced"
        );
      }
    };
    fetchUsers();
  }, []);

  const handleUsersSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedUsers(event.target.value);
  };

  const SaveDataSchedules = async () => {
    const schedules = {};
    try {
      const schedulesResponse = await fetch("", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(schedules),
      });
      if (!schedulesResponse.ok) {
        throw new Error(`HTTP Error! Status : ${schedulesResponse.status}`);
      }

      const ResultSchedules = await schedulesResponse.json();
      setSuccessMessage(ResultSchedules);
      SetDataSchdules([...(dataSchedules || []), schedules]);
      SetDay("");
    } catch (error) {
      SetError(
        error instanceof Error ? error.message : "An Unknown Error Occured"
      );
    }
  };
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Form Schedule" />
      <div className="grid grid-cols-1 gap-9 sm:grid-cols">
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Schedules Form
              </h3>
            </div>
            {successMessage && (
              <p className="text-green-500">{successMessage}</p>
            )}
            {error && <p className="text-red-500">{error}</p>}
            <form action="#">
              <div className="p-6.5">
                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Pilih Pegawai
                  </label>
                  <select
                    name=""
                    id="UsersId"
                    onChange={handleUsersSelectChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="">---Pilih Pegawai----</option>
                    {dataUsers.length > 0 ? (
                      dataUsers.map((users) => (
                        <option key={users.user_uid} value={users.user_uid}>
                          {users.full_name}
                        </option>
                      ))
                    ) : (
                      <option value="">Loading.....</option>
                    )}
                  </select>
                  {error && <p style={{ color: "red" }}>{error}</p>}
                </div>

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      StartTime <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="time"
                      id="StartTime"
                      placeholder="Masukkan Kode Departments"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    End Time <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="time"
                    id="EndTime"
                    placeholder="Masukkan Name Departments"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-6">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Day
                  </label>
                  <select className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
                    <option id="Day">--- Pilih Hari ---</option>
                    <option id="Day" value={Day}>
                      Senin
                    </option>
                    <option id="Day" value={Day}>
                      Selasa
                    </option>
                    <option id="Day" value={Day}>
                      Rabu
                    </option>
                    <option id="Day" value={Day}>
                      Kamis
                    </option>
                    <option id="Day" value={Day}>
                      Jumat
                    </option>
                    <option id="Day" value={Day}>
                      Sabtu
                    </option>
                    <option id="Day" value={Day}>
                      Minggu
                    </option>
                  </select>
                </div>

                <button
                  onClick={SaveDataSchedules}
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                >
                  Save Data
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ScheduleFormPage;
