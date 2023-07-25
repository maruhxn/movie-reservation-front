import { z } from "zod";

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

export type User = z.infer<typeof UserSchema>;
