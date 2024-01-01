import useSWR from "swr";
import { DB, isResultSetError, sql } from "../db/db";
import { useCallback } from "react";
import { z } from "zod";
import { keys } from "./keys";

export const starterSchema = z.object({
  id: z.string(),
  name: z.string(),
  instructions: z.string().nullable(),
  lastFed: z.string().nullable(),
  schedule: z.string().nullable(),
});
export type Starter = z.infer<typeof starterSchema>;

export function useStarter({ id }: { id: string }) {
  const { data, error, mutate } = useSWR(keys.starter(id), async () => {
    const res = await DB.read(
      sql`SELECT * FROM starters WHERE id = ${id} LIMIT 1`,
    );
    if (isResultSetError(res)) {
      throw res.error;
    }
    return starterSchema.parse(res.rows[0]);
  });

  const revalidate = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    starter: data,
    error,
    isLoading: !data && !error,
    revalidate,
    mutate,
  };
}
