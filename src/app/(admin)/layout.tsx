import Breadcrumb from "@/components/Breadcrumb";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/Toaster";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import axios from "axios";
import { cookies } from "next/dist/client/components/headers";
import { Inter } from "next/font/google";
import { redirect } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "관리자 페이지 | 영화 예매 사이트",
  description: "관리자 페이지 | 영화 예매 사이트",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = cookies().get("token");
  if (!token) {
    redirect("/sign-in");
  }
  const { data } = await axios.get(`${process.env.SERVER_URL}/auth`, {
    withCredentials: true,
    headers: {
      Authorization: "Bearer " + token.value,
    },
  });

  if (!data.data) {
    redirect("/");
  }

  return (
    <html
      lang="ko"
      className={cn(
        "bg-white text-slate-900 antialiased light",
        inter.className
      )}
    >
      <body className="min-h-screen bg-slate-50 antialiased">
        <Providers>
          <Breadcrumb />
          <div className="container max-w-7 mx-auto h-full pt-12">
            {children}
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
