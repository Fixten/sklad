import { Express } from "express";
import request from "supertest";

import DbSingleton from "@/db/index.js";
import { productItemSchema } from "@/features/product/productItem.schema.js";

import { bodyOf, listOf, Row } from "../e2eHelpers.js";
import { bootstrap, truncate } from "../e2eSetup.js";

interface TemplateMaterial {
  material_variant_id: number;
  quantity: number;
}

interface TemplateResponse extends Row {
  materials: TemplateMaterial[];
  expected_production_work_hours: number | null;
  development_work_hours: number | null;
  production_instructions: string | null;
  drawing_description: string | null;
}

interface VariantResponse extends Row {
  unit: string;
  unit_locked?: boolean;
}

async function createCatalog(app: Express, suffix = "", unit = "pieces") {
  const type = await request(app)
    .post("/api/material-type")
    .send({ name: `Wood${suffix}` });
  const material = await request(app)
    .post("/api/material")
    .send({
      name: "Oak",
      material_type_id: bodyOf(type).id,
    });
  const variant = await request(app)
    .post("/api/material-variant")
    .send({
      name: `Oak plank${suffix}`,
      unit,
      material_id: bodyOf(material).id,
    });
  return bodyOf(variant) as VariantResponse;
}

async function createTemplate(
  app: Express,
  name = "Shelf",
  fields: Record<string, unknown> = {},
) {
  const res = await request(app)
    .post("/api/product-template")
    .send({ name, ...fields });
  expect(res.status).toBe(200);
  return bodyOf(res) as TemplateResponse;
}

function itemPath(id: number) {
  return `/api/product-template/${String(id)}`;
}

