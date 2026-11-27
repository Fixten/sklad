import type { components } from "@/api/schema";
import type { JsonBody, JsonQuery } from "@/api/schema-helpers";

export type ProductTemplateModel = components["schemas"]["ProductTemplate"];
export type ProductTemplateDTO = JsonBody<"/api/product-template", "post">;
export type ProductTemplatePatchDTO = JsonBody<
  "/api/product-template/{id}",
  "patch"
>;
export type ProductTemplateListQuery = JsonQuery<
  "/api/product-template",
  "get"
>;
