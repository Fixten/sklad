import type { components } from "@/api/schema";
import type { JsonBody, JsonQuery } from "@/api/schema-helpers";

export type VariantModel = components["schemas"]["MaterialVariant"];
export type VariantDTO = JsonBody<"/api/material-variant", "post">;
export type VariantPatchDTO = JsonBody<"/api/material-variant/{id}", "patch">;
export type VariantListQuery = JsonQuery<"/api/material-variant", "get">;
