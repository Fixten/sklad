import { beforeEach } from "vitest";

import "@/styles/index.css";

const freezeAnimations = () => {
  const style = document.createElement("style");
  style.textContent = `*, *::before, *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
    caret-color: transparent !important;
  }`;
  document.head.append(style);
};

beforeEach(freezeAnimations);
