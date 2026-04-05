import { eq, SQL } from "drizzle-orm";

import CreateAndUpdateRepository, {
  throwIfNull,
} from "./CreateAndUpdateRepository/index.js";
import { BaseSchema } from "./schema/index.js";

import dbSingleton from "./index.js";

export default class Repository<T extends BaseSchema> {
  db = dbSingleton;
  private createAndUpdate;
  constructor(private schema: T) {
    this.createAndUpdate = new CreateAndUpdateRepository(
      this.db.client,
      this.schema,
    );
  }

  addNew(newItem: T["$inferInsert"]) {
    return this.createAndUpdate.insertDoc(newItem);
  }

  updateById(id: number, updateItem: Partial<T["$inferInsert"]>) {
    return this.createAndUpdate
      .updateDoc(eq(this.schema.id, id), updateItem)
      .then((rows) => rows[0]);
  }
  updateByValue(where: SQL, updateItem: Partial<T["$inferInsert"]>) {
    return this.createAndUpdate.updateDoc(where, updateItem);
  }
  upsert(where: SQL, updateItem: T["$inferInsert"]) {
    return this.createAndUpdate.upsertDoc(where, updateItem);
  }
  getAll() {
    return this.db.client.select().from(this.schema);
  }
  getByValue(where: SQL) {
    const error = "Item was not found";
    return throwIfNull(
      this.db.client.select().from(this.schema).where(where) as Promise<
        T["$inferSelect"][]
      >,
      error,
    );
  }

  getById(id: number) {
    const where = eq(this.schema.id, id);
    return this.getByValue(where);
  }

  deleteByValue(where: SQL) {
    return throwIfNull(
      this.db.client
        .delete(this.schema)
        .where(where)
        .then((v) => (v.changes > 0 ? true : null)),
      "Item to delete was not found",
    );
  }

  deleteById(id: number) {
    return this.deleteByValue(eq(this.schema.id, id));
  }
}
