import { z } from "zod";
import { ReservationSchema } from "./reservation";
import { TokenSchema } from "./token";

export enum ProviderType {
  LOCAL = "LOCAL",
  KAKAO = "KAKAO",
}

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  image: z.string().nullable(),
  provider: z.nativeEnum(ProviderType),
  snsId: z.string().nullable(),
  role: z.number(),
  isVerified: z.boolean(),
  createdAt: z.string(),
});

export const FullUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  image: z.string().nullable(),
  provider: z.nativeEnum(ProviderType),
  snsId: z.string().nullable(),
  role: z.number(),
  isVerified: z.boolean(),
  createdAt: z.string(),
  tokens: z.array(z.lazy(() => TokenSchema)),
  reservations: z.array(z.lazy(() => ReservationSchema)),
});

export type User = z.infer<typeof UserSchema>;
export type FullUser = z.infer<typeof FullUserSchema>;
