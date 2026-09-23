import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { Urls } from "@/constants/Urls.js";
import { IdParamsDocZ } from "@/openapi/common.zod.js";
import {
  bodyOf,
  deletedContent,
  errors,
  itemPath,
  jsonContent,
  paramsOf,
} from "@/openapi/registry.js";
import { getFullPathname } from "@/utils/getFullPathname.js";

import { materialVariantCreateZ, materialVariantPatchZ, materialVariantRowZ } from "./materialVariant.zod.js";

export function registerMaterialVariantOpenApi(registry: OpenAPIRegistry) {
  const materialVariant = registry.register("MaterialVariant", materialVariantRowZ);
  const base = getFullPathname(Urls.materialVariant);

  registry.registerPath({
    method: "get",
    path: base,
    tags: ["Material Variant"],
    summary: "List active material variants",
    responses: {
      200: { description: "Active material variants", content: jsonContent(z.array(materialVariant)) },
      ...errors,
    },
  });
  registry.registerPath({
    method: "get",
    path: itemPath(Urls.materialVariant),
    tags: ["Material Variant"],
    summary: "Get a material variant by id",
    request: paramsOf(IdParamsDocZ),
    responses: {
      200: { description: "The material variant", content: jsonContent(materialVariant) },
      ...errors,
    },
  });
  registry.registerPath({
    method: "post",
    path: base,
    tags: ["Material Variant"],
    summary: "Create a material variant",
    request: bodyOf(materialVariantCreateZ),
    responses: {
      200: { description: "The created material variant", content: jsonContent(materialVariant) },
      ...errors,
    },
  });
  registry.registerPath({
    method: "patch",
    path: itemPath(Urls.materialVariant),
    tags: ["Material Variant"],
    summary: "Update a material variant",
    request: { ...paramsOf(IdParamsDocZ), ...bodyOf(materialVariantPatchZ) },
    responses: {
      200: { description: "The updated material variant", content: jsonContent(materialVariant) },
      ...errors,
    },
  });
  registry.registerPath({
    method: "delete",
    path: itemPath(Urls.materialVariant),
    tags: ["Material Variant"],
    summary: "Delete a material variant",
    request: paramsOf(IdParamsDocZ),
    responses: {
      200: { description: "Delete confirmation", content: deletedContent },
      ...errors,
    },
  });
}