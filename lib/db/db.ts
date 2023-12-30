import {
  openDatabase,
  type Query,
  type SQLiteDatabase,
  ResultSet,
  ResultSetError,
} from "expo-sqlite";
import SQL from "@nearform/sql";

/** An injection-safe SQL query wrapper.
 *
 * ```ts
 * DB.write(sql`INSERT INTO users(name) VALUES(${name})`);
 * ```
 */
export function sql(strings: any, ...values: any[]): Query {
  const statement = SQL(strings, ...values);
  return {
    sql: statement.text,
    args: statement.values,
  };
}

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
  read: (query: Query) => Promise<ResultSet | ResultSetError>;
  write: (query: Query) => Promise<ResultSet | ResultSetError>;
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
    const db = await connection();
    const results = await db.execAsync([query], false);
    return results[0];
  },
  async write(query) {
    const db = await connection();
    const results = await db.execAsync([query], true);
    return results[0];
  },
  async transaction(cb) {
    const db = await connection();
    return db.transactionAsync((tx) => {
      const wrappedExecute = (query: Query) => {
        return tx.executeSqlAsync(query.sql, query.args as any[]);
      };
      const wrappedTx = {
        read: wrappedExecute,
        write: wrappedExecute,
      };
      return cb(wrappedTx);
    });
  },
};
