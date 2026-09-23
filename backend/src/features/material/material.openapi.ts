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

import { materialCreateZ, materialPatchZ, materialRowZ } from "./material.zod.js";

export function registerMaterialOpenApi(registry: OpenAPIRegistry) {
  const material = registry.register("Material", materialRowZ);
  const base = getFullPathname(Urls.material);

  registry.registerPath({
    method: "get",
    path: base,
    tags: ["Material"],
    summary: "List active materials",
    responses: {
      200: { description: "Active materials", content: jsonContent(z.array(material)) },
      ...errors,
    },
  });
  registry.registerPath({
    method: "get",
    path: itemPath(Urls.material),
    tags: ["Material"],
    summary: "Get a material by id",
    request: paramsOf(IdParamsDocZ),
    responses: {
      200: { description: "The material", content: jsonContent(material) },
      ...errors,
    },
  });
  registry.registerPath({
    method: "post",
    path: base,
    tags: ["Material"],
    summary: "Create a material",
    request: bodyOf(materialCreateZ),
    responses: {
      200: { description: "The created material", content: jsonContent(material) },
      ...errors,
    },
  });
  registry.registerPath({
    method: "patch",
    path: itemPath(Urls.material),
    tags: ["Material"],
    summary: "Update a material",
    request: { ...paramsOf(IdParamsDocZ), ...bodyOf(materialPatchZ) },
    responses: {
      200: { description: "The updated material", content: jsonContent(material) },
      ...errors,
    },
  });
  registry.registerPath({
    method: "delete",
    path: itemPath(Urls.material),
    tags: ["Material"],
    summary: "Delete a material",
    request: paramsOf(IdParamsDocZ),
    responses: {
      200: { description: "Delete confirmation", content: deletedContent },
      ...errors,
    },
  });
}