import { ObjectId } from "mongodb";

export interface SettingsModel {
  _id: ObjectId;
  work_hour_cost: number;
}
