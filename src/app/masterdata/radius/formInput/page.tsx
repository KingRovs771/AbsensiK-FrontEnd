"use client";
import DefaultLayout from "@/components/Layouts/MainLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Radius } from "@/types/Radius";
import { useState } from "react";

const FormRadiusPage: React.FC = () => {
  const [dataRadius, SetDataRadius] = useState<Radius[] | undefined>(undefined);
  const [RadiusId] = useState<number>(0);
  const [NameLocation, SetNameLocation] = useState<string>("");
  const [Latitude, SetLatitude] = useState<string>("");
  const [Longitude, SetLongitude] = useState<string>("");
  const [Radius, SetRadius] = useState<number>(0);
  const [error, SetError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const SaveDataRadius = async () => {
    const radius = {
      radius_id: RadiusId,
      name_location: NameLocation,
      latitude: Latitude,
      longitude: Longitude,
      radius: Radius,
    };
    try {
      const SaveRadiusResponse = await fetch(
        "http://localhost:8080/v1/radius/insertRadius",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(radius),
        }
      );
      if (!SaveRadiusResponse.ok) {
        throw new Error(`HTTP Error! Status : ${SaveRadiusResponse.status}`);
      }

      const SaveResultRadius = await SaveRadiusResponse.json();
      setSuccessMessage(SaveResultRadius);
      SetDataRadius([...(dataRadius || []), radius]);
      SetNameLocation("");
      SetLatitude("");
      SetLongitude("");
    } catch (error) {
      SetError(
        error instanceof Error ? error.message : "An Unknown Error Occured"
      );
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Form Radius" />
      <div className="grid grid-cols-1 gap-9 sm:grid-cols">
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Radius Form
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
                      Nama Lokasi <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="text"
                      id="nameLocation"
                      value={NameLocation}
                      onChange={(e) => SetNameLocation(e.target.value)}
                      placeholder="Masukkan Nama Location"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Latitude <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    id="Latitude"
                    value={Latitude}
                    onChange={(e) => SetLatitude(e.target.value)}
                    placeholder="Masukkan Latitude - Example : -6.988798734902"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Longitude <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    id="Longitude"
                    value={Longitude}
                    onChange={(e) => SetLongitude(e.target.value)}
                    placeholder="Masukkan Longitude - Example : 106.9458576695"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Radius(Km) <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    id="Radius"
                    value={Radius}
                    onChange={(e) => SetRadius(Number(e.target.value))}
                    placeholder="Masukkan Radius Kilometer"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <button
                  onClick={SaveDataRadius}
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

export default FormRadiusPage;
