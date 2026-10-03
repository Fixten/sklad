import { ErrorMessages } from "@/constants/Errors.js";
import DbSingleton from "@/db/index.js";
import {
  applyMigrations,
  backupDatabase,
  getBackupsPath,
  hasPendingMigrations,
} from "@/db/migrate.js";
import { Logger } from "@/utils/logger.js";

const DEFAULT_KEEP = 5;

async function migrateProd(): Promise<void> {
  DbSingleton.init();
  const db = DbSingleton.base;
  if (!db) throw new Error(ErrorMessages.NO_DB_CONNECTION);

  if (!hasPendingMigrations(db)) {
    Logger.log("No pending migrations; nothing to do");
    return;
  }

  const file = await backupDatabase(db, getBackupsPath(), DEFAULT_KEEP);

  applyMigrations(DbSingleton.client);
  Logger.log(`Migrations applied; backup written to ${file}`);
}

migrateProd().catch((error: unknown) => {
  Logger.error("Migrations failed", error);
  process.exit(1);
});
