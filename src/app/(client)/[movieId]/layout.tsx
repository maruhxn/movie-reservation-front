import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ReservationLayout({
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
  return <>{children}</>;
}
