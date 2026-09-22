import { Response } from "supertest";

export interface Row {
  id: number;
  name?: string;
  description?: string | null;
  unit?: string;
  material_id?: number;
  material_type_id?: number;
  supplier?: string;
  supply_url?: string | null;
  price?: number | null;
  count?: number | null;
  material_variant_id?: number;
  variant?: number;
  work_hour_cost?: number;
  message?: string;
}

export function bodyOf(res: Response): Row {
  return res.body as Row;
}

export function listOf(res: Response): Row[] {
  return res.body as Row[];
}