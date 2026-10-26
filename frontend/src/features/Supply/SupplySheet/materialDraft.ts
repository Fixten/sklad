import type { Unit } from "@/features/units";

export type MaterialTypeChoice =
  | { kind: "existing"; id: number; name: string }
  | { kind: "new"; name: string };

export interface MaterialDraft {
  type: MaterialTypeChoice;
  materialName: string;
  variantName: string;
  unit: Unit;
}
