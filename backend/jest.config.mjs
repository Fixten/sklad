export default {
  testEnvironment: "node",
  verbose: true,

  moduleNameMapper: {
    "^db/(.*)\\.js$": "<rootDir>/src/db/$1.ts",
    "^(\\.{1,2}/.*)\\.js$": "$1", // Handle .js extensions in import statements
  },
};
