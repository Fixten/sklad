import { eq, isNull, SQL } from "drizzle-orm";

import { ErrorMessages } from "@/constants/Errors.js";

import CreateAndUpdateRepository, {
  throwIfNull,
} from "./CreateAndUpdateRepository/index.js";
import { BaseSchema } from "./schema/index.js";

import singleton, { Db } from "./index.js";

export default class Repository<T extends BaseSchema> {
  private createAndUpdate;
  constructor(
    private schema: T,
    private db: Db<Record<string, unknown>> = singleton,
  ) {
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
  getAllActive() {
    return this.db.client
      .select()
      .from(this.schema)
      .where(isNull(this.schema.deleted_at));
  }
  getByValue(where: SQL) {
    return this.db.client.select().from(this.schema).where(where) as Promise<
      T["$inferSelect"][]
    >;
  }

  async getById(id: number) {
    const where = eq(this.schema.id, id);
    const rows = await this.getByValue(where);
    if (rows.length === 0) throw new Error(ErrorMessages.ITEM_NOT_FOUND);
    return rows[0];
  }

  deleteByValue(where: SQL) {
    return throwIfNull(
      this.db.client
        .delete(this.schema)
        .where(where)
        .then((v) => (v.changes > 0 ? true : null)),
      ErrorMessages.ITEM_TO_DELETE_NOT_FOUND,
    );
  }

  deleteById(id: number) {
    return this.deleteByValue(eq(this.schema.id, id));
  }

  softDelete(id: number) {
    return this.updateById(id, {
      deleted_at: new Date(),
    } as Partial<T["$inferInsert"]>);
  }
}
