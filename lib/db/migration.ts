import { DB, IDB, isResultSetError, sql } from "./db";

const VERSION_KEY = "version";

async function getVersion(tx: IDB) {
  // We just always try to create the table to simplify the following logic.
  // With the `IF NOT EXISTS`, this is always going to succeed.
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

  const version = parseInt(
    versionResult.rows.length === 0 ? 0 : versionResult.rows[0].value,
    10,
  );
  return version;
}

export function migrateUp() {
  return DB.transaction(async (tx) => {
    const version = await getVersion(tx);
    console.log("current version", version);

    const migrations = MIGRATIONS.slice(version);
    console.log("migrations to do", migrations.length);
    for (const [version, migration] of migrations.entries()) {
      await migration.up(tx);
      await tx.write(
        sql`UPDATE meta SET value = ${version + 1} WHERE key = ${VERSION_KEY}`,
      );
    }
    console.log("now version", await getVersion(tx));
  });
}

export function migrateDown() {
  return DB.transaction(async (tx) => {
    const version = await getVersion(tx);
    console.log("current version", version);

    if (version === 0) {
      console.log("already at version 0");
      return;
    }

    const lastMigration = MIGRATIONS[version - 1];
    await lastMigration.down(tx);
    await tx.write(
      sql`UPDATE meta SET value = ${version - 1} WHERE key = ${VERSION_KEY}`,
    );

    console.log("now version", await getVersion(tx));
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
        sql`CREATE TABLE IF NOT EXISTS starters(id TEXT PRIMARY KEY, name TEXT, instructions TEXT, schedule TEXT, lastFed TEXT)`,
      );
    },
    down: async (tx) => {
      await tx.write(sql`DROP TABLE IF EXISTS starters`);
    },
  },
];
