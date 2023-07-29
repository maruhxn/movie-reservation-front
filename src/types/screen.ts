import { z } from "zod";
import { MovieScheduleSchema } from "./movieSchedule";
import { SeatSchema } from "./seat";

export const FullScreenSchema = z.object({
  id: z.string(),
  screenNum: z.number(),
  seatAmt: z.number(),

  movieSchedules: z.lazy(() => MovieScheduleSchema),
  seats: z.array(z.lazy(() => SeatSchema)),
});

export const ScreenSchema = z.object({
  id: z.string(),
  screenNum: z.number(),
  seatAmt: z.number(),
});

export const CreateScreenSchema = z.object({
  screenNum: z.string(),
  seatAmt: z.string(),
});

export type Screen = z.infer<typeof ScreenSchema>;
export type FullScreen = z.infer<typeof FullScreenSchema>;
export type CreateScreen = z.infer<typeof CreateScreenSchema>;
