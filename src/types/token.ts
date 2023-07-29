import { z } from "zod";
import { UserSchema } from "./user";

export const TokenSchema = z.object({
  id: z.string(),
  payload: z.string(),
  userId: z.string(),
  createdAt: z.date(),
});

export const FullTokenSchema = z.object({
  id: z.string(),
  payload: z.string(),
  userId: z.string(),
  createdAt: z.date(),
  user: z.lazy(() => UserSchema),
});

export type Token = z.infer<typeof TokenSchema>;
export type FullToken = z.infer<typeof FullTokenSchema>;
