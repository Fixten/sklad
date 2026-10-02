import request from "supertest";

import { readFeatureFlags } from "@/config/featureFlags.js";

import { bootstrap } from "../e2eSetup.js";

const FEATURE_ROUTES = {
  settings: "/api/settings",
  materialType: "/api/material-type",
  materialVariant: "/api/material-variant",
  material: "/api/material",
  supply: "/api/supply",
  supplier: "/api/supplier",
} as const;

const FEATURE_NAMES = Object.keys(
  FEATURE_ROUTES,
) as (keyof typeof FEATURE_ROUTES)[];

const enabled = (name: (typeof FEATURE_NAMES)[number]) => ({
  [name]: true,
});

describe("feature flag routing", () => {
  it("mounts every feature route when no flags are given", async () => {
    const app = bootstrap();

    for (const name of FEATURE_NAMES) {
      const { status } = await request(app).get(FEATURE_ROUTES[name]);
      expect({ name, status }).toEqual({ name, status: 200 });
    }
  });

  it.each(FEATURE_NAMES)("mounts %s only when its flag is on", async (name) => {
    const on = bootstrap(enabled(name));
    expect((await request(on).get(FEATURE_ROUTES[name])).status).toBe(200);

    const off = bootstrap({ [name]: false });
    expect((await request(off).get(FEATURE_ROUTES[name])).status).toBe(404);
  });

  it("never gates the root route or the docs ui", async () => {
    const app = bootstrap();
    expect((await request(app).get("/api/")).status).toBe(200);
    expect(
      (await request(app).get("/api/docs/swagger-initializer.js")).status,
    ).toBe(200);
  });

  it("documents every feature route in the spec even when every flag is off", async () => {
    const off = Object.fromEntries(FEATURE_NAMES.map((name) => [name, false]));
    const app = bootstrap(off);

    const res = await request(app).get("/api/docs/spec.json");
    const paths = (res.body as { paths?: Record<string, unknown> }).paths ?? {};
    for (const route of Object.values(FEATURE_ROUTES)) {
      expect(paths[route]).toBeDefined();
    }
  });

  it("ships a config whose keys are all known feature names", () => {
    for (const key of Object.keys(readFeatureFlags())) {
      expect(FEATURE_NAMES).toContain(key);
    }
  });
});
