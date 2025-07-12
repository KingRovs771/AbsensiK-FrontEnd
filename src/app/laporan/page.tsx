"use client";

import React, { useState, useRef } from "react";
import DefaultLayout from "@/components/Layouts/MainLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useReactToPrint } from "react-to-print";
import { ApiResponse } from "@/types/ApiResponse";

// ===================================================================
// 1. Tipe Data dan Konstanta
// ===================================================================

type ReportType = "salary" | "attendance" | "leave" | "users";

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

// ===================================================================
// 2. Komponen Modal Pemilih Periode
// ===================================================================
const ReportPeriodModal = ({
  isOpen,
  onClose,
  onPrint,
  reportTitle,
}: {
  isOpen: boolean;
  onClose: () => void;
  onPrint: (month: string, year: string, monthName: string) => void;
  reportTitle: string;
}) => {
  const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, "0");
  const currentYear = new Date().getFullYear().toString();

  const [month, setMonth] = useState<string>(currentMonth);
  const [year, setYear] = useState<string>(currentYear);

  if (!isOpen) return null;

  const handlePrintClick = () => {
    if (!month || !year) {
      alert("Silakan pilih bulan dan tahun.");
      return;
    }
    const monthName = MONTHS[parseInt(month, 10) - 1];
    onPrint(month, year, monthName);
    onClose();
  };

  const years = Array.from({ length: 10 }, (_, i) =>
    (new Date().getFullYear() - i).toString()
  );

  return (
    <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-boxdark">
        <h3 className="mb-4 text-xl font-bold text-black dark:text-white">
          Pilih Periode - {reportTitle}
        </h3>
        <div className="mb-4">
          <label className="mb-2 block text-black dark:text-white">Bulan</label>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full rounded border border-stroke bg-transparent px-4 py-3 dark:border-form-strokedark dark:bg-form-input"
          >
            {MONTHS.map((m, index) => (
              <option
                key={index}
                value={(index + 1).toString().padStart(2, "0")}
              >
                {m}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-6">
          <label className="mb-2 block text-black dark:text-white">Tahun</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full rounded border border-stroke bg-transparent px-4 py-3 dark:border-form-strokedark dark:bg-form-input"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="rounded bg-gray-300 px-6 py-2 text-black hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700"
          >
            Batal
          </button>
          <button
            onClick={handlePrintClick}
            className="rounded bg-primary px-6 py-2 text-white hover:bg-opacity-90"
          >
            Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
};

// ===================================================================
// 3. Komponen Kartu Laporan
// ===================================================================
const ReportCard = ({
  title,
  description,
  icon,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
          {icon}
        </div>
        <button
          onClick={onClick}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90"
        >
          Buat Laporan
        </button>
      </div>
      <div className="mt-4">
        <h4 className="text-lg font-bold text-black dark:text-white">
          {title}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
    </div>
  );
};

// ===================================================================
// 4. Komponen Halaman Cetak
// ===================================================================
interface PrintableReportProps {
  title: string;
  reportType: ReportType;
  period: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  onBack: () => void;
}

const PrintableReport: React.FC<PrintableReportProps> = ({
  title,
  reportType,
  period,
  data,
  onBack,
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Laporan ${title} - ${period}`,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getHeaders = () => {
    switch (reportType) {
      case "salary":
        return [
          "NIK",
          "Nama Lengkap",
          "Periode",
          "Total Gaji",
          "Total Potongan",
        ];
      case "attendance":
        return ["NIK", "Nama Lengkap", "Tanggal", "Check In", "Check Out"];
      case "leave":
        return ["NIK", "Nama Lengkap", "Tipe", "Mulai", "Selesai", "Status"];
      case "users":
        return ["NIK", "Nama Lengkap", "Email", "Telepon", "Devisi"];
      default:
        return [];
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderRow = (item: any, index: number) => {
    switch (reportType) {
      case "salary":
        return (
          <tr key={index}>
            <td>{item.user_uid}</td>
            <td>{item.full_name}</td>
            <td>{`${item.month}/${item.year}`}</td>
            <td>{formatCurrency(item.total_gaji)}</td>
            <td>{formatCurrency(item.total_potongan)}</td>
          </tr>
        );
      case "attendance":
        return (
          <tr key={index}>
            <td>{item.user_uid}</td>
            <td>{item.full_name}</td>
            <td>{item.tanggal}</td>
            <td>{item.time_in || "-"}</td>
            <td>{item.time_out || "-"}</td>
          </tr>
        );
      case "leave":
        return (
          <tr key={index}>
            <td>{item.user_uid}</td>
            <td>{item.full_name}</td>
            <td>{item.permit_type}</td>
            <td>{item.start_date}</td>
            <td>{item.end_date}</td>
            <td>{item.status === "1" ? "Approved" : "Pending/Rejected"}</td>
          </tr>
        );
      case "users":
        return (
          <tr key={index}>
            <td>{item.user_uid}</td>
            <td>{item.full_name}</td>
            <td>{item.email}</td>
            <td>{item.phone}</td>
            <td>{item.department?.name_departments || "N/A"}</td>
          </tr>
        );
      default:
        return null;
    }
  };

  return (
    <DefaultLayout>
      <style jsx global>{`
        @media print {
          body,
          html {
            background: white;
            -webkit-print-color-adjust: exact;
          }
          .printable-area {
            margin: 0;
            padding: 0;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: A4;
            margin: 20mm;
          }
        }
      `}</style>
      <div className="mx-auto max-w-5xl">
        <div className="no-print mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-black dark:text-white">
            Pratinjau Laporan
          </h2>
          <div>
            <button
              onClick={onBack}
              className="mr-4 rounded bg-gray-500 px-6 py-2 text-white hover:bg-gray-600"
            >
              Kembali
            </button>
            <button
              onClick={handlePrint}
              className="rounded bg-primary px-6 py-2 text-white hover:bg-opacity-90"
            >
              Cetak
            </button>
          </div>
        </div>
        <div ref={printRef} className="printable-area bg-white p-8 shadow-lg">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-black">Laporan {title}</h1>
            <p className="text-md text-gray-600">Periode: {period}</p>
            <p className="text-sm text-gray-500">
              Dicetak pada: {new Date().toLocaleString("id-ID")}
            </p>
          </div>
          <table className="w-full table-auto border-collapse border border-gray-400 text-sm">
            <thead>
              <tr className="bg-gray-200 text-black">
                {getHeaders().map((header) => (
                  <th
                    key={header}
                    className="border border-gray-300 p-2 text-left font-semibold"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>{data.map((item, index) => renderRow(item, index))}</tbody>
          </table>
        </div>
      </div>
    </DefaultLayout>
  );
};

// ===================================================================
// 5. Komponen Halaman Laporan Utama (Controller)
// ===================================================================
const LaporanPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReport, setCurrentReport] = useState<{
    type: ReportType;
    title: string;
  } | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [reportData, setReportData] = useState<any[] | null>(null);
  const [reportPeriod, setReportPeriod] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenModal = (type: ReportType, title: string) => {
    setCurrentReport({ type, title });
    if (type === "users") {
      // Untuk laporan user, tidak perlu modal, langsung siapkan laporan
      handlePrepareReport("", "", "Semua Data");
    } else {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentReport(null);
  };

  const handlePrepareReport = async (
    month: string,
    year: string,
    monthName: string
  ) => {
    if (!currentReport) return;

    setIsLoading(true);
    setError(null);
    setReportData(null);
    setReportPeriod(`${monthName} ${year}`);

    try {
      const params =
        currentReport.type === "users" ? "" : `?month=${month}&year=${year}`;
      const apiUrl = `http://localhost:8080/v1/report/generateReport?type=${currentReport.type}${params}`;

      const response = await fetch(apiUrl, {
        headers: {
          /* 'Authorization': `Bearer ${token}` */
        },
      });

      if (!response.ok) {
        throw new Error(`Gagal mengambil data: ${response.statusText}`);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const apiResponse: ApiResponse<any[]> = await response.json();

      if (apiResponse.Status === "Success") {
        if (apiResponse.Data && apiResponse.Data.length > 0) {
          setReportData(apiResponse.Data);
        } else {
          throw new Error("Tidak ada data untuk periode yang dipilih.");
        }
      } else {
        throw new Error(
          apiResponse.Message || "Gagal mengambil data dari server."
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Terjadi kesalahan tidak dikenal"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <DefaultLayout>
        <div className="text-center p-10">Mempersiapkan laporan...</div>
      </DefaultLayout>
    );
  }

  if (error) {
    return (
      <DefaultLayout>
        <div className="text-center p-10">
          <p className="text-red-500">Error: {error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-4 rounded bg-primary px-6 py-2 text-white"
          >
            Kembali ke Pilihan Laporan
          </button>
        </div>
      </DefaultLayout>
    );
  }

  if (reportData && currentReport) {
    return (
      <PrintableReport
        title={currentReport.title}
        data={reportData}
        reportType={currentReport.type}
        period={currentReport.type === "users" ? "Semua Data" : reportPeriod}
        onBack={() => setReportData(null)}
      />
    );
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Pusat Laporan" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ReportCard
          title="Laporan Gaji Karyawan"
          description="Rincian gaji pokok, tunjangan, dan potongan."
          icon={
            <svg
              className="h-6 w-6 fill-primary"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
            >
              <path d="M64 64C28.7 64 0 92.7 0 128V384c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H64zM288 256a32 32 0 1 1 0-64 32 32 0 1 1 0 64zM128 288a32 32 0 1 1-64 0 32 32 0 1 1 64 0zM480 288a32 32 0 1 1-64 0 32 32 0 1 1 64 0zM64 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H512c17.7 0 32-14.3 32-32s-14.3-32-32-32H64z" />
            </svg>
          }
          onClick={() => handleOpenModal("salary", "Gaji Karyawan")}
        />
        <ReportCard
          title="Laporan Kehadiran"
          description="Rekapitulasi kehadiran, keterlambatan, dan jam kerja."
          icon={
            <svg
              className="h-6 w-6 fill-primary"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path d="M96 32C96 14.3 81.7 0 64 0S32 14.3 32 32V64H96V32zm32 192c-17.7 0-32 14.3-32 32s14.3 32 32 32h16c17.7 0 32-14.3 32-32s-14.3-32-32-32H128zM96 160c0-17.7-14.3-32-32-32S32 142.3 32 160v32c0 17.7 14.3 32 32 32s32-14.3 32-32V160zM224 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V64h64V32zM352 64V32c0-17.7-14.3-32-32-32s-32 14.3-32 32V64h64zM256 224c-17.7 0-32 14.3-32 32s14.3 32 32 32h16c17.7 0 32-14.3 32-32s-14.3-32-32-32H256zm-32 64V480c0 17.7 14.3 32 32 32s32-14.3 32-32V288H224zM320 160v32c0 17.7 14.3 32 32 32s32-14.3 32-32V160c0-17.7-14.3-32-32-32s-32 14.3-32 32z" />
            </svg>
          }
          onClick={() => handleOpenModal("attendance", "Kehadiran")}
        />
        <ReportCard
          title="Laporan Izin & Cuti"
          description="Rekapitulasi semua pengajuan izin, sakit, dan cuti."
          icon={
            <svg
              className="h-6 w-6 fill-primary"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-144c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32z" />
            </svg>
          }
          onClick={() => handleOpenModal("leave", "Izin & Cuti")}
        />
        <ReportCard
          title="Laporan Data Karyawan"
          description="Mencetak daftar lengkap semua karyawan terdaftar."
          icon={
            <svg
              className="h-6 w-6 fill-primary"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 512"
            >
              <path d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192h42.7c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0H21.3C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7h42.7C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3H405.3zM320 336a96 96 0 1 1 0-192 96 96 0 1 1 0 192z" />
            </svg>
          }
          onClick={() => handleOpenModal("users", "Data Karyawan")}
        />
      </div>
      <ReportPeriodModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onPrint={handlePrepareReport}
        reportTitle={currentReport?.title || ""}
      />
    </DefaultLayout>
  );
};

export default LaporanPage;
