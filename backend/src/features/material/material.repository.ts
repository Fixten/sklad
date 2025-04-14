import dbManager from "db/dbManager.js";
import { ObjectId } from "mongodb";

const collectionName = "material";

const collection = dbManager.getCollection(collectionName);

export const getMaterial = (_id: ObjectId) => collection.findOne({ _id });
