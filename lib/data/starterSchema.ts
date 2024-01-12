import { z } from "zod";

export const starterSchema = z.object({
  id: z.string(),
  name: z.string(),
  instructions: z.string().nullable().optional(),
  lastFed: z.string().nullable().optional(),
  schedule: z.string().nullable().optional(),
});
export type Starter = z.infer<typeof starterSchema>;
