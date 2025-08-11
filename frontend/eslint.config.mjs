import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import * as pluginImportX from "eslint-plugin-import-x";
import tsParser from "@typescript-eslint/parser";
import jestPlugin from "eslint-plugin-jest";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import pluginQuery from "@tanstack/eslint-plugin-query";

export default [
  ...pluginQuery.configs["flat/recommended"],
  ...tseslint.config(
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
      files: ["**/*.test.ts", "**/*.test.tsx"],
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
      files: ["**/*.{js,ts,jsx,tsx}"],
      ignores: ["eslint.config.mjs"],
      languageOptions: {
        parser: tsParser,
        ecmaVersion: "latest",
        sourceType: "module",
      },
      rules: {
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
      settings: {
        "import-x/resolver-next": [
          createTypeScriptImportResolver({ project: "tsconfig.json" }),
        ],
      },
    }
  ),
];
