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
  restorePath,
} from "@/openapi/registry.js";
import { getFullPathname } from "@/utils/getFullPathname.js";

import {
  supplierCreateZ,
  supplierPatchZ,
  supplierRowZ,
} from "./supplier.zod.js";

export function registerSupplierOpenApi(registry: OpenAPIRegistry) {
  const supplier = registry.register("Supplier", supplierRowZ);
  const base = getFullPathname(Urls.supplier);

  registry.registerPath({
    method: "get",
    path: base,
    tags: ["Supplier"],
    summary: "List active suppliers",
    responses: {
      200: {
        description: "Active suppliers",
        content: jsonContent(z.array(supplier)),
      },
      ...errors,
    },
  });
  registry.registerPath({
    method: "get",
    path: itemPath(Urls.supplier),
    tags: ["Supplier"],
    summary: "Get a supplier",
    request: paramsOf(IdParamsDocZ),
    responses: {
      200: { description: "The supplier", content: jsonContent(supplier) },
      ...errors,
    },
  });
  registry.registerPath({
    method: "post",
    path: base,
    tags: ["Supplier"],
    summary: "Create a supplier",
    request: bodyOf(supplierCreateZ),
    responses: {
      200: {
        description: "The created supplier",
        content: jsonContent(supplier),
      },
      ...errors,
    },
  });
  registry.registerPath({
    method: "patch",
    path: itemPath(Urls.supplier),
    tags: ["Supplier"],
    summary: "Update a supplier",
    request: { ...paramsOf(IdParamsDocZ), ...bodyOf(supplierPatchZ) },
    responses: {
      200: {
        description: "The updated supplier",
        content: jsonContent(supplier),
      },
      ...errors,
    },
  });
  registry.registerPath({
    method: "delete",
    path: itemPath(Urls.supplier),
    tags: ["Supplier"],
    summary: "Delete a supplier",
    request: paramsOf(IdParamsDocZ),
    responses: {
      200: { description: "Delete confirmation", content: deletedContent },
      ...errors,
    },
  });
  registry.registerPath({
    method: "post",
    path: restorePath(Urls.supplier),
    tags: ["Supplier"],
    summary: "Restore a soft-deleted supplier",
    request: paramsOf(IdParamsDocZ),
    responses: {
      200: {
        description: "The restored supplier",
        content: jsonContent(supplier),
      },
      ...errors,
    },
  });
}
