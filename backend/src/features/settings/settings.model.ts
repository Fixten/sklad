import { ObjectId } from "mongodb";

export interface NewSettings {
  work_hour_cost: number;
}

export interface SettingsModel extends NewSettings {
  _id: ObjectId;
}
