export default {
  testEnvironment: "node",
  verbose: true,

  moduleNameMapper: {
    "^@*/(.*)\\.js$": "<rootDir>/src/$1.ts",
    "^(\\.{1,2}/.*)\\.js$": "$1", // Handle .js extensions in import statements
  },
};
