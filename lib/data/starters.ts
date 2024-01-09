import useSWR, { useSWRConfig } from "swr";
import { DB, isResultSetError, sql } from "../db/db";
import { useCallback } from "react";
import { ulid } from "../ulid";
import { z } from "zod";
import { Starter, starterSchema } from "./starter";
import { keys } from "./keys";

const startersSchema = z.array(starterSchema);

export async function getAllStarters() {
  const res = await DB.read(sql`SELECT * FROM starters`);
  if (isResultSetError(res)) {
    throw res.error;
  }
  return startersSchema.parse(res.rows);
}

export function useStarters() {
  const { data, error, mutate } = useSWR(keys.starters, async () => {
    return getAllStarters();
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
