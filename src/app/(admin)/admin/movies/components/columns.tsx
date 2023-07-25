"use client";

import { IMovie } from "@/types/movie";
import { ColumnDef } from "@tanstack/react-table";

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

export const columns: ColumnDef<IMovie>[] = movieKeys.map((key) => ({
  accessorKey: key,
  header: key,
}));
