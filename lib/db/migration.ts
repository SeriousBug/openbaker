import { DB, IDB, isResultSetError, sql } from "./db";

const VERSION_KEY = "version";

export function migrateUp() {
  return DB.transaction(async (tx) => {
    await tx.write(
      sql`CREATE TABLE IF NOT EXISTS meta(key TEXT PRIMARY KEY, value TEXT)`,
    );
    const versionResult = await tx.write(
      sql`SELECT value FROM meta WHERE key = ${VERSION_KEY}`,
    );
    if (isResultSetError(versionResult)) {
      console.error(versionResult.error);
      throw versionResult.error;
    }

    console.log(versionResult);
    console.log("length", versionResult.rows.length);
    const version = parseInt(
      versionResult.rows.length === 0 ? 0 : versionResult.rows[0].value,
      10,
    );
    console.log("version", version);

    const migrations = MIGRATIONS.slice(version);
    console.log("migrations to do", migrations.length);
    for (const [version, migration] of migrations.entries()) {
      await migration.up(tx);
      await tx.write(
        sql`UPDATE meta SET value = ${version} WHERE key = ${VERSION_KEY}`,
      );
    }
  });
}

type Migration = {
  up: (tx: IDB) => Promise<void>;
  down: (tx: IDB) => Promise<void>;
};

/** **NEVER** reorder or delete any of these. Or migrations will be broken. */
const MIGRATIONS: Migration[] = [
  {
    up: async (tx) => {
      await tx.write(
        sql`INSERT INTO meta(key, value) VALUES(${VERSION_KEY}, 1)`,
      );
    },
    down: async (tx) => {
      await tx.write(sql`DELETE FROM meta WHERE key = ${VERSION_KEY}`);
    },
  },
];
