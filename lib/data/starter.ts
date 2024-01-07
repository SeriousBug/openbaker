import useSWR, { useSWRConfig } from "swr";
import { DB, isResultSetError, sql } from "../db/db";
import { useCallback } from "react";
import { z } from "zod";
import { keys } from "./keys";
import SQL from "@nearform/sql";

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

export function useDeleteStarter() {
  const { mutate } = useSWRConfig();
  return useCallback(
    async (id: string) => {
      console.log("deleting", id);
      await DB.write(sql`DELETE FROM starters WHERE id = ${id}`);
      await Promise.all([mutate(keys.starters), mutate(keys.starter(id))]);
    },
    [mutate],
  );
}

// export function useUpdateStarter() {
//   const { mutate } = useSWRConfig();
//   return useCallback(
//     async (id: string, starter: Partial<Starter>) => {
//       const updateStatement = sql``
//       await DB.write(
//         sql`UPDATE starters SET ${sql(starter)} WHERE id = ${id} RETURNING *`,
//       );
//       await Promise.all([mutate(keys.starters), mutate(keys.starter(id))]);
//     },
//     [mutate],
//   );
// }
