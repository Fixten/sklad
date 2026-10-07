import type { components } from "@/api/schema";
import type { JsonBody } from "@/api/schema-helpers";

export type MaterialTypeModel = components["schemas"]["MaterialType"];
export type MaterialTypeDTO = JsonBody<"/api/material-type", "post">;
