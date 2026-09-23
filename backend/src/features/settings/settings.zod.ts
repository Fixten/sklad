import { z } from "zod";

import { dateZ } from "@/openapi/common.zod.js";

export const settingsRowZ = z
  .object({
    id: z.int(),
    work_hour_cost: z.int(),
    created_at: dateZ,
    updated_at: dateZ.nullish(),
    deleted_at: dateZ.nullish(),
  })
  .strict();

export const settingsShortZ = z.object({ work_hour_cost: z.int() }).strict();

export const settingsGetZ = z.union([settingsRowZ, settingsShortZ]);

export const settingsBodyZ = z.object({ work_hour_cost: z.int() }).strict();

export type SettingsRow = z.infer<typeof settingsRowZ>;
export type SettingsBody = z.infer<typeof settingsBodyZ>;