import type { Preview } from "@storybook/react-vite";

import "../src/styles/index.css";

const preview: Preview = {
  decorators: [
    (Story) => {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");

      return Story();
    },
  ],
  parameters: {
    layout: "centered",
  },
};

export default preview;
