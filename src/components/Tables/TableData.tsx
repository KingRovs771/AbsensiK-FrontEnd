"use client";
import { useState } from "react";
import DataTable from "react-data-table-component";

const columns = [
  {
    name: "Title",
    selector: (row) => row.title,
    sortable: true,
    sortField: "title",
  },
  {
    name: "Director",
    selector: (row) => row.director,
    sortable: true,
    sortField: "director",
  },
  {
    name: "Year",
    selector: (row) => row.year,
    sortable: true,
    sortField: "year",
  },
];

const TableData = () => {
  const [item, setData] = useState<data>
  return <DataTable columns={columns} data={data} />;
};
export default TableData;
