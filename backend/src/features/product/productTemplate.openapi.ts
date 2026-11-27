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
  productTemplateCreateZ,
  productTemplateDetailZ,
  productTemplateListQueryZ,
  productTemplatePatchZ,
  productTemplateRowZ,
} from "./productTemplate.zod.js";

export function registerProductTemplateOpenApi(registry: OpenAPIRegistry) {
  const productTemplate = registry.register(
    "ProductTemplate",
    productTemplateRowZ,
  );
  const productTemplateDetail = registry.register(
    "ProductTemplateDetail",
    productTemplateDetailZ,
  );
  const base = getFullPathname(Urls.productTemplate);

  registry.registerPath({
    method: "get",
    path: base,
    tags: ["Product Template"],
    summary: "List product templates",
    request: queryOf(productTemplateListQueryZ),
    responses: {
      200: {
        description:
          "Product templates; includes soft-deleted ones when hidden=true",
        content: jsonContent(z.array(productTemplate)),
      },
      ...errors,
    },
  });
  registry.registerPath({
    method: "get",
    path: itemPath(Urls.productTemplate),
    tags: ["Product Template"],
    summary: "Get a product template by id",
    request: paramsOf(IdParamsDocZ),
    responses: {
      200: {
        description: "The product template",
        content: jsonContent(productTemplateDetail),
      },
      ...errors,
    },
  });
  registry.registerPath({
    method: "post",
    path: base,
    tags: ["Product Template"],
    summary: "Create a product template",
    request: bodyOf(productTemplateCreateZ),
    responses: {
      200: {
        description: "The created product template",
        content: jsonContent(productTemplateDetail),
      },
      ...errors,
    },
  });
  registry.registerPath({
    method: "patch",
    path: itemPath(Urls.productTemplate),
    tags: ["Product Template"],
    summary: "Update a product template",
    description:
      "When materials is present it replaces all template materials; when absent they stay unchanged.",
    request: { ...paramsOf(IdParamsDocZ), ...bodyOf(productTemplatePatchZ) },
    responses: {
      200: {
        description: "The updated product template",
        content: jsonContent(productTemplateDetail),
      },
      ...errors,
    },
  });
  registry.registerPath({
    method: "delete",
    path: itemPath(Urls.productTemplate),
    tags: ["Product Template"],
    summary: "Delete a product template",
    request: paramsOf(IdParamsDocZ),
    responses: {
      200: { description: "Delete confirmation", content: deletedContent },
      ...errors,
    },
  });
  registry.registerPath({
    method: "post",
    path: restorePath(Urls.productTemplate),
    tags: ["Product Template"],
    summary: "Restore a soft-deleted product template",
    request: paramsOf(IdParamsDocZ),
    responses: {
      200: {
        description: "The restored product template",
        content: jsonContent(productTemplateDetail),
      },
      ...errors,
    },
  });
}
