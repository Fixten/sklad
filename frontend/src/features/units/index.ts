import zod from "zod";

import type { components } from "@/api/schema";

export type Unit = components["schemas"]["MaterialVariant"]["unit"];

export const UnitSchema = zod.enum(["meters", "pieces"]);

export const UnitLabels: Record<Unit, string> = {
  meters: "метр",
  pieces: "штука",
};

export const UnitHints: Record<Unit, string> = {
  meters: "В метрах",
  pieces: "В штуках",
};

export const UnitShortLabels: Record<Unit, string> = {
  meters: "м",
  pieces: "шт",
};

export const UnitOptions = [
  { value: "meters", label: UnitLabels.meters },
  { value: "pieces", label: UnitLabels.pieces },
] satisfies { value: Unit; label: string }[];
