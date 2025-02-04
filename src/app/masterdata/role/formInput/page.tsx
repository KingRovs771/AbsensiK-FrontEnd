"use client";
import DefaultLayout from "@/components/Layouts/MainLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useState } from "react";
import { Role } from "@/types/Role";

const FormRolePage: React.FC = () => {
  const [kodeRole, setKodeRole] = useState<string>("");
  const [nameRole, setNameRole] = useState<string>("");
  const [Description, setDescription] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [dataRoles, setDataRoles] = useState<Role[] | undefined>(undefined);

  const SaveDataRole = async () => {
    const role = {
      role_id: kodeRole,
      name_role: nameRole,
      description: Description,
    };
    try {
      const SaveRoleResponse = await fetch(
        "http://localhost:8080/v1/roles/insertRoles",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(role),
        }
      );
      if (!SaveRoleResponse.ok) {
        throw new Error(`HTTP error! status: ${SaveRoleResponse.status}`);
      }

      const resultSaveRole = await SaveRoleResponse.json();
      setSuccessMessage(resultSaveRole);
      setDataRoles([...(dataRoles || []), role]);
      setKodeRole("");
      setNameRole("");
      setDescription("");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An Unknown error occurred"
      );
    }
  };
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Form Role" />
      <div className="grid grid-cols-1 gap-9 sm:grid-cols">
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Role Form
              </h3>
            </div>
            <form action="#">
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Kode Role <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="text"
                      id="kodeRole"
                      value={kodeRole}
                      onChange={(e) => setKodeRole(e.target.value)}
                      placeholder="Masukkan Kode Departments"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Name Role <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    id="NameRole"
                    value={nameRole}
                    onChange={(e) => setNameRole(e.target.value)}
                    placeholder="Masukkan Password"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Description
                  </label>
                  <textarea
                    rows={6}
                    value={Description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Type your message"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  ></textarea>
                </div>

                <button
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                  onClick={SaveDataRole}
                >
                  Save Data
                </button>
              </div>
            </form>
            {successMessage && (
              <p className="text-green-500">{successMessage}</p>
            )}
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default FormRolePage;
