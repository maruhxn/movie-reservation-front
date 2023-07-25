"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/admin`,
      label: "Overview",
      active: pathname === `/admin`,
    },
    {
      href: `/admin/billboards`,
      label: "Billboards",
      active: pathname === `/admin/billboards`,
    },
    {
      href: `/admin/movies`,
      label: "Movies",
      active: pathname === `/admin/movies`,
    },
    {
      href: `/admin/movie-schedules`,
      label: "Movie Schedules",
      active: pathname === `/admin/movie-schedules`,
    },
    {
      href: `/admin/screens`,
      label: "Screens",
      active: pathname === `/admin/screens`,
    },
    {
      href: `/admin/seats`,
      label: "Seats",
      active: pathname === `/admin/seats`,
    },
    {
      href: `/admin/reservations`,
      label: "Reservations",
      active: pathname === `/admin/reservations`,
    },
    {
      href: `/admin/users`,
      label: "Users",
      active: pathname === `/admin/users`,
    },
  ];

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
