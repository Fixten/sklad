import { Express } from "express";
import request from "supertest";

import DbSingleton from "@/db/index.js";
import { materialUsageSchema } from "@/features/materialUsage/materialUsage.schema.js";
import { productItemSchema } from "@/features/product/productItem.schema.js";
import { productTemplateSchema } from "@/features/product/productTemplate.schema.js";
import { supplyConsumptionSchema } from "@/features/supplyConsumption/supplyConsumption.schema.js";

import { bodyOf, listOf, Row } from "../e2eHelpers.js";
import { bootstrap, truncate } from "../e2eSetup.js";

interface CatalogVariant {
  id: number;
  name: string;
  unit: string;
}

async function createCatalog(app: Express, suffix = "", unit = "pieces") {
  const type = await request(app)
    .post("/api/material-type")
    .send({ name: `Wood${suffix}` });
  const typeId = bodyOf(type).id;
  const material = await request(app)
    .post("/api/material")
    .send({ name: "Oak", material_type_id: typeId });
  const materialId = bodyOf(material).id;
  const variant = await request(app)
    .post("/api/material-variant")
    .send({ name: "Oak plank", unit, material_id: materialId });
  return {
    typeId,
    materialId,
    variant: bodyOf(variant) as CatalogVariant,
  };
}

async function createSupplier(app: Express, name = "Lumber Co") {
  const res = await request(app).post("/api/supplier").send({ name });
  return bodyOf(res);
}

async function createReferencedSupplier(
  app: Express,
  name = "Lumber Co",
  suffix = "",
) {
  const { variant } = await createCatalog(app, suffix);
  const supplier = await createSupplier(app, name);
  const supply = await createSupply(app, {
    material_variant_id: variant.id,
    supplier_id: supplier.id,
    purchase_price: 100,
    quantity: 5,
  });
  return { ...supplier, supplyId: supply.id };
}

async function createSupply(
  app: Express,
  supply: Record<string, unknown>,
): Promise<Row> {
  return bodyOf(await request(app).post("/api/supply").send(supply));
}

async function consume(
  app: Express,
  supplyId: number,
  variantId: number,
  consumedQuantity: number,
) {
  const template = await DbSingleton.client
    .insert(productTemplateSchema)
    .values({ name: `Template for ${String(supplyId)}` })
    .returning();
  const item = await DbSingleton.client
    .insert(productItemSchema)
    .values({ product_template_id: template[0]!.id })
    .returning();
  const usage = await DbSingleton.client
    .insert(materialUsageSchema)
    .values({
      product_item_id: item[0]!.id,
      material_variant_id: variantId,
      actual_quantity: consumedQuantity,
    })
    .returning();
  await DbSingleton.client.insert(supplyConsumptionSchema).values({
    material_usage_id: usage[0]!.id,
    supply_id: supplyId,
    consumed_quantity: consumedQuantity,
  });
}

