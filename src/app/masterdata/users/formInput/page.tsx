"use client";
import DefaultLayout from "@/components/Layouts/MainLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useState, useEffect } from "react";
import { Role } from "@/types/Role";
import { ApiResponse } from "@/types/ApiResponse";
import { Departement } from "@/types/Departement";
import { UsersData } from "@/types/UsersData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// NOTE: Assuming the Role type includes 'daily_rate'
// export interface Role {
//   role_id: string;
//   name_role: string;
//   daily_rate: number;
// }

const FormUserPage: React.FC = () => {
  const [dataDepartement, setDepartement] = useState<Departement[]>([]);
  const [dataRole, setRole] = useState<Role[]>([]);
  const [dataUsers, setUsers] = useState<UsersData[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [userUID, setUserUID] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [dailyrate, setDailyRate] = useState<number>(0);
  const [departmentsId, setDepartmeentsId] = useState<string>("");
  const [roleId, setRoleId] = useState<string>("");

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const roleResponse = await fetch(
          "http://localhost:8080/v1/roles/AllRoles"
        );
        if (!roleResponse.ok) {
          throw new Error(`Http Error! Status : ${roleResponse.status}`);
        }
        const apiResponse: ApiResponse<Role[]> = await roleResponse.json();
        if (apiResponse.Status === "Success") {
          setRole(apiResponse.Data);
        } else {
          throw new Error(apiResponse.Message || "Unknown error from server");
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An Unknown error occurred"
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
          throw new Error(`Http Error! Status : ${departementResponse.status}`);
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
          error instanceof Error ? error.message : "An Unknown error occurred"
        );
        console.log(error);
      }
    };
    fetchRoles();
    fetchDepartements();
  }, []);

  // Handler for role selection change
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRoleId = e.target.value;
    setRoleId(selectedRoleId);

    // Find the selected role from the dataRole state
    const selectedRole = dataRole.find(
      (role) => role.role_id === selectedRoleId
    );

    // If a role is found, update the daily rate state
    // Otherwise, reset it to 0
    if (selectedRole && selectedRole.daily_rate) {
      setDailyRate(selectedRole.daily_rate);
    } else {
      setDailyRate(0);
    }
  };

  const SaveDataUsers = async () => {
    // Basic validation
    if (!userUID || !username || !password || !roleId || !departmentsId) {
      toast.error("Please fill all required fields!", { autoClose: 3000 });
      return;
    }

    const users = {
      user_uid: userUID,
      username: username,
      password: password,
      email: email,
      full_name: fullName,
      gender: gender,
      phone: phone,
      address: address,
      dailyrate: dailyrate,
      departments_id: departmentsId,
      role_id: roleId,
    };
    try {
      const usersResponse = await fetch(
        "http://localhost:8080/v1/users/insertUsers",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(users),
        }
      );
      if (!usersResponse.ok) {
        const errorData = await usersResponse.json();
        throw new Error(
          errorData.message || `HTTP Error! Status : ${usersResponse.status}`
        );
      }

      const ResultUsers = await usersResponse.json();

      toast.success("Data berhasil disimpan!", { autoClose: 3000 });
      setSuccessMessage(ResultUsers.Message || "Success");
      setUsers([...(dataUsers || []), users]);

      // Clear form fields after successful submission
      setUserUID("");
      setUsername("");
      setPassword("");
      setEmail("");
      setFullName("");
      setGender("");
      setPhone("");
      setAddress("");
      setDailyRate(0);
      setDepartmeentsId("");
      setRoleId("");
    } catch (error) {
      toast.error("Gagal menyimpan data!", { autoClose: 3000 });
      setError(
        error instanceof Error ? error.message : "An Unknown Error Occurred"
      );
    }
  };
  return (
    <>
      <ToastContainer />
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

              <div className="p-6.5">
                {successMessage && (
                  <div
                    className="mb-4.5 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
                    role="alert"
                  >
                    <span className="block sm:inline">{successMessage}</span>
                  </div>
                )}
                {error && (
                  <div
                    className="mb-4.5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                    role="alert"
                  >
                    <span className="block sm:inline">{error}</span>
                  </div>
                )}
                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Kode Pegawai <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    id="userUID"
                    value={userUID}
                    onChange={(e) => setUserUID(e.target.value)}
                    placeholder="Masukkan Kode Pegawai"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Username <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
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
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan Email"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Departements <span className="text-meta-1">*</span>
                  </label>
                  <select
                    name="departmentsId"
                    id="departmentsId"
                    value={departmentsId}
                    onChange={(e) => setDepartmeentsId(e.target.value)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="">---Pilih Departements----</option>
                    {dataDepartement && dataDepartement.length > 0 ? (
                      dataDepartement.map((departement) => (
                        <option
                          key={departement.departments_id}
                          value={departement.departments_id}
                        >
                          {departement.name_departments}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        Loading.....
                      </option>
                    )}
                  </select>
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Role <span className="text-meta-1">*</span>
                  </label>
                  <select
                    name="roleId"
                    id="roleId"
                    value={roleId}
                    onChange={handleRoleChange} // Use the new handler here
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="">---Pilih Role----</option>
                    {dataRole.length > 0 ? (
                      dataRole.map((role) => (
                        <option key={role.role_id} value={role.role_id}>
                          {role.name_role}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        Loading.....
                      </option>
                    )}
                  </select>
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Masukkan Nama Lengkap"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Jenis Kelamin
                  </label>
                  <select
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="">---Pilih Jenis Kelamin----</option>
                    <option value="Laki-Laki">Laki-Laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Phone
                  </label>
                  <input
                    type="text"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+62 | Masukkan Nomor : 62890389820018"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Bayaran Harian
                  </label>
                  <input
                    type="number"
                    id="dailyrate"
                    value={dailyrate}
                    placeholder="Pilih Role untuk menampilkan bayaran"
                    readOnly // This makes the input field not editable
                    disabled // This visually indicates the field is disabled
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-6">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Address
                  </label>
                  <textarea
                    rows={6}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Masukkan Alamat"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  ></textarea>
                </div>

                <button
                  onClick={SaveDataUsers}
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                >
                  Save Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </DefaultLayout>
    </>
  );
};

export default FormUserPage;
