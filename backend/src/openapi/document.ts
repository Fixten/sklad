import { OpenApiGeneratorV3, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

import { registerMaterialOpenApi } from "../features/material/material.openapi.js";
import { registerMaterialTypeOpenApi } from "../features/materialType/materialType.openapi.js";
import { registerMaterialVariantOpenApi } from "../features/materialVariant/materialVariant.openapi.js";
import { registerSettingsOpenApi } from "../features/settings/settings.openapi.js";
import { registerSupplierOpenApi } from "../features/supplier/supplier.openapi.js";
import { registerSupplyOpenApi } from "../features/supply/supply.openapi.js";

import { ErrorResponseZ } from "./common.zod.js";

const registry = new OpenAPIRegistry();

registry.register("ErrorResponse", ErrorResponseZ);

registerMaterialTypeOpenApi(registry);
registerMaterialOpenApi(registry);
registerMaterialVariantOpenApi(registry);
registerSupplyOpenApi(registry);
registerSupplierOpenApi(registry);
registerSettingsOpenApi(registry);

export function buildSpec() {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: "3.0.3",
    info: {
      title: "Sklad API",
      version: "1.0.0",
      description: "Epic 1 catalog, supply and settings API.",
    },
    tags: [
      { name: "Material Type" },
      { name: "Material" },
      { name: "Material Variant" },
      { name: "Supply" },
      { name: "Supplier" },
      { name: "Settings" },
    ],
  });
}