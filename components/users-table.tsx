"use client"; 

import { useState } from "react";
import { DataTable } from "@/app/dashboard/users/data-table";
import { getColumns } from "@/app/dashboard/users/columns";
import NoData from "./no-data";
import { User } from "@/db/schema";

interface UsersTableProps {
  initialUsers: User[];
}

export default function UserTable({ initialUsers }: UsersTableProps) {
  const [data, setData] = useState<Array<User>>(initialUsers);

  if (!data || data.length === 0) {
    return (
      <NoData />
    );
  }

  return (
    <DataTable
      columns={getColumns(setData)} // Make sure getColumns is compatible
      data={data}
      // setData={setData} // Passing setData if your DataTable or columns need to modify the parent state
    />
  );
}