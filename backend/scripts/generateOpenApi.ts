import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

import { specJsonPath } from "../src/openapi/specPath.js";
import { buildSpec } from "../src/openapi/document.js";

export function generateOpenApiSpec(): string {
  mkdirSync(dirname(specJsonPath), { recursive: true });
  writeFileSync(specJsonPath, `${JSON.stringify(buildSpec(), null, 2)}\n`);
  return specJsonPath;
}

generateOpenApiSpec();
