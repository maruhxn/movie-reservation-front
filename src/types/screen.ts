import { z } from "zod";

export const ScreenSchema = z.object({
  id: z.string(),
  screenNum: z.number(),
  seatAmt: z.number(),
});

export type Screen = z.infer<typeof ScreenSchema>;
