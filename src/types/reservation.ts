import { z } from "zod";

export const ReservationSchema = z.object({
  id: z.string(),
  personAmt: z.number(),
  userId: z.string(),
  movieScheduleId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Reservation = z.infer<typeof ReservationSchema>;
