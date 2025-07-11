"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { ApiResponse } from "@/types/ApiResponse";

// ===================================================================
// 1. Definisikan Tipe Data untuk Statistik
// ===================================================================
interface DashboardStats {
  total_employees: number;
  on_leave_today: number;
  absent_today: number;
  present_today: number;
}

// ===================================================================
// 2. Komponen CardDataStats (Tidak ada perubahan)
// ===================================================================
interface CardDataStatsProps {
  title: string;
  total: string;
  children: ReactNode;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  total,
  children,
}) => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
        {children}
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="text-title-md font-bold text-black dark:text-white">
            {total}
          </h4>
          <span className="text-sm font-medium">{title}</span>
        </div>
      </div>
    </div>
  );
};

const DashboardStatsView: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "http://localhost:8080/v1/dashboard/status",
          {
            headers: {
              // 'Authorization': `Bearer ${your_auth_token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const apiResponse: ApiResponse<DashboardStats> = await response.json();

        if (apiResponse.Status === "Success") {
          setStats(apiResponse.Data);
        } else {
          throw new Error(
            apiResponse.Message || "Gagal mengambil data statistik"
          );
        }
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan tidak dikenal"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (isLoading) {
    return <div className="text-center p-10">Loading statistics...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <CardDataStats
        title="Total Karyawan"
        total={stats?.total_employees.toLocaleString("id-ID") ?? "0"}
      >
        {/* SVG Icon untuk Karyawan */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 fill-primary"
          viewBox="0 0 640 512"
        >
          <path d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192h42.7c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0H21.3C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7h42.7C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3H405.3zM320 336a96 96 0 1 1 0-192 96 96 0 1 1 0 192z" />
        </svg>
      </CardDataStats>

      <CardDataStats
        title="Karyawan Izin Hari Ini"
        total={stats?.on_leave_today.toLocaleString("id-ID") ?? "0"}
      >
        {/* SVG Icon untuk Izin */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 fill-primary"
          viewBox="0 0 512 512"
        >
          <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-144c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32z" />
        </svg>
      </CardDataStats>

      <CardDataStats
        title="Karyawan Alpha Hari Ini"
        total={stats?.absent_today.toLocaleString("id-ID") ?? "0"}
      >
        {/* SVG Icon untuk Alpha */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 fill-primary"
          viewBox="0 0 448 512"
        >
          <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
        </svg>
      </CardDataStats>

      <CardDataStats
        title="Total Kehadiran Hari Ini"
        total={stats?.present_today.toLocaleString("id-ID") ?? "0"}
      >
        {/* SVG Icon untuk Kehadiran */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 fill-primary"
          viewBox="0 0 576 512"
        >
          <path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z" />
        </svg>
      </CardDataStats>
    </div>
  );
};

export default DashboardStatsView;
