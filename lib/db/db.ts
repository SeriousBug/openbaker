import {
  openDatabase,
  type Query,
  type SQLiteDatabase,
  ResultSet,
  ResultSetError,
} from "expo-sqlite";
import SQL, { SqlStatement } from "@nearform/sql";
import { Log } from "../log";

/** An injection-safe SQL query wrapper.
 *
 * ```ts
 * DB.write(sql`INSERT INTO users(name) VALUES(${name})`);
 * ```
 */
export const sql = SQL;

export function isResultSetError(
  result: ResultSet | ResultSetError,
): result is ResultSetError {
  return "error" in result;
}

export function isResultSet(
  result: ResultSet | ResultSetError,
): result is ResultSet {
  return !isResultSetError(result);
}

const DB_NAME = "openbaker.db";

export type IDB = {
  read: (query: SqlStatement) => Promise<ResultSet | ResultSetError>;
  write: (query: SqlStatement) => Promise<ResultSet | ResultSetError>;
};
export type IDBTx = IDB & {
  transaction: (cb: (tx: IDB) => Promise<void>) => Promise<void>;
};

let db: SQLiteDatabase | undefined;
async function connection() {
  if (!db) {
    db = openDatabase(DB_NAME);
  }
  return db;
}

export const DB: IDBTx = {
  async read(query) {
    return Log.span("DB.read", async () => {
      const db = await connection();
      Log.event("DB.read.query", { query: query.sql, values: query.values });
      const results = await db.execAsync(
        [{ sql: query.sql, args: query.values }],
        true,
      );
      Log.event("DB.read.results", { results });
      return results[0];
    });
  },
  async write(query) {
    return Log.span("DB.write", async () => {
      const db = await connection();
      Log.event("DB.write.query", { query: query.sql, values: query.values });
      const results = await db.execAsync(
        [{ sql: query.sql, args: query.values }],
        false,
      );
      Log.event("DB.write.results", { results });
      return results[0];
    });
  },
  async transaction(cb) {
    return Log.span("DB.transaction", async () => {
      const db = await connection();
      return db.transactionAsync((tx) => {
        const wrappedExecute = (query: SqlStatement) => {
          Log.event("DB.transaction.query", { query: query.sql });
          return tx.executeSqlAsync(query.sql, query.values);
        };
        const wrappedTx = {
          read: wrappedExecute,
          write: wrappedExecute,
        };
        return cb(wrappedTx);
      });
    });
  },
};
