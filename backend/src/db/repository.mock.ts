import { Document } from "mongodb";

import Repository from "./repository.js";

export const getRepositoryMock = <T extends Document>() =>
  ({
    addNew: jest.fn(),
    updateById: jest.fn(),
    updateByValue: jest.fn(),
    upsert: jest.fn(),
    getAll: jest.fn(),
    getById: jest.fn(),
    getByValue: jest.fn(),
    deleteByValue: jest.fn(),
    deleteMany: jest.fn(),
    deleteById: jest.fn(),
  }) as unknown as Repository<T>;

export const objectIdStringMock = "123412341234123412341234";
