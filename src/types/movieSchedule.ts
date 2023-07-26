import { z } from "zod";

export const MovieScheduleSchema = z.object({
  id: z.string(),
  movieId: z.string(),
  screenId: z.string(),
  startTm: z.date(),
  endTm: z.date(),
});

export const CreateMovieScheduleSchema = z.object({
  movieId: z.string(),
  screenId: z.string(),
  startTm: z.string(),
  endTm: z.string(),
});

export type MovieSchedule = z.infer<typeof MovieScheduleSchema>;
export type CreateMovieSchedule = z.infer<typeof CreateMovieScheduleSchema>;
