import { format } from "date-fns";
import { Metadata } from "next";
import { z } from "zod";

import { DataTable } from "@/components/data-table";
import { Reservation, ReservationSchema } from "@/types/reservation";
import axios from "axios";
import { cookies } from "next/dist/client/components/headers";
import { columns } from "./components/columns";

export const metadata: Metadata = {
  title: "예매 관리",
  description: "예매 관리 페이지",
};

// Simulate a database read for Reservations.
async function getReservations() {
  const token = cookies().get("token");
  const { data } = await axios.get(`${process.env.SERVER_URL}/reservations`, {
    headers: {
      Authorization: "Bearer " + token!.value,
    },
  });
  const reservations = data.data.map((reservation: Reservation) => ({
    ...reservation,
    createdAt: format(new Date(reservation.createdAt), "yyyy-MM-dd"),
    updatedAt: format(new Date(reservation.updatedAt), "yyyy-MM-dd"),
  }));

  return z.array(ReservationSchema).parse(reservations);
}

export default async function ReservationManagePage() {
  const reservations = await getReservations();

  return (
    <>
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">예매 관리</h2>
            {/* <p className="text-muted-foreground">영화 추가</p> */}
            {/* <MovieAddForm /> */}
          </div>
        </div>
        <DataTable searchKey="userId" data={reservations} columns={columns} />
      </div>
    </>
  );
}
