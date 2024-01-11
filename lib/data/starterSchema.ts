import { z } from "zod";

export const starterSchema = z.object({
  id: z.string(),
  name: z.string(),
  instructions: z.string().nullable(),
  lastFed: z.string().nullable(),
  schedule: z.string().nullable(),
});
export type Starter = z.infer<typeof starterSchema>;
