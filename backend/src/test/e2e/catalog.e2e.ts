import { Express } from "express";
import request from "supertest";

import DbSingleton from "@/db/index.js";

import { bodyOf, listOf, Row } from "../e2eHelpers.js";
import { bootstrap, truncate } from "../e2eSetup.js";

interface MaterialType extends Row {
  name: string;
}

interface Material extends Row {
  name: string;
  material_type_id: number;
}

interface MaterialVariant extends Row {
  name: string;
  unit: string;
  material_id: number;
}

async function createTypeApp(app: Express, name = "Wood") {
  return request(app).post("/api/material-type").send({ name });
}

async function createType(app: Express, name = "Wood") {
  return bodyOf(await createTypeApp(app, name)) as MaterialType;
}

async function createMaterial(app: Express, typeId: number, name = "Oak") {
  const res = await request(app)
    .post("/api/material")
    .send({ name, material_type_id: typeId });
  return bodyOf(res) as Material;
}

async function createVariant(
  app: Express,
  materialId: number,
  name = "Oak plank",
  unit = "pieces",
) {
  const res = await request(app)
    .post("/api/material-variant")
    .send({ name, unit, material_id: materialId });
  return bodyOf(res) as MaterialVariant;
}

describe("catalog e2e", () => {
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

  describe("material types", () => {
    test("creates and lists material types", async () => {
      const created = await createType(app);
      expect(created.name).toBe("Wood");

      const res = await request(app).get("/api/material-type");
      expect(res.status).toBe(200);
      const list = listOf(res);
      expect(list).toHaveLength(1);
      expect(list[0].id).toBe(created.id);
    });

    test("returns the type by id and 404 for a missing one", async () => {
      const created = await createType(app);

      const found = await request(app).get(
        `/api/material-type/${String(created.id)}`,
      );
      expect(found.status).toBe(200);
      expect((bodyOf(found) as MaterialType).name).toBe("Wood");

      const missing = await request(app).get("/api/material-type/999");
      expect(missing.status).toBe(404);
    });

    test("rejects a duplicate active name with 409", async () => {
      await createType(app);
      const duplicate = await createTypeApp(app);
      expect(duplicate.status).toBe(409);
    });

    test("allows reusing the name after the type is soft-deleted", async () => {
      const created = await createType(app);
      await request(app).post("/api/material").send({
        name: "Oak",
        material_type_id: created.id,
      });

      const deleted = await request(app).delete(
        `/api/material-type/${String(created.id)}`,
      );
      expect(deleted.status).toBe(200);

      const recreated = await createType(app);
      expect(recreated.id).toBeGreaterThan(created.id);

      const list = await request(app).get("/api/material-type");
      expect(listOf(list)).toHaveLength(1);
    });

    test("hard-deletes an unreferenced type and soft-deletes a referenced one", async () => {
      const unreferenced = await createType(app, "Plastic");
      await request(app).delete(`/api/material-type/${String(unreferenced.id)}`);
      expect(listOf(await request(app).get("/api/material-type"))).toHaveLength(0);

      const referenced = await createType(app);
      await createMaterial(app, referenced.id);
      await request(app).delete(`/api/material-type/${String(referenced.id)}`);
      expect(listOf(await request(app).get("/api/material-type"))).toHaveLength(0);

      const byId = await request(app).get(
        `/api/material-type/${String(referenced.id)}`,
      );
      expect(byId.status).toBe(200);
    });

    test("returns 404 when deleting a missing type", async () => {
      const res = await request(app).delete("/api/material-type/999");
      expect(res.status).toBe(404);
    });

    test("rejects an empty or blank required name with 400", async () => {
      for (const name of ["", "   "]) {
        const res = await request(app).post("/api/material-type").send({ name });
        expect(res.status).toBe(400);
      }
    });

    test("updates a type via PATCH", async () => {
      const created = await createType(app);
      const updated = await request(app)
        .patch(`/api/material-type/${String(created.id)}`)
        .send({ description: "hardwood" });
      expect(updated.status).toBe(200);
      expect(bodyOf(updated).description).toBe("hardwood");
    });
  });

  describe("materials", () => {
    test("creates and lists materials belonging to a type", async () => {
      const type = await createType(app);
      const created = await createMaterial(app, type.id);
      expect(created.material_type_id).toBe(type.id);

      const list = await request(app).get("/api/material");
      expect(listOf(list)).toHaveLength(1);
    });

    test("rejects a material with a missing type with 409", async () => {
      const res = await request(app)
        .post("/api/material")
        .send({ name: "Oak", material_type_id: 999 });
      expect(res.status).toBe(409);
    });

    test("enforces unique name per type and allows the same name in another type", async () => {
      const typeA = await createType(app, "Wood");
      const typeB = await createType(app, "Metal");
      await createMaterial(app, typeA.id, "Oak");

      const duplicate = await request(app)
        .post("/api/material")
        .send({ name: "Oak", material_type_id: typeA.id });
      expect(duplicate.status).toBe(409);

      const otherType = await createMaterial(app, typeB.id, "Oak");
      expect(otherType.id).toBeGreaterThan(0);
    });

    test("returns 404 for a missing material", async () => {
      const res = await request(app).get("/api/material/999");
      expect(res.status).toBe(404);
    });

    test("rejects an empty or blank required name with 400", async () => {
      const type = await createType(app);
      for (const name of ["", "   "]) {
        const res = await request(app)
          .post("/api/material")
          .send({ name, material_type_id: type.id });
        expect(res.status).toBe(400);
      }
    });
  });

  describe("material variants", () => {
    test("creates and lists variants of a material", async () => {
      const type = await createType(app);
      const material = await createMaterial(app, type.id);
      const created = await createVariant(app, material.id);
      expect(created.unit).toBe("pieces");

      const list = await request(app).get("/api/material-variant");
      expect(listOf(list)).toHaveLength(1);
    });

    test("rejects an invalid unit with 400", async () => {
      const type = await createType(app);
      const material = await createMaterial(app, type.id);
      const res = await request(app)
        .post("/api/material-variant")
        .send({ name: "Oak plank", unit: "gallons", material_id: material.id });
      expect(res.status).toBe(400);
    });

    test("enforces unique variant name per material", async () => {
      const type = await createType(app);
      const material = await createMaterial(app, type.id);
      await createVariant(app, material.id, "Oak plank");

      const duplicate = await request(app)
        .post("/api/material-variant")
        .send({ name: "Oak plank", unit: "pieces", material_id: material.id });
      expect(duplicate.status).toBe(409);
    });

    test("allows unit change while the variant is unused", async () => {
      const type = await createType(app);
      const material = await createMaterial(app, type.id);
      const variant = await createVariant(app, material.id);

      const updated = await request(app)
        .patch(`/api/material-variant/${String(variant.id)}`)
        .send({ unit: "meters" });
      expect(updated.status).toBe(200);
      expect(bodyOf(updated).unit).toBe("meters");
    });

    test("rejects an empty or blank required name with 400", async () => {
      const type = await createType(app);
      const material = await createMaterial(app, type.id);
      for (const name of ["", "   "]) {
        const res = await request(app)
          .post("/api/material-variant")
          .send({ name, unit: "pieces", material_id: material.id });
        expect(res.status).toBe(400);
      }
    });
  });
});