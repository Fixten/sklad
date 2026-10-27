import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import * as pluginImportX from "eslint-plugin-import-x";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import pluginQuery from "@tanstack/eslint-plugin-query";
import vitest from "@vitest/eslint-plugin";
import { defineConfig } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import path from "node:path";

const srcDir = path.join(import.meta.dirname, "src");

const moduleTrees = ["features", "components/ui", "lib", "router/pages"];

const moduleRootOf = (filename) => {
  const relative = path.relative(srcDir, filename);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    return null;
  }
  const dir = path.dirname(relative).split(path.sep).join("/");
  const tree = moduleTrees.find(
    (prefix) => dir === prefix || dir.startsWith(`${prefix}/`),
  );
  if (!tree) {
    return dir;
  }
  const segment = dir.slice(tree.length + 1).split("/")[0];
  return segment ? `${tree}/${segment}` : tree;
};

const sameModuleRelativeImport = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      outsideModule:
        "Relative import leaves its module. Use the @/ alias for anything outside {{module}}.",
    },
  },
  create(context) {
    const filename = context.filename;
    const moduleRoot = moduleRootOf(filename);
    if (!moduleRoot) {
      return {};
    }
    const moduleDir = path.join(srcDir, moduleRoot);
    const check = (node) => {
      const specifier = node.source?.value;
      if (typeof specifier !== "string" || !specifier.startsWith(".")) {
        return;
      }
      const target = path.resolve(path.dirname(filename), specifier);
      const inside = path.relative(moduleDir, target);
      if (
        inside === "" ||
        (!inside.startsWith("..") && !path.isAbsolute(inside))
      ) {
        return;
      }
      context.report({
        node: node.source,
        messageId: "outsideModule",
        data: { module: moduleRoot },
      });
    };
    return {
      ImportDeclaration: check,
      ExportNamedDeclaration: check,
      ExportAllDeclaration: check,
    };
  },
};

const uiPrivatePattern = {
  group: [
    "@base",
    "@base/*",
    "@ui/base",
    "@ui/base/*",
    "@/components/ui/base",
    "@/components/ui/base/*",
  ],
  message: "Import UI via @ui/*. @base is private to src/components/ui.",
};

const uiIconPattern = {
  group: ["lucide-react"],
  message: "Import icons via @ui/Icon.",
};

export default defineConfig(
  { ignores: ["**/src/api/schema.d.ts"] },
  pluginQuery.configs["flat/recommended"],
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  pluginImportX.flatConfigs.recommended,
  pluginImportX.flatConfigs.typescript,
  reactHooks.configs.flat.recommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    languageOptions: {
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
    files: ["**/*.{ts,tsx}"],
    plugins: {
      local: {
        rules: { "same-module-relative-import": sameModuleRelativeImport },
      },
    },
    rules: {
      "local/same-module-relative-import": "error",
      "no-restricted-imports": [
        "error",
        { patterns: [uiPrivatePattern, uiIconPattern] },
      ],
    },
  },
  {
    files: ["**/src/components/ui/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": "off",
    },
  },
  {
    files: ["**/src/config/features.ts"],
    rules: {
      "local/same-module-relative-import": "off",
      "no-restricted-imports": [
        "error",
        { patterns: [uiPrivatePattern, uiIconPattern] },
      ],
    },
  },
  {
    files: ["**/*.{test,spec}.{ts,tsx}"],
    plugins: { vitest },
    rules: {
      ...vitest.configs.recommended.rules,
      "vitest/no-large-snapshots": [
        "warn",
        { maxSize: 100, inlineMaxSize: 50 },
      ],
      "vitest/prefer-snapshot-hint": "warn",
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
