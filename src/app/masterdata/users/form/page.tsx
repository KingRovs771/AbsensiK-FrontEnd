"use client";
import DefaultLayout from "@/components/Layouts/MainLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useState, useEffect } from "react";

type ApiResponse<T> = {
  status: string;
  message: string;
  data: T;
  error?: string;
};

type DataDepartement = {
  departement: string;
};

type DataRole = {
  role_id: string;
  nama_role: string;
};

const FormUserPage: React.FC = () => {
  const [dataDepartement, setDepartement] = useState<DataDepartement | null>(
    null
  );
  const [dataRole, setRole] = useState<DataRole[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const departementResponse = await fetch("");
        if (!departementResponse.ok) {
          throw new Error("Http Error! Status : ${departementResponse.status}");
        }
        const dataDepartement: ApiResponse<DataDepartement> =
          await departementResponse.json();
        if (dataDepartement.status === "success") {
          setDepartement(dataDepartement.data);
        } else {
          throw new Error(
            dataDepartement.error || "Unknown error from departement"
          );
        }

        const roleResponse = await fetch("");
        if (!roleResponse.ok) {
          throw new Error("Http Error! Status : ${roleReponse.status}");
        }
        const dataRole: ApiResponse<DataRole[]> = await roleResponse.json();
        if (dataRole.status === "success") {
          setRole(dataRole.data);
        } else {
          throw new Error(dataRole.error || "Unknown error from departement");
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An Unknown error eccurred"
        );
      }
    };
    fetchData();
  }, []);

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
                    Departement
                  </label>
                  <select
                    name=""
                    id=""
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="">---Pilih Departements----</option>
                    <option value="">Laki-Laki</option>
                    <option value="">Perempuan</option>
                  </select>
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Role
                  </label>
                  <select
                    name=""
                    id=""
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="">---Pilih Role----</option>
                    <option value="">Laki-Laki</option>
                    <option value="">Perempuan</option>
                  </select>
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