describe("supplier and supply e2e", () => {
  let app: Express;

  beforeAll(() => {
    app = bootstrap();
  });

  afterAll(() => {
    DbSingleton.close();
  });

  beforeEach(() => {
    truncate();
  });

  describe("suppliers", () => {
    test("creates, lists, reads and updates a supplier", async () => {
      const created = await createSupplier(app);

      const list = await request(app).get("/api/supplier");
      expect(listOf(list)).toHaveLength(1);

      const read = await request(app).get(
        `/api/supplier/${String(created.id)}`,
      );
      expect(read.status).toBe(200);
      expect(bodyOf(read).name).toBe("Lumber Co");

      const updated = await request(app)
        .patch(`/api/supplier/${String(created.id)}`)
        .send({ url: "https://lumber.example", contact: "+7 900 000-00-00" });
      expect(updated.status).toBe(200);
      expect(bodyOf(updated).url).toBe("https://lumber.example");
      expect(bodyOf(updated).contact).toBe("+7 900 000-00-00");
      expect(bodyOf(updated).description).toBeNull();
    });

    test("rejects an empty or blank required supplier name with 400", async () => {
      for (const name of ["", "   "]) {
        const res = await request(app).post("/api/supplier").send({ name });
        expect(res.status).toBe(400);
      }
    });

    test("rejects a name already used by another active supplier with 409", async () => {
      await createSupplier(app);
      const res = await request(app)
        .post("/api/supplier")
        .send({ name: "lumber co" });
      expect(res.status).toBe(409);
      expect(bodyOf(res).message).toBe("Name already exists");
    });

    test("allows a deleted name to be reused but not to be restored into", async () => {
      const created = await createReferencedSupplier(app);
      await request(app).delete(`/api/supplier/${String(created.id)}`);

      const recreated = await createSupplier(app);
      expect(recreated.id).not.toBe(created.id);

      const restored = await request(app).post(
        `/api/supplier/${String(created.id)}/restore`,
      );
      expect(restored.status).toBe(409);
      expect(bodyOf(restored).message).toBe("Name already exists");
    });

    test("rejects editing a soft-deleted supplier with 409", async () => {
      const created = await createReferencedSupplier(app);
      await request(app).delete(`/api/supplier/${String(created.id)}`);

      const res = await request(app)
        .patch(`/api/supplier/${String(created.id)}`)
        .send({ description: "late edit" });
      expect(res.status).toBe(409);
      expect(bodyOf(res).message).toBe("Item is deleted");
    });

    test("hard-deletes an unreferenced supplier and soft-deletes a referenced one", async () => {
      const unreferenced = await createSupplier(app);
      const hard = await request(app).delete(
        `/api/supplier/${String(unreferenced.id)}`,
      );
      expect(hard.status).toBe(200);
      expect(hard.body).toEqual({
        message: `${String(unreferenced.id)} deleted`,
      });
      expect(listOf(await request(app).get("/api/supplier"))).toHaveLength(0);

      const { variant } = await createCatalog(app);
      const referenced = await createSupplier(app, "Timber Co");
      await createSupply(app, {
        material_variant_id: variant.id,
        supplier_id: referenced.id,
        purchase_price: 100,
        quantity: 5,
      });
      const soft = await request(app).delete(
        `/api/supplier/${String(referenced.id)}`,
      );
      expect(soft.status).toBe(200);
      expect(soft.body).toEqual({
        message: `${String(referenced.id)} deleted`,
      });
      expect(listOf(await request(app).get("/api/supplier"))).toHaveLength(0);

      const restored = await request(app).post(
        `/api/supplier/${String(referenced.id)}/restore`,
      );
      expect(restored.status).toBe(200);
    });
  });

  describe("supplies", () => {
    test("creates a supply with decimal money and derives unit purchase cost", async () => {
      const { variant } = await createCatalog(app);
      const created = await createSupply(app, {
        material_variant_id: variant.id,
        purchase_price: "120.129",
        quantity: 10,
        description: "first batch",
      });

      expect(created.material_variant_id).toBe(variant.id);
      expect(created.purchase_price).toBe(120.12);
      expect(created.quantity).toBe(10);
      expect(created.unit).toBe("pieces");
      expect(created.remaining_quantity).toBe(10);
      expect(created.unit_purchase_cost).toBe(12.012);
    });

    test("keeps meter precision in thousandths and derives a fractional unit cost", async () => {
      const { variant } = await createCatalog(app, "", "meters");
      const created = await createSupply(app, {
        material_variant_id: variant.id,
        purchase_price: "125.50",
        quantity: "1.250",
      });

      expect(created.quantity).toBe(1.25);
      expect(created.remaining_quantity).toBe(1.25);
      expect(created.unit_purchase_cost).toBe(100.4);
    });

    test("lists supplies and filters them by variant and supplier", async () => {
      const { variant } = await createCatalog(app);
      const supplier = await createSupplier(app);
      await createSupply(app, {
        material_variant_id: variant.id,
        supplier_id: supplier.id,
        purchase_price: 100,
        quantity: 5,
      });
      const other = await createCatalog(app, "2");
      await createSupply(app, {
        material_variant_id: other.variant.id,
        purchase_price: 100,
        quantity: 5,
      });

      expect(listOf(await request(app).get("/api/supply"))).toHaveLength(2);
      expect(
        listOf(
          await request(app).get(
            `/api/supply?material_variant_id=${String(variant.id)}`,
          ),
        ),
      ).toHaveLength(1);
      expect(
        listOf(
          await request(app).get(
            `/api/supply?supplier_id=${String(supplier.id)}`,
          ),
        ),
      ).toHaveLength(1);
      expect(
        (await request(app).get("/api/supply?material_variant_id=abc")).status,
      ).toBe(400);
    });

    test("rejects a supply for a missing or deleted variant", async () => {
      const missing = await request(app)
        .post("/api/supply")
        .send({ material_variant_id: 999, purchase_price: 120, quantity: 10 });
      expect(missing.status).toBe(404);

      const hardDeleted = await createCatalog(app);
      const gone = await request(app).delete(
        `/api/material-variant/${String(hardDeleted.variant.id)}`,
      );
      expect(gone.status).toBe(200);

      const softDeleted = await createCatalog(app, "2");
      await createSupply(app, {
        material_variant_id: softDeleted.variant.id,
        purchase_price: 120,
        quantity: 10,
      });
      await request(app).delete(
        `/api/material-variant/${String(softDeleted.variant.id)}`,
      );

      const deleted = await request(app).post("/api/supply").send({
        material_variant_id: softDeleted.variant.id,
        purchase_price: 120,
        quantity: 10,
      });
      expect(deleted.status).toBe(409);
      expect(bodyOf(deleted).message).toBe("Referenced record is deleted");
    });

    test("rejects an empty required variant with 400", async () => {
      const res = await request(app)
        .post("/api/supply")
        .send({ material_variant_id: "", purchase_price: 120, quantity: 10 });
      expect(res.status).toBe(400);
    });

    test("rejects a non-positive quantity and a negative price", async () => {
      const { variant } = await createCatalog(app);

      const zero = await request(app).post("/api/supply").send({
        material_variant_id: variant.id,
        purchase_price: 120,
        quantity: 0,
      });
      expect(zero.status).toBe(400);
      expect(bodyOf(zero).message).toBe("Quantity must be greater than zero");

      const negative = await request(app).post("/api/supply").send({
        material_variant_id: variant.id,
        purchase_price: "-1",
        quantity: 1,
      });
      expect(negative.status).toBe(400);
      expect(bodyOf(negative).message).toBe("Price cannot be negative");
    });

    test("rejects quantities exceeding the precision of the variant unit", async () => {
      const { variant } = await createCatalog(app);
      const fractional = await request(app).post("/api/supply").send({
        material_variant_id: variant.id,
        purchase_price: 120,
        quantity: 1.5,
      });
      expect(fractional.status).toBe(400);
      expect(bodyOf(fractional).message).toBe(
        "Value has more decimal places than allowed",
      );

      const meters = await createCatalog(app, "2", "meters");
      const tooPrecise = await request(app).post("/api/supply").send({
        material_variant_id: meters.variant.id,
        purchase_price: 120,
        quantity: "1.2500",
      });
      expect(tooPrecise.status).toBe(400);
    });

    test("updates, deletes and restores a supply", async () => {
      const { variant } = await createCatalog(app);
      const created = await createSupply(app, {
        material_variant_id: variant.id,
        purchase_price: 120,
        quantity: 10,
      });

      const read = await request(app).get(`/api/supply/${String(created.id)}`);
      expect(read.status).toBe(200);

      const updated = await request(app)
        .patch(`/api/supply/${String(created.id)}`)
        .send({ quantity: 7 });
      expect(updated.status).toBe(200);
      expect(bodyOf(updated).quantity).toBe(7);
      expect(bodyOf(updated).remaining_quantity).toBe(7);

      await consume(app, created.id, variant.id, 1);

      const deleted = await request(app).delete(
        `/api/supply/${String(created.id)}`,
      );
      expect(deleted.status).toBe(200);
      expect(deleted.body).toEqual({
        message: `${String(created.id)} deleted`,
      });
      expect(listOf(await request(app).get("/api/supply"))).toHaveLength(0);

      const restored = await request(app).post(
        `/api/supply/${String(created.id)}/restore`,
      );
      expect(restored.status).toBe(200);
      expect(bodyOf(restored).deleted_at).toBeFalsy();
      expect(listOf(await request(app).get("/api/supply"))).toHaveLength(1);
    });

    test("hard-deletes an unreferenced supply and soft-deletes a referenced one", async () => {
      const free = await createCatalog(app, "Free");
      const unreferenced = await createSupply(app, {
        material_variant_id: free.variant.id,
        purchase_price: 100,
        quantity: 5,
      });
      const hardDeleted = await request(app).delete(
        `/api/supply/${String(unreferenced.id)}`,
      );
      expect(hardDeleted.status).toBe(200);
      expect(bodyOf(hardDeleted).message).toBe(
        `${String(unreferenced.id)} deleted`,
      );
      expect(
        (await request(app).get(`/api/supply/${String(unreferenced.id)}`))
          .status,
      ).toBe(404);
      expect(
        (
          await request(app).post(
            `/api/supply/${String(unreferenced.id)}/restore`,
          )
        ).status,
      ).toBe(404);

      const used = await createCatalog(app, "Used");
      const referenced = await createSupply(app, {
        material_variant_id: used.variant.id,
        purchase_price: 100,
        quantity: 5,
      });
      await consume(app, referenced.id, used.variant.id, 1);

      const softDeleted = await request(app).delete(
        `/api/supply/${String(referenced.id)}`,
      );
      expect(softDeleted.status).toBe(200);
      const read = await request(app).get(
        `/api/supply/${String(referenced.id)}`,
      );
      expect(read.status).toBe(200);
      expect(bodyOf(read).deleted_at).toBeTruthy();

      const restored = await request(app).post(
        `/api/supply/${String(referenced.id)}/restore`,
      );
      expect(restored.status).toBe(200);
      expect(bodyOf(restored).deleted_at).toBeFalsy();
    });

    test("moves an unconsumed supply to another variant and rescales it", async () => {
      const { variant: pieces } = await createCatalog(app);
      const meters = await createCatalog(app, "2", "meters");
      const created = await createSupply(app, {
        material_variant_id: pieces.id,
        purchase_price: 120,
        quantity: 2,
      });

      const moved = await request(app)
        .patch(`/api/supply/${String(created.id)}`)
        .send({ material_variant_id: meters.variant.id, quantity: "1.500" });
      expect(moved.status).toBe(200);
      expect(bodyOf(moved).material_variant_id).toBe(meters.variant.id);
      expect(bodyOf(moved).unit).toBe("meters");
      expect(bodyOf(moved).quantity).toBe(1.5);

      const read = await request(app).get(`/api/supply/${String(created.id)}`);
      expect(bodyOf(read).material_variant_id).toBe(meters.variant.id);
      expect(bodyOf(read).unit).toBe("meters");
      expect(bodyOf(read).quantity).toBe(1.5);
    });

    test("requires a quantity when the move changes the unit", async () => {
      const { variant: pieces } = await createCatalog(app);
      const meters = await createCatalog(app, "2", "meters");
      const created = await createSupply(app, {
        material_variant_id: pieces.id,
        purchase_price: 120,
        quantity: 2,
      });

      const moved = await request(app)
        .patch(`/api/supply/${String(created.id)}`)
        .send({ material_variant_id: meters.variant.id });
      expect(moved.status).toBe(409);
      expect(bodyOf(moved).message).toBe(
        "Quantity is required when moving a supply to a variant with a different unit",
      );

      const read = await request(app).get(`/api/supply/${String(created.id)}`);
      expect(bodyOf(read).material_variant_id).toBe(pieces.id);
      expect(bodyOf(read).quantity).toBe(2);
    });

    test("moves a supply to a variant of the same unit without a quantity", async () => {
      const first = await createCatalog(app);
      const second = await createCatalog(app, "Birch");
      const created = await createSupply(app, {
        material_variant_id: first.variant.id,
        purchase_price: 120,
        quantity: 2,
      });

      const moved = await request(app)
        .patch(`/api/supply/${String(created.id)}`)
        .send({ material_variant_id: second.variant.id });
      expect(moved.status).toBe(200);
      expect(bodyOf(moved).material_variant_id).toBe(second.variant.id);
      expect(bodyOf(moved).quantity).toBe(2);
    });

    test("rejects a missing supplier but accepts a soft-deleted one", async () => {
      const { variant } = await createCatalog(app);

      const missing = await request(app).post("/api/supply").send({
        material_variant_id: variant.id,
        purchase_price: 10,
        quantity: 1,
        supplier_id: 999,
      });
      expect(missing.status).toBe(404);
      expect(bodyOf(missing).message).toBe("Item was not found");

      const gone = await createReferencedSupplier(app, "Plywood Co", "Birch");
      await request(app).delete(`/api/supplier/${String(gone.id)}`);

      const created = await request(app).post("/api/supply").send({
        material_variant_id: variant.id,
        purchase_price: 10,
        quantity: 1,
        supplier_id: gone.id,
      });
      expect(created.status).toBe(200);
      expect(bodyOf(created).supplier_id).toBe(gone.id);

      const switching = await request(app)
        .patch(`/api/supply/${String(gone.supplyId)}`)
        .send({ supplier_id: 999 });
      expect(switching.status).toBe(404);
      expect(bodyOf(switching).message).toBe("Item was not found");
    });

    test("keeps a supply editable while its supplier is deleted", async () => {
      const supplier = await createReferencedSupplier(app, "Plywood Co");
      await request(app).delete(`/api/supplier/${String(supplier.id)}`);

      const res = await request(app)
        .patch(`/api/supply/${String(supplier.supplyId)}`)
        .send({ description: "late edit" });
      expect(res.status).toBe(200);
      expect(bodyOf(res).description).toBe("late edit");
      expect(bodyOf(res).supplier_id).toBe(supplier.id);
    });

    test("rejects editing a soft-deleted supply with 409", async () => {
      const { variant } = await createCatalog(app);
      const created = await createSupply(app, {
        material_variant_id: variant.id,
        purchase_price: 120,
        quantity: 10,
      });
      await consume(app, created.id, variant.id, 1);
      await request(app).delete(`/api/supply/${String(created.id)}`);

      const res = await request(app)
        .patch(`/api/supply/${String(created.id)}`)
        .send({ quantity: 5 });
      expect(res.status).toBe(409);
      expect(bodyOf(res).message).toBe("Item is deleted");
    });

    test("keeps remaining stock in step with consumption and reports it per variant", async () => {
      const { variant } = await createCatalog(app);
      const supply = await createSupply(app, {
        material_variant_id: variant.id,
        purchase_price: 100,
        quantity: 10,
      });
      await consume(app, supply.id, variant.id, 4);

      const read = await request(app).get(`/api/supply/${String(supply.id)}`);
      expect(bodyOf(read).remaining_quantity).toBe(6);

      const stock = await request(app).get(
        `/api/supply/stock/${String(variant.id)}`,
      );
      expect(stock.status).toBe(200);
      expect(bodyOf(stock).quantity).toBe(6);
      expect(bodyOf(stock).unit).toBe("pieces");

      const deleted = await request(app).delete(
        `/api/supply/${String(supply.id)}`,
      );
      expect(deleted.status).toBe(200);

      const afterDelete = await request(app).get(
        `/api/supply/stock/${String(variant.id)}`,
      );
      expect(bodyOf(afterDelete).quantity).toBe(0);
    });

    test("reads the stock of a soft-deleted variant", async () => {
      const { variant } = await createCatalog(app);
      await createSupply(app, {
        material_variant_id: variant.id,
        purchase_price: 10,
        quantity: 1,
      });
      await request(app).delete(`/api/material-variant/${String(variant.id)}`);

      const res = await request(app).get(
        `/api/supply/stock/${String(variant.id)}`,
      );
      expect(res.status).toBe(200);
      expect(bodyOf(res).quantity).toBe(1);
      expect(bodyOf(res).unit).toBe("pieces");
    });

    test("reports zero stock for a variant without supplies", async () => {
      const { variant } = await createCatalog(app, "", "meters");
      const stock = await request(app).get(
        `/api/supply/stock/${String(variant.id)}`,
      );
      expect(stock.status).toBe(200);
      expect(bodyOf(stock).quantity).toBe(0);
      expect(bodyOf(stock).unit).toBe("meters");
    });

    test("rejects correcting a quantity below the already consumed amount", async () => {
      const { variant } = await createCatalog(app);
      const supply = await createSupply(app, {
        material_variant_id: variant.id,
        purchase_price: 100,
        quantity: 10,
      });
      await consume(app, supply.id, variant.id, 4);

      const res = await request(app)
        .patch(`/api/supply/${String(supply.id)}`)
        .send({ quantity: 3 });
      expect(res.status).toBe(409);
      expect(bodyOf(res).message).toBe(
        "Quantity cannot be lower than the already consumed amount",
      );

      const read = await request(app).get(`/api/supply/${String(supply.id)}`);
      expect(bodyOf(read).quantity).toBe(10);
    });

    test("rejects moving a consumed supply to another variant", async () => {
      const { variant } = await createCatalog(app);
      const other = await createCatalog(app, "2", "meters");
      const supply = await createSupply(app, {
        material_variant_id: variant.id,
        purchase_price: 100,
        quantity: 10,
      });
      await consume(app, supply.id, variant.id, 4);

      const res = await request(app)
        .patch(`/api/supply/${String(supply.id)}`)
        .send({ material_variant_id: other.variant.id });
      expect(res.status).toBe(409);
      expect(bodyOf(res).message).toBe(
        "Material variant cannot be changed after the supply was consumed",
      );
    });

    test("rejects a unit change on a variant that has supplies", async () => {
      const { variant } = await createCatalog(app);
      await createSupply(app, {
        material_variant_id: variant.id,
        purchase_price: 100,
        quantity: 5,
      });

      const res = await request(app)
        .patch(`/api/material-variant/${String(variant.id)}`)
        .send({ unit: "meters" });
      expect(res.status).toBe(400);
      expect(bodyOf(res).message).toBe(
        "Unit cannot be changed after historical usage",
      );
    });

    test("soft-deletes a used variant and hard-deletes an unused one", async () => {
      const used = await createCatalog(app);
      await createSupply(app, {
        material_variant_id: used.variant.id,
        purchase_price: 100,
        quantity: 5,
      });
      await request(app).delete(
        `/api/material-variant/${String(used.variant.id)}`,
      );
      expect(
        listOf(await request(app).get("/api/material-variant")),
      ).toHaveLength(0);
      expect(
        (
          await request(app).get(
            `/api/material-variant/${String(used.variant.id)}`,
          )
        ).status,
      ).toBe(200);

      const unused = await createCatalog(app, "2");
      await request(app).delete(
        `/api/material-variant/${String(unused.variant.id)}`,
      );
      expect(
        listOf(await request(app).get("/api/material-variant")),
      ).toHaveLength(0);
      expect(
        (
          await request(app).get(
            `/api/material-variant/${String(unused.variant.id)}`,
          )
        ).status,
      ).toBe(404);

      const recreated = await request(app).post("/api/material-variant").send({
        name: "Oak plank",
        unit: "pieces",
        material_id: unused.materialId,
      });
      expect(recreated.status).toBe(200);
    });
  });
});
