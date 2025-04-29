import dbConnection from "./dbConnection.js";
import { DbManager } from "./dbManager.js";

jest.mock("./dbConnection.js", () => ({
  client: {
    db: jest.fn(),
  },
}));

const dbValue = "dbValue";
(dbConnection.client.db as jest.Mock).mockImplementation(() => dbValue);

describe("dbManager", () => {
  let dbManager: DbManager;
  beforeEach(() => {
    dbManager = new DbManager();
    jest.clearAllMocks();
  });
  it("calls dbConnections's db property", () => {
    void dbManager.db;
    expect(dbConnection.client.db).toHaveBeenCalledWith("bags-test");
  });
  it("prints console message if success", () => {
    const spy = jest.spyOn(console, "log");
    void dbManager.db;
    expect(spy).toHaveBeenCalledWith("Current DB is set");
  });
  it("call dbConnections only once", () => {
    const firstDb = dbManager.db;
    console.log(firstDb);
    expect(dbConnection.client.db).toHaveBeenCalled();
    const secondDb = dbManager.db;
    expect(dbConnection.client.db).toHaveBeenCalledTimes(1);
    expect(firstDb).toBe(secondDb);
  });
  it("returns db from dbConnection", () => {
    const { db } = dbManager;
    expect(db).toBe(dbValue);
  });
});
