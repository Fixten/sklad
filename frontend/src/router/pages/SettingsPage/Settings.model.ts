import type { components } from "@/api/schema";
import type { JsonBody } from "@/api/schema-helpers";

export type SettingsModel = components["schemas"]["Settings"];
export type SettingsDTO = JsonBody<"/api/settings", "post">;
