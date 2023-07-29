import { z } from "zod";
import { MovieScheduleSchema } from "./movieSchedule";
import { UserSchema } from "./user";

export const FullReservationSchema = z.object({
  id: z.string(),
  personAmt: z.number(),
  userId: z.string(),
  movieScheduleId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  user: z.lazy(() => UserSchema),
  movieSchedule: z.lazy(() => MovieScheduleSchema),
  seatIds: z.array(z.string()),
  seatNames: z.array(z.string()),
});

export const ReservationSchema = z.object({
  id: z.string(),
  personAmt: z.number(),
  userId: z.string(),
  movieScheduleId: z.string(),
  seatIds: z.array(z.string()),
  seatNames: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreateReservationSchema = z.object({
  personAmt: z.number().min(1).max(10),
  movieScheduleId: z.string(),
  seatIds: z.array(z.string()),
  seatNames: z.array(z.string()),
});

export type Reservation = z.infer<typeof ReservationSchema>;
export type FullReservation = z.infer<typeof FullReservationSchema>;
export type CreateReservation = z.infer<typeof CreateReservationSchema>;
