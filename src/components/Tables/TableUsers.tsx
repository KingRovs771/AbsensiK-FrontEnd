"use client";

import { Users } from "@/types/Users";
import { ApiResponse } from "@/types/ApiResponse";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

// Modal Component for User Details
const ModalDetailUser = ({
  user,
  onClose,
}: {
  user: Users;
  onClose: () => void;
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-lg bg-white p-6 shadow-default dark:bg-boxdark"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-stroke pb-4 dark:border-strokedark">
          <h3 className="text-xl font-semibold text-black dark:text-white">
            Detail Pengguna: {user.full_name}
          </h3>
          <button onClick={onClose} className="text-2xl font-bold">
            &times;
          </button>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="font-medium">User UID:</p>
            <p>{user.user_uid}</p>
          </div>
          <div>
            <p className="font-medium">Username:</p>
            <p>{user.username}</p>
          </div>
          <div>
            <p className="font-medium">Email:</p>
            <p>{user.email || "N/A"}</p>
          </div>
          <div>
            <p className="font-medium">Telepon:</p>
            <p>{user.phone || "N/A"}</p>
          </div>
          <div className="md:col-span-2">
            <p className="font-medium">Alamat:</p>
            <p>{user.address || "N/A"}</p>
          </div>
          <div>
            <p className="font-medium">Jenis Kelamin:</p>
            <p>{user.gender || "N/A"}</p>
          </div>
          <div>
            <p className="font-medium">Divisi:</p>
            <p>{user.department?.name_departments || "N/A"}</p>
          </div>
          <div>
            <p className="font-medium">Jabatan (Role):</p>
            <p>{user.role?.name_role || "N/A"}</p>
          </div>
          <div>
            <p className="font-medium">Gaji Harian:</p>
            <p>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(user.dailyrate || 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Table Component
const TableUsers = () => {
  const [dataUsers, setUsers] = useState<Users[]>([]);
  const [error, setError] = useState<string | null>(null);

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Users | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersResponse = await fetch(
          "http://localhost:8080/v1/users/allUsers"
        );
        if (!usersResponse.ok) {
          throw new Error(`Http Error! Status : ${usersResponse.status}`);
        }
        const apiResponse: ApiResponse<Users[]> = await usersResponse.json();
        if (apiResponse.Status === "Success") {
          setUsers(apiResponse.Data);
        } else {
          throw new Error(apiResponse.Message || "Unknown error from server");
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An Unknown error occurred"
        );
      }
    };
    fetchUsers();
  }, []);

  const handleUsersDelete = async (UserUID: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) return;
    try {
      const UsersResponse = await fetch(
        `http://localhost:8080/v1/users/deleteUser/${UserUID}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        }
      );
      const result = await UsersResponse.json();
      if (!UsersResponse.ok || result.Status !== "Success") {
        throw new Error(result.Message || "Gagal menghapus data");
      }
      toast.success("Sukses Menghapus Data!");
      setUsers(dataUsers?.filter((users) => users.user_uid !== UserUID));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal Menghapus Data!"
      );
    }
  };

  const handleOpenModal = (user: Users) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <>
      <ToastContainer autoClose={3000} />
      <div className="rounded-sm border border-stroke bg-white px-12 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
          Data Users
        </h4>
        <a
          className="rounded-sm mb-2 inline-flex items-center justify-center bg-primary px-2 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-2"
          href="/masterdata/users/formInput"
        >
          <span>Insert User</span>
        </a>
        <div className="flex flex-col">
          <div className="grid grid-cols-5 rounded-sm bg-gray-2 dark:bg-meta-4 text-center">
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase">Nama Lengkap</h5>
            </div>
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase">Divisi</h5>
            </div>
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase">Detail</h5>
            </div>
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase">Edit</h5>
            </div>
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase">Delete</h5>
            </div>
          </div>

          {dataUsers.length > 0 ? (
            dataUsers.map((user, index) => (
              <div
                className="grid grid-cols-5 border-b border-stroke dark:border-strokedark"
                key={user.user_uid || index}
              >
                <div className="flex items-center justify-center p-2.5">
                  <p className="text-black dark:text-white">{user.full_name}</p>
                </div>
                <div className="flex items-center justify-center p-2.5">
                  <p className="text-meta-3">
                    {user.department?.name_departments || "N/A"}
                  </p>
                </div>
                <div className="flex items-center justify-center p-2.5">
                  <button
                    onClick={() => handleOpenModal(user)}
                    className="rounded-sm bg-success px-4 py-2 font-medium text-white hover:bg-opacity-90"
                  >
                    Detail
                  </button>
                </div>
                <div className="flex items-center justify-center p-2.5">
                  <Link
                    href={`/masterdata/users/formUpdate/${user.user_uid}`}
                    className="rounded-sm bg-warning px-4 py-2 font-medium text-white hover:bg-opacity-90"
                  >
                    Update
                  </Link>
                </div>
                <div className="flex items-center justify-center p-2.5">
                  <button
                    onClick={() => handleUsersDelete(user.user_uid)}
                    className="rounded-sm bg-danger px-4 py-2 font-medium text-white hover:bg-opacity-90"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="p-5 text-center">Loading atau tidak ada data...</p>
          )}
          {error && <p className="text-red-500 p-5 text-center">{error}</p>}
        </div>
      </div>
      {isModalOpen && selectedUser && (
        <ModalDetailUser user={selectedUser} onClose={handleCloseModal} />
      )}
    </>
  );
};

export default TableUsers;
