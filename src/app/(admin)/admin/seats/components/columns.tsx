"use client";

import { Seat } from "@/types/seat";
import { ColumnDef } from "@tanstack/react-table";

export const movieKeys = ["id", "name", "screenId", "reservationId"] as const;

export const columns: ColumnDef<Seat>[] = movieKeys.map((key) => ({
  accessorKey: key,
  header: key,
}));
