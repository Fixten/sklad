import { ObjectId } from "mongodb";

export interface NewUnit {
  name: string;
}

export interface UnitModel extends NewUnit {
  _id: ObjectId;
  created_at: string;
  updated_at: string;
}
