import { MongoClient } from "mongodb";

export function createConnection() {
  const { MONGO_CONNECTION_STRING } = process.env;
  if (MONGO_CONNECTION_STRING) {
    return new MongoClient(MONGO_CONNECTION_STRING);
  } else throw new Error("No Mongo connection string in env");
}

export class DbConnection {
  #client?: MongoClient;
  #createNewClient() {
    this.#client = createConnection();
    console.log("Mongo client created");
    return this.#client;
  }
  get client() {
    return this.#client ?? this.#createNewClient();
  }
  connect() {
    this.#createNewClient();
  }
  disconnect() {
    return this.#client?.close();
  }
}

export default new DbConnection();
