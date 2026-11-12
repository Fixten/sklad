import { afterEach } from "vitest";
import { userEvent } from "vitest/browser";

import "./browser.setup";

afterEach(async () => {
  await userEvent.hover(document.body);
});
