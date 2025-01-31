import { Tipe_potongan } from "@/types/Tipe_potongan";

const TipePotonganData: Tipe_potongan[] = [
  {
    tipe_potongan_id: 1,
    name_potongan: "BPJS",
    nilai_potongan: 20000,
  },
];

const TablePotongan = () => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-12 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Data Potongan
      </h4>
      <a
        className="rounded-sm mb-2 inline-flex items-center justify-center bg-primary px-2 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-2"
        href="#"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          width="18"
          height="18"
          className="fill-current mr-2"
        >
          <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" />
        </svg>
        <span>Insert Potongan</span>
      </a>
      <div className="flex flex-col">
        <div className="grid max-screen grid-cols-5 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-6 text-center">
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">No</h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Nama Potongan
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Tipe Potongan
            </h5>
          </div>
          <div className="hidden max p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Detail
            </h5>
          </div>
          <div className="hidden max p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Edit
            </h5>
          </div>
          <div className="hidden max p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Delete
            </h5>
          </div>
        </div>

        {TipePotonganData.map((TipePotongan, key) => (
          <div
            className={`grid grid-cols-3 sm:grid-cols-6 ${
              key === TipePotonganData.length - 1
                ? ""
                : "border-b border-stroke dark:border-strokedark"
            }`}
            key={key}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <div className="flex-shrink-0 text-center">
                <p className="text-black text-center dark:text-white">1</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <div className="flex-shrink-0 text-center ">
                <p className="text-black dark:text-white">
                  {TipePotongan.name_potongan}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-2">
              <p className="text-black dark:text-white">
                Rp. {TipePotongan.nilai_potongan}
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-1">
              <a
                className="rounded-sm inline-flex items-center justify-center bg-success px-2 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-2"
                href="#"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                  width="18"
                  height="18"
                  className="fill-current me-2"
                >
                  <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" />
                </svg>
                <span>Update </span>
              </a>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <a
                className="rounded-sm inline-flex items-center justify-center bg-warning px-2 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-2"
                href="#"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  className="fill-current mr-2"
                  viewBox="0 0 512 512"
                >
                  <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1 0 32c0 8.8 7.2 16 16 16l32 0zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" />
                </svg>
                <span>Update </span>
              </a>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <a
                className="rounded-sm inline-flex items-center justify-center bg-danger px-2 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-2"
                href="#"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  width="18"
                  height="18"
                  className="fill-current mr-2"
                >
                  <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
                </svg>
                <span>Delete</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TablePotongan;
