import { MemoryRouter } from "react-router";
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

import PageLayout from ".";

import type { ComponentProps } from "react";

const backlinkClasses = [
  "type-label",
  "text-muted-foreground",
  "hover:text-foreground",
  "focus-visible:outline-2",
  "focus-visible:outline-offset-2",
];

const renderLayout = (
  props: Omit<ComponentProps<typeof PageLayout>, "children">,
) =>
  render(
    <MemoryRouter>
      <PageLayout {...props}>
        <div>Контент</div>
      </PageLayout>
    </MemoryRouter>,
  );

test("renders the title and children", async () => {
  const screen = await renderLayout({ title: "Поставка" });

  await expect
    .element(screen.getByRole("heading", { name: "Поставка" }))
    .toBeInTheDocument();
  await expect.element(screen.getByText("Контент")).toBeInTheDocument();
});

test("renders the backlink", async () => {
  const screen = await renderLayout({
    title: "Поставка",
    back: { to: "/material", label: "Материалы" },
  });

  const link = screen.getByRole("link", { name: "← Материалы" });
  await expect.element(link).toHaveAttribute("href", "/material");

  for (const className of backlinkClasses) {
    await expect.element(link).toHaveClass(className);
  }
});

test("omits the backlink when back is not passed", async () => {
  const screen = await renderLayout({ title: "Поставка" });

  await expect.element(screen.getByRole("link")).not.toBeInTheDocument();
});
