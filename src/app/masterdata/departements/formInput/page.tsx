"use client";
import DefaultLayout from "@/components/Layouts/MainLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useState } from "react";
import { Departement } from "@/types/Departement";

const FormDepartmentsPage: React.FC = () => {
  const [DataDepartments, SetDataDeparments] = useState<
    Departement[] | undefined
  >(undefined);
  const [DepartmentsId, SetDeparmentsId] = useState<string>("");
  const [NameDepartments, SetNameDepartments] = useState<string>("");
  const [Description, SetDescription] = useState<string>("");
  const [error, SetError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const SaveDataDepartments = async () => {
    const departments = {
      departments_id: DepartmentsId,
      name_departments: NameDepartments,
      description: Description,
    };
    try {
      const departmentsReponse = await fetch("", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(departments),
      });
      if (!departmentsReponse.ok) {
        throw new Error(`HTTP Error! Status : ${departmentsReponse.status}`);
      }

      const ResultDepartments = await departmentsReponse.json();
      setSuccessMessage(ResultDepartments);
      SetDataDeparments([...(DataDepartments || []), departments]);
      SetDeparmentsId("");
      SetNameDepartments("");
      SetDescription("");
    } catch (error) {
      SetError(
        error instanceof Error ? error.message : "An Unknown Error Occured"
      );
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Form Departements" />
      <div className="grid grid-cols-1 gap-9 sm:grid-cols">
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Departments Form
              </h3>
            </div>
            {successMessage && (
              <p className="text-green-500">{successMessage}</p>
            )}
            {error && <p className="text-red-500">{error}</p>}
            <form action="#">
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Kode Departments <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="text"
                      id="DepartmentsId"
                      value={DepartmentsId}
                      onChange={(e) => SetDeparmentsId(e.target.value)}
                      placeholder="Masukkan Kode Departments"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Name Departments <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    id="NameDepartments"
                    value={NameDepartments}
                    onChange={(e) => SetNameDepartments(e.target.value)}
                    placeholder="Masukkan Name Departments"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-6">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Description
                  </label>
                  <textarea
                    rows={6}
                    id="Description"
                    value={Description}
                    onChange={(e) => SetDescription(e.target.value)}
                    placeholder="Type your message"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  ></textarea>
                </div>

                <button
                  onClick={SaveDataDepartments}
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

export default FormDepartmentsPage;
