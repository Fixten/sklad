import { sql } from "drizzle-orm";

import DbSingleton, { Db } from "@/db/index.js";
import { createSingleton } from "@/utils/createSingleton.js";

export default class HealthRepository {
  static getSingleton = createSingleton(() => new HealthRepository());

  constructor(private db: Db<Record<string, unknown>> = DbSingleton) {}

  ping() {
    this.db.client.get(sql`SELECT 1`);
  }
}
