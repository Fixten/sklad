import type { components } from "@/api/schema";
import type { JsonBody, JsonQuery } from "@/api/schema-helpers";

export type MaterialModel = components["schemas"]["Material"];
export type MaterialDTO = JsonBody<"/api/material", "post">;
export type MaterialListQuery = JsonQuery<"/api/material", "get">;
