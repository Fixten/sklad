import type { components } from "@/api/schema";
import type { JsonBody } from "@/api/schema-helpers";

export type MaterialModel = components["schemas"]["Material"];
export type MaterialDTO = JsonBody<"/api/material", "post">;
