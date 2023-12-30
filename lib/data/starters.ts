import useSWR from "swr";
import { DB, isResultSetError, sql } from "../db/db";
import { useCallback } from "react";
import { ulid } from "../ulid";
import { z } from "zod";

const starterSchema = z.object({
  id: z.string(),
  name: z.string(),
  lastFed: z.string().nullable(),
  schedule: z.string().nullable(),
});
const startersSchema = z.array(starterSchema);

export function useStarters() {
  const { data, error, mutate } = useSWR("starters", async () => {
    const res = await DB.read(sql`SELECT * FROM starters`);
    if (isResultSetError(res)) {
      throw res.error;
    }
    return startersSchema.parse(res.rows);
  });

  const revalidate = useCallback(async () => {
    await mutate();
  }, [mutate]);

  const addStarter = useCallback(
    async (name: string) => {
      const id = ulid();
      await DB.write(
        sql`INSERT INTO starters (id, name, schedule, lastFed) VALUES (${id}, ${name}, null, null)`,
      );

      await revalidate();
    },
    [revalidate],
  );

  return {
    starters: data,
    error,
    isLoading: !data && !error,
    revalidate,
    mutate,
    addStarter,
  };
}
