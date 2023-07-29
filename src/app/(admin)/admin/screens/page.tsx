import { Metadata } from "next";
import { z } from "zod";

import { DataTable } from "@/components/data-table";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { ScreenSchema } from "@/types/screen";
import axios from "axios";
import { cookies } from "next/dist/client/components/headers";
import Link from "next/link";
import { columns } from "./components/columns";

export const metadata: Metadata = {
  title: "상영관 관리",
  description: "상영관 관리 페이지",
};

// Simulate a database read for screens.
async function getScreens() {
  const token = cookies().get("token");
  const { data } = await axios.get(`${process.env.SERVER_URL}/screens`, {
    headers: {
      Authorization: "Bearer " + token!.value,
    },
  });
  const screens = data.data;

  return z.array(ScreenSchema).parse(screens);
}

export default async function ScreenManagePage() {
  const screens = await getScreens();

  return (
    <>
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {`상영관 목록 관리(${screens.length})`}
            </h2>
          </div>
          <Link
            href="/admin/screens/create"
            className={cn(
              buttonVariants({
                variant: "default",
              })
            )}
          >
            Create
          </Link>
        </div>
        <DataTable searchKey="screenNum" data={screens} columns={columns} />
      </div>
    </>
  );
}
