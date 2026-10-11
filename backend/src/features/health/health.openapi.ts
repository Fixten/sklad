import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

import { Urls } from "@/constants/Urls.js";
import { jsonContent } from "@/openapi/registry.js";
import { getFullPathname } from "@/utils/getFullPathname.js";

import { healthFailZ, healthOkZ } from "./health.zod.js";

export function registerHealthOpenApi(registry: OpenAPIRegistry) {
  registry.register("HealthOk", healthOkZ);
  const failure = registry.register("HealthError", healthFailZ);

  registry.registerPath({
    method: "get",
    path: getFullPathname(Urls.health),
    tags: ["Health"],
    summary: "Report service health including database reachability",
    responses: {
      200: {
        description: "The service and its database are reachable",
        content: jsonContent(healthOkZ),
      },
      503: {
        description: "The database is unreachable",
        content: jsonContent(failure),
      },
    },
  });
}
