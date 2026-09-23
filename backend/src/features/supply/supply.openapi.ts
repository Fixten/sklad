import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { Urls } from "@/constants/Urls.js";
import { IdParamsDocZ } from "@/openapi/common.zod.js";
import {
  bodyOf,
  errors,
  itemPath,
  jsonContent,
  paramsOf,
} from "@/openapi/registry.js";
import { getFullPathname } from "@/utils/getFullPathname.js";

import { supplyCreateZ, supplyRowZ, supplyUpdateZ } from "./supply.zod.js";

export function registerSupplyOpenApi(registry: OpenAPIRegistry) {
  const supply = registry.register("Supply", supplyRowZ);
  const base = getFullPathname(Urls.supply);

  registry.registerPath({
    method: "get",
    path: base,
    tags: ["Supply"],
    summary: "List supplies",
    responses: {
      200: { description: "Supplies", content: jsonContent(z.array(supply)) },
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
    method: "post",
    path: itemPath(Urls.supply),
    tags: ["Supply"],
    summary: "Update a supply",
    request: { ...paramsOf(IdParamsDocZ), ...bodyOf(supplyUpdateZ) },
    responses: {
      200: { description: "The updated supply", content: jsonContent(supply) },
      ...errors,
    },
  });
  registry.registerPath({
    method: "delete",
    path: itemPath(Urls.supply),
    tags: ["Supply"],
    summary: "Hard-delete a supply",
    request: paramsOf(IdParamsDocZ),
    responses: {
      200: { description: "Whether the supply was deleted", content: jsonContent(z.boolean()) },
      ...errors,
    },
  });
}