import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

test("unstyled text falls back to the body token", async () => {
  const screen = await render(
    <>
      <p data-testid="paragraph">Склад</p>
      <span data-testid="span">Склад</span>
      <h1 data-testid="heading">Склад</h1>
    </>,
  );

  for (const id of ["paragraph", "span", "heading"]) {
    const style = getComputedStyle(screen.getByTestId(id).element());

    expect(style.fontSize).toBe("16px");
    expect(style.fontWeight).toBe("500");
    expect(style.lineHeight).toBe("24px");
    expect(style.textWrap).toBe("pretty");
    expect(style.fontFamily).toContain("Manrope");
  }
});

test("typography variants still override the body fallback", async () => {
  const screen = await render(
    <h2 className="type-title" data-testid="title">
      Склад
    </h2>,
  );

  const style = getComputedStyle(screen.getByTestId("title").element());

  expect(style.fontSize).toBe("20px");
  expect(style.fontWeight).toBe("600");
  expect(style.textWrap).toBe("balance");
});
