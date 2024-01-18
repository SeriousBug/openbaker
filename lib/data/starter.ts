import useSWR, { useSWRConfig } from "swr";
import { DB, isResultSetError, sql } from "../db/db";
import { useCallback } from "react";
import { z } from "zod";
import { keys } from "./keys";
import { rescheduleAllNotifications } from "../notification";
import { ulid } from "../ulid";
import { Starter, starterSchema } from "./starterSchema";
import { Log } from "../log";
import SQL from "@nearform/sql";

export function useStarter({ id }: { id: string }) {
  const { data, error, mutate } = useSWR(keys.starter(id), async () => {
    return Log.span("useStarter", async () => {
      const res = await DB.read(
        sql`SELECT * FROM starters WHERE id = ${id} LIMIT 1`,
      );
      if (isResultSetError(res)) {
        throw res.error;
      }
      return starterSchema.parse(res.rows[0]);
    });
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
      await DB.write(sql`DELETE FROM starters WHERE id = ${id}`);
      await Promise.all([mutate(keys.starters), mutate(keys.starter(id))]);
      rescheduleAllNotifications();
    },
    [mutate],
  );
}

export function useFeedStarter() {
  const { mutate } = useSWRConfig();
  return useCallback(
    async ({ id, newFeeding }: { id: string; newFeeding: string }) => {
      await DB.write(
        sql`UPDATE starters SET lastFed = ${newFeeding} WHERE id = ${id}`,
      );
      await Promise.all([mutate(keys.starters), mutate(keys.starter(id))]);
      rescheduleAllNotifications();
    },
    [mutate],
  );
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
      rescheduleAllNotifications();

      return { id };
    },
    [mutate],
  );
}

export function useUpdateStarter() {
  const { mutate } = useSWRConfig();
  return useCallback(
    async (id: string, starter: Partial<Starter>) => {
      const expressions = [];
      // Ew. Maybe I should look into a query builder library.
      if (starter.name) {
        expressions.push(sql`name = ${starter.name}`);
      }
      if (starter.instructions) {
        expressions.push(sql`instructions = ${starter.instructions}`);
      }
      if (starter.schedule) {
        expressions.push(sql`schedule = ${starter.schedule}`);
      }
      if (starter.lastFed) {
        expressions.push(sql`lastFed = ${starter.lastFed}`);
      }

      await DB.write(
        sql`UPDATE starters SET ${SQL.glue(expressions, ",")} WHERE id = ${id}`,
      );
      await Promise.all([mutate(keys.starters), mutate(keys.starter(id))]);
    },
    [mutate],
  );
}
