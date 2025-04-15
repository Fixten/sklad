import { Db } from "mongodb";

import dbConnection from "./dbConnection.js";

const dbName = "bags";

export class DbManager {
  #db?: Db;
  #setDb() {
    this.#db = dbConnection.client.db(dbName);
    console.log("Current DB is set");
    return this.#db;
  }
  get db() {
    return this.#db ?? this.#setDb();
  }
}

export default new DbManager();
