import { Document, ObjectId } from "mongodb";

interface DbFields {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type WithDb<T extends Document> = T & DbFields;
