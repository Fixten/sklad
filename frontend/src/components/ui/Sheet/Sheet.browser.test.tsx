import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";

import { Button } from "@ui/Button";
import Typography from "@ui/Typography";

import Sheet from ".";

test("renders the hint and error in separate slots", async () => {
  const screen = await render(
    <Sheet
      open
      onOpenChange={vi.fn()}
      title="Поставка материала"
      step="01 / 02"
      hint={
        <Typography variant="label" className="text-muted-foreground m-0">
          ↑↓ Выбрать · Enter
        </Typography>
      }
      error="Не удалось сохранить поставку"
      actions={<Button>Сохранить поставку</Button>}
    >
      <Typography variant="body">
        Выберите материал из списка или создайте новый.
      </Typography>
    </Sheet>,
  );

  await expect
    .element(screen.getByText("↑↓ Выбрать · Enter"))
    .toBeInTheDocument();
  await expect
    .element(screen.getByRole("alert"))
    .toHaveTextContent("Не удалось сохранить поставку");
});
