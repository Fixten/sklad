import type { components } from "@/api/schema";
import type { JsonBody } from "@/api/schema-helpers";

export type SupplierModel = components["schemas"]["Supplier"];
export type SupplierDTO = JsonBody<"/api/supplier", "post">;
export type SupplierPatchDTO = JsonBody<"/api/supplier/{id}", "patch">;
