import request from "supertest";

import { isFeatureEnabled, readFeatureFlags } from "@/config/featureFlags.js";

import { bootstrap } from "../e2eSetup.js";

const FEATURE_ROUTES = {
  settings: "/api/settings",
  materialType: "/api/material-type",
  materialVariant: "/api/material-variant",
  material: "/api/material",
  supply: "/api/supply",
  supplier: "/api/supplier",
} as const;

type FeatureRouteName = keyof typeof FEATURE_ROUTES;

describe("feature flag routing", () => {
  it("mounts each feature route if and only if its flag is enabled", async () => {
    const features = readFeatureFlags();
    const app = bootstrap();

    for (const name of Object.keys(FEATURE_ROUTES) as FeatureRouteName[]) {
      const status = (await request(app).get(FEATURE_ROUTES[name])).status;
      expect({ name, mounted: status !== 404 }).toEqual({
        name,
        mounted: isFeatureEnabled(name, features),
      });
    }
  });

  it("never gates the root route or the docs ui", async () => {
    const app = bootstrap();
    expect((await request(app).get("/api/")).status).toBe(200);
    expect(
      (await request(app).get("/api/docs/swagger-initializer.js")).status,
    ).toBe(200);
  });

  it("documents every feature route in the spec even when a flag is off", async () => {
    const app = bootstrap();
    const disabled = (Object.keys(FEATURE_ROUTES) as FeatureRouteName[]).find(
      (name) => !isFeatureEnabled(name),
    );
    if (!disabled) return;

    const res = await request(app).get("/api/docs/spec.json");
    const paths = (res.body as { paths?: Record<string, unknown> }).paths ?? {};
    for (const route of Object.values(FEATURE_ROUTES)) {
      expect(paths[route]).toBeDefined();
    }
  });
});
