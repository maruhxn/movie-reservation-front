"use client";

import { User } from "@/types/user";
import { ColumnDef } from "@tanstack/react-table";

export const movieKeys = [
  "id",
  "name",
  "email",
  "phone",
  "image",
  "provider",
  "snsId",
  "role",
  "isVerified",
  "createdAt",
] as const;

export const columns: ColumnDef<User>[] = movieKeys.map((key) => ({
  accessorKey: key,
  header: key,
}));
