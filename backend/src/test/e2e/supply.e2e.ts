import { Express } from "express";
import request from "supertest";

import DbSingleton from "@/db/index.js";

import { bodyOf, listOf, Row } from "../e2eHelpers.js";
import { bootstrap, truncate } from "../e2eSetup.js";

interface Supplier extends Row {
  supplier: string;
}

interface CatalogVariant {
  id: number;
  name: string;
  unit: string;
}

async function createCatalog(app: Express, suffix = "") {
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
    .send({ name: "Oak plank", unit: "pieces", material_id: materialId });
  return {
    typeId,
    materialId,
    variant: bodyOf(variant) as CatalogVariant,
  };
}

async function createSupplier(app: Express, name = "Lumber Co") {
  const res = await request(app).post("/api/supplier").send({ supplier: name });
  return bodyOf(res) as Supplier;
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
    test("creates, lists and updates a supplier", async () => {
      const created = await createSupplier(app);

      const list = await request(app).get("/api/supplier");
      expect(listOf(list)).toHaveLength(1);

      const updated = await request(app)
        .post(`/api/supplier/${String(created.id)}`)
        .send({ supply_url: "https://lumber.example" });
      expect(updated.status).toBe(200);
      expect(bodyOf(updated).supply_url).toBe("https://lumber.example");
    });

    test("rejects an empty or blank required supplier name with 400", async () => {
      for (const supplier of ["", "   "]) {
        const res = await request(app).post("/api/supplier").send({ supplier });
        expect(res.status).toBe(400);
      }
    });

    test("hard-deletes an unreferenced supplier and soft-deletes a referenced one", async () => {
      const unreferenced = await createSupplier(app);
      const hard = await request(app).delete(`/api/supplier/${String(unreferenced.id)}`);
      expect(hard.status).toBe(200);
      expect(hard.body).toEqual({ message: `${String(unreferenced.id)} deleted` });
      expect(listOf(await request(app).get("/api/supplier"))).toHaveLength(0);

      const { variant } = await createCatalog(app);
      const referenced = await createSupplier(app, "Timber Co");
      await request(app)
        .post("/api/supply")
        .send({
          variant: variant.id,
          supplier: referenced.id,
          price: 100,
          count: 5,
        });
      const soft = await request(app).delete(`/api/supplier/${String(referenced.id)}`);
      expect(soft.status).toBe(200);
      expect(soft.body).toEqual({ message: `${String(referenced.id)} deleted` });
      expect(listOf(await request(app).get("/api/supplier"))).toHaveLength(0);
    });
  });

  describe("supplies", () => {
    test("creates a supply referencing a variant and lists it", async () => {
      const { variant } = await createCatalog(app);
      const created = await request(app)
        .post("/api/supply")
        .send({ variant: variant.id, price: 120, count: 10 });
      expect(created.status).toBe(200);
      expect(bodyOf(created).variant).toBe(variant.id);

      const list = await request(app).get("/api/supply");
      expect(listOf(list)).toHaveLength(1);
    });

    test("rejects a supply with a missing variant with 409", async () => {
      const res = await request(app)
        .post("/api/supply")
        .send({ variant: 999, price: 120, count: 10 });
      expect(res.status).toBe(409);
    });

    test("rejects an empty required variant with 400", async () => {
      const res = await request(app)
        .post("/api/supply")
        .send({ variant: "", price: 120, count: 10 });
      expect(res.status).toBe(400);
    });

    test("updates and deletes a supply", async () => {
      const { variant } = await createCatalog(app);
      const created = bodyOf(
        await request(app)
          .post("/api/supply")
          .send({ variant: variant.id, price: 120, count: 10 }),
      );

      const updated = await request(app)
        .post(`/api/supply/${String(created.id)}`)
        .send({ count: 7 });
      expect(updated.status).toBe(200);
      expect(bodyOf(updated).count).toBe(7);

      const deleted = await request(app).delete(`/api/supply/${String(created.id)}`);
      expect(deleted.status).toBe(200);
      expect(deleted.body).toEqual({ message: `${String(created.id)} deleted` });
      expect(listOf(await request(app).get("/api/supply"))).toHaveLength(0);
    });

    test("rejects a unit change on a variant that has supplies", async () => {
      const { variant } = await createCatalog(app);
      await request(app)
        .post("/api/supply")
        .send({ variant: variant.id, price: 100, count: 5 });

      const res = await request(app)
        .patch(`/api/material-variant/${String(variant.id)}`)
        .send({ unit: "meters" });
      expect(res.status).toBe(400);
      expect(bodyOf(res).message).toBe("Unit cannot be changed after historical usage");
    });

    test("soft-deletes a used variant and hard-deletes an unused one", async () => {
      const used = await createCatalog(app);
      await request(app)
        .post("/api/supply")
        .send({ variant: used.variant.id, price: 100, count: 5 });
      await request(app).delete(`/api/material-variant/${String(used.variant.id)}`);
      expect(listOf(await request(app).get("/api/material-variant"))).toHaveLength(0);
      expect(
        (await request(app).get(`/api/material-variant/${String(used.variant.id)}`))
          .status,
      ).toBe(200);

      const unused = await createCatalog(app, "2");
      await request(app).delete(`/api/material-variant/${String(unused.variant.id)}`);
      expect(listOf(await request(app).get("/api/material-variant"))).toHaveLength(0);
      expect(
        (await request(app).get(`/api/material-variant/${String(unused.variant.id)}`))
          .status,
      ).toBe(404);

      const recreated = await request(app)
        .post("/api/material-variant")
        .send({
          name: "Oak plank",
          unit: "pieces",
          material_id: unused.materialId,
        });
      expect(recreated.status).toBe(200);
    });
  });
});