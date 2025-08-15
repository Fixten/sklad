export const materialRepositoryMock = {
  getById: jest.fn(),
  getAll: jest.fn(),
  updateById: jest.fn(),
  deleteMaterial: jest.fn(),
  createMaterial: jest.fn(),
};

export const variantRepositoryMock = {
  createVariant: jest.fn(),
  deleteVariant: jest.fn(),
  updateVariant: jest.fn(),
  getById: jest.fn(),
};
