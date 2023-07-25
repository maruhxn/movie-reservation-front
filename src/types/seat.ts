import { z } from "zod";

export const SeatSchema = z.object({
  id: z.string(),
  name: z.string(),
  reservationId: z.string().nullable(),
  screenId: z.string(),
});

export type Seat = z.infer<typeof SeatSchema>;
