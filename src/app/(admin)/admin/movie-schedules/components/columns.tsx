"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MovieScheduleColumn } from "../page";
import CellActions from "./cell-actions";

export const movieKeys = ["id", "movie", "screen", "startTm", "endTm"] as const;

export const columns: ColumnDef<MovieScheduleColumn>[] = [
  ...movieKeys.map((key) => ({
    accessorKey: key,
    header: key,
  })),
  { id: "actions", cell: ({ row }) => <CellActions data={row.original} /> },
];
