export default {
  testEnvironment: "node",
  verbose: true,

  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1", // Handle .js extensions in import statements
  },
};
