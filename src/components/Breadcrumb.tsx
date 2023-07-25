"use client";

import useUser from "@/hooks/use-user";
import { cn } from "@/lib/utils";
import { User } from "@/types/user";
import { Link } from "lucide-react";
import { MainNav } from "./MainNav";
import { ThemeToggle } from "./ThemeToggle";
import UserAccountNav from "./UserAccountNav";
import { buttonVariants } from "./ui/Button";

const Breadcrumb = () => {
  const user = useUser();
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
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
    </div>
  );
};

export default Breadcrumb;
