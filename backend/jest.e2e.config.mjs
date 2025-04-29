import mainConfig from "./jest.config.mjs";

export default {
  ...mainConfig,
  testMatch: ["**/?(*.)+(e2e).[jt]s"],
};
