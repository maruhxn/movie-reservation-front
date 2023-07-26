"use client";

import { IMovie } from "@/types/movie";
import { ColumnDef } from "@tanstack/react-table";
import CellActions from "./cell-actions";

export const movieKeys = [
  "id",
  "title",
  "adult",
  "backdrop_path",
  "original_language",
  "original_title",
  "popularity",
  "poster_path",
  "release_date",
  "vote_average",
  "vote_count",
  "genres",
  "runtime",
] as const;

export const columns: ColumnDef<IMovie>[] = [
  ...movieKeys.map((key) => ({
    accessorKey: key,
    header: key,
  })),
  { id: "actions", cell: ({ row }) => <CellActions data={row.original} /> },
];
