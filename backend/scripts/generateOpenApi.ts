import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

import { buildSpec } from "../src/openapi/document.js";

export const specJsonPath = join(process.cwd(), "public", "spec.json");

export function generateOpenApiSpec(): string {
  mkdirSync(dirname(specJsonPath), { recursive: true });
  writeFileSync(specJsonPath, `${JSON.stringify(buildSpec(), null, 2)}\n`);
  return specJsonPath;
}

generateOpenApiSpec();