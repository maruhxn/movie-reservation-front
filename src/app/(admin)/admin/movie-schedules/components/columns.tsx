"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IMovieScheduleColumn } from "../page";

export const movieKeys = [
  "id",
  "movie",
  "screen",
  "startDate",
  "startTm",
  "endTm",
] as const;

export const columns: ColumnDef<IMovieScheduleColumn>[] = movieKeys.map(
  (key) => ({
    accessorKey: key,
    header: key,
  })
);
