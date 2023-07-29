import { z } from "zod";

export const ReservedSeatsInfoSchema = z.object({
  restSeatAmt: z.number(),
  reservedSeatIds: z.array(z.string()),
});

export type ReservedSeatsInfo = z.infer<typeof ReservedSeatsInfoSchema>;
