import { z } from "zod";

export const MovieScheduleSchema = z.object({
  id: z.string(),
  movieId: z.string(),
  screenId: z.string(),
  startDate: z.string(),
  startTm: z.string(),
  endTm: z.string(),
});

export type MovieSchedule = z.infer<typeof MovieScheduleSchema>;
