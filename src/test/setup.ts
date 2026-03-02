import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// RTL does not auto-register cleanup with Vitest — do it explicitly.
afterEach(() => {
  cleanup();
});
