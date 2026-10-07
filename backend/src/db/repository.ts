import { and, eq, isNull, SQL } from "drizzle-orm";

import { ErrorMessages } from "@/constants/Errors.js";

import CreateAndUpdateRepository, {
  throwIfNull,
} from "./CreateAndUpdateRepository/index.js";
import { BaseSchema } from "./schema/index.js";

import singleton, { Db } from "./index.js";

// typescript-eslint sees Partial<T["$inferInsert"]> as {} because of Partial
/* eslint-disable @typescript-eslint/no-generated-empty-object-type */
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
    const [row] = this.createAndUpdate.updateDoc(
      eq(this.schema.id, id),
      updateItem,
    );
    if (!row) throw new Error(ErrorMessages.ITEM_NOT_FOUND);
    return row;
  }
  upsert(id: number, updateItem: T["$inferInsert"]) {
    return this.createAndUpdate.upsertDoc(this.schema.id, {
      ...updateItem,
      id,
    });
  }

  transaction<T>(operation: () => T): T {
    return this.db.client.transaction(operation, { behavior: "immediate" });
  }

  getAll() {
    return this.db.client.select().from(this.schema).all();
  }
  getAllActive() {
    return this.db.client
      .select()
      .from(this.schema)
      .where(isNull(this.schema.deleted_at))
      .all();
  }
  getByValue(where: SQL) {
    return this.db.client.select().from(this.schema).where(where).all();
  }
  getActiveByValue(where: SQL) {
    return this.db.client
      .select()
      .from(this.schema)
      .where(and(where, isNull(this.schema.deleted_at)))
      .all();
  }

  getById(id: number) {
    const row = this.db.client
      .select()
      .from(this.schema)
      .where(eq(this.schema.id, id))
      .get();
    if (!row) throw new Error(ErrorMessages.ITEM_NOT_FOUND);
    return row;
  }

  deleteByValue(where: SQL) {
    const { changes } = this.db.client.delete(this.schema).where(where).run();
    return throwIfNull(
      changes > 0 ? true : null,
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

  restore(id: number) {
    return this.updateById(id, {
      deleted_at: null,
    } as Partial<T["$inferInsert"]>);
  }
}
