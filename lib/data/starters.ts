import useSWR, { useSWRConfig } from "swr";
import { DB, isResultSetError, sql } from "../db/db";
import { useCallback } from "react";
import { ulid } from "../ulid";
import { z } from "zod";
import { Starter, starterSchema } from "./starter";
import { keys } from "./keys";

const startersSchema = z.array(starterSchema);

export function useStarters() {
  const { data, error, mutate } = useSWR(keys.starters, async () => {
    const res = await DB.read(sql`SELECT * FROM starters`);
    if (isResultSetError(res)) {
      throw res.error;
    }
    return startersSchema.parse(res.rows);
  });

  const revalidate = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    starters: data,
    error,
    isLoading: !data && !error,
    revalidate,
    mutate,
  };
}

export function useAddStarter() {
  const { mutate } = useSWRConfig();
  return useCallback(
    async ({ name, instructions, lastFed, schedule }: Omit<Starter, "id">) => {
      const id = ulid();
      await DB.write(
        sql`INSERT INTO starters (id, name, instructions, schedule, lastFed) VALUES (${id}, ${name}, ${instructions}, ${schedule}, ${lastFed})`,
      );

      await Promise.all([mutate(keys.starters), mutate(keys.starter(id))]);

      return { id };
    },
    [mutate],
  );
}
