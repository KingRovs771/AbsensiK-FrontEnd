"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DefaultLayout from "@/components/Layouts/MainLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ApiResponse } from "@/types/ApiResponse";
import { Radius } from "@/types/Radius"; // Make sure this type is defined
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FormUpdateRadius = ({ params }: { params: { radius_id: string } }) => {
  const router = useRouter();
  const { radius_id } = params; // Get ID from params

  // State to hold the entire radius object
  const [radiusData, setRadiusData] = useState<Partial<Radius>>({
    name_location: "",
    latitude: "",
    longitude: "",
    radius: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!radius_id) return; // Do nothing if ID is not available yet

    const fetchRadiusData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8080/v1/radius/getRadiusById/${radius_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch radius data");
        }
        const apiResponse: ApiResponse<Radius> = await response.json();
        if (apiResponse.Status === "Success") {
          setRadiusData(apiResponse.Data);
        } else {
          throw new Error(apiResponse.Message || "Failed to load data");
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(message);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRadiusData();
  }, [radius_id]); // Rerun effect if radius_id changes

  // A single handler to update the radiusData state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRadiusData((prevData) => ({
      ...prevData,
      // Convert radius value to a number, keep others as strings
      [name]: name === "radius" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    setError(null);

    // Prepare data for submission, ensuring radius_id is an integer
    const updatedData = {
      radius_id: radiusData.radius_id,
      name_location: radiusData.name_location,
      latitude: radiusData.latitude,
      longitude: radiusData.longitude,
      radius: radiusData.radius,
    };

    try {
      const response = await fetch(
        `http://localhost:8080/v1/radius/updateRadius/${radius_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }
      );

      const result: ApiResponse<null> = await response.json();

      if (!response.ok || result.Status !== "Success") {
        throw new Error(result.Message || "Failed to update data");
      }

      toast.success(result.Message || "Data successfully updated!");

      setTimeout(() => {
        router.push("/masterdata/radius");
      }, 2000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <DefaultLayout>
        <Breadcrumb pageName="Form Update Radius" />
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Update Radius: {radiusData.name_location}
            </h3>
          </div>
          {isLoading ? (
            <div className="p-6.5 text-center">Loading data...</div>
          ) : (
            <div className="p-6.5">
              {error && (
                <div className="mb-4 rounded bg-danger/10 p-3 text-center text-danger">
                  {error}
                </div>
              )}
              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Nama Tempat
                </label>
                <input
                  type="text"
                  name="name_location"
                  value={radiusData.name_location || ""}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3"
                />
              </div>

              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Latitude
                </label>
                <input
                  type="text"
                  name="latitude"
                  value={radiusData.latitude || ""}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3"
                />
              </div>

              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Longitude
                </label>
                <input
                  type="text"
                  name="longitude"
                  value={radiusData.longitude || ""}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3"
                />
              </div>

              <div className="mb-6">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Radius (meter)
                </label>
                <input
                  type="number"
                  name="radius"
                  value={radiusData.radius || 0}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3"
                />
              </div>

              <button
                onClick={handleUpdate}
                disabled={isLoading}
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Update Data"}
              </button>
            </div>
          )}
        </div>
      </DefaultLayout>
    </>
  );
};

export default FormUpdateRadius;
