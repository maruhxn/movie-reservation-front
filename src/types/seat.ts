import { z } from "zod";
import { ScreenSchema } from "./screen";

export const FullSeatSchema = z.object({
  id: z.string(),
  name: z.string(),
  screenId: z.string(),
  screen: z.lazy(() => ScreenSchema),
});

export const SeatSchema = z.object({
  id: z.string(),
  name: z.string(),
  screenId: z.string(),
});

export type Seat = z.infer<typeof SeatSchema>;
export type FullSeat = z.infer<typeof FullSeatSchema>;
