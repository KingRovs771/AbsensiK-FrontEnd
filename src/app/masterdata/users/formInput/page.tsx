"use client";
import DefaultLayout from "@/components/Layouts/MainLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useState, useEffect } from "react";
import { Role } from "@/types/Role";
import { ApiResponse } from "@/types/ApiResponse";
import { Departement } from "@/types/Departement";

const FormUserPage: React.FC = () => {
  const [dataDepartement, setDepartement] = useState<Departement[]>([]);
  const [dataRole, setRole] = useState<Role[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedDepartements, setSelectedDepartements] = useState<string>("");

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const roleResponse = await fetch(
          "http://localhost:8080/v1/roles/AllRoles"
        );
        if (!roleResponse.ok) {
          throw new Error("Http Error! Status : ${response.status}");
        }
        const apiResponse: ApiResponse<Role[]> = await roleResponse.json();
        if (apiResponse.Status === "Success") {
          setRole(apiResponse.Data);
        } else {
          throw new Error(apiResponse.Message || "Unknown error from server");
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An Unknown error eccurred"
        );
        console.log(error);
      }
    };

    const fetchDepartements = async () => {
      try {
        const departementResponse = await fetch(
          "http://localhost:8080/v1/departements/AllDepartements"
        );
        if (!departementResponse.ok) {
          throw new Error("Http Error! Status : ${departementResponse.status}");
        }
        const apiResponse: ApiResponse<Departement[]> =
          await departementResponse.json();
        if (apiResponse.Status === "Success") {
          setDepartement(apiResponse.Data);
        } else {
          throw new Error(apiResponse.Message || "Unknown error from server");
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An Unknown error eccurred"
        );
        console.log(error);
      }
    };
    fetchRoles();
    fetchDepartements();
  }, []);

  const handleRoleSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedRole(event.target.value);
  };

  const handleDepartementsSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedDepartements(event.target.value);
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Form Users" />
      <div className="grid grid-cols-1 gap-9 sm:grid-cols">
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                User Form
              </h3>
            </div>
            <form action="#">
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Username
                    </label>
                    <input
                      type="text"
                      placeholder="Masukkan Username"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Password <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Masukkan Password"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Masukkan Email"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Departements
                  </label>
                  <select
                    name=""
                    id=""
                    onChange={handleDepartementsSelectChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="">---Pilih Departements----</option>
                    {dataDepartement && dataDepartement.length > 0 ? (
                      dataDepartement.map((departement) => (
                        <option
                          key={departement.departments_id}
                          value={departement.name_departments}
                        >
                          {departement.name_departments}
                        </option>
                      ))
                    ) : (
                      <option value="">Loading.....</option>
                    )}
                  </select>
                  {error && <p style={{ color: "red" }}>{error}</p>}
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Role
                  </label>
                  <select
                    name=""
                    id=""
                    onChange={handleRoleSelectChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="">---Pilih Role----</option>
                    {dataRole.length > 0 ? (
                      dataRole.map((role) => (
                        <option key={role.role_id} value={role.name_role}>
                          {role.name_role}
                        </option>
                      ))
                    ) : (
                      <option value="">Loading.....</option>
                    )}
                  </select>
                  {error && <p style={{ color: "red" }}>{error}</p>}
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Nama Lengkap
                  </label>
                  <input
                    type="email"
                    placeholder="Masukkan Nama Lengkap"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Phone
                  </label>
                  <input
                    type="email"
                    placeholder="Masukkan Email"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Jenis Kelamin
                  </label>
                  <select
                    name=""
                    id=""
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="">---Pilih Jenis Kelamin----</option>
                    <option value="">Laki-Laki</option>
                    <option value="">Perempuan</option>
                  </select>
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+62 | Masukkan Nomor : 62890389820018"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Bayaran Harian
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan Bayaran harian"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-6">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Address
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Type your message"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  ></textarea>
                </div>

                <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default FormUserPage;
