import mainConfig from "./jest.config.mjs";

export default {
  ...mainConfig,
  testMatch: ["<rootDir>/src/**/**.e2e.ts"],
};
