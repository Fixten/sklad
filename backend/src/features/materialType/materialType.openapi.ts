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

import { materialTypeCreateZ, materialTypePatchZ, materialTypeRowZ } from "./materialType.zod.js";

export function registerMaterialTypeOpenApi(registry: OpenAPIRegistry) {
  const materialType = registry.register("MaterialType", materialTypeRowZ);
  const base = getFullPathname(Urls.materialType);

  registry.registerPath({
    method: "get",
    path: base,
    tags: ["Material Type"],
    summary: "List active material types",
    responses: {
      200: { description: "Active material types", content: jsonContent(z.array(materialType)) },
      ...errors,
    },
  });
  registry.registerPath({
    method: "get",
    path: itemPath(Urls.materialType),
    tags: ["Material Type"],
    summary: "Get a material type by id",
    request: paramsOf(IdParamsDocZ),
    responses: {
      200: { description: "The material type", content: jsonContent(materialType) },
      ...errors,
    },
  });
  registry.registerPath({
    method: "post",
    path: base,
    tags: ["Material Type"],
    summary: "Create a material type",
    request: bodyOf(materialTypeCreateZ),
    responses: {
      200: { description: "The created material type", content: jsonContent(materialType) },
      ...errors,
    },
  });
  registry.registerPath({
    method: "patch",
    path: itemPath(Urls.materialType),
    tags: ["Material Type"],
    summary: "Update a material type",
    request: { ...paramsOf(IdParamsDocZ), ...bodyOf(materialTypePatchZ) },
    responses: {
      200: { description: "The updated material type", content: jsonContent(materialType) },
      ...errors,
    },
  });
  registry.registerPath({
    method: "delete",
    path: itemPath(Urls.materialType),
    tags: ["Material Type"],
    summary: "Delete a material type",
    request: paramsOf(IdParamsDocZ),
    responses: {
      200: { description: "Delete confirmation", content: deletedContent },
      ...errors,
    },
  });
}