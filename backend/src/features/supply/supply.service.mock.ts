import { SupplyService } from "./supply.service.js";

export const supplyServiceMock = {
  addNew: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),
  getById: jest.fn(),
  getAll: jest.fn(),
  deteleAllForVariant: jest.fn(),
} as unknown as SupplyService;
