import type { components } from "@/api/schema";
import type { JsonBody, JsonQuery } from "@/api/schema-helpers";

export type SupplyModel = components["schemas"]["Supply"];
export type SupplyStock = components["schemas"]["SupplyStock"];
export type SupplyDTO = JsonBody<"/api/supply", "post">;
export type SupplyPatchDTO = JsonBody<"/api/supply/{id}", "patch">;
export type SupplyListQuery = JsonQuery<"/api/supply", "get">;
