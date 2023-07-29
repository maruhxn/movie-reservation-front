import { FullMovieSchedule } from "@/types/movieSchedule";
import { ReservedSeatsInfo } from "@/types/reservedSeatsInfo";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImagePath(imagePath: string) {
  const fullImagePath = `https://image.tmdb.org/t/p/original/${imagePath}`;
  return fullImagePath;
}

export function getReservedSeatsInfo(
  movieSchedule: FullMovieSchedule
): ReservedSeatsInfo {
  console.log(movieSchedule);
  const reservedSeatIds = [] as string[];
  const seatAmt = movieSchedule.screen.seatAmt;
  movieSchedule.reservations.forEach(
    (reservation) =>
      reservation.seatIds.length > 0 &&
      reservedSeatIds.push(...reservation.seatIds)
  );
  return {
    restSeatAmt: seatAmt - reservedSeatIds.length,
    reservedSeatIds,
  };
}
