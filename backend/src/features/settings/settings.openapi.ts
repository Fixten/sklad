import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

import { Urls } from "@/constants/Urls.js";
import { bodyOf, errors, jsonContent } from "@/openapi/registry.js";
import { getFullPathname } from "@/utils/getFullPathname.js";

import { settingsBodyZ, settingsGetZ, settingsRowZ } from "./settings.zod.js";

export function registerSettingsOpenApi(registry: OpenAPIRegistry) {
  const settings = registry.register("Settings", settingsRowZ);
  const path = getFullPathname(Urls.settings);

  registry.registerPath({
    method: "get",
    path,
    tags: ["Settings"],
    summary: "Get the settings",
    responses: {
      200: { description: "The settings row or its default", content: jsonContent(settingsGetZ) },
      ...errors,
    },
  });
  registry.registerPath({
    method: "post",
    path,
    tags: ["Settings"],
    summary: "Create or update the settings",
    request: bodyOf(settingsBodyZ),
    responses: {
      200: { description: "The stored settings row", content: jsonContent(settings) },
      ...errors,
    },
  });
}