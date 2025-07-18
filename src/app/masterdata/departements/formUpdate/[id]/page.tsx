'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DefaultLayout from '@/components/Layouts/MainLayout';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import { ApiResponse } from '@/types/ApiResponse';
import { Departement } from '@/types/departement';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FormUpdateDepartments = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { id } = params; // Ambil ID dari params

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return; // Jangan lakukan apa-apa jika ID belum ada

    const fetchDepartmentData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/v1/departements/getDepartementsById/${id}`);
        if (!response.ok) {
          throw new Error('Gagal mengambil data departemen');
        }
        const apiResponse: ApiResponse<Departement> = await response.json();
        if (apiResponse.Status === 'Success') {
          const dept = apiResponse.Data;
          setName(dept.name_departments);
          setDescription(dept.description);
        } else {
          throw new Error(apiResponse.Message || 'Gagal memuat data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
        toast.error(err instanceof Error ? err.message : 'Terjadi kesalahan');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartmentData();
  }, [id]); // useEffect akan berjalan lagi jika ID berubah

  const handleUpdate = async () => {
    setIsLoading(true);
    setError(null);

    const updatedData = {
      departments_id: id,
      name_departments: name,
      description: description,
    };

    try {
      const response = await fetch(`http://localhost:8080/v1/departements/updateDepartements/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      const result: ApiResponse<null> = await response.json();

      if (!response.ok || result.Status !== 'Success') {
        throw new Error(result.Message || 'Gagal memperbarui data');
      }

      toast.success(result.Message || 'Data berhasil diperbarui!');
      // Arahkan kembali ke halaman tabel setelah 2 detik
      setTimeout(() => {
        router.push('/masterdata/departements');
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan';
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
        <Breadcrumb pageName="Form Update Departemen" />
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">Update Departemen: {id}</h3>
          </div>
          {isLoading ? (
            <div className="p-6.5 text-center">Loading data...</div>
          ) : (
            <div className="p-6.5">
              {error && <div className="mb-4 text-red-500">{error}</div>}
              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">Nama Departemen</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3" />
              </div>
              <div className="mb-6">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">Deskripsi</label>
                <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3"></textarea>
              </div>
              <button onClick={handleUpdate} disabled={isLoading} className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:cursor-not-allowed">
                {isLoading ? 'Menyimpan...' : 'Update Data'}
              </button>
            </div>
          )}
        </div>
      </DefaultLayout>
    </>
  );
};

export default FormUpdateDepartments;
