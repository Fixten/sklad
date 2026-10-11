import { z } from "zod";

import "@/openapi/common.zod.js";

export const healthOkZ = z.object({ status: z.literal("ok") }).strict();

export const healthFailZ = z.object({ status: z.literal("error") }).strict();
