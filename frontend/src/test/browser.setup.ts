import { afterEach, beforeEach, expect, vi } from "vitest";

import "@/styles/index.css";

import { takeUnhandledRequests } from "./apiStub";

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

const applyDarkTheme = () => {
  document.documentElement.classList.add("dark");
};

beforeEach(() => {
  applyDarkTheme();
  freezeAnimations();
});

afterEach(() => {
  vi.unstubAllGlobals();
  expect(takeUnhandledRequests()).toEqual([]);
});
