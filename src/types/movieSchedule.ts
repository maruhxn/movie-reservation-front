import { z } from "zod";
import { MovieSchema } from "./movie";
import { ReservationSchema } from "./reservation";
import { FullScreenSchema } from "./screen";

export const FullMovieScheduleSchema = z.object({
  id: z.string(),
  movieId: z.string(),
  screenId: z.string(),
  startTm: z.string(),
  endTm: z.string(),
  movie: MovieSchema,
  screen: z.lazy(() => FullScreenSchema),
  reservations: z.array(z.lazy(() => ReservationSchema)),
});

export const MovieScheduleSchema = z.object({
  id: z.string(),
  movieId: z.string(),
  screenId: z.string(),
  startTm: z.string(),
  endTm: z.string(),
});

export const CreateMovieScheduleSchema = z.object({
  movieId: z.string(),
  screenId: z.string(),
  startTm: z.string(),
  endTm: z.string(),
});

export type MovieSchedule = z.infer<typeof MovieScheduleSchema>;
export type FullMovieSchedule = z.infer<typeof FullMovieScheduleSchema>;
export type CreateMovieSchedule = z.infer<typeof CreateMovieScheduleSchema>;
