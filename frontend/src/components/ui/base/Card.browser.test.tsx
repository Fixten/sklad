import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

import { Card, CardDescription } from "@base/card";

const description =
  "Кожаный ремень из растительного дубления, ширина 40 мм, пряжка из латуни, окрашено вручную масляным составом, край обработан воском и отполирован до матового блеска, чтобы изделие не бликовало под лампой на верстаке";

const shellWidth = 896;

test("caps the description at the prose measure", async () => {
  const screen = await render(
    <div style={{ width: shellWidth }}>
      <Card>
        <CardDescription data-testid="description">
          {description}
        </CardDescription>
      </Card>
    </div>,
  );

  const element = screen.getByTestId("description").element();
  const measureProbe = document.createElement("span");
  measureProbe.className = "type-body";
  measureProbe.style.cssText =
    "position:absolute;visibility:hidden;white-space:nowrap;width:65ch";
  element.parentElement?.appendChild(measureProbe);

  expect(element.clientWidth).toBeLessThan(shellWidth);
  expect(element.clientWidth).toBeCloseTo(
    measureProbe.getBoundingClientRect().width,
    0,
  );

  measureProbe.remove();
});

test("wraps copy with prettier line breaks", async () => {
  const screen = await render(
    <Card>
      <CardDescription data-testid="description">{description}</CardDescription>
    </Card>,
  );

  const element = screen.getByTestId("description").element();

  expect(getComputedStyle(element).textWrap).toBe("pretty");
});
