"use client";

import { Reservation } from "@/types/reservation";
import { ColumnDef } from "@tanstack/react-table";

export const movieKeys = [
  "id",
  "personAmt",
  "userId",
  "movieScheduleId",
  "seatIds",
  "seatNames",
  "createdAt",
  "updatedAt",
] as const;

export const columns: ColumnDef<Reservation>[] = movieKeys.map((key) => ({
  accessorKey: key,
  header: key,
}));
