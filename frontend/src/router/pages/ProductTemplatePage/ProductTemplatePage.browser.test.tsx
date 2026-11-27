import { generatePath } from "react-router";
import { expect, test } from "vitest";

import pathsRouter from "@/router/paths.router";

import { renderPage } from "./testHarness";

test.each([
  pathsRouter.products,
  generatePath(pathsRouter.productTemplate, { id: "10" }),
])("renders the product template placeholder at %s", async (path) => {
  const screen = await renderPage(path);

  await expect
    .element(screen.getByRole("heading", { name: "Шаблоны изделий" }))
    .toBeInTheDocument();
  await expect
    .element(screen.getByRole("link", { name: "Шаблоны" }))
    .toBeInTheDocument();
});
