import { Metadata } from "next";
import { z } from "zod";

import { DataTable } from "@/components/data-table";
import { SeatSchema } from "@/types/seat";
import axios from "axios";
import { cookies } from "next/dist/client/components/headers";
import { columns } from "./components/columns";

export const metadata: Metadata = {
  title: "좌석 관리",
  description: "좌석 관리 페이지",
};

// Simulate a database read for seats.
async function getseats() {
  const token = cookies().get("token");
  const { data } = await axios.get(`${process.env.SERVER_URL}/seats`, {
    headers: {
      Authorization: "Bearer " + token!.value,
    },
  });
  const seats = data.data;

  return z.array(SeatSchema).parse(seats);
}

export default async function SeatManagePage() {
  const seats = await getseats();

  return (
    <>
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">좌석 관리</h2>
          </div>
        </div>
        <DataTable searchKey="id" data={seats} columns={columns} />
      </div>
    </>
  );
}
