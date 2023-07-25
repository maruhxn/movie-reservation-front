import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImagePath(imagePath: string) {
  const fullImagePath = `https://image.tmdb.org/t/p/original/${imagePath}`;
  return fullImagePath;
}
