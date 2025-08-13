import { MongoClient } from "mongodb";
import mongoose from "mongoose";

export function getConnectionString() {
  const { MONGO_CONNECTION_STRING } = process.env;
  if (MONGO_CONNECTION_STRING) {
    return MONGO_CONNECTION_STRING;
  } else throw new Error("No Mongo connection string in env");
}

export function createMongooseConnection() {
  const connectionString = getConnectionString();
  return mongoose.connect(connectionString);
}

export function createConnection() {
  const connectionString = getConnectionString();
  return new MongoClient(connectionString);
}

export class DbConnection {
  #client?: MongoClient;
  #mongooseClient?: mongoose.Mongoose;

  #createNewClient() {
    this.#client = createConnection();
    console.log("Mongo client created");
    return this.#client;
  }

  async #createNewMongooseClient() {
    this.#mongooseClient = await createMongooseConnection();
    console.log("Mongoose client created");
    return this.#client;
  }
  get client() {
    return this.#client ?? this.#createNewClient();
  }

  async getMongooseClinet() {
    return this.#mongooseClient ?? (await this.#createNewMongooseClient());
  }

  async connect() {
    await Promise.all([
      this.#createNewClient(),
      this.#createNewMongooseClient(),
    ]);
  }
  disconnect() {
    return this.#client?.close();
  }
}

export default new DbConnection();
