import { Db } from "mongodb";

import dbManager from "../dbManager.js";

import DbCollection from "./index.js";

const collectionName = "collectionName";

describe("DbCollection", () => {
  let dbSpy: jest.SpyInstance;
  const mockedCollection = {};
  beforeEach(() => {
    dbSpy = jest.spyOn(dbManager, "db", "get").mockReturnValue({
      collection: jest.fn().mockReturnValue(mockedCollection),
    } as unknown as Db);
  });
  afterEach(jest.resetAllMocks);
  test("should set argument in collection name property", () => {
    const dbCollection = new DbCollection(collectionName);
    expect(dbCollection.collectionName).toBe(collectionName);
  });
  test("should not call dbManager on init", () => {
    new DbCollection(collectionName);
    expect(dbSpy).not.toHaveBeenCalled();
  });
  test("should call dbManager when collection getter called", () => {
    const dbCollection = new DbCollection(collectionName);
    dbCollection.collection;
    expect(dbSpy).toHaveBeenCalled();
  });
  test("if getter called twice dbManager called once", () => {
    const dbCollection = new DbCollection(collectionName);
    dbCollection.collection;
    dbCollection.collection;
    expect(dbSpy).toHaveBeenCalledTimes(1);
  });
  test("collection returns correct mock", () => {
    const dbCollection = new DbCollection(collectionName);
    const collection = dbCollection.collection;
    expect(collection).toBe(mockedCollection);
  });
});
