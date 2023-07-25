import { z } from "zod";

export const MovieSchema = z.object({
  id: z.string(),
  title: z.string(),
  adult: z.boolean(),
  backdrop_path: z.string().nullable(),
  original_language: z.string(),
  original_title: z.string(),
  overview: z.string(),
  popularity: z.number(),
  poster_path: z.string().nullable(),
  release_date: z.string(),
  vote_average: z.number(),
  vote_count: z.number(),
  genres: z.array(z.string()),
  runtime: z.number(),
});

export type IMovie = z.infer<typeof MovieSchema>;
