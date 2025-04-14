import { Collection, Db } from "mongodb";

import getNewDbConnection from "./getNewDbConnection.js";

function createConnection() {
  const { MONGO_CONNECTION_STRING } = process.env;
  if (MONGO_CONNECTION_STRING) {
    return getNewDbConnection(MONGO_CONNECTION_STRING);
  } else throw new Error("No Mongo connection string in env");
}

interface DbManagerInterface {
  getCollection: (collectionName: string) => Collection;
}

class DbManager implements DbManagerInterface {
  #dbConnection?: Db;
  #connect() {
    this.#dbConnection = createConnection();
    return this.#dbConnection;
  }
  #getDbConnection() {
    return this.#dbConnection ?? this.#connect();
  }
  getCollection(collectionName: string) {
    return this.#getDbConnection().collection(collectionName);
  }
}

const dbManager = new DbManager();

export default dbManager;
