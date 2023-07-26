import { Metadata } from "next";
import { z } from "zod";

import { DataTable } from "@/components/data-table";
import { UserSchema } from "@/types/user";
import axios from "axios";
import { cookies } from "next/dist/client/components/headers";
import { columns } from "./components/columns";

export const metadata: Metadata = {
  title: "유저 관리",
  description: "유저 관리 페이지",
};

// Simulate a database read for users.
async function getUsers() {
  const token = cookies().get("token");
  const { data } = await axios.get(`${process.env.SERVER_URL}/users`, {
    headers: {
      Authorization: "Bearer " + token!.value,
    },
  });
  const users = data.data;

  return z.array(UserSchema).parse(users);
}

export default async function SeatManagePage() {
  const users = await getUsers();

  return (
    <>
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">유저 관리</h2>
          </div>
        </div>
        <DataTable searchKey="name" data={users} columns={columns} />
      </div>
    </>
  );
}
