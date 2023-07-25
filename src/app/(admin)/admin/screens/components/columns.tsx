"use client";

import { Screen } from "@/types/screen";
import { ColumnDef } from "@tanstack/react-table";

export const movieKeys = ["id", "screenNum", "seatAmt"] as const;

export const columns: ColumnDef<Screen>[] = movieKeys.map((key) => ({
  accessorKey: key,
  header: key,
}));