describe("product template e2e", () => {
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

  test("creates a name-only template with nullable fields and no materials", async () => {
    const created = await createTemplate(app);

    expect(created.name).toBe("Shelf");
    expect(created.description).toBeNull();
    expect(created.production_instructions).toBeNull();
    expect(created.drawing_description).toBeNull();
    expect(created.expected_production_work_hours).toBeNull();
    expect(created.development_work_hours).toBeNull();
    expect(created.materials).toEqual([]);

    const read = await request(app).get(itemPath(created.id));
    expect(read.status).toBe(200);
    expect((bodyOf(read) as TemplateResponse).materials).toEqual([]);
    expect(
      listOf(await request(app).get("/api/product-template")),
    ).toHaveLength(1);
  });

  test("creates all fields and returns material quantities as decimals", async () => {
    const pieces = await createCatalog(app);
    const meters = await createCatalog(app, "2", "meters");

    const created = await createTemplate(app, "  Workbench  ", {
      description: "Oak workbench",
      production_instructions: "Sand and oil",
      drawing_description: "Legs at 90 degrees",
      expected_production_work_hours: "2.500",
      development_work_hours: 0,
      materials: [
        { material_variant_id: pieces.id, quantity: 4 },
        { material_variant_id: meters.id, quantity: "1.250" },
      ],
    });

    expect(created.description).toBe("Oak workbench");
    expect(created.production_instructions).toBe("Sand and oil");
    expect(created.drawing_description).toBe("Legs at 90 degrees");
    expect(created.expected_production_work_hours).toBe(2.5);
    expect(created.development_work_hours).toBe(0);
    expect(created.materials).toEqual([
      { material_variant_id: pieces.id, quantity: 4 },
      { material_variant_id: meters.id, quantity: 1.25 },
    ]);

    const list = listOf(
      await request(app).get("/api/product-template"),
    ) as TemplateResponse[];
    expect(list[0]!.materials).toEqual(created.materials);

    const nullText = await createTemplate(app, "Null text", {
      description: null,
      production_instructions: null,
      drawing_description: null,
    });
    expect(nullText.description).toBeNull();
    expect(nullText.production_instructions).toBeNull();
    expect(nullText.drawing_description).toBeNull();

    const cleared = await request(app)
      .patch(itemPath(created.id))
      .send({ description: null });
    expect(cleared.status).toBe(200);
    expect(bodyOf(cleared).description).toBeNull();

    const read = bodyOf(
      await request(app).get(itemPath(created.id)),
    ) as TemplateResponse;
    expect(read.description).toBeNull();
  });

  test("PATCH leaves absent materials unchanged, clears with [] and replaces with a full array", async () => {
    const pieces = await createCatalog(app);
    const meters = await createCatalog(app, "2", "meters");
    const created = await createTemplate(app, "Shelf", {
      materials: [{ material_variant_id: pieces.id, quantity: 4 }],
    });

    const unchanged = await request(app)
      .patch(itemPath(created.id))
      .send({ description: "Updated" });
    expect(unchanged.status).toBe(200);
    expect((bodyOf(unchanged) as TemplateResponse).materials).toEqual([
      { material_variant_id: pieces.id, quantity: 4 },
    ]);

    const cleared = await request(app)
      .patch(itemPath(created.id))
      .send({ materials: [] });
    expect(cleared.status).toBe(200);
    expect((bodyOf(cleared) as TemplateResponse).materials).toEqual([]);

    const replaced = await request(app)
      .patch(itemPath(created.id))
      .send({
        materials: [{ material_variant_id: meters.id, quantity: "0.750" }],
      });
    expect(replaced.status).toBe(200);
    expect((bodyOf(replaced) as TemplateResponse).materials).toEqual([
      { material_variant_id: meters.id, quantity: 0.75 },
    ]);

    const read = bodyOf(
      await request(app).get(itemPath(created.id)),
    ) as TemplateResponse;
    expect(read.materials).toEqual([
      { material_variant_id: meters.id, quantity: 0.75 },
    ]);
  });

  test("rejects a duplicate variant with 409 and does not save", async () => {
    const variant = await createCatalog(app);

    const res = await request(app)
      .post("/api/product-template")
      .send({
        name: "Shelf",
        materials: [
          { material_variant_id: variant.id, quantity: 1 },
          { material_variant_id: variant.id, quantity: 2 },
        ],
      });

    expect(res.status).toBe(409);
    expect(bodyOf(res).message).toBe(
      "Material variant is already in the template",
    );
    expect(listOf(await request(app).get("/api/product-template"))).toEqual([]);
  });

  test("rejects hidden variants on create and full replacement", async () => {
    const variant = await createCatalog(app);
    const created = await createTemplate(app, "Shelf", {
      materials: [{ material_variant_id: variant.id, quantity: 4 }],
    });

    const deleted = await request(app).delete(
      `/api/material-variant/${String(variant.id)}`,
    );
    expect(deleted.status).toBe(200);

    const rejectedCreate = await request(app)
      .post("/api/product-template")
      .send({
        name: "Other",
        materials: [{ material_variant_id: variant.id, quantity: 4 }],
      });
    expect(rejectedCreate.status).toBe(409);
    expect(bodyOf(rejectedCreate).message).toBe("Referenced record is deleted");

    const rejectedPatch = await request(app)
      .patch(itemPath(created.id))
      .send({
        description: "late edit",
        materials: [{ material_variant_id: variant.id, quantity: 4 }],
      });
    expect(rejectedPatch.status).toBe(409);
    const read = bodyOf(
      await request(app).get(itemPath(created.id)),
    ) as TemplateResponse;
    expect(read.description).toBeNull();
    expect(read.materials).toEqual([
      { material_variant_id: variant.id, quantity: 4 },
    ]);
  });

  test("rejects unknown variants with 404", async () => {
    const res = await request(app)
      .post("/api/product-template")
      .send({
        name: "Shelf",
        materials: [{ material_variant_id: 999, quantity: 1 }],
      });

    expect(res.status).toBe(404);
    expect(bodyOf(res).message).toBe("Item was not found");
  });

  test("enforces quantity positivity and unit precision", async () => {
    const pieces = await createCatalog(app);
    const meters = await createCatalog(app, "2", "meters");

    for (const quantity of [0, -1]) {
      const res = await request(app)
        .post("/api/product-template")
        .send({
          name: `Shelf ${String(quantity)}`,
          materials: [{ material_variant_id: pieces.id, quantity }],
        });
      expect(res.status).toBe(400);
      expect(bodyOf(res).message).toBe("Quantity must be greater than zero");
    }

    const fractionalPiece = await request(app)
      .post("/api/product-template")
      .send({
        name: "Fractional",
        materials: [{ material_variant_id: pieces.id, quantity: 1.5 }],
      });
    expect(fractionalPiece.status).toBe(400);
    expect(bodyOf(fractionalPiece).message).toBe(
      "Value has more decimal places than allowed",
    );

    const preciseMeter = await request(app)
      .post("/api/product-template")
      .send({
        name: "Precise",
        materials: [{ material_variant_id: meters.id, quantity: "1.2500" }],
      });
    expect(preciseMeter.status).toBe(400);
    expect(bodyOf(preciseMeter).message).toBe(
      "Value has more decimal places than allowed",
    );

    const valid = await createTemplate(app, "Valid", {
      materials: [{ material_variant_id: meters.id, quantity: "1.250" }],
    });
    expect(valid.materials).toEqual([
      { material_variant_id: meters.id, quantity: 1.25 },
    ]);
  });

  test("hours are nullable, non-negative and limited to three decimals", async () => {
    const omitted = await createTemplate(app, "Omitted");
    expect(omitted.expected_production_work_hours).toBeNull();

    const explicitNull = await createTemplate(app, "Null", {
      expected_production_work_hours: null,
      development_work_hours: null,
    });
    expect(explicitNull.development_work_hours).toBeNull();

    const created = await createTemplate(app, "Hours", {
      expected_production_work_hours: "1.250",
    });
    expect(created.expected_production_work_hours).toBe(1.25);

    const tooPrecise = await request(app).post("/api/product-template").send({
      name: "Too precise",
      development_work_hours: "1.0001",
    });
    expect(tooPrecise.status).toBe(400);
    expect(bodyOf(tooPrecise).message).toBe(
      "Value has more decimal places than allowed",
    );

    const negative = await request(app).post("/api/product-template").send({
      name: "Negative",
      expected_production_work_hours: -1,
    });
    expect(negative.status).toBe(400);
    expect(bodyOf(negative).message).toBe("Work hours cannot be negative");

    const cleared = await request(app).patch(itemPath(created.id)).send({
      expected_production_work_hours: null,
      development_work_hours: 0,
    });
    expect(cleared.status).toBe(200);
    const clearedBody = bodyOf(cleared) as TemplateResponse;
    expect(clearedBody.expected_production_work_hours).toBeNull();
    expect(clearedBody.development_work_hours).toBe(0);
  });

  test("reserves active and hidden names", async () => {
    await createTemplate(app, "Shelf");

    const active = await request(app)
      .post("/api/product-template")
      .send({ name: " shelf " });
    expect(active.status).toBe(409);
    expect(bodyOf(active).message).toBe("Name already exists");

    const hidden = await createTemplate(app, "Workbench");
    DbSingleton.client
      .insert(productItemSchema)
      .values({ product_template_id: hidden.id })
      .run();
    await request(app).delete(itemPath(hidden.id));

    const reserved = await request(app)
      .post("/api/product-template")
      .send({ name: "WORKBENCH" });
    expect(reserved.status).toBe(409);
    expect(bodyOf(reserved).message).toBe(
      "Name is reserved by a hidden record",
    );
  });

  test("lists hidden templates only with hidden=true", async () => {
    const hidden = await createTemplate(app, "Hidden");
    DbSingleton.client
      .insert(productItemSchema)
      .values({ product_template_id: hidden.id })
      .run();
    await request(app).delete(itemPath(hidden.id));

    expect(listOf(await request(app).get("/api/product-template"))).toEqual([]);
    expect(
      listOf(await request(app).get("/api/product-template?hidden=false")),
    ).toEqual([]);

    const all = listOf(
      await request(app).get("/api/product-template?hidden=true"),
    ) as TemplateResponse[];
    expect(all).toHaveLength(1);
    expect(all[0]!.id).toBe(hidden.id);
    expect(all[0]!.deleted_at).toBeTruthy();
  });

  test("a hidden template accepts only a name-only rename and frees its old name", async () => {
    const hidden = await createTemplate(app, "Shelf");
    DbSingleton.client
      .insert(productItemSchema)
      .values({ product_template_id: hidden.id })
      .run();
    await request(app).delete(itemPath(hidden.id));

    const renamed = await request(app)
      .patch(itemPath(hidden.id))
      .send({ name: "Renamed" });
    expect(renamed.status).toBe(200);
    expect(bodyOf(renamed).name).toBe("Renamed");

    const rejected = await request(app)
      .patch(itemPath(hidden.id))
      .send({ description: "late edit" });
    expect(rejected.status).toBe(409);
    expect(bodyOf(rejected).message).toBe("Item is deleted");

    const rejectedMaterials = await request(app)
      .patch(itemPath(hidden.id))
      .send({ name: "Again", materials: [] });
    expect(rejectedMaterials.status).toBe(409);

    await createTemplate(app, "Shelf");
    const restored = await request(app).post(
      `/api/product-template/restore/${String(hidden.id)}`,
    );
    expect(restored.status).toBe(200);
    expect(bodyOf(restored).deleted_at).toBeNull();
  });

  test("hard-deletes an unreferenced template and soft-deletes a referenced one", async () => {
    const variant = await createCatalog(app);
    const free = await createTemplate(app, "Free", {
      materials: [{ material_variant_id: variant.id, quantity: 4 }],
    });

    const hard = await request(app).delete(itemPath(free.id));
    expect(hard.status).toBe(200);
    expect(hard.body).toEqual({ message: `${String(free.id)} deleted` });
    expect((await request(app).get(itemPath(free.id))).status).toBe(404);
    expect(listOf(await request(app).get("/api/product-template"))).toEqual([]);

    const referenced = await createTemplate(app, "Referenced", {
      materials: [{ material_variant_id: variant.id, quantity: 4 }],
    });
    DbSingleton.client
      .insert(productItemSchema)
      .values({ product_template_id: referenced.id })
      .run();

    const soft = await request(app).delete(itemPath(referenced.id));
    expect(soft.status).toBe(200);
    const hidden = bodyOf(
      await request(app).get(itemPath(referenced.id)),
    ) as TemplateResponse;
    expect(hidden.deleted_at).toBeTruthy();
    expect(hidden.materials).toEqual([
      { material_variant_id: variant.id, quantity: 4 },
    ]);
    expect(listOf(await request(app).get("/api/product-template"))).toEqual([]);

    const restored = await request(app).post(
      `/api/product-template/restore/${String(referenced.id)}`,
    );
    expect(restored.status).toBe(200);
    expect(bodyOf(restored).deleted_at).toBeNull();
    expect(
      listOf(await request(app).get("/api/product-template")),
    ).toHaveLength(1);
  });

  test("returns 404 for unknown template ids", async () => {
    expect((await request(app).get("/api/product-template/999")).status).toBe(
      404,
    );
    expect(
      (
        await request(app)
          .patch("/api/product-template/999")
          .send({ name: "Missing" })
      ).status,
    ).toBe(404);
    expect(
      (await request(app).delete("/api/product-template/999")).status,
    ).toBe(404);
    expect(
      (await request(app).post("/api/product-template/restore/999")).status,
    ).toBe(404);
  });

  test("rejects malformed bodies with 400", async () => {
    for (const body of [
      {},
      { name: "" },
      { name: "Shelf", materials: [{ material_variant_id: 1 }] },
      { name: "Shelf", extra: true },
    ]) {
      const res = await request(app).post("/api/product-template").send(body);
      expect(res.status).toBe(400);
    }

    const malformed = await request(app)
      .post("/api/product-template")
      .set("Content-Type", "application/json")
      .send("{not json");
    expect(malformed.status).toBe(400);
  });

  test("soft-deletes a variant referenced only by a template", async () => {
    const variant = await createCatalog(app);
    const template = await createTemplate(app, "Shelf", {
      materials: [{ material_variant_id: variant.id, quantity: 4 }],
    });

    const before = bodyOf(
      await request(app).get(`/api/material-variant/${String(variant.id)}`),
    ) as VariantResponse;
    expect(before.unit_locked).toBe(false);

    const deleted = await request(app).delete(
      `/api/material-variant/${String(variant.id)}`,
    );
    expect(deleted.status).toBe(200);

    const hidden = bodyOf(
      await request(app).get(`/api/material-variant/${String(variant.id)}`),
    ) as VariantResponse;
    expect(hidden.deleted_at).toBeTruthy();
    expect(hidden.unit_locked).toBe(false);
    expect(listOf(await request(app).get("/api/material-variant"))).toEqual([]);
    expect(
      listOf(await request(app).get("/api/material-variant?hidden=true")),
    ).toHaveLength(1);

    const read = bodyOf(
      await request(app).get(itemPath(template.id)),
    ) as TemplateResponse;
    expect(read.materials).toEqual([
      { material_variant_id: variant.id, quantity: 4 },
    ]);
  });
});
