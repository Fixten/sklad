import { MongoClient } from "mongodb";

const dbName = "bags";

export default function getNewDbConnection(connectionString: string) {
  const client = new MongoClient(connectionString);
  return client.db(dbName);
}
