import { MongoClient } from "mongodb";

const uri = process.env.MONGO_CONNECTION_STRING;
const dbName = "bags";

export default async function connectMongo() {
  if (uri) {
    const client = new MongoClient(uri);
    try {
      return client.db(dbName);
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  } else throw new Error("no mongo connection string in env");
}
