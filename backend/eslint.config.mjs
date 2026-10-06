import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import * as pluginImportX from "eslint-plugin-import-x";
import jestPlugin from "eslint-plugin-jest";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import drizzle from "eslint-plugin-drizzle";

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  pluginImportX.flatConfigs.recommended,
  pluginImportX.flatConfigs.typescript,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  // Add Jest configuration for test files
  {
    files: ["**/*.test.ts"],
    plugins: {
      jest: jestPlugin,
    },
    rules: {
      // Turn off the original rule for test files
      "@typescript-eslint/unbound-method": "off",
      "jest/unbound-method": "error",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
    },
  },
  {
    files: ["**/*.{js,ts}"],
    ignores: ["eslint.config.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "import-x/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "type",
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
  },
  {
    files: ["src/features/**/*.service.ts", "src/features/**/*.router.ts"],
    rules: {
      // A transaction is a repository concern. A service that needs one calls a
      // single repository method and hands it the business decision as a
      // synchronous callback; opening one here would put a half-finished unit of
      // work in a layer that cannot see the rest of it. `src/db/schema/*` is
      // unaffected — that is the table definition, not a connection.
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/db/index.js", "@/db/repository.js"],
              message:
                "Services and routers must not import the db layer. Add or extend a method on the feature's repository instead; it owns the transaction.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/**/*.ts"],
    plugins: { drizzle },
    rules: {
      "drizzle/enforce-delete-with-where": [
        "error",
        { drizzleObjectName: ["client", "dbClient"] },
      ],
      "drizzle/enforce-update-with-where": [
        "error",
        { drizzleObjectName: ["client", "dbClient"] },
      ],
    },
  },
  {
    settings: {
      "import-x/resolver-next": [
        createTypeScriptImportResolver({
          project: [`${import.meta.dirname}/tsconfig.json`],
        }),
      ],
    },
  },
);
