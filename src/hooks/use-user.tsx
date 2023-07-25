"use client";

import { IUser } from "@/types/user";
import axios, { AxiosError } from "axios";
import { getCookie } from "cookies-next";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const useUser = (withReplace = false) => {
  const accessToken = getCookie("token");
  const [userInfo, setUserInfo] = useState<IUser | null>();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!accessToken) {
      return setUserInfo(null);
    }
    const getUserInfo = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/auth`,
          {
            withCredentials: true,
            headers: {
              Authorization: "Bearer " + accessToken,
            },
          }
        );

        setUserInfo(data.data);
      } catch (err) {
        if (err instanceof AxiosError) {
          if (err.response?.status === 401 && withReplace)
            router.replace("/sign-in");
        }
      }
    };

    getUserInfo();
  }, [accessToken, pathname]);

  return userInfo as IUser;
};

export default useUser;
