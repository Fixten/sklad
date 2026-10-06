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
  queryOf,
  restorePath,
} from "@/openapi/registry.js";
import { getFullPathname } from "@/utils/getFullPathname.js";

import {
  supplyCreateZ,
  supplyListQueryZ,
  supplyPatchZ,
  supplyRowZ,
  supplyStockZ,
} from "./supply.zod.js";

export function registerSupplyOpenApi(registry: OpenAPIRegistry) {
  const supply = registry.register("Supply", supplyRowZ);
  const supplyStock = registry.register("SupplyStock", supplyStockZ);
  const base = getFullPathname(Urls.supply);

  registry.registerPath({
    method: "get",
    path: base,
    tags: ["Supply"],
    summary: "List active supplies with their remaining stock",
    request: queryOf(supplyListQueryZ),
    responses: {
      200: { description: "Supplies", content: jsonContent(z.array(supply)) },
      ...errors,
    },
  });
  registry.registerPath({
    method: "get",
    path: itemPath(Urls.supply),
    tags: ["Supply"],
    summary: "Get a supply",
    request: paramsOf(IdParamsDocZ),
    responses: {
      200: { description: "The supply", content: jsonContent(supply) },
      ...errors,
    },
  });
  registry.registerPath({
    method: "get",
    path: `${base}/stock/{id}`,
    tags: ["Supply"],
    summary: "Get the stock derived from the supplies of a material variant",
    description:
      "The id is a material variant id. A soft-deleted variant stays readable: the figure is derived, never written.",
    request: paramsOf(IdParamsDocZ),
    responses: {
      200: {
        description: "Remaining stock of the material variant",
        content: jsonContent(supplyStock),
      },
      ...errors,
    },
  });
  registry.registerPath({
    method: "post",
    path: base,
    tags: ["Supply"],
    summary: "Create a supply",
    request: bodyOf(supplyCreateZ),
    responses: {
      200: { description: "The created supply", content: jsonContent(supply) },
      ...errors,
    },
  });
  registry.registerPath({
    method: "patch",
    path: itemPath(Urls.supply),
    tags: ["Supply"],
    summary: "Update or correct a supply",
    request: { ...paramsOf(IdParamsDocZ), ...bodyOf(supplyPatchZ) },
    responses: {
      200: { description: "The updated supply", content: jsonContent(supply) },
      ...errors,
    },
  });
  registry.registerPath({
    method: "delete",
    path: itemPath(Urls.supply),
    tags: ["Supply"],
    summary: "Delete a supply",
    request: paramsOf(IdParamsDocZ),
    responses: {
      200: { description: "Delete confirmation", content: deletedContent },
      ...errors,
    },
  });
  registry.registerPath({
    method: "post",
    path: restorePath(Urls.supply),
    tags: ["Supply"],
    summary: "Restore a soft-deleted supply",
    request: paramsOf(IdParamsDocZ),
    responses: {
      200: { description: "The restored supply", content: jsonContent(supply) },
      ...errors,
    },
  });
}
