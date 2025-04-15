import { MongoClient } from "mongodb";

import { DbConnection, createConnection } from "./dbConnection.js";

jest.mock("mongodb");

const MongoClientMocked = MongoClient as jest.MockedClass<typeof MongoClient>;

describe("dbConnection", () => {
  const connectionString = "mongodb://test:27017";
  beforeEach(() => {
    process.env.MONGO_CONNECTION_STRING = connectionString;
  });

  afterEach(() => {
    delete process.env.MONGO_CONNECTION_STRING;
    MongoClientMocked.mockClear();
  });

  describe("createConnection", () => {
    test("creates Mongo client with connection string", () => {
      createConnection();
      expect(MongoClientMocked).toHaveBeenCalledWith(connectionString);
    });
    test("if no connection string in env, throws error", () => {
      const error = "No Mongo connection string in env";
      delete process.env.MONGO_CONNECTION_STRING;
      expect(createConnection).toThrow(error);
    });
  });

  describe("dbConnectionClass", () => {
    let dbConnection: DbConnection;
    beforeEach(() => {
      dbConnection = new DbConnection();
    });
    test("should create a mongo client with the provided connection string", () => {
      void dbConnection.client;
      expect(MongoClientMocked).toHaveBeenCalledWith(connectionString);
    });
    test("should create new connection only once", () => {
      const firstClient = dbConnection.client;
      expect(MongoClientMocked).toHaveBeenCalled();
      const secondClient = dbConnection.client;
      expect(MongoClientMocked).toHaveBeenCalledTimes(1);
      expect(secondClient).toBe(firstClient);
    });
    test("should log that the mongo client was created", () => {
      const consoleSpy = jest.spyOn(console, "log");
      void dbConnection.client;
      expect(consoleSpy).toHaveBeenCalledWith("Mongo client created");
    });
    test("should handle different connection strings", () => {
      const connectionStrings = [
        "mongodb://user:pass@localhost:27017",
        "mongodb+srv://user:pass@cluster0.example.mongodb.net",
        "mongodb://localhost:27017,localhost:27018/?replicaSet=rs0",
      ];
      connectionStrings.forEach((currentConnectionString) => {
        process.env.MONGO_CONNECTION_STRING = currentConnectionString;
        dbConnection = new DbConnection();
        void dbConnection.client;
        expect(MongoClientMocked).toHaveBeenCalledWith(currentConnectionString);
      });
    });
    test("disconnect method calls close method of mongo client", async () => {
      const closeMock = jest.spyOn(MongoClientMocked.prototype, "close");
      void dbConnection.client;
      await dbConnection.disconnect();
      expect(closeMock).toHaveBeenCalled();
    });

    describe("connect", () => {
      test("creates new connection", () => {
        dbConnection.connect();
        expect(MongoClientMocked).toHaveBeenCalled();
      });
      test("creates new connection every time", () => {
        dbConnection.connect();
        dbConnection.connect();
        expect(MongoClientMocked).toHaveBeenCalledTimes(2);
      });
    });
  });
});
