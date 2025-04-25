import { ObjectId } from "mongodb";

export interface ProductModel {
  name: string;
  description: string;
  instruction: string;
  work_hours: number;
  development_hours: number;
  count: number;
  photo: string;
  audience: string;
  mods: string[];
  drawings: string[];
  additional_costs: number;
  material: [
    {
      material_id: ObjectId;
      quantity: number;
    },
  ];
}
