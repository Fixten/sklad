import type { components } from "@/api/schema";
import type { JsonBody, JsonQuery } from "@/api/schema-helpers";

export type MaterialTypeModel = components["schemas"]["MaterialType"];
export type MaterialTypeDTO = JsonBody<"/api/material-type", "post">;
export type MaterialTypePatchDTO = JsonBody<"/api/material-type/{id}", "patch">;
export type MaterialTypeListQuery = JsonQuery<"/api/material-type", "get">;
