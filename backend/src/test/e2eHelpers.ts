import { Response } from "supertest";

export interface Row {
  id: number;
  name?: string;
  deleted_at?: Date | null;
  updated_at?: Date | null;
  description?: string | null;
  unit?: string;
  url?: string | null;
  contact?: string | null;
  material_id?: number;
  material_type_id?: number;
  purchase_price?: number;
  quantity?: number;
  remaining_quantity?: number;
  unit_purchase_cost?: number;
  material_variant_id?: number;
  supplier_id?: number;
  work_hour_cost?: number;
  message?: string;
}

export function bodyOf(res: Response): Row {
  return res.body as Row;
}

export function listOf(res: Response): Row[] {
  return res.body as Row[];
}
