"use client";

import useUser from "@/hooks/use-user";
import { cn } from "@/lib/utils";
import { User } from "@/types/user";
import Image from "next/image";
import Link from "next/link";
import SearchBar from "./SearchBar";
import UserAccountNav from "./UserAccountNav";
import { buttonVariants } from "./ui/Button";

const Navbar = () => {
  const user = useUser();
  return (
    <div className="fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-[10] py-2">
      <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
        {/* logo */}
        <Link
          href="/"
          className="flex gap-2 items-center relative w-24 min-h-[3.5rem] bottom-1"
        >
          <Image src={"/logo.png"} alt="logo" className="object-contain" fill />
        </Link>

        {/* search bar */}
        <SearchBar />

        {user ? (
          <UserAccountNav user={user as User} />
        ) : (
          <div className="space-x-2">
            <Link href="/sign-in" className={buttonVariants()}>
              로그인
            </Link>
            <Link
              href="/sign-up"
              className={cn(buttonVariants(), "bg-[#4FA987]")}
            >
              회원가입
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
